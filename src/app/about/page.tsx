import type { Metadata } from 'next';
import { AboutHero } from '@/components/AboutHero';
import { Timeline } from '@/components/Timeline';
import { SkillBars } from '@/components/SkillBars';

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
      </div>
    </>
  );
}
