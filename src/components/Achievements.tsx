import { profile } from "@/data/profile";
import { AwardIcon, CodeIcon, TrophyIcon, UsersIcon } from "./Icons";
import { Section } from "./Section";

const icons = [TrophyIcon, CodeIcon, UsersIcon, AwardIcon];

export function Achievements() {
  return (
    <Section id="achievements" index="05" eyebrow="Achievements & Leadership" title="Beyond the day job.">
      <ul className="grid gap-4 sm:grid-cols-2">
        {profile.achievements.map(({ title, detail }, i) => {
          const Icon = icons[i % icons.length];
          return (
            <li
              key={title}
              data-reveal
              className="flex gap-4 rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-border-strong"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 leading-relaxed text-muted text-pretty">{detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
