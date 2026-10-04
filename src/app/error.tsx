'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * 全站错误边界。
 *
 * 之前没有这个文件，MDX 解析或任何渲染期抛错都会让整页崩成浏览器的默认报错页。
 *有了它，异常被收敛在一张卡片里，页面其余部分（导航、页脚）依然可点。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 开发期直接打日志；线上留埋点位置（需要上报时在这里接）
    console.error('[page error]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="card flex w-full flex-col items-center p-8 sm:p-12">
        <p className="text-5xl font-bold">出错了</p>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          页面渲染时出了点问题。可以先重试一下，不行就回首页继续逛。
        </p>

        {/* digest 是服务端渲染错误的标识，用户截图反馈时带上它好定位 */}
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-text-tertiary">
            错误编号：{error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-7 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.97]"
          >
            重试
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-bg-card px-7 text-sm font-medium text-text-secondary shadow-sm transition-all hover:text-text-primary hover:shadow-md active:scale-[0.97]"
          >
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
