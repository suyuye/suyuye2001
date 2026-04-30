import { AlbumGrid } from '@/components/AlbumGrid';
import type { AlbumPhoto } from '@/components/AlbumGrid';

const GITHUB_API = 'https://api.github.com/repos/suyuye/blog-images/contents/album';
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/album';
const IMAGE_EXTS = /\.(jpe?g|png|webp|gif)$/i;

async function fetchPhotos(): Promise<AlbumPhoto[]> {
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
    .filter((f) => f.type === 'file' && IMAGE_EXTS.test(f.name))
    .map((f, i) => ({
      id: `photo-${i}`,
      url: `${CDN_BASE}/${f.name}`,
      title: f.name.replace(/\.[^.]+$/, ''),
    }));
}

export default async function AlbumPage() {
  let photos: AlbumPhoto[] = [];
  let error: string | null = null;

  try {
    photos = await fetchPhotos();
  } catch (e) {
    error = e instanceof Error ? e.message : '未知错误';
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-20 sm:pt-32">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">相册</h1>
        <p className="mt-3 text-text-secondary">
          用镜头记录生活{photos.length > 0 ? ` · 共 ${photos.length} 张照片` : ''}
        </p>
      </section>

      {error ? (
        <div className="card p-12 text-center text-text-secondary">
          <p className="text-lg">加载失败</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : (
        <AlbumGrid photos={photos} />
      )}
    </div>
  );
}
