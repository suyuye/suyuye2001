'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TypeWriter } from './TypeWriter';
import { Avatar } from './Avatar';

const blobs = [
  { color: 'bg-blue-400', size: 'w-72 h-72', left: 'left-[5%]', top: 'top-[10%]', duration: 25, x: [0, 40, -20, 0], y: [0, -30, 20, 0] },
  { color: 'bg-purple-400', size: 'w-96 h-96', left: 'right-[10%]', top: 'top-[5%]', duration: 30, x: [0, -30, 25, 0], y: [0, 25, -15, 0] },
  { color: 'bg-indigo-300', size: 'w-64 h-64', left: 'left-[40%]', top: 'bottom-[15%]', duration: 28, x: [0, 25, -35, 0], y: [0, -20, 15, 0] },
];

export function HeroSection() {
  // 系统开启「减少动态效果」时，所有循环动画退化为静态
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden pt-20 sm:pt-28">
      {/* Slow-moving blurry blobs —— 纯装饰，丢帧无所谓，保留 framer-motion 即可 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            className={`absolute ${blob.size} ${blob.left} ${blob.top} ${blob.color} rounded-full opacity-10 blur-3xl`}
            animate={reduceMotion ? undefined : { x: blob.x, y: blob.y }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/*
        Content

        入场动画全部走 CSS（animate-pop-in / rise-in / fade-in）而不是 framer-motion：
        motion 的 initial={{ opacity: 0 }} 会被 SSR 直接写进 HTML 的 style 属性，
        等客户端 JS 加载完才推进。移动端弱网下 chunk 加载慢或失败时，
        这个 opacity:0 会永久留在页面上 —— 首屏表现为「一整片空白 / 纯黑」，
        而 PC 因为 JS 已在缓存里几乎复现不了。
        CSS 动画随 HTML/CSSOM 一起下发，浏览器解析到就播，不等 JS。
      */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Avatar — 只保留一层呼吸光晕，之前 animate-pulse 与 breathing 两条动画叠加会互相打架 */}
        <div className="relative mb-8 animate-pop-in">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32">
            {/* Glow ring */}
            <div
              className="absolute inset-1 rounded-full bg-primary/15"
              style={
                reduceMotion
                  ? undefined
                  : { animation: 'breathing 6s ease-in-out infinite' }
              }
            />
            {/* Avatar image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar size="lg" />
            </div>
          </div>
          <style jsx>{`
            @keyframes breathing {
              0%, 100% { transform: scale(1); opacity: 0.55; }
              50% { transform: scale(1.12); opacity: 0.25; }
            }
          `}</style>
        </div>

        {/* Blog title */}
        <h1 className="animate-rise-in animate-delay-1 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span
            className={`bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] ${
              reduceMotion ? '' : 'animate-gradient-slow'
            }`}
          >
            可我不是苏羽野
          </span>
        </h1>

        {/* Typewriter tagline */}
        <div className="mt-6 h-8 animate-fade-in animate-delay-2 text-lg text-text-secondary sm:text-xl">
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
        </div>

        {/* CTA buttons —— 原「关于我」页已移除，第二入口改指相册 */}
        <div className="mt-10 flex animate-rise-in animate-delay-3 items-center justify-center gap-4">
          <a
            href="/blog"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-7 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97]"
          >
            浏览博客
          </a>
          <a
            href="/album"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-bg-card px-7 text-sm font-medium text-text-secondary shadow-sm transition-all hover:text-text-primary hover:shadow-md active:scale-[0.97]"
          >
            看看相册
          </a>
        </div>
      </div>

      {/* Wave divider — sits above blobs, below content */}
      <div className="absolute bottom-0 left-0 z-0 w-full translate-y-[1px] overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="block h-10 w-full md:h-16 lg:h-20"
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
