'use client';

import { motion } from 'framer-motion';
import { userConfig } from '@/config/userConfig';

const poeticBio =
  '数字世界的漫游者，用代码谱写旋律，用设计传递温度。'
  + '从山城重庆出发，在比特洪流中寻找秩序的碎片。'
  + '相信技术是诗意的另一种表达。';

export function AboutHero() {
  const { name, location, age, major, interests } = userConfig;

  return (
    <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden sm:min-h-[60vh]">
      {/* Background with animated gradient + pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5 dark:from-primary/12 dark:to-primary/8" />
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Decorative blurred orbs */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl dark:bg-primary/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative line */}
          <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Name */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {name}
            </span>
          </h1>

          {/* Poetic bio */}
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-text-secondary text-base sm:text-lg">
            {poeticBio}
          </p>

          {/* Quick stats row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-tertiary">
            <span>📍 {location}</span>
            <span className="hidden sm:inline">·</span>
            <span>🎂 {age} 岁</span>
            <span className="hidden sm:inline">·</span>
            <span>📚 {major}</span>
            <span className="hidden sm:inline">·</span>
            <span>🎧 {interests[0]}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
