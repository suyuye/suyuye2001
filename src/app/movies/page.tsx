'use client';

import { useState, useEffect, useCallback } from 'react';
import { movies } from '@/config/moviesData';

const STORAGE_KEY = 'watchedMovies';

function loadWatched(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveWatched(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function MoviesPage() {
  const [watched, setWatched] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWatched(loadWatched());
    setHydrated(true);
  }, []);

  const toggleWatched = useCallback((id: string) => {
    setWatched((prev) => {
      const next = prev.includes(id)
        ? prev.filter((wid) => wid !== id)
        : [...prev, id];
      saveWatched(next);
      return next;
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-20 sm:pt-32">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">影音空间</h1>
        <p className="mt-3 text-text-secondary">
          记录我看过的那些光影世界。
        </p>
        {hydrated && (
          <p className="mt-2 text-sm font-medium text-primary">
            已看 {watched.length} / {movies.length} 部
            {watched.length > 0 && (
              <span className="text-text-tertiary font-normal">
                {' '}· 完成度 {Math.round((watched.length / movies.length) * 100)}%
              </span>
            )}
          </p>
        )}
      </section>

      {/* Pill cloud */}
      <div className="flex flex-wrap gap-3 justify-center">
        {movies.map((movie) => {
          const isWatched = watched.includes(movie.id);

          return (
            <button
              key={movie.id}
              onClick={() => toggleWatched(movie.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                ${
                  isWatched
                    ? 'bg-transparent border border-green-200 text-green-600/50 line-through hover:border-green-300 dark:border-green-800/50 dark:text-green-500/50 dark:hover:border-green-700/60'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md active:scale-95 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-800/60'
                }
              `}
            >
              {movie.title}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      {hydrated && (
        <div className="mx-auto mt-10 max-w-xs">
          <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-[width] duration-500"
              style={{
                width: `${(watched.length / movies.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-text-tertiary/60">
        点击药丸标记已看 · 浏览器本地存储
      </p>
    </div>
  );
}
