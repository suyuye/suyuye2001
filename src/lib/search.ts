import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { getAllChapters, getChapter } from '@/lib/novel';
import { albumsData } from '@/config/lyricsData';

export type SearchKind = 'post' | 'novel' | 'lyrics';

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** 用于结果列表下方的小字说明 */
  subtitle: string;
  href: string;
  /** 参与匹配的关键词 */
  keywords: string;
}

/** 取纯文本前若干字符作为摘要，过滤 Markdown 语法与图片 */
function excerpt(markdown: string, max = 90): string {
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

/**
 * 整个索引会被序列化进 RSC payload 传给客户端，
 * 所以正文只截取前 1200 字用于匹配，避免首屏 payload 过大。
 */
const MATCH_LIMIT = 1200;

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // 文章
  for (const post of getAllPosts()) {
    const full = getPostBySlug(post.slug);
    entries.push({
      kind: 'post',
      title: post.title,
      subtitle: post.description || (full ? excerpt(full.content) : ''),
      href: `/posts/${post.slug}`,
      keywords: [
        post.title,
        post.description,
        post.tags.join(' '),
        full ? excerpt(full.content, MATCH_LIMIT) : '',
      ].join(' '),
    });
  }

  // 小说章节
  for (const chapter of getAllChapters()) {
    const full = getChapter(chapter.novel, chapter.slug);
    entries.push({
      kind: 'novel',
      title: chapter.title,
      subtitle: `${chapter.novel}${full ? ' · ' + excerpt(full.content) : ''}`,
      href: `/novel/${chapter.slug}`,
      keywords: [
        chapter.title,
        chapter.novel,
        chapter.description,
        full ? excerpt(full.content, MATCH_LIMIT) : '',
      ].join(' '),
    });
  }

  // 歌词
  for (const album of albumsData) {
    for (const track of album.tracks) {
      entries.push({
        kind: 'lyrics',
        title: track.title,
        subtitle: `${album.title} · ${album.artist} · ${excerpt(track.lyrics, 60)}`,
        href: '/lyrics',
        keywords: [
          track.title,
          album.title,
          album.artist,
          track.lyrics.slice(0, MATCH_LIMIT),
        ].join(' '),
      });
    }
  }

  return entries;
}