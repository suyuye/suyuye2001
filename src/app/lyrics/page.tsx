'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { albumsData, type Album } from '@/config/lyricsData';

export default function LyricsPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setActiveId(album.tracks[0]?.id ?? null);
  };

  const handleBack = () => {
    setSelectedAlbum(null);
    setActiveId(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 pb-20 sm:pt-32">
      {/* Header */}
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">笔下</h1>
        <p className="mt-3 text-text-secondary">人生如戏。</p>
      </section>

      <AnimatePresence mode="wait">
        {selectedAlbum === null ? (
          /* ══════════════════════════════════════
             Level 1 — Album grid
             ══════════════════════════════════════ */
          <motion.div
            key="album-grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {albumsData.map((album) => (
                <button
                  key={album.id}
                  onClick={() => handleSelectAlbum(album)}
                  className="group text-left"
                >
                  <div className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    {/* Cover */}
                    <div className="overflow-hidden">
                      <img
                        src={album.cover}
                        alt={album.title}
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-1">
                        {album.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-tertiary">
                        {album.artist}
                      </p>
                      <p className="mt-1 text-xs text-text-tertiary/70">
                        {album.tracks.length} 首曲目
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ══════════════════════════════════════
             Level 2 — Track list + Lyrics
             ══════════════════════════════════════ */
          <motion.div
            key={`album-${selectedAlbum.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back button */}
            <button
              onClick={handleBack}
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              返回专辑展架
            </button>

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* ── Left sidebar: album info + track list ── */}
              <aside className="md:col-span-1">
                <div className="sticky top-24">
                  {/* Album cover */}
                  <div className="card overflow-hidden">
                    <img
                      src={selectedAlbum.cover}
                      alt={selectedAlbum.title}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-text-primary">
                        {selectedAlbum.title}
                      </h2>
                      <p className="mt-0.5 text-sm text-primary font-medium">
                        {selectedAlbum.artist}
                      </p>
                      <p className="mt-3 text-sm text-text-secondary leading-relaxed max-h-[120px] overflow-y-auto pr-2 scrollbar-thin">
                        {selectedAlbum.description}
                      </p>
                    </div>
                  </div>

                  {/* Track list */}
                  {selectedAlbum.tracks.length > 0 ? (
                    <nav className="mt-4 card p-2">
                      <p className="px-3 py-2 text-xs font-medium text-text-tertiary/70 tracking-wide uppercase">
                        曲目列表
                      </p>
                      {selectedAlbum.tracks.map((track) => {
                        const isActive = track.id === activeId;
                        return (
                          <button
                            key={track.id}
                            onClick={() => setActiveId(track.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-primary-bg text-primary font-semibold'
                                : 'text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'
                            }`}
                          >
                            <span className="text-xs text-text-tertiary mr-2 tabular-nums">
                              {String(track.id).padStart(2, '0')}
                            </span>
                            {track.title}
                          </button>
                        );
                      })}
                    </nav>
                  ) : (
                    <div className="mt-4 card p-6 text-center text-text-tertiary text-sm">
                      暂无曲目
                    </div>
                  )}
                </div>
              </aside>

              {/* ── Right panel: lyrics display ── */}
              <main className="md:col-span-2">
                <div className="card min-h-[420px] p-6 sm:p-10">
                  {(() => {
                    const activeTrack = selectedAlbum.tracks.find((t) => t.id === activeId);
                    if (!activeTrack) {
                      return (
                        <div className="flex items-center justify-center h-[300px] text-text-tertiary text-sm">
                          请在左侧选择一首曲目
                        </div>
                      );
                    }
                    return (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeId}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          {/* Track title */}
                          <h3 className="mb-8 text-xl font-bold text-text-primary">
                            {activeTrack.title}
                          </h3>

                          {/* Lyrics text */}
                          {activeTrack.lyrics ? (
                            <div className="whitespace-pre-wrap leading-loose text-lg text-gray-800 dark:text-gray-300 font-serif tracking-wide">
                              {activeTrack.lyrics}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-[200px] text-text-tertiary text-sm">
                              暂无歌词
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    );
                  })()}
                </div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
