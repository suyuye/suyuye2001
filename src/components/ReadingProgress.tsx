'use client';

import { useEffect, useState } from 'react';

/**
 * 阅读进度条。
 *
 * 以「正文容器」为度量范围，而不是整页滚动比例——
 * 否则文章末尾的评论区会让进度条怎么滚都到不了 100%。
 *
 * 进度定义：把正文容器顶边从视口 1/3 处推到视口顶之外的过程映射到 0→100%。
 * 用 1/3 而不是视口底，是因为视口底一碰到正文开头进度条就会开始动，
 * 读者会觉得「还没开始读就已经有进度了」。
 */
export function ReadingProgress({ targetId }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const target = document.getElementById(targetId ?? 'reading-body');
      if (!target) {
        setProgress(0);
        return;
      }

      const rect = target.getBoundingClientRect();
      const anchor = window.innerHeight / 3;
      const ratio = (anchor - rect.top) / rect.height;

      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  if (progress <= 0.001) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
      role="progressbar"
      aria-label="阅读进度"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary to-primary-light"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
