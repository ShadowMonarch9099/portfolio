import { profile } from "@/data/profile";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" index="01" eyebrow="About" title="Frontend first, full-stack when it counts.">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div data-reveal className="space-y-5 text-lg leading-relaxed text-muted">
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <dl data-reveal className="grid grid-cols-2 gap-3 self-start">
          {profile.quickFacts.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
            >
              <dt className="font-mono text-xs uppercase tracking-wider text-muted">{label}</dt>
              <dd className="mt-2 text-2xl font-semibold tracking-tight">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
