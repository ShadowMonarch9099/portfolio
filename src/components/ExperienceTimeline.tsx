import { profile } from "@/data/profile";
import { ArrowUpRightIcon } from "./Icons";
import { Section } from "./Section";

export function ExperienceTimeline() {
  return (
    <Section id="experience" index="02" eyebrow="Experience" title="Where I've shipped production software.">
      <div className="space-y-16">
        {profile.experience.map((job) => (
          <article key={`${job.company}-${job.period}`} className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
            <header data-reveal className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-mono text-sm text-muted">{job.period}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{job.company}</h3>
              <p className="mt-1 text-muted">
                {job.role} · {job.location}
              </p>
            </header>

            <ol className="relative space-y-6 border-l border-border pl-6 sm:pl-8">
              {job.projects.map((project) => (
                <li key={project.name} data-reveal className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-7 -left-[calc(1.5rem+5px)] size-2.5 rounded-full bg-accent ring-4 ring-bg sm:-left-[calc(2rem+5px)]"
                  />
                  <div className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong sm:p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="text-lg font-semibold tracking-tight">
                        {project.name} <span className="font-normal text-muted">– {project.subtitle}</span>
                      </h4>
                      <p className="font-mono text-sm text-muted">{project.period}</p>
                    </div>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
                      >
                        {project.liveUrl.replace(/^https?:\/\//, "")}
                        <ArrowUpRightIcon className="size-3.5" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                    <ul className="mt-5 space-y-3">
                      {project.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 leading-relaxed text-muted">
                          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent/70" />
                          <span className="text-pretty">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </Section>
  );
}
