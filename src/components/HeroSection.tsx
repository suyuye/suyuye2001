'use client';

import { motion } from 'framer-motion';
import { TypeWriter } from './TypeWriter';
import { Avatar } from './Avatar';

const blobs = [
  { color: 'bg-blue-400', size: 'w-72 h-72', left: 'left-[5%]', top: 'top-[10%]', duration: 25, x: [0, 40, -20, 0], y: [0, -30, 20, 0] },
  { color: 'bg-purple-400', size: 'w-96 h-96', left: 'right-[10%]', top: 'top-[5%]', duration: 30, x: [0, -30, 25, 0], y: [0, 25, -15, 0] },
  { color: 'bg-indigo-300', size: 'w-64 h-64', left: 'left-[40%]', top: 'bottom-[15%]', duration: 28, x: [0, 25, -35, 0], y: [0, -20, 15, 0] },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
      {/* Slow-moving blurry blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            className={`absolute ${blob.size} ${blob.left} ${blob.top} ${blob.color} rounded-full opacity-10 blur-3xl`}
            animate={{ x: blob.x, y: blob.y }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
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
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            可我不是苏羽野
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
              '站在暴雨里，我比它更磅礴。',
              '往事暗沉不可追，来日之路光明灿烂。',
              '劝君莫惜金缕衣，劝君惜取少年时。',
              'per aspera ad astra',
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

      {/* Wave divider — sits above blobs, below content */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px] z-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="block w-full h-10 md:h-16 lg:h-20"
        >
          <path
            d="M0,50 C320,100 420,0 740,50 C1060,100 1120,0 1440,50 L1440,100 L0,100 Z"
            className="fill-bg"
          />
        </svg>
      </div>
    </section>
  );
}
