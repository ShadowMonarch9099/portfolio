import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function Loadout() {
  const primary = profile.skills.find((g) => g.primary);
  const rest = profile.skills.filter((g) => !g.primary);

  return (
    <Stop stop="loadout" label="Loadout" level="05">
      <Eyebrow>LVL 05 · Loadout</Eyebrow>
      <h2 data-split className="display text-[clamp(2.4rem,5.4vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
        Main build: <span className="text-accent">frontend.</span>
      </h2>
      <p data-reveal className="mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
        The tools I reach for. Frontend is where I spend most of my time; the rest is there when the job needs it.
      </p>

      {primary && (
        <div data-reveal className="mt-10">
          <h3 className="pixel mb-3 flex items-center justify-between text-accent">
            <span>{primary.name} · equipped</span>
            <span className="text-muted">
              {primary.skills.length}/{primary.skills.length}
            </span>
          </h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {primary.skills.map((s, i) => (
              <li key={s} className="brackets group relative bg-bg-2/60 px-3 pb-3 pt-6 transition-colors hover:bg-bg-2">
                <span aria-hidden="true" className="pixel absolute left-2 top-1.5 text-[0.55rem] text-muted group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display text-lg font-semibold leading-tight">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl data-reveal className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
        {rest.map((g) => (
          <div key={g.name}>
            <dt className="pixel text-[0.65rem] text-muted">{g.name}</dt>
            <dd className="mt-2 leading-relaxed">{g.skills.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </Stop>
  );
}
