<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 项目速查

## 常用命令
- `npm run dev` — 本地开发 (localhost:3000)
- `npm run build` — 生产构建（Netlify 自动执行）
- `npm run lint` — ESLint

## 内容放哪里（不要新建其他位置）
- 博客文章：`src/content/posts/<slug>.mdx`，frontmatter 字段 `title / date / tags / description / cover`
- 小说章节：`src/content/novels/<书名>/<slug>.mdx`，frontmatter 加 `chapter: 序号`
- 个人资料/社交链接：`src/config/userConfig.ts`
- 实验室项目：`src/config/projectsData.ts`
- 歌词本专辑：`src/config/lyricsData.ts`
- 音乐封面映射：`src/config/musicMeta.ts`（key 是 mp3 文件名去掉后缀）

## 媒体与图床（不在本仓库）
- 所有图片/mp3/相册照片都存在独立仓库 `suyuye/blog-images`，通过 jsDelivr CDN 访问：
  `https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/<目录>/<文件名>`
- 相册 `/album` 和音乐 `/music` 在构建时通过 GitHub API 拉取文件列表（`next: { revalidate: 3600 }`），不要把媒体文件提交到本仓库。

## 关键约束
- Giscus 评论配置写在 `src/components/Comments.tsx`（硬编码 repo=`suyuye/suyuye2001`），`userConfig.ts` 里的 giscus 字段是占位符，不要以它为准。
- 相册密码门默认硬编码 `20010411`，可被环境变量 `NEXT_PUBLIC_ALBUM_PASSWORD` 覆盖。
- 线上域名：`https://suyuye-boke.netlify.app`，改 robots/sitemap/OG 时以此为准。
- 主题亮/暗由 `ThemeProvider` + Tailwind CSS 变量驱动，新增组件请复用 `text-text-primary / text-text-secondary / bg-bg-card / border-border / bg-primary` 等语义化类，不要写死颜色。
- 文章 Markdown 渲染在 `src/components/MDXContent.tsx` 统一定制（Mac 风格代码块、引用块、表格样式），新样式优先改那里而不是内联。

