import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

/** A pixel trophy, like an in-game achievement icon. */
function Trophy() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-10 shrink-0 text-accent" shapeRendering="crispEdges">
      <path
        fill="currentColor"
        d="M4 1h8v1h2v4h-1v1h-1v1h-1v1H9v2h2v1h1v3H4v-3h1v-1h2V9H5V8H4V7H3V6H2V2h2V1Zm0 2H3v2h1V3Zm8 0v2h1V3h-1Z"
      />
    </svg>
  );
}

const SKILLS = ["Speak", "Read", "Write"];

export function OffClock() {
  const { offClock, achievements, now } = profile;
  // "When I'm not coding, I'm probably gaming." → small lead-in + big punchline.
  const [lead, ...rest] = offClock.title.split(", ");
  return (
    <Stop stop="offclock" id="off-clock" label="Off the clock" level="06">
      <Eyebrow>LVL 06 · Off the clock</Eyebrow>
      <h2 className="display">
        <span data-reveal className="block text-[clamp(1.4rem,2.8vw,2.2rem)] font-medium text-muted">
          {lead},
        </span>{" "}
        <span data-split className="block text-[clamp(2.6rem,6.4vw,5.6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
          {rest.join(", ")}
        </span>
      </h2>
      <p data-reveal className="mt-8 max-w-lg text-lg leading-relaxed text-muted text-pretty">
        {offClock.body}
      </p>

      <dl data-reveal className="mt-8 grid grid-cols-3 border-y border-line">
        {offClock.stats.map((st) => (
          <div key={st.label} className="py-4 pr-3">
            <dt className="pixel text-[0.6rem] text-muted">{st.label}</dt>
            <dd className="display mt-1 text-xl font-bold sm:text-2xl">{st.value}</dd>
          </div>
        ))}
      </dl>

      <h3 data-reveal className="pixel mt-12 flex items-center justify-between text-muted">
        <span>Languages</span>
        <span aria-hidden="true" className="flex gap-4 text-[0.6rem]">
          {SKILLS.map((k) => (
            <span key={k} className="w-12 text-center">
              {k}
            </span>
          ))}
        </span>
      </h3>
      <ul data-reveal className="mt-3 space-y-2">
        {offClock.languages.map((l) => (
          <li key={l.name} className="panel px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <p className="display text-lg font-bold">{l.name}</p>
              <p className="sr-only">{l.can.join(", ")}</p>
              <span aria-hidden="true" className="flex gap-4">
                {SKILLS.map((k) => (
                  <span
                    key={k}
                    className={`h-2 w-12 ${l.can.includes(k) ? "bg-signal" : "border border-line-strong"}`}
                  />
                ))}
              </span>
            </div>
            {"note" in l && l.note && <p className="mt-1.5 text-sm leading-relaxed text-muted text-pretty">{l.note}</p>}
          </li>
        ))}
      </ul>

      <h3 data-reveal className="pixel mt-12 flex items-center justify-between text-muted">
        <span>Achievements</span>
        <span className="text-signal">
          {achievements.length}/{achievements.length} unlocked
        </span>
      </h3>
      <ul className="mt-4 space-y-2.5">
        {achievements.map((a) => (
          <li key={a.title} data-reveal className="panel flex items-center gap-4 p-4">
            <Trophy />
            <div>
              <p className="pixel text-[0.6rem] text-signal">Achievement unlocked</p>
              <p className="display mt-0.5 text-lg font-bold">{a.title}</p>
              <p className="text-sm leading-relaxed text-muted text-pretty">{a.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <div data-reveal className="brackets brackets-accent mt-12 p-5">
        <p className="pixel flex items-center gap-2 text-accent">
          <span aria-hidden="true" className="blink">▶</span> Current quest
        </p>
        <p className="mt-3 max-w-lg text-lg leading-relaxed text-pretty">{now}</p>
      </div>
    </Stop>
  );
}
