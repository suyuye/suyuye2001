import type { Metadata } from 'next';
import { AboutHero } from '@/components/AboutHero';
import { Timeline } from '@/components/Timeline';
import { SkillBars } from '@/components/SkillBars';
import { MusicPlayer } from '@/components/MusicPlayer';
import type { Track } from '@/components/MusicPlayer';
import { musicMeta } from '@/config/musicMeta';

export const metadata: Metadata = {
  title: '关于我',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-bold text-text-primary sm:text-2xl">
      <span className="inline-block h-5 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

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

export default async function AboutPage() {
  let tracks: Track[] = [];
  let fetchError: string | null = null;

  try {
    tracks = await fetchTracks();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : '未知错误';
  }

  return (
    <>
      <AboutHero />

      <div className="mx-auto max-w-4xl space-y-10 px-4 pb-20 sm:space-y-14">
        {/* ── Career Timeline ── */}
        <section className="card p-6 sm:p-10">
          <SectionTitle>职业轨迹</SectionTitle>
          <div className="mt-8">
            <Timeline />
          </div>
        </section>

        {/* ── Skills ── */}
        <section className="card p-6 sm:p-10">
          <SectionTitle>技能图谱</SectionTitle>
          <div className="mt-8">
            <SkillBars />
          </div>
        </section>

        {/* ── Music Space ── */}
        <section className="card p-6 sm:p-10">
          <SectionTitle>音乐空间</SectionTitle>
          <p className="mt-2 text-sm text-text-tertiary">
            说唱是流淌在代码之外的另一种节奏。这里记录着我的音乐探索。
          </p>
          <div className="mt-6">
            {fetchError ? (
              <div className="card p-8 text-center text-text-secondary text-sm">
                <p>加载失败</p>
                <p className="mt-1 text-xs">{fetchError}</p>
              </div>
            ) : (
              <MusicPlayer tracks={tracks} />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
