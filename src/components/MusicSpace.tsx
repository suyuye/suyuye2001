'use client';

import { motion } from 'framer-motion';
import { userConfig } from '@/config/userConfig';

const tracks = [
  {
    title: '未命名 Demo · 01',
    style: 'Lo-fi Hip-hop',
    status: 'AI 生成 · 实验作品',
    gradient: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    title: '数字脉搏',
    style: 'Electronic / Rap',
    status: 'AI 协作 · 制作中',
    gradient: 'from-blue-500/20 to-purple-500/10',
  },
  {
    title: '山城节奏',
    style: 'Rap / Boom Bap',
    status: '灵感片段 · 采样中',
    gradient: 'from-orange-500/20 to-rose-500/10',
  },
];

/** Deterministic hue from text for genre tags */
function getHue(text: string) {
  return text.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}

export function MusicSpace() {
  const { interests } = userConfig;
  const rapRelated = interests.filter(
    (i) => i.toLowerCase().includes('rap') || i.toLowerCase().includes('音乐')
  );

  return (
    <div className="space-y-5">
      {/* Genre vibe tags */}
      <div className="flex flex-wrap gap-2">
        {rapRelated.map((tag) => {
          const hue = getHue(tag);
          return (
            <motion.span
              key={tag}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium cursor-default"
              style={{
                backgroundColor: `hsl(${hue}, 28%, 22%)`,
                color: `hsl(${hue}, 72%, 74%)`,
              }}
              whileHover={{ scale: 1.06 }}
            >
              🎵 {tag}
            </motion.span>
          );
        })}
      </div>

      {/* Track list */}
      <div className="flex flex-col gap-3">
        {tracks.map((track, i) => (
          <motion.div
            key={track.title}
            className={`card overflow-hidden p-4 sm:p-5 ${track.gradient}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="flex items-center gap-4">
              {/* Album art placeholder */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg sm:h-14 sm:w-14 sm:text-xl">
                🎧
              </div>

              {/* Track info */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-text-primary">
                  {track.title}
                </h4>
                <p className="text-xs text-text-tertiary">{track.style}</p>
              </div>

              {/* Status badge */}
              <span className="shrink-0 rounded-full bg-bg-card px-2.5 py-1 text-[11px] text-text-tertiary border border-border">
                {track.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hint for future */}
      <p className="text-center text-xs text-text-tertiary/60">
        ✦ AI 音乐作品持续创作中，敬请期待 ✦
      </p>
    </div>
  );
}
