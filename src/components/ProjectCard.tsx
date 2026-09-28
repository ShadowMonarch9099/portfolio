import Image from "next/image";
import type { Project } from "@/data/profile";
import { ProjectLinks } from "./ProjectLinks";

interface ProjectCardProps {
  project: Project;
  onOpen: (trigger: HTMLButtonElement) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <article
      data-reveal
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 has-[button:focus-visible]:border-accent"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap gap-x-2 font-mono text-xs text-muted">
          <span>{project.context}</span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">{project.period}</span>
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">
          {/* The button's ::after stretches over the whole card so any click opens details.
              Links below sit above it with `relative z-10`. */}
          <button
            type="button"
            onClick={(e) => onOpen(e.currentTarget)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.title}
            <span className="sr-only">: view details</span>
          </button>
        </h3>
        <p className="mt-2 leading-relaxed text-muted text-pretty">{project.description}</p>

        <ul className="mt-4 space-y-2 text-sm">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-pretty">{h}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs text-muted">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex min-h-15 items-center justify-between gap-3 pt-6">
          <ProjectLinks project={project} />
          <span
            aria-hidden="true"
            className="ml-auto text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5"
          >
            Details →
          </span>
        </div>
      </div>
    </article>
  );
}
