'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({
  theme: 'light',
  toggle: () => {},
});

/**
 * 在首帧渲染前就把 .dark 打到 html 上。
 * ThemeProvider 要等 useEffect 才知道主题，那时已经晚了一帧——
 * 深色模式下用户会看到「白底 + 深色文字」闪一下（移动端更明显，因为网络慢、闪得久）。
 * 这个脚本不依赖 React，随 SSR 一起下发，首帧就是对的。
 */
const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // 主题由上面的内联脚本在首帧前写到 html 上，这里只负责同步 React state。
  // 不再需要 mounted 标记做「等挂载再渲染」的早返回 —— 那会导致首帧 html 上没有 .dark。
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const t: Theme = prefersDark ? 'dark' : 'light';
      setTheme(t);
      document.documentElement.classList.toggle('dark', t === 'dark');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
