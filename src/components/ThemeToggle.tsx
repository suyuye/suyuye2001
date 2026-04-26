'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-primary-bg hover:text-primary transition-colors"
      aria-label="切换主题"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="text-lg leading-none"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </motion.span>
    </button>
  );
}
