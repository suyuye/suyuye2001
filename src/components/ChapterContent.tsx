'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const components: Components = {
  p: ({ children, ...props }) => (
    <p
      className="my-4 leading-[1.9] text-text-secondary text-[15px] sm:text-base [text-indent:2em]"
      {...props}
    >
      {children}
    </p>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-4 border-primary/40 pl-5 py-2 text-text-secondary italic leading-relaxed rounded-r-lg bg-primary-bg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <div className="my-10 flex items-center justify-center gap-2 text-text-tertiary/30">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs tracking-[0.5em]">◆ ◆ ◆</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-text-primary" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="text-text-secondary/80" {...props}>
      {children}
    </em>
  ),
};

export function ChapterContent({ content }: { content: string }) {
  return (
    <div className="novel-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
