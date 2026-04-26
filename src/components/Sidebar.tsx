'use client';

import { motion } from 'framer-motion';
import { userConfig } from '@/config/userConfig';
import { SocialIcon } from './SocialIcon';
import { useTheme } from './ThemeProvider';

/* ─── Deterministic hue from string ─── */
function getHue(text: string) {
  return text.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}

/* ─── Props ─── */
interface SidebarProps {
  postCount: number;
  tagCount: number;
  tags: string[];
}

/* ─── Card wrapper ─── */
function SideCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card p-5 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Section title ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
      <span className="inline-block h-4 w-1 rounded-full bg-primary" />
      {children}
    </h3>
  );
}

/* ══════════════════════════════════════════════
   Profile Card — reads from userConfig
   ══════════════════════════════════════════════ */
function ProfileCard({ postCount, tagCount }: { postCount: number; tagCount: number }) {
  const { name, avatar, bio, social, interests } = userConfig;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SideCard>
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-bg-card text-2xl font-bold text-primary">
              {avatar}
            </div>
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-bg-card bg-green-500" />
        </div>

        {/* Name */}
        <h4 className="text-lg font-bold text-text-primary">{name}</h4>
        <p className="mt-0.5 text-xs text-text-tertiary">{bio}</p>

        {/* Quick info chips */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          <span className="rounded-md bg-primary-bg px-2 py-0.5 text-xs text-primary">
            📍 {userConfig.location}
          </span>
          <span className="rounded-md bg-primary-bg px-2 py-0.5 text-xs text-primary">
            🎂 {userConfig.age}
          </span>
          <span className="rounded-md bg-primary-bg px-2 py-0.5 text-xs text-primary">
            📚 {userConfig.major}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-4 flex w-full items-center justify-around border-y border-border py-3">
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{postCount}</p>
            <p className="text-xs text-text-tertiary">文章</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{tagCount}</p>
            <p className="text-xs text-text-tertiary">标签</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">0</p>
            <p className="text-xs text-text-tertiary">分类</p>
          </div>
        </div>

        {/* ── Dynamic interest tag wall ── */}
        <div className="mt-4 w-full">
          <p className="mb-2.5 text-xs font-medium text-text-tertiary/70 tracking-wide">
            ✦ 兴趣标签
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {interests.map((interest) => {
              const hue = getHue(interest);
              return (
                <motion.span
                  key={interest}
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium cursor-default select-none"
                  style={{
                    backgroundColor: isDark
                      ? `hsl(${hue}, 28%, 22%)`
                      : `hsl(${hue}, 52%, 88%)`,
                    color: isDark
                      ? `hsl(${hue}, 72%, 74%)`
                      : `hsl(${hue}, 62%, 36%)`,
                  }}
                  animate={{
                    y: [0, -3, 0, 2, 0],
                    x: [0, 1, -2, 0, 0],
                  }}
                  transition={{
                    duration: 3 + (hue % 3),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (hue % 10) * 0.12,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {interest}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* Social links — driven by config */}
        <div className="mt-4 flex items-center gap-2">
          {social.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-bg hover:text-primary"
            >
              <SocialIcon icon={link.icon} className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>

        {/* Follow button */}
        <motion.a
          href={social.find((s) => s.icon === 'github')?.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 hover:shadow-xl active:scale-[0.97]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          关注我
        </motion.a>
      </div>
    </SideCard>
  );
}

/* ══════════════════════════════════════════════
   Announcement Card
   ══════════════════════════════════════════════ */
function AnnouncementCard() {
  return (
    <SideCard>
      <SectionTitle>公告</SectionTitle>
      <div className="flex items-start gap-3">
        <motion.span
          className="shrink-0 text-xl"
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          📢
        </motion.span>
        <p className="text-sm text-text-secondary leading-relaxed">
          欢迎来到苏羽野的博客！这里将会持续分享技术文章、学习笔记和生活感悟。
          新文章每周更新，敬请关注。
        </p>
      </div>
    </SideCard>
  );
}

/* ══════════════════════════════════════════════
   Tag Cloud Card
   ══════════════════════════════════════════════ */
function TagCloudCard({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <SideCard>
      <SectionTitle>标签云</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const sizes = ['text-xs', 'text-sm', 'text-sm', 'text-base', 'text-base'];
          const hash = tag.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
          const sizeClass = sizes[hash % sizes.length];
          const opacity = 0.5 + ((hash % 5) * 0.1);

          return (
            <span
              key={tag}
              className={`rounded-full bg-primary-bg px-3 py-1.5 ${sizeClass} font-medium text-primary transition-all hover:brightness-110 hover:shadow-sm cursor-default`}
              style={{ opacity }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </SideCard>
  );
}

/* ══════════════════════════════════════════════
   Sidebar — composition root
   ══════════════════════════════════════════════ */
export function Sidebar({ postCount, tagCount, tags }: SidebarProps) {
  return (
    <aside className="sticky top-24 flex flex-col gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <ProfileCard postCount={postCount} tagCount={tagCount} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <AnnouncementCard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <TagCloudCard tags={tags} />
      </motion.div>
    </aside>
  );
}
