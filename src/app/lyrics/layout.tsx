import type { Metadata } from 'next';

/**
 * 歌词页的 metadata 放在 layout 而不是 page。
 *
 * `page.tsx` 是 'use client'（专辑/歌曲切换用了 useState），
 * 而 Next.js 禁止从客户端组件导出 metadata —— 会在构建时报错。
 * layout 是服务端组件，metadata 会被该段下的所有页面继承。
 */
export const metadata: Metadata = {
  title: '笔下',
  description: '写过的词和唱过的歌 — 人生如戏，这里是一些还没散场的片段。',
  alternates: { canonical: '/lyrics' },
};

export default function LyricsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
