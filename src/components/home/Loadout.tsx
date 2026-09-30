import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function Loadout() {
  const primary = profile.skills.find((g) => g.primary);
  const rest = profile.skills.filter((g) => !g.primary);

  return (
    <Stop stop="loadout" label="Loadout">
      <Eyebrow>Ch. 05 — Loadout</Eyebrow>
      <h2 data-split className="display text-[clamp(2.4rem,5.2vw,4.75rem)]">
        Main build: frontend.
      </h2>
      <p data-reveal className="mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
        The tools I reach for. Frontend is where I spend most of my time; the rest is there when the job needs it.
      </p>

      {primary && (
        <div data-reveal className="mt-10">
          <h3 className="hud mb-4 text-accent">{primary.name} · primary</h3>
          <ul className="display flex flex-wrap gap-x-3 gap-y-1 text-[1.75rem] leading-tight sm:text-4xl">
            {primary.skills.map((s, i) => (
              <li key={s}>
                {s}
                {i < primary.skills.length - 1 && (
                  <span aria-hidden="true" className="text-muted">
                    ,
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl data-reveal className="mt-12 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
        {rest.map((g) => (
          <div key={g.name}>
            <dt className="hud text-muted">{g.name}</dt>
            <dd className="mt-2 leading-relaxed">{g.skills.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Stop>
  );
}
