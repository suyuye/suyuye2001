'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { SearchEntry, SearchKind } from '@/lib/search';

const KIND_META: Record<SearchKind, { label: string; color: string }> = {
  post: { label: '文章', color: 'bg-primary-bg text-primary' },
  novel: { label: '小说', color: 'bg-primary-bg text-primary' },
  lyrics: { label: '笔下', color: 'bg-primary-bg text-primary' },
};

/**
 * 中文没有空格分词，直接用 includes 匹配整句命中率很低。
 * 这里把查询串拆成单字 + 相邻二字组合（bigram），
 * 只要有一个片段命中就认为相关，再用命中数排序。
 */
function scoreOf(entry: SearchEntry, query: string): number {
  if (!query) return 1;

  const haystack = entry.keywords.toLowerCase();
  const q = query.toLowerCase();

  if (haystack.includes(q)) return 1000 - haystack.indexOf(q);

  let score = 0;
  // 单字命中
  for (const ch of new Set(q)) {
    if (haystack.includes(ch)) score += 1;
  }
  // 二字片段命中，权重更高
  for (let i = 0; i < q.length - 1; i++) {
    const bigram = q.slice(i, i + 2);
    if (haystack.includes(bigram)) score += 8;
  }
  return score;
}

export function SearchDialog({
  entries,
  open,
  onClose,
}: {
  entries: SearchEntry[];
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 每次打开都从干净状态开始。
  // 在渲染期比对 open 而不是放进 useEffect —— 后者会触发级联渲染，
  // 也是 react-hooks/set-state-in-effect 报错的来源。
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return entries
      .map((entry) => ({ entry, score: scoreOf(entry, query.trim()) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.entry);
  }, [entries, query]);

  // 结果变少时把高亮项夹回合法范围
  const highlight = results.length ? Math.min(activeIndex, results.length - 1) : 0;

  // 打开时聚焦（等入场动画开始，避免被动画遮挡）
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // 锁定背景滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = (entry: SearchEntry) => {
    onClose();
    router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (e.key === 'Enter' && results[highlight]) {
      e.preventDefault();
      go(results[highlight]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onKeyDown={onKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="站内搜索"
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg
                className="h-4 w-4 shrink-0 text-text-tertiary"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="搜索文章、小说、歌词…"
                className="h-14 w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
              />
              <kbd className="hidden shrink-0 rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] text-text-tertiary sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {!query.trim() ? (
                <p className="px-3 py-8 text-center text-xs text-text-tertiary">
                  输入关键词开始搜索
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-8 text-center text-xs text-text-tertiary">
                  没有找到「{query}」相关的内容
                </p>
              ) : (
                results.map((entry, i) => (
                  <Link
                    key={entry.href + entry.title}
                    href={entry.href}
                    onClick={onClose}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      i === highlight ? 'bg-primary-bg' : ''
                    }`}
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                        KIND_META[entry.kind].color
                      }`}
                    >
                      {KIND_META[entry.kind].label}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm font-medium ${
                          i === highlight ? 'text-primary' : 'text-text-primary'
                        }`}
                      >
                        {entry.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-text-tertiary">
                        {entry.subtitle}
                      </span>
                    </span>
                    {i === highlight && (
                      <svg
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-primary"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    )}
                  </Link>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="hidden items-center gap-4 border-t border-border px-4 py-2.5 text-[11px] text-text-tertiary sm:flex">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-bg px-1 py-0.5">↑</kbd>
                <kbd className="rounded border border-border bg-bg px-1 py-0.5">↓</kbd>
                选择
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-bg px-1 py-0.5">↵</kbd>
                打开
              </span>
              <span className="ml-auto">共 {entries.length} 条可搜索内容</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}