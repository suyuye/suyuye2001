'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/mdx';

export function HomeBlogCard({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/posts/${post.slug}`} className="card-hover block p-6 h-full">
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary mb-3">
          <time>{post.date}</time>
          {post.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-bg px-2 py-0.5 text-primary font-medium"
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
    </motion.div>
  );
}
