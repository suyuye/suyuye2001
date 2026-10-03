import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { MDXContent } from '@/components/MDXContent';
import { Comments } from '@/components/Comments';
import { ReadingProgress } from '@/components/ReadingProgress';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.description,
    openGraph: post.cover
      ? { images: [{ url: post.cover, width: 1200, height: 630 }] }
      : undefined,
  };
}

/** 统计中文字符 + 英文单词，估算阅读时长（中文按 400 字/分） */
function getReadingStats(content: string) {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '');

  const cjk = (plain.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (plain.match(/[a-zA-Z]+/g) || []).length;
  const minutes = Math.max(1, Math.round(cjk / 400 + words / 200));

  return { minutes, chars: cjk + words };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { minutes, chars } = getReadingStats(post.content);

  return (
    <>
      <ReadingProgress targetId="post-body" />

      {/* ── Header: title block on solid bg, cover image below ── */}
      <header className="mx-auto max-w-3xl px-4 pt-28 sm:pt-36">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href="/blog"
              className="rounded-full bg-primary-bg px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
          {post.title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {post.description}
        </p>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
          <time className="whitespace-nowrap">{post.date}</time>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">约 {minutes} 分钟读完</span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">约 {chars} 字</span>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-border" />
      </header>

      {/* ── Cover: no text overlay, original colors preserved ── */}
      {post.cover && (
        <figure className="mx-auto mt-8 max-w-4xl px-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src={post.cover}
              alt={post.title}
              className="h-auto w-full object-cover sm:h-[300px] sm:object-cover"
            />
          </div>
        </figure>
      )}

      {/* ── Article body: bare layout, no card ── */}
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-12 sm:pt-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-text-tertiary transition-colors hover:text-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回博客
        </Link>

        <div id="post-body">
          <MDXContent content={post.content} />
        </div>

        {/* Footer nav */}
        <div className="mt-16 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            全部文章
          </Link>
          <span className="text-xs text-text-tertiary">{post.date}</span>
        </div>

        {/* Giscus comments */}
        <div className="mt-10 border-t border-border pt-10">
          <Comments />
        </div>
      </div>
    </>
  );
}