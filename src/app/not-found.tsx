import Link from 'next/link';

/**
 * 404 页。
 *
 * 之前没有这个文件，访问不存在的 URL 会渲染Next.js 默认的英文错误页，
 * 和站点风格完全不搭。误输网址、或外链失效时，这页是访客对站点的第一印象。
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      {/* 404 数字用渐变文本，与 Hero 标题的视觉语言一致 */}
      <p className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-7xl font-bold tracking-tight text-transparent sm:text-8xl">
        404
      </p>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">这个页面不存在</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
        链接可能已经失效，或者地址输错了。可以搜一下站内内容，或者从下面几个入口重新出发。
      </p>

      {/* 搜索提示：引导读者用 ⌘K 而不是自己找路 */}
      <p className="mt-5 text-sm text-text-tertiary">
        也可以按
        <kbd className="mx-1.5 rounded-md border border-border bg-bg-card px-2 py-1 font-mono text-xs text-text-secondary">
          ⌘K
        </kbd>
        打开站内搜索
      </p>

      {/* 主行动 + 次级入口 */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-7 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.97]"
        >
          回到首页
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-bg-card px-7 text-sm font-medium text-text-secondary shadow-sm transition-all hover:text-text-primary hover:shadow-md active:scale-[0.97]"
        >
          看看文章
        </Link>
      </div>

      {/* 兜底导航：读者不想回首页时至少还有路可走 */}
      <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-tertiary">
        {[
          { href: '/blog', label: '文章' },
          { href: '/novel', label: '小说' },
          { href: '/album', label: '相册' },
          { href: '/music', label: '音乐' },
          { href: '/lyrics', label: '笔下' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
