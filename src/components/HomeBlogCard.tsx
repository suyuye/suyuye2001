'use client';

import Link from 'next/link';
import type { BlogPost } from '@/lib/mdx';

export function HomeBlogCard({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  return (
    // CSS 入场动画，不依赖 JS（motion 的 initial opacity:0 在弱网下会永久隐形）
    <div
      className="animate-rise-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={`/posts/${post.slug}`} className="card-hover block p-6 h-full">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
          <time className="whitespace-nowrap">{post.date}</time>
          {post.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="h-fit whitespace-nowrap rounded-full bg-primary-bg px-2.5 py-0.5 text-primary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {post.description}
        </p>
      </Link>
    </div>
  );
}
