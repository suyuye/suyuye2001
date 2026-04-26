import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNovels } from '@/lib/novel';

export const metadata: Metadata = {
  title: '小说',
};

export default function NovelPage() {
  const novels = getAllNovels();

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-20 sm:pt-32">
      {novels.length === 0 ? (
        <div className="card p-12 text-center text-text-secondary">
          <p className="text-lg">暂无小说</p>
        </div>
      ) : (
        novels.map((novel) => (
          <section key={novel.title} className="card overflow-hidden">
            {/* Novel header */}
            <div className="relative bg-gradient-to-br from-primary/10 via-transparent to-primary/5 px-6 py-10 sm:px-10 sm:py-14">
              <div className="relative z-10">
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  连载中
                </span>
                <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">
                  {novel.title}
                </h1>
                <p className="mt-2 text-sm text-text-tertiary">
                  共 {novel.chapters.length} 章
                </p>
              </div>
            </div>

            {/* Chapter list */}
            <div className="divide-y divide-border">
              {novel.chapters.map((ch) => (
                <Link
                  key={ch.slug}
                  href={`/novel/${ch.slug}`}
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-bg-card-hover sm:px-10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-bg text-xs font-bold text-primary">
                    {ch.chapter}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {ch.title}
                    </h3>
                    {ch.description && (
                      <p className="mt-0.5 text-xs text-text-tertiary line-clamp-1">
                        {ch.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-text-tertiary group-hover:text-primary transition-colors">
                    阅读 →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
