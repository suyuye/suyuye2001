'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/mdx';

export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/posts/${post.slug}`} className="block card-hover p-6">
        <div className="flex items-center gap-2 text-xs text-text-tertiary mb-3">
          <time>{post.date}</time>
          {post.tags && post.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-bg px-2.5 py-0.5 text-primary text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
    </motion.div>
  );
}
