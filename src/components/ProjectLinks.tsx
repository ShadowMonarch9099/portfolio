import type { Project } from "@/data/profile";
import { ArrowUpRightIcon, GitHubIcon } from "./Icons";

/** Live / GitHub buttons. Each is hidden when its URL isn't set in profile.ts. */
export function ProjectLinks({ project }: { project: Project }) {
  if (!project.liveUrl && !project.githubUrl) return null;
  const base =
    "relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors";
  return (
    <div className="flex flex-wrap gap-2">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border-accent bg-accent text-accent-contrast hover:bg-accent-hover`}
        >
          Live
          <ArrowUpRightIcon className="size-3.5" />
          <span className="sr-only">: {project.title} (opens in a new tab)</span>
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border-border-strong hover:border-accent hover:text-accent`}
        >
          <GitHubIcon className="size-3.5" />
          GitHub
          <span className="sr-only">: {project.title} source (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}
