'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { BlogPost } from '@/lib/mdx';

/** Generate a deterministic gradient from a string */
function gradientFromSlug(slug: string, index: number) {
  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-600 to-pink-400',
    'from-emerald-500 to-teal-400',
    'from-orange-500 to-rose-400',
    'from-indigo-500 to-violet-400',
    'from-pink-500 to-amber-400',
  ];
  const hash = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

function PostCard({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  const isOdd = index % 2 === 0; // even index → image on left
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
    >
      <Link href={`/posts/${post.slug}`} className="group block">
        <article className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div
            className={`flex flex-col ${isOdd ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
          >
            {/* Cover image */}
            <div className="relative sm:w-[38%] shrink-0 overflow-hidden">
              {post.cover && !imgError ? (
                <img
                  src={post.cover}
                  alt={post.title}
                  className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className={`h-52 w-full bg-gradient-to-br ${gradientFromSlug(post.slug, index)} sm:h-full flex items-center justify-center`}
                >
                  <span className="text-4xl font-bold text-white/40">
                    {post.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
              {/* Meta */}
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                <time className="whitespace-nowrap">{post.date}</time>
                <span>·</span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="h-fit whitespace-nowrap rounded-full bg-primary-bg px-2.5 py-0.5 text-primary font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">
                {post.description}
              </p>

              {/* Read more */}
              <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <span>阅读全文</span>
                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="flex flex-col gap-5">
      {posts.length === 0 ? (
        <div className="card p-10 text-center text-text-secondary">
          <p className="text-lg">还没有文章</p>
        </div>
      ) : (
        posts.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)
      )}
    </div>
  );
}
