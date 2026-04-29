'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { userConfig } from '@/config/userConfig';

type GiscusTheme = 'light' | 'dark' | 'preferred_color_scheme';

export function GiscusComment() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  const giscusTheme: GiscusTheme = theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    // Avoid double-loading the script
    if (scriptLoadedRef.current) {
      // Just tell the existing iframe to update theme
      const iframe = document.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame'
      );
      if (iframe) {
        iframe.contentWindow?.postMessage(
          {
            giscus: {
              setConfig: {
                theme: giscusTheme,
              },
            },
          },
          'https://giscus.app'
        );
      }
      return;
    }

    scriptLoadedRef.current = true;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', userConfig.giscus.repo);
    script.setAttribute('data-repo-id', userConfig.giscus.repoId);
    script.setAttribute('data-category', userConfig.giscus.category);
    script.setAttribute('data-category-id', userConfig.giscus.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
  }, [giscusTheme]);

  // Update theme on the fly without reloading
  useEffect(() => {
    if (scriptLoadedRef.current) {
      const iframe = document.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame'
      );
      if (iframe) {
        iframe.contentWindow?.postMessage(
          {
            giscus: {
              setConfig: {
                theme: giscusTheme,
              },
            },
          },
          'https://giscus.app'
        );
      }
    }
  }, [giscusTheme]);

  return (
    <div className="mt-12">
      <div
        className="card p-6 sm:p-10"
        ref={containerRef}
      />
    </div>
  );
}
