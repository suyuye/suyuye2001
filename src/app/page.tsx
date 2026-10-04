import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { getAllNovels } from '@/lib/novel';
import { HeroSection } from '@/components/HeroSection';
import { PostList } from '@/components/PostList';
import { Sidebar } from '@/components/Sidebar';

// 首页此前继承 layout 的默认 metadata，分享出去标题是全站通用的那一句。
export const metadata: Metadata = {
  title: '首页',
  description:
    '苏羽野的数字花园 — 记录技术探索、独立开发、说唱音乐创作，以及生活中的光影碎片。',
  alternates: { canonical: '/' },
};

export default function Home() {
  const posts = getAllPosts();
  const novels = getAllNovels();

  // Gather all unique tags for sidebar
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <>
      <HeroSection />

      {/* Novel promotion */}
      {novels.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-10">
          {novels.map((novel) => {
            // 每本书跳自己的第一章，而不是统一跳第一本
            const firstChapter = novel.chapters[0];

            return (
              <div key={novel.title} className="card overflow-hidden">
                <div className="relative bg-gradient-to-br from-primary/[0.07] via-transparent to-primary/[0.03] px-6 py-8 sm:px-8">
                  <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                        连载小说
                      </span>
                      <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
                        {novel.title}
                      </h2>
                      <p className="mt-1 text-sm text-text-tertiary">
                        共 {novel.chapters.length} 章 · 仙侠 · 修行
                      </p>
                    </div>
                    <Link
                      href={firstChapter ? `/novel/${firstChapter.slug}` : '/novel'}
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.97]"
                    >
                      开始阅读 →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Post list – 70% */}
          <div className="min-w-0 flex-1 lg:w-[70%]">
            {/* 分区标题：给读者「下面这块是什么」的锚点 */}
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                  最新文章
                </h2>
                <p className="mt-1 text-xs text-text-tertiary">
                  共 {posts.length} 篇 · 技术、创作与生活
                </p>
              </div>
              <Link
                href="/blog"
                className="shrink-0 text-sm text-text-secondary transition-colors hover:text-primary"
              >
                全部文章 →
              </Link>
            </div>

            <PostList posts={posts} />
          </div>

          {/* Sidebar – 30% */}
          <div className="lg:w-[30%] lg:min-w-[280px]">
            <Sidebar
              postCount={posts.length}
              tagCount={allTags.length}
              tags={allTags}
            />
          </div>
        </div>
      </section>
    </>
  );
}
