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
      <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted">
        {offClock.body.map((p) => (
          <p key={p} data-reveal className="text-pretty">
            {p}
          </p>
        ))}
      </div>

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
