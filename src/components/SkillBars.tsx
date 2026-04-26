'use client';

import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number; // 0-100
  color: string; // Tailwind hue number
}

const skills: Skill[] = [
  { name: 'Next.js / React', level: 78, color: '210' },
  { name: 'Shopify 模板开发', level: 55, color: '160' },
  { name: 'AI 音乐生成', level: 70, color: '280' },
  { name: '视频剪辑 / 后期', level: 62, color: '350' },
  { name: 'Tailwind / CSS', level: 82, color: '200' },
  { name: '电商运营策略', level: 65, color: '30' },
];

function SkillRow({ skill, index }: { skill: Skill; index: number }) {
  const { name, level, color } = skill;

  return (
    <motion.div
      className="flex flex-col gap-1.5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-primary">{name}</span>
        <span className="text-xs tabular-nums text-text-tertiary">{level}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(${color}, 55%, 55%), hsl(${color}, 65%, 45%))`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export function SkillBars() {
  return (
    <div className="flex flex-col gap-5">
      {skills.map((skill, i) => (
        <SkillRow key={skill.name} skill={skill} index={i} />
      ))}
    </div>
  );
}
