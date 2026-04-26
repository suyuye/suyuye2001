'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

function CodeBlock({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  const language = className?.replace('language-', '') || '';
  const code = String(children).replace(/\n$/, '');

  return (
    <div className="code-block-mac">
      <div className="code-block-mac-header">
        <span className="code-block-mac-dot red" />
        <span className="code-block-mac-dot yellow" />
        <span className="code-block-mac-dot green" />
        <span className="code-block-mac-title">{language || 'code'}</span>
      </div>
      <pre>
        <code className={className} {...props}>
          {code}
        </code>
      </pre>
    </div>
  );
}

const components: Components = {
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-primary hover:text-primary-light underline underline-offset-3"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  pre: ({ children }) => {
    // If the pre has a direct code child with a language class, use the Mac-style block
    const child = Array.isArray(children) ? children[0] : children;
    if (
      child &&
      typeof child === 'object' &&
      'type' in child &&
      child.type === 'code' &&
      'className' in child.props &&
      typeof child.props.className === 'string' &&
      child.props.className.startsWith('language-')
    ) {
      return <>{children}</>;
    }
    return (
      <pre className="overflow-x-auto rounded-xl border border-border bg-bg-card p-4 my-6 text-sm">
        {children}
      </pre>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded-md bg-primary-bg px-1.5 py-0.5 text-sm font-mono text-primary"
          {...props}
        >
          {children}
        </code>
      );
    }
    // Language-classed code: rendered inside Mac-style block by `pre` handler
    // But when pre handler passes through, react-markdown renders code separately
    // So we handle it here as a fallback
    return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
  },
  img: ({ src, alt, ...props }) => (
    <img
      src={src}
      alt={alt || ''}
      className="rounded-xl my-6 max-w-full"
      loading="lazy"
      {...props}
    />
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary pl-5 pr-4 py-3 my-6 text-text-secondary italic rounded-r-lg bg-primary-bg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  h1: ({ children, ...props }) => (
    <h1 className="text-2xl font-bold mt-10 mb-4 text-text-primary" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-xl font-semibold mt-8 mb-3 text-text-primary" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg font-semibold mt-6 mb-2 text-text-primary" {...props}>
      {children}
    </h3>
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border border-border px-4 py-2 bg-primary-bg font-semibold text-left text-text-primary"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-4 py-2 text-text-secondary" {...props}>
      {children}
    </td>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 my-4 space-y-1.5 text-text-secondary" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 my-4 space-y-1.5 text-text-secondary" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  p: ({ children, ...props }) => (
    <p className="my-4 leading-relaxed text-text-secondary" {...props}>
      {children}
    </p>
  ),
};

export function MDXContent({ content }: { content: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
