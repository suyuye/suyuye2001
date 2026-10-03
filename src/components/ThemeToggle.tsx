'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary-bg hover:text-primary"
      aria-label="切换主题"
    >
      {/*
        图标切换动画走 CSS 而非 framer-motion：
        motion 的 initial opacity:0 会被 SSR 写进 HTML，
        移动端弱网下 JS 未就绪时按钮会是一个空圈。
        key={theme} 会让 React 重建 span，CSS 动画随之重播。
      */}
      <span key={theme} className="animate-spin-in text-lg leading-none">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
