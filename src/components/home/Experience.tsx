import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function Experience() {
  return (
    <Stop stop="experience" label="Experience" level="04">
      <Eyebrow>LVL 04 · Quest log</Eyebrow>
      <h2 data-split className="display text-[clamp(2.2rem,4.6vw,4.2rem)] font-bold">
        Six months in <span className="text-accent">production.</span>
      </h2>

      <ol className="mt-10 space-y-4">
        {profile.experience.map((e, i) => (
          <li key={e.org} data-reveal className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="pixel text-[0.65rem] text-accent">Quest {String(i + 1).padStart(2, "0")}</p>
              <p className="meta text-muted">{e.period}</p>
            </div>
            <h3 className="display mt-3 text-2xl font-bold sm:text-3xl">{e.org}</h3>
            <p className="mt-1 font-medium italic">
              {e.role} <span className="not-italic text-muted">· {e.place}</span>
            </p>
            <p className="mt-3 max-w-lg leading-relaxed text-muted text-pretty">{e.summary}</p>
          </li>
        ))}
      </ol>
    </Stop>
  );
}
