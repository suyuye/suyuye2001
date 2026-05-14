export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  icon: string;
  demoLink?: string;
  githubLink?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: '专属数字音乐播放器',
    description:
      '脱离第三方平台的定制化 HTML5 播放器，接入 GitHub API 自动抓取，支持暗色模式与极致动效。',
    techStack: ['Next.js', 'Tailwind', 'GitHub API', 'Audio Context'],
    icon: '🎵',
    demoLink: '/music',
  },
  {
    id: '2',
    title: 'Shopify 独立站深度定制',
    description:
      '基于跨界电商业务的深度改造，包含 Shopify API 优化、数据驱动的运营面板与 TikTok 流量承接。',
    techStack: ['Shopify API', 'Liquid', 'eCommerce', 'Data Analysis'],
    icon: '🛒',
  },
  {
    id: '3',
    title: 'DIY 智能音箱中枢',
    description:
      '从零折腾的硬件探索项目，打通底层硬件逻辑与网络通信的极客实践。',
    techStack: ['Hardware DIY', 'IoT', 'Network'],
    icon: '🔊',
  },
];
