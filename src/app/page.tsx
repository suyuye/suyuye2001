import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { getAllNovels } from '@/lib/novel';
import { HeroSection } from '@/components/HeroSection';
import { PostList } from '@/components/PostList';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const posts = getAllPosts();
  const novels = getAllNovels();
  const firstChapter = novels[0]?.chapters[0];

  // Gather all unique tags for sidebar
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <>
      <HeroSection />

      {/* Novel promotion */}
      {novels.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-8">
          {novels.map((novel) => (
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
          ))}
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Post list – 70% */}
          <div className="min-w-0 flex-1 lg:w-[70%]">
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
