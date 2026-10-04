import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import { BlogCard } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: '文章',
  description:
    '技术探索、独立开发项目的记录与踩坑，以及一些不成体系的想法碎片。',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-20 sm:pt-32">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">博客</h1>
        <p className="mt-3 text-text-secondary">
          共 {posts.length} 篇文章
        </p>
      </section>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="card p-12 text-center text-text-secondary">
          <p className="text-lg">还没有文章</p>
          <p className="mt-1 text-sm">
            在 <code>src/content/posts/</code> 中添加 .mdx 文件即可发布。
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
