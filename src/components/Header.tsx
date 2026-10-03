'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { SearchDialog } from './SearchDialog';
import type { SearchEntry } from '@/lib/search';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '文章' },
  { href: '/novel', label: '小说' },
  { href: '/album', label: '相册' },
  { href: '/music', label: '音乐' },
  { href: '/lyrics', label: '笔下' },
  { href: '/about', label: '关于我' },
  { href: '/lab', label: '实验室' },
];

export function Header({ searchEntries = [] }: { searchEntries?: SearchEntry[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ⌘K / Ctrl+K 打开搜索，/ 也可以（不在输入态时）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (e.key === '/' && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center">
      <nav className="glass relative mt-3 flex h-13 w-[calc(100%-2rem)] max-w-5xl items-center rounded-2xl px-5 shadow-md">
        {/* Logo */}
        <Link href="/" className="mr-8 shrink-0">
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            苏羽野
          </span>
        </Link>

        {/* Desktop nav links — hidden below md */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-1.5 text-sm font-medium transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="mr-1 flex h-8 items-center gap-1.5 rounded-lg px-2 text-text-secondary transition-colors hover:bg-primary-bg hover:text-primary"
          aria-label="打开搜索"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <kbd className="hidden text-[10px] leading-none text-text-tertiary lg:block">
            ⌘K
          </kbd>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Hamburger button — visible only below md */}
        <button
          className="ml-3 md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-primary-bg hover:text-primary transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile dropdown menu — anchored to nav bottom */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute left-4 right-4 top-full mt-2 origin-top md:hidden"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="glass rounded-2xl px-2 py-2 shadow-xl">
                {/* Search entry for mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-bg hover:text-primary"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                    搜索
                  </button>
                </motion.div>

                {navLinks.map((link, i) => {
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-bg text-primary'
                            : 'text-text-secondary hover:bg-primary-bg hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop overlay — behind dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[-1] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>

      <SearchDialog
        entries={searchEntries}
        open={searchOpen}
        onClose={closeSearch}
      />
    </>
  );
}
