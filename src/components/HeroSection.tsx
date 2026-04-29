'use client';

import { motion } from 'framer-motion';
import { TypeWriter } from './TypeWriter';
import { Avatar } from './Avatar';

const floatingPaths = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  d: `M${10 + i * 15} ${20 + i * 8} Q${40 + i * 10} ${5 + i * 12} ${70 + i * 5} ${25 + i * 6}`,
}));

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10" />
        <svg
          className="absolute inset-0 h-full w-full opacity-30 dark:opacity-20"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          {floatingPaths.map((p) => (
            <motion.path
              key={p.id}
              d={p.d}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="0.15"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{
                duration: 4,
                delay: p.id * 0.3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Avatar with breathing glow */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative h-28 w-28 sm:h-32 sm:w-32">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
            <div
              className="absolute inset-2 rounded-full bg-primary/10"
              style={{
                animation: 'breathing 3s ease-in-out infinite',
              }}
            />
            {/* Avatar image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar size="lg" />
            </div>
          </div>
          <style jsx>{`
            @keyframes breathing {
              0%, 100% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.25); opacity: 0.3; }
            }
          `}</style>
        </motion.div>

        {/* Blog title */}
        <motion.h1
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            苏羽野的博客
          </span>
        </motion.h1>

        {/* Typewriter tagline */}
        <motion.div
          className="mt-6 h-8 text-lg sm:text-xl text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <TypeWriter
            strings={[
              '记录技术、设计与生活',
              '用文字定格思考',
              '用代码创造价值',
              '保持好奇，持续学习',
            ]}
            typeSpeed={70}
            deleteSpeed={40}
            pauseDuration={2000}
          />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <a
            href="/blog"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-7 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97]"
          >
            浏览博客
          </a>
          <a
            href="/about"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-bg-card px-7 text-sm font-medium text-text-secondary shadow-sm transition-all hover:text-text-primary hover:shadow-md active:scale-[0.97]"
          >
            关于我
          </a>
        </motion.div>
      </div>
    </section>
  );
}
