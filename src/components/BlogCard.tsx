'use client';

import Link from 'next/link';
import type { BlogPost } from '@/lib/mdx';

export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    // CSS 入场动画，不依赖 JS（motion 的 initial opacity:0 在弱网下会永久隐形）
    <div className="animate-rise-in" style={{ animationDelay: `${index * 0.08}s` }}>
      <Link href={`/posts/${post.slug}`} className="block card-hover p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
          <time className="whitespace-nowrap">{post.date}</time>
          {post.tags && post.tags.length > 0 && (
            <>
              <span>·</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="h-fit whitespace-nowrap rounded-full bg-primary-bg px-2.5 py-0.5 text-primary text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>

        <h2 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {post.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
          <span>阅读更多</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </div>
  );
}
