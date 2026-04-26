import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { HeroSection } from '@/components/HeroSection';
import { PostList } from '@/components/PostList';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const posts = getAllPosts();

  // Gather all unique tags for sidebar
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Post list – 70% */}
          <div className="min-w-0 flex-1 lg:w-[70%]">
            <PostList posts={posts} />
          </div>

          {/* Sidebar – 30% */}
          <div className="lg:w-[30%] lg:min-w-[280px]">
            <Sidebar
              postCount={posts.length}
              tagCount={allTags.length}
              tags={allTags}
            />
          </div>
        </div>
      </section>
    </>
  );
}
