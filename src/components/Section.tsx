import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export function Section({ id, index, eyebrow, title, intro, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header data-reveal className="mb-12 max-w-2xl sm:mb-16">
          <p className="font-mono text-sm text-accent">
            {index} <span aria-hidden="true">/</span> {eyebrow}
          </p>
          <h2 id={headingId} className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-4 text-lg text-muted text-pretty">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
