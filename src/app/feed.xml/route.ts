import { getAllPosts, getPostBySlug } from '@/lib/mdx';

const SITE_URL = 'https://suyuye-boke.netlify.app';
const SITE_NAME = '苏羽野2026-2027';
const SITE_DESC =
  '一个独立开发者的数字花园 — 记录技术探索、说唱音乐创作，以及生活中的光影碎片。';
const AUTHOR_NAME = '苏羽野';
const AUTHOR_EMAIL = 'suyuye2001@163.com';

/**
 * RSS 2.0 输出。
 *
 * Next.js 16 内置的 metadata route 只支持 robots / sitemap / manifest
 * （见 next/dist/build/webpack/loaders/metadata/resolve-route-data.d.ts
 * 里的 resolveRouteData 联合类型），没有 MetadataRoute.RSS 这类内置约定，
 * 所以这里手写 XML 并返回原生 Response。
 */
export const dynamic = 'force-static';

/** XML 文本节点必须转义，否则标题里的 & < > 会让整个 feed 解析失败 */
function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 去掉 Markdown 语法，只留纯文本摘要 */
function plain(markdown: string, max = 150): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max) + '…' : text;
}

/** YYYY-MM-DD → RFC 822（RSS 规定的日期格式，须带 GMT） */
function toRfc822(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export async function GET() {
  const posts = getAllPosts();
  const latest = posts[0]?.rawDate ?? new Date().toISOString().slice(0, 10);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/posts/${post.slug}`;
      const categories = post.tags
        .map((t) => `      <category>${esc(t)}</category>`)
        .join('\n');
      // description 为空时退回正文摘要，所以这里要读全文（getAllPosts 不含 content）
      const body = plain(getPostBySlug(post.slug)?.content ?? '');
      return `    <item>
      <title>${esc(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.rawDate)}</pubDate>
      <author>${esc(AUTHOR_NAME)} (${esc(AUTHOR_EMAIL)})</author>
      <description>${esc(post.description || body)}</description>
${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(SITE_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${toRfc822(latest)}</lastBuildDate>
    <generator>Next.js</generator>
    <managingEditor>${esc(AUTHOR_EMAIL)} (${esc(AUTHOR_NAME)})</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
