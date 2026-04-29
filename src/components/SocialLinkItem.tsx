'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { SocialLink } from '@/config/userConfig';
import { SocialIcon } from './SocialIcon';

// ============================================================
// QR 码图片映射 — 将占位符替换为你的图床链接
// ============================================================
const qrCodeMap: Record<string, string> = {
  QQ: 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/qq.jpg',
  微信: 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/wechat.jpg',
};

interface SocialLinkItemProps {
  link: SocialLink;
}

export function SocialLinkItem({ link }: SocialLinkItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const hasQR = link.label === 'QQ' || link.label === '微信';
  const qrSrc = qrCodeMap[link.label];

  const hrefProps = link.url.startsWith('http')
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  const anchor = (
    <a
      href={link.url}
      aria-label={link.label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-bg hover:text-primary"
      {...hrefProps}
    >
      <SocialIcon icon={link.icon} className="h-4.5 w-4.5" />
    </a>
  );

  if (!hasQR) return anchor;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {anchor}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center">
              <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl p-2 shadow-xl shadow-black/10 dark:bg-black/70 dark:border-white/10">
                <img
                  src={qrSrc}
                  alt={`${link.label} 二维码`}
                  className="h-36 w-36 rounded-xl"
                />
              </div>
              {/* 下三角箭头 */}
              <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/70 dark:border-t-black/70" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
