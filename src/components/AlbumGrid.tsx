'use client';

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export interface AlbumPhoto {
  id: string;
  url: string;
  title: string;
}

export function AlbumGrid({ photos }: { photos: AlbumPhoto[] }) {
  if (photos.length === 0) {
    return (
      <div className="card p-12 text-center text-text-secondary">
        <p className="text-lg">还没有照片</p>
        <p className="mt-1 text-sm">在 GitHub 仓库的 album 目录中添加照片即可自动展示。</p>
      </div>
    );
  }

  return (
    <PhotoProvider
      speed={() => 320}
      maskOpacity={0.85}
      toolbarRender={({ onScale, scale, rotate, onRotate }) => (
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white backdrop-blur hover:bg-white/20"
            onClick={() => onScale(scale + 0.5)}
          >
            +
          </button>
          <button
            className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white backdrop-blur hover:bg-white/20"
            onClick={() => onScale(scale - 0.5)}
          >
            -
          </button>
          <button
            className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white backdrop-blur hover:bg-white/20"
            onClick={() => onRotate(rotate + 90)}
          >
            ↻
          </button>
        </div>
      )}
    >
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
        {photos.map((photo) => (
          <PhotoView key={photo.id} src={photo.url}>
            <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl cursor-pointer">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
