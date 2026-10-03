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

/**
 * 统一换行符为 LF。
 *
 * 仓库内的 .mdx 文件在 Windows 上创建，保存为 CRLF。
 * react-markdown / remark 对 CRLF 的空行判定不稳定，会把整篇内容
 * 合并成单个段落，导致图注、列表、图片等块级结构全部失效。
 * 这里在读取时归一化，避免改动内容文件本身。
 */
function normalize(raw: string): string {
  return raw.replace(/\r\n?/g, '\n');
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir);

  const posts = files
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const raw = normalize(fs.readFileSync(path.join(postsDir, f), 'utf-8'));
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

  const raw = normalize(fs.readFileSync(files[0], 'utf-8'));
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
