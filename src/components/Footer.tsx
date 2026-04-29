'use client';

import { useEffect, useState } from 'react';
import { userConfig } from '@/config/userConfig';
import { SocialLinkItem } from './SocialLinkItem';

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
        {/* Social icons — driven by config */}
        <div className="flex items-center gap-3">
          {userConfig.social.map((link) => (
            <SocialLinkItem key={link.label} link={link} />
          ))}
        </div>

        {/* Info text */}
        <div className="flex flex-col items-center gap-1 text-center text-sm text-text-tertiary">
          <p>
            &copy; {new Date().getFullYear()} 苏羽野的博客. Made with Next.js &amp;
            Tailwind CSS.
          </p>
          <p>
            已运行 {runtime.days} 天 {runtime.hours} 时 {runtime.minutes} 分
          </p>
        </div>
      </div>
    </footer>
  );
}
