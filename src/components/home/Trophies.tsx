import { profile } from "@/data/profile";
import { level, levelLabel } from "@/components/chapters";
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

export function Trophies() {
  const { achievements } = profile;
  return (
    <Stop stop="trophies" label="Trophies" level={level("trophies")}>
      <Eyebrow>{levelLabel("trophies")}</Eyebrow>
      <h2 data-split className="display text-[clamp(2.4rem,5.4vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
        Achievements <span className="text-accent">unlocked.</span>
      </h2>

      <h3 data-reveal className="pixel mt-10 flex items-center justify-between text-muted">
        <span>Trophy room</span>
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
    </Stop>
  );
}
