import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function Experience() {
  return (
    <Stop stop="experience" label="Experience">
      <Eyebrow>Ch. 04 — Experience</Eyebrow>
      <h2 data-split className="display text-[clamp(2.4rem,5.2vw,4.75rem)]">
        Six months in production.
      </h2>

      <ol className="mt-12 border-t border-line">
        {profile.experience.map((e) => (
          <li key={e.org} data-reveal className="grid gap-2 border-b border-line py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
            <p className="hud pt-1.5 text-muted">{e.period}</p>
            <div>
              <h3 className="display text-3xl">{e.org}</h3>
              <p className="mt-1 text-fg">
                {e.role} <span className="text-muted">· {e.place}</span>
              </p>
              <p className="mt-3 max-w-lg leading-relaxed text-muted text-pretty">{e.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </Stop>
  );
}
