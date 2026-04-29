'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import type { SocialLink } from '@/config/userConfig';
import { SocialIcon } from './SocialIcon';

// ============================================================
// QR 码图片映射 — 将占位符替换为你的图床链接
// ============================================================
const qrCodeMap: Record<string, string> = {
  QQ: 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/qq1.jpg',
  微信: 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/wechat2.jpg',
};

interface SocialLinkItemProps {
  link: SocialLink;
}

function QRImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 ${className}`}>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
          加载失败
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export function SocialLinkItem({ link }: SocialLinkItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hasQR = link.label === 'QQ' || link.label === '微信';
  const qrSrc = qrCodeMap[link.label];

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hasQR) return;
      if (isMobile) {
        e.preventDefault();
        setShowModal(true);
      }
    },
    [hasQR, isMobile],
  );

  const hrefProps = link.url.startsWith('http')
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  const anchor = (
    <a
      href={link.url}
      aria-label={link.label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-bg hover:text-primary"
      onClick={handleClick}
      {...hrefProps}
    >
      <SocialIcon icon={link.icon} className="h-4.5 w-4.5" />
    </a>
  );

  if (!hasQR) return anchor;

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => !isMobile && setShowTooltip(true)}
        onMouseLeave={() => !isMobile && setShowTooltip(false)}
      >
        {anchor}

        {/* Desktop hover tooltip */}
        <AnimatePresence>
          {showTooltip && !isMobile && (
            <motion.div
              className="absolute bottom-full left-1/2 z-[100] mb-2 -translate-x-1/2"
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.92 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="flex flex-col items-center">
                {/* Card body — fixed width prevents collapse */}
                <div className="w-[160px] flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl p-3 shadow-xl shadow-black/10 dark:bg-gray-800/80 dark:border-white/10">
                  <QRImage
                    src={qrSrc}
                    alt={`${link.label} 二维码`}
                    className="w-full h-auto block rounded-xl"
                  />
                  <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">
                    扫码加{link.label}
                  </p>
                </div>
                {/* Arrow */}
                <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/70 dark:border-t-gray-800/80" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile full-screen modal */}
      <AnimatePresence>
        {showModal && isMobile && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Modal content */}
            <motion.div
              className="relative z-10 mx-4 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="w-[220px] flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl p-4 shadow-2xl dark:bg-gray-900/90 dark:border-white/10">
                <QRImage
                  src={qrSrc}
                  alt={`${link.label} 二维码`}
                  className="w-full h-auto block rounded-xl"
                />
                <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  扫码加{link.label}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
