'use client';

import { motion } from 'framer-motion';

interface TimelineItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const items: TimelineItem[] = [
  {
    year: '2020 — 2024',
    title: '数字媒体技术',
    subtitle: '专业学习',
    description:
      '系统学习数字媒体技术，涵盖前端开发、UI/UX 设计、影视后期与三维建模。奠定了技术与设计融合的知识体系。',
    icon: '📚',
  },
  {
    year: '2024 — 至今',
    title: '亚马逊卖家支持',
    subtitle: '电商运营',
    description:
      '负责亚马逊平台卖家支持工作，深入理解电商平台运作机制与用户需求，积累了丰富的跨境电商业态认知。',
    icon: '📦',
  },
  {
    year: '2025 — 未来',
    title: 'Shopify 运营与开发',
    subtitle: '深耕转型',
    description:
      '正在向 Shopify 生态全面转型，学习 Liquid 模板语言、Shopify 应用开发与独立站运营策略，打造全链路电商解决方案。',
    icon: '🚀',
  },
];

export function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border sm:left-[23px]" />

      <div className="flex flex-col gap-10">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            className="relative pl-14 sm:pl-16"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            {/* Dot */}
            <div className="absolute left-0 top-1 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-card shadow-sm sm:h-12 sm:w-12">
                <span className="text-base sm:text-lg">{item.icon}</span>
              </div>
            </div>

            {/* Content card */}
            <div className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-2">
                <time className="text-xs font-medium text-primary">{item.year}</time>
                <span className="rounded-full bg-primary-bg px-2 py-0.5 text-xs text-primary">
                  {item.subtitle}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-text-primary">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
