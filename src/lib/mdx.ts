import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover?: string;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir);

  const posts = files
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const raw = fs.readFileSync(path.join(postsDir, f), 'utf-8');
      const { data } = matter(raw);
      const slug = f.replace(/\.mdx?$/, '');
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date ? formatDate(data.date) : '',
        tags: data.tags || [],
        cover: data.cover || undefined,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPostWithContent | null {
  const files = ['md', 'mdx']
    .map((ext) => path.join(postsDir, `${slug}.${ext}`))
    .filter(fs.existsSync);

  if (files.length === 0) return null;

  const raw = fs.readFileSync(files[0], 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date ? formatDate(data.date) : '',
    tags: data.tags || [],
    cover: data.cover || undefined,
    content,
  };
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
