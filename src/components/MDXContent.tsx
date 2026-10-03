'use client';

import React, { isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import type { Components } from 'react-markdown';

function CodeBlock({ className, children }: React.ComponentPropsWithoutRef<'code'>) {
  const language = className?.replace('language-', '') || '';
  const code = String(children).replace(/\n$/, '');

  return (
    <div className="code-block-mac">
      <div className="code-block-mac-header">
        <span className="code-block-mac-dot red" />
        <span className="code-block-mac-dot yellow" />
        <span className="code-block-mac-dot green" />
        <span className="code-block-mac-title">{language || 'text'}</span>
      </div>
      <pre>
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
}

/**
 * react-markdown 会给每个组件注入一个 `node` prop用于定位源码位置，
 * 直接 {...props} 透传会让它作为非法属性渲染到 DOM 上，这里统一剥离。
 */
type MarkdownProps = Record<string, unknown>;

function stripInternalProps(props: object): MarkdownProps {
  const out: MarkdownProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === 'node' || key === 'ref' || key === 'key') continue;
    out[key] = value;
  }
  return out;
}

/**
 * 图片组件。真正的 <figure> 包装在 p 里完成（见下方 p 的实现），
 * 因为 Markdown 的图片始终被包在段落中，单独 override img 无法拿到块级容器。
 */
function MarkdownImage({ src, alt }: React.ComponentPropsWithoutRef<'img'>) {
  if (!src || typeof src !== 'string') return null;

  return (
    <div className="group/md-img relative overflow-hidden rounded-xl border border-border">
      <img
        src={src}
        alt={alt || ''}
        className="w-full transition-transform duration-300 group-hover/md-img:scale-[1.015]"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * 判断一个元素是否为 Markdown 图片节点。
 *
 * 注意：段落 children 里的图片元素是 react-markdown 内部的 img 组件
 * （type.name === 'img'），并非 components.img 传入的函数引用，
 * 因此不能通过 `node.type === MarkdownImage` 判断。
 * 这里改用 props 特征识别：图片必有 src，链接节点只有 href。
 */
function isMarkdownImage(node: React.ReactNode): node is React.ReactElement<{
  src?: string;
  alt?: string;
}> {
  if (!isValidElement(node)) return false;
  const props = node.props as MarkdownProps;
  return typeof props.src === 'string' && !('href' in props);
}

/**
 * 判断元素是否为 Markdown 斜体节点。
 *
 * react-markdown 传给 p 的 children 是它内部的组件实例，
 * `element.type === 'em'` 这类字符串比较不会命中，
 * 必须读type.name —— 强调节点则是 'strong'，据此可与加粗区分。
 */
function isEmElement(node: React.ReactNode): node is React.ReactElement {
  if (!isValidElement(node)) return false;
  const type = node.type as { name?: string };
  return type?.name === 'em';
}

/** 段落内容是否为纯图片，是则返回该图片元素以提升为 <figure> */
function extractImage(children: React.ReactNode): React.ReactElement | null {
  const nodes = React.Children.toArray(children).filter((n) => {
    // 忽略换行产生的空白文本
    return !(typeof n === 'string' && n.trim() === '');
  });

  // 只有恰好一个有效子节点时才可能是纯图片
  if (nodes.length !== 1) return null;

  const first = nodes[0];

  // 情况一：裸图片 ![alt](src)
  if (isMarkdownImage(first)) return first;

  // 情况二：图片被链接包裹 [![](src)](href) —— 冗余链接，取出内层图片
  if (isValidElement(first) && first.type === 'a') {
    const inner = (first.props as { children?: React.ReactNode }).children;
    if (isMarkdownImage(inner)) return inner;
  }

  return null;
}

const components: Components = {
  a: ({ href, children, ...props }) => {
    const external = href?.startsWith('http');
    const rest = stripInternalProps(props);
    return (
      <a
        href={href}
        className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  },

  /**
   * pre 统一接管所有围栏代码块。
   * 之前的实现只在 code 带 language- 类时才走 Mac 样式，
   * 导致「无语言标注的代码块」被当成行内 code 渲染成一个彩色药丸塞进 pre 里。
   */
  pre: ({ children }) => {
    const child = Array.isArray(children) ? children[0] : children;

    if (isValidElement(child) && child.type === 'code') {
      const { className, children: code } = child.props as {
        className?: string;
        children?: React.ReactNode;
      };
      return <CodeBlock className={className}>{code}</CodeBlock>;
    }

    return <pre className="code-block-mac"><code>{children}</code></pre>;
  },

  // 行内代码：无 className 且未被 pre 包裹时才走这里
  code: ({ className, children, ...props }) => {
    if (className?.startsWith('language-')) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    const rest = stripInternalProps(props);
    return (
      <code
        className="rounded-md bg-primary-bg px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
        {...rest}
      >
        {children}
      </code>
    );
  },

  /**
   * 段落。
   * 1. 纯图片段落 →提升为 <figure>，配合 PhotoView 支持点击放大
   * 2. 纯斜体段落 → 视为图片图注（小字居中、贴近图片）
   * 3. 正文用 text-text-primary，secondary 留给图注/引用等次要信息
   */
  p: ({ children, ...props }) => {
    const rest = stripInternalProps(props);
    const image = extractImage(children);
    if (image) {
      const { src, alt } = image.props as { src?: string; alt?: string };
      return (
        <figure className="my-8">
          <PhotoView src={typeof src === 'string' ? src : ''}>
            <MarkdownImage src={src} alt={alt} />
          </PhotoView>
        </figure>
      );
    }

    const nodes = React.Children.toArray(children).filter(
      (n) => !(typeof n === 'string' && n.trim() === '')
    );

    /*
     * 整段是一个 <em> 且较短 → 视为图片图注。
     * 注意：children 里的元素是 react-markdown 内部组件（type.name === 'em'），
     * 不是 components.em 传入的函数引用，因此必须用 type.name 判断。
     */
    if (nodes.length === 1 && isEmElement(nodes[0])) {
      const text = String(
        (nodes[0].props as { children?: React.ReactNode }).children ?? ''
      );
      if (text.length < 80) {
        return (
          <p className="prose-caption" {...rest}>
            {children}
          </p>
        );
      }
    }

    return (
      <p className="my-5 leading-[1.9] text-text-primary" {...rest}>
        {children}
      </p>
    );
  },

  em: ({ children, ...props }) => (
    <em className="italic text-text-primary" {...stripInternalProps(props)}>
      {children}
    </em>
  ),

  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-text-primary" {...stripInternalProps(props)}>
      {children}
    </strong>
  ),

  del: ({ children, ...props }) => (
    <del className="text-text-tertiary line-through" {...stripInternalProps(props)}>
      {children}
    </del>
  ),

  blockquote: ({ children, ...props }) => (
    <blockquote className="prose-quote" {...stripInternalProps(props)}>
      {children}
    </blockquote>
  ),

  h1: ({ children, ...props }) => (
    <h1 className="mt-12 mb-4 text-2xl font-bold text-text-primary" {...stripInternalProps(props)}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2 className="prose-h2" {...stripInternalProps(props)}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3 className="mt-8 mb-3 text-lg font-semibold text-text-primary" {...stripInternalProps(props)}>
      {children}
    </h3>
  ),

  h4: ({ children, ...props }) => (
    <h4 className="mt-6 mb-2 text-base font-semibold text-text-primary" {...stripInternalProps(props)}>
      {children}
    </h4>
  ),

  hr: () => (
    <div className="my-12 flex items-center justify-center gap-2" aria-hidden="true">
      <div className="h-px w-16 bg-border" />
      <span className="text-xs tracking-[0.4em] text-text-tertiary">✦</span>
      <div className="h-px w-16 bg-border" />
    </div>
  ),

  table: ({ children, ...props }) => (
    <div className="my-7 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm" {...stripInternalProps(props)}>
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }) => (
    <thead className="bg-bg" {...stripInternalProps(props)}>
      {children}
    </thead>
  ),

  th: ({ children, ...props }) => (
    <th
      className="border-b border-border px-4 py-3 text-left font-semibold text-text-primary"
      {...stripInternalProps(props)}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td className="border-b border-border px-4 py-3 text-text-secondary" {...stripInternalProps(props)}>
      {children}
    </td>
  ),

  ul: ({ children, ...props }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 marker:text-text-tertiary" {...stripInternalProps(props)}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-text-tertiary" {...stripInternalProps(props)}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li className="leading-[1.85] text-text-primary [&>ul]:my-2 [&>ol]:my-2" {...stripInternalProps(props)}>
      {children}
    </li>
  ),

  input: ({ type, checked, ...props }) => (
    <input
      type={type}
      checked={checked}
      readOnly
      {...stripInternalProps(props)}
      className="mr-2 h-4 w-4 shrink-0 cursor-default appearance-none rounded border border-border bg-bg-card accent-primary"
    />
  ),

  kbd: ({ children, ...props }) => (
    <kbd
      className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-xs text-text-secondary"
      {...stripInternalProps(props)}
    >
      {children}
    </kbd>
  ),
};

export function MDXContent({ content }: { content: string }) {
  return (
    <PhotoProvider speed={() => 320} maskOpacity={0.85}>
      <div className="prose-custom">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </PhotoProvider>
  );
}