export interface SocialLink {
  label: string;
  url: string;
  icon: 'github' | 'twitter' | 'email' | 'wechat' | 'rss';
}

export interface UserConfig {
  name: string;
  avatar: string;
  location: string;
  age: number;
  major: string;
  bio: string;
  currentRole: string;
  targetRole: string;
  interests: string[];
  social: SocialLink[];
}

export const userConfig: UserConfig = {
  name: '苏羽野',
  avatar: '苏',
  location: '重庆',
  age: 25,
  major: '数字媒体技术',
  bio: '保持好奇，持续学习',

  currentRole: '亚马逊卖家支持',
  targetRole: 'Shopify 运营与开发',

  interests: ['说唱音乐 (Rap)', 'AI 音乐创作', '手机科技', 'Hexo 博客定制'],

  social: [
    { label: 'GitHub', url: 'https://github.com', icon: 'github' },
    { label: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
    { label: 'Email', url: 'mailto:suyuye2001@163.com', icon: 'email' },
    { label: '微信', url: '#wechat', icon: 'wechat' },
    { label: 'RSS', url: '/blog', icon: 'rss' },
  ],
};
