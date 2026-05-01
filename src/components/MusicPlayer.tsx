'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);

  // ── Audio event bindings ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!dragging) setCurrentTime(audio.currentTime);
    };
    const onLoadedMeta = () => setDuration(audio.duration);
    const onEnded = () => {
      if (currentIndex < tracks.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsPlaying(false);
        audio.currentTime = 0;
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [currentIndex, dragging]);

  // ── Load new track ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // ── Play / Pause ──
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  // ── Seek ──
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const seekFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    },
    [duration],
  );

  const handleProgressDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      seekFromEvent(e);
      const onMove = (ev: MouseEvent) => seekFromEvent(ev);
      const onUp = () => {
        setDragging(false);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [seekFromEvent],
  );

  // ── Switch track ──
  const playTrack = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    // The useEffect above will load the new src; we play in a microtask
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 0);
  }, []);

  if (tracks.length === 0) {
    return (
      <div className="card p-8 text-center text-text-secondary text-sm">
        播放列表为空
      </div>
    );
  }

  const currentTrack = tracks[currentIndex];

  return (
    <div className="space-y-5">
      {/* Hidden native audio */}
      <audio ref={audioRef} preload="metadata" />

      {/* ── Player card ── */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
          {/* Cover art */}
          <div className="mx-auto shrink-0 sm:mx-0">
            <div
              className={`h-40 w-40 overflow-hidden rounded-2xl shadow-lg sm:h-44 sm:w-44 ${
                isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''
              }`}
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Info + controls */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            {/* Track info */}
            <div className="text-center sm:text-left">
              <h3 className="truncate text-lg font-bold text-text-primary">
                {currentTrack.title}
              </h3>
              <p className="mt-0.5 truncate text-sm text-text-tertiary">
                {currentTrack.artist}
              </p>
            </div>

            {/* Controls */}
            <div className="mt-4 space-y-3">
              {/* Play/Pause button */}
              <div className="flex justify-center sm:justify-start">
                <button
                  onClick={togglePlay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/25 transition-all hover:brightness-110 active:scale-95"
                  aria-label={isPlaying ? '暂停' : '播放'}
                >
                  {isPlaying ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs tabular-nums text-text-tertiary w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressRef}
                  className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-border"
                  onMouseDown={handleProgressDown}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-primary shadow-md shadow-primary/30 opacity-0 transition-opacity hover:opacity-100"
                    style={{ left: `${progress}%`, opacity: dragging ? 1 : undefined }}
                  />
                </div>
                <span className="text-xs tabular-nums text-text-tertiary w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Playlist ── */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-tertiary tracking-wide">播放列表</p>
        {tracks.map((track, i) => (
          <button
            key={track.id}
            onClick={() => playTrack(i)}
            className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all hover:bg-primary-bg ${
              i === currentIndex
                ? 'bg-primary-bg ring-1 ring-primary/20'
                : ''
            }`}
          >
            {/* Mini cover */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <img
                src={track.cover}
                alt={track.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Track info */}
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-medium ${
                  i === currentIndex ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {track.title}
              </p>
              <p className="truncate text-xs text-text-tertiary">{track.artist}</p>
            </div>

            {/* Playing indicator */}
            {i === currentIndex && isPlaying && (
              <div className="flex shrink-0 items-center gap-0.5">
                <span className="h-3 w-0.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
                <span className="h-3 w-0.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
                <span className="h-3 w-0.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-text-tertiary/60">
        ✦ 在 GitHub 仓库的 music 目录中添加 .mp3 文件即可自动展示 ✦
      </p>
    </div>
  );
}
