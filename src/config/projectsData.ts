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
    title: 'DIY 旺仔音响免开孔版',
    description:
      '用 Blender Python API 参数化生成方圆柱音箱外壳，攻克嘉立创 70cm³ 免费额度限制与水密性检测，从建模到打印全流程极客实战。',
    techStack: ['Blender bpy', '3D Printing', 'Python', 'Parametric Design'],
    icon: '🔊',
    demoLink: '/posts/sound-diy',
  },
];
