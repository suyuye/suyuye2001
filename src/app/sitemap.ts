import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://suyuye-boke.netlify.app';

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/album`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/music`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lyrics`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // 文章页此前完全没进 sitemap，等于放弃了文章页的搜索收录入口。
  // lastModified 用 rawDate（YYYY-MM-DD），比 formatDate 后的「2026/10/03」更易被正确解析。
  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.rawDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...coreRoutes, ...postRoutes];
}
