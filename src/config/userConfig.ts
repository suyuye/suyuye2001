export interface SocialLink {
  label: string;
  url: string;
  icon: 'github' | 'email' | 'wechat' | 'rss' | 'qq';
}

export interface GiscusConfig {
  repo: `${string}/${string}`;              // e.g. "suyuye/boke"
  repoId: string;                           // from giscus.app
  category: string;                         // e.g. "Announcements"
  categoryId: string;                       // from giscus.app
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
  giscus: GiscusConfig;
}

export const userConfig: UserConfig = {
  name: '苏羽野',
  avatar: 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260429205225_34_230.jpg',
  location: '重庆',
  age: 25,
  major: '数字媒体技术',
  bio: '站在暴雨里，我比它更磅礴。',

  currentRole: '亚马逊卖家支持',
  targetRole: 'Shopify 运营与开发',

  interests: ['说唱音乐 (Rap)', '音乐创作', '手机科技', 'Hexo 博客定制'],

 social: [
    { label: 'GitHub', url: 'https://github.com/suyuye', icon: 'github' },
    // 替换了 Twitter 为 QQ，直接唤起聊天
    { label: 'QQ', url: 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/qq1.jpg', icon: 'qq' }, 
    { label: 'Email', url: 'mailto:suyuye2001@163.com', icon: 'email' },
    // 微信设置为锚点链接，稍后配合代码实现弹窗显示二维码
    { label: '微信', url: 'https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/wechat2.jpg', icon: 'wechat' }, 
    { label: 'RSS', url: '/blog', icon: 'rss' },
  ],

  // Giscus 评论系统配置 — 前往 https://giscus.app 获取
  giscus: {
    repo: 'suyuye/boke',
    repoId: 'YOUR_REPO_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
};
