'use client';

import { useEffect, useState } from 'react';

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    svg: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    svg: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'RSS',
    href: '/blog',
    svg: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.2 21.6A17.28 17.28 0 001.92 4.32v3.456a13.848 13.848 0 0113.824 13.824h3.456zM4.32 19.2a2.88 2.88 0 100 5.76 2.88 2.88 0 000-5.76zm12.96 2.4a9.6 9.6 0 00-9.6-9.6v3.456a6.144 6.144 0 016.144 6.144h3.456z" />
      </svg>
    ),
  },
];

export function Footer() {
  const [runtime, setRuntime] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const startDate = new Date('2026-04-24');

    function updateRuntime() {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setRuntime({ days, hours, minutes });
    }

    updateRuntime();
    const timer = setInterval(updateRuntime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-10">
        {/* Social icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-primary-bg hover:text-primary"
            >
              {link.svg}
            </a>
          ))}
        </div>

        {/* Info text */}
        <div className="flex flex-col items-center gap-1 text-center text-sm text-text-tertiary">
          <p>
            © {new Date().getFullYear()} 苏羽野的博客. Made with Next.js & Tailwind
            CSS.
          </p>
          <p>
            已运行 {runtime.days} 天 {runtime.hours} 时 {runtime.minutes} 分
          </p>
        </div>
      </div>
    </footer>
  );
}
