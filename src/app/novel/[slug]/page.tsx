import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllChapters, getChapter } from '@/lib/novel';
import { ChapterContent } from '@/components/ChapterContent';

export async function generateStaticParams() {
  const chapters = getAllChapters();
  return chapters.map((ch) => ({ slug: ch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = getAllChapters();
  const meta = all.find((c) => c.slug === slug);
  if (!meta) return { title: 'Not Found' };
  return {
    title: `${meta.title} — ${meta.novel}`,
    description: meta.description,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = getAllChapters();
  const info = all.find((c) => c.slug === slug);
  if (!info) notFound();

  const chapter = getChapter(info.novel, slug);
  if (!chapter) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-20 sm:pt-32">
      {/* Back link */}
      <Link
        href="/novel"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        返回目录
      </Link>

      <article className="card p-6 sm:p-10">
        {/* Chapter header */}
        <header className="mb-8 text-center">
          <span className="text-xs font-medium text-primary">
            {chapter.novel}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
            {chapter.title}
          </h1>
        </header>

        {/* Divider */}
        <div className="mb-8 flex items-center gap-3 text-text-tertiary/40">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs">✦</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Chapter content */}
        <ChapterContent content={chapter.content} />

        {/* Bottom nav */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/novel"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回目录
          </Link>
        </div>
      </article>
    </div>
  );
}
