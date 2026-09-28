"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile, type Project } from "@/data/profile";
import { CloseIcon } from "./Icons";
import { ProjectCard } from "./ProjectCard";
import { ProjectLinks } from "./ProjectLinks";
import { Section } from "./Section";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
  }, [selected]);

  function open(project: Project, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelected(project);
  }

  function handleClose() {
    setSelected(null);
    triggerRef.current?.focus();
  }

  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      title="Selected work."
      intro="Two production products from my internship and a hackathon build. Open a card for the full story."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profile.projects.map((project) => (
          <ProjectCard key={project.slug} project={project} onOpen={(t) => open(project, t)} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        aria-labelledby="project-dialog-title"
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface p-0 text-fg shadow-2xl"
      >
        {selected && (
          <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="relative aspect-[16/9] border-b border-border bg-surface-2">
              <Image
                src={selected.image}
                alt={selected.imageAlt}
                fill
                sizes="(min-width: 672px) 672px, 100vw"
                className="object-cover"
              />
              <form method="dialog" className="absolute right-3 top-3">
                <button
                  type="submit"
                  aria-label="Close project details"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface/90 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent"
                >
                  <CloseIcon className="size-5" />
                </button>
              </form>
            </div>
            <div className="p-6 sm:p-8">
              <p className="font-mono text-xs text-muted">
                {selected.context} · {selected.period}
              </p>
              <h3 id="project-dialog-title" className="mt-2 text-2xl font-semibold tracking-tight">
                {selected.title}
              </h3>
              <p className="mt-2 text-lg leading-relaxed text-muted text-pretty">{selected.description}</p>

              <ul className="mt-6 space-y-3">
                {selected.bullets.map((b) => (
                  <li key={b} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                {selected.tags.map((tag) => (
                  <li key={tag} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs text-muted">
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-8 empty:hidden">
                <ProjectLinks project={selected} />
              </div>
            </div>
          </div>
        )}
      </dialog>
    </Section>
  );
}
