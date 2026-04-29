import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { MDXContent } from '@/components/MDXContent';
import { Comments } from '@/components/Comments';

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

const gradientOverlays = [
  'from-blue-600/80 via-blue-500/60 to-transparent',
  'from-purple-600/80 via-pink-500/60 to-transparent',
  'from-emerald-600/80 via-teal-500/60 to-transparent',
  'from-orange-600/80 via-rose-500/60 to-transparent',
  'from-indigo-600/80 via-violet-500/60 to-transparent',
];

function getCoverGradient(slug: string) {
  const hash = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradientOverlays[hash % gradientOverlays.length];
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* ── Full-width hero with cover ── */}
      <section className="relative flex h-[40vh] min-h-[320px] items-end overflow-hidden sm:h-[50vh]">
        {/* Cover image or gradient fallback */}
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getCoverGradient(post.slug)}`}
          />
        )}

        {/* Gradient overlay for readability */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent`}
        />

        {/* Title area */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 pb-10 sm:pb-14">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-3 py-1 text-white/90 backdrop-blur-sm font-medium"
              >
                {tag}
              </span>
            ))}
            <span className="text-white/50">·</span>
            <time className="text-white/70">{post.date}</time>
          </div>

          <h1 className="text-2xl font-bold text-white sm:text-4xl md:text-5xl leading-tight">
            {post.title}
          </h1>

          <p className="max-w-xl text-sm text-white/70 sm:text-base line-clamp-2">
            {post.description}
          </p>
        </div>
      </section>

      {/* ── Article body ── */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回博客
        </Link>

        <article className="card p-6 sm:p-10">
          <MDXContent content={post.content} />
        </article>

        {/* Footer nav */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
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
