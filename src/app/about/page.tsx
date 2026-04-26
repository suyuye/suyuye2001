import type { Metadata } from 'next';
import { AboutHero } from '@/components/AboutHero';
import { Timeline } from '@/components/Timeline';
import { SkillBars } from '@/components/SkillBars';
import { MusicSpace } from '@/components/MusicSpace';

export const metadata: Metadata = {
  title: '关于我',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-bold text-text-primary sm:text-2xl">
      <span className="inline-block h-5 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <div className="mx-auto max-w-4xl space-y-10 px-4 pb-20 sm:space-y-14">
        {/* ── Career Timeline ── */}
        <section className="card p-6 sm:p-10">
          <SectionTitle>职业轨迹</SectionTitle>
          <div className="mt-8">
            <Timeline />
          </div>
        </section>

        {/* ── Skills ── */}
        <section className="card p-6 sm:p-10">
          <SectionTitle>技能图谱</SectionTitle>
          <div className="mt-8">
            <SkillBars />
          </div>
        </section>

        {/* ── Music Space ── */}
        <section className="card p-6 sm:p-10">
          <SectionTitle>音乐空间</SectionTitle>
          <p className="mt-2 text-sm text-text-tertiary">
            说唱是流淌在代码之外的另一种节奏。这里记录着我的音乐探索。
          </p>
          <div className="mt-6">
            <MusicSpace />
          </div>
        </section>
      </div>
    </>
  );
}
