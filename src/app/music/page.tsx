import type { Metadata } from 'next';
import { MusicPlayer } from '@/components/MusicPlayer';
import type { Track } from '@/components/MusicPlayer';
import { musicMeta } from '@/config/musicMeta';

export const metadata: Metadata = {
  title: '音乐空间',
};

const GITHUB_API = 'https://api.github.com/repos/suyuye/blog-images/contents/music';
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/music';
const DEFAULT_COVER = 'https://placehold.co/400x400/8b5cf6/white?text=Music';

function formatTitle(filename: string): string {
  const name = filename.replace(/\.mp3$/i, '').replace(/_/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function fetchTracks(): Promise<Track[]> {
  const res = await fetch(GITHUB_API, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'suyuye-blog',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API 返回 ${res.status}`);
  }

  const files: { name: string; type: string }[] = await res.json();
  if (!Array.isArray(files)) return [];

  return files
    .filter((f) => f.type === 'file' && /\.mp3$/i.test(f.name))
    .map((f, i) => {
      const baseName = f.name.replace(/\.mp3$/i, '');
      const meta = musicMeta[baseName];
      return {
        id: `track-${i}`,
        title: meta?.title ?? formatTitle(f.name),
        artist: meta?.artist ?? '未知艺术家',
        cover: meta?.cover ?? DEFAULT_COVER,
        src: `${CDN_BASE}/${f.name}`,
      };
    });
}

export default async function MusicPage() {
  let tracks: Track[] = [];
  let fetchError: string | null = null;

  try {
    tracks = await fetchTracks();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : '未知错误';
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-20 sm:pt-32">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">数字专辑</h1>
        <p className="mt-3 text-text-secondary">
          收录我的日常听歌记录，分享音乐。
        </p>
      </section>

      {fetchError ? (
        <div className="card p-12 text-center text-text-secondary">
          <p className="text-lg">加载失败</p>
          <p className="mt-1 text-sm">{fetchError}</p>
        </div>
      ) : (
        <MusicPlayer tracks={tracks} />
      )}
    </div>
  );
}
