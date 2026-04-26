import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const novelsDir = path.join(process.cwd(), 'src', 'content', 'novels');

export interface NovelChapter {
  slug: string;
  title: string;
  novel: string;
  chapter: number;
  description: string;
  date: string;
}

export interface NovelChapterWithContent extends NovelChapter {
  content: string;
}

export interface Novel {
  title: string;
  chapters: NovelChapter[];
}

/** List all novels (subdirectories) */
export function getAllNovels(): Novel[] {
  if (!fs.existsSync(novelsDir)) return [];

  const items = fs.readdirSync(novelsDir, { withFileTypes: true });
  const novels: Novel[] = [];

  for (const item of items) {
    if (!item.isDirectory()) continue;

    const chapterDir = path.join(novelsDir, item.name);
    const files = fs
      .readdirSync(chapterDir)
      .filter((f) => /\.mdx?$/.test(f));

    const chapters = files
      .map((f) => {
        const raw = fs.readFileSync(path.join(chapterDir, f), 'utf-8');
        const { data } = matter(raw);
        return {
          slug: f.replace(/\.mdx?$/, ''),
          title: data.title || '',
          novel: data.novel || item.name,
          chapter: data.chapter ?? 0,
          description: data.description || '',
          date: data.date || '',
        };
      })
      .sort((a, b) => a.chapter - b.chapter);

    novels.push({ title: item.name, chapters });
  }

  return novels;
}

/** Get all chapters across all novels, sorted */
export function getAllChapters(): NovelChapter[] {
  return getAllNovels().flatMap((n) => n.chapters);
}

/** Get a specific chapter by novel name and chapter slug */
export function getChapter(
  novel: string,
  slug: string
): NovelChapterWithContent | null {
  const filePath = path.join(novelsDir, novel, `${slug}.mdx`);
  const mdPath = path.join(novelsDir, novel, `${slug}.md`);

  const found = [filePath, mdPath].find(fs.existsSync);
  if (!found) return null;

  const raw = fs.readFileSync(found, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    novel: data.novel || novel,
    chapter: data.chapter ?? 0,
    description: data.description || '',
    date: data.date || '',
    content,
  };
}
