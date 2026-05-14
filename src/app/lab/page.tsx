import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/config/projectsData';

export const metadata: Metadata = {
  title: '极客实验室',
};

export default function LabPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 pb-20 sm:pt-32">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">极客实验室</h1>
        <p className="mt-3 text-text-secondary">
          代码、硬件与奇思妙想的孵化车库。
        </p>
      </section>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 dark:bg-white/5 dark:border-white/10 dark:hover:border-primary/30 dark:hover:shadow-primary/10"
          >
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              {project.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-text-primary">
              {project.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {project.description}
            </p>

            {/* Tech stack pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 rounded-md bg-gray-100 text-text-secondary dark:bg-gray-800 dark:text-gray-400"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action links */}
            <div className="mt-5 flex items-center gap-3">
              {project.demoLink && (
                <Link
                  href={project.demoLink}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  演示
                </Link>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-text-tertiary hover:text-primary transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  源码
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
