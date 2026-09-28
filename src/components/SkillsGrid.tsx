import { profile } from "@/data/profile";
import { CodeIcon } from "./Icons";
import { Section } from "./Section";

export function SkillsGrid() {
  const featured = profile.skills.filter((g) => g.featured);
  const others = profile.skills.filter((g) => !g.featured);

  return (
    <Section id="skills" index="04" eyebrow="Skills" title="The toolkit, frontend first.">
      <div className="space-y-4">
        {featured.map((group) => (
          <div
            key={group.name}
            data-reveal
            className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface p-6 sm:p-8"
          >
            <div aria-hidden="true" className="bg-glow absolute inset-0" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-contrast">
                  <CodeIcon className="size-5" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight">{group.name}</h3>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-xs text-accent">
                  primary focus
                </span>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent sm:text-base"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((group) => (
            <div
              key={group.name}
              data-reveal
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted">{group.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
