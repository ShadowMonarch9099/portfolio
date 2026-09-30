import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

/** A small hexagonal badge, like an in-game achievement icon. */
function Badge({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 40 44" aria-hidden="true" className="size-11 shrink-0 text-accent">
      <path d="M20 2 37 11.5v21L20 42 3 32.5v-21Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="20" y="27" textAnchor="middle" className="fill-current font-mono text-[11px]">
        {String(n).padStart(2, "0")}
      </text>
    </svg>
  );
}

export function OffClock() {
  const { offClock, achievements, now } = profile;
  return (
    <Stop stop="offclock" id="off-clock" label="Off the clock">
      <Eyebrow>Ch. 06 — Off the clock</Eyebrow>
      <h2 data-split className="display text-[clamp(2.4rem,5.2vw,4.75rem)]">
        {offClock.title}
      </h2>
      <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted">
        {offClock.body.map((p) => (
          <p key={p} data-reveal className="text-pretty">
            {p}
          </p>
        ))}
      </div>

      <h3 data-reveal className="hud mt-14 text-muted">
        Achievements unlocked · {achievements.length}/{achievements.length}
      </h3>
      <ul className="mt-5 space-y-3">
        {achievements.map((a, i) => (
          <li
            key={a.title}
            data-reveal
            className="flex items-center gap-4 rounded-sm border border-line bg-bg/60 p-4 backdrop-blur-sm transition-colors hover:border-line-strong"
          >
            <Badge n={i + 1} />
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-sm leading-relaxed text-muted text-pretty">{a.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <div data-reveal className="mt-14 flex gap-4">
        <span aria-hidden="true" className="relative mt-2 flex size-2.5 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
          <span className="relative size-2.5 rounded-full bg-accent" />
        </span>
        <div>
          <p className="hud text-muted">Now</p>
          <p className="mt-2 max-w-lg leading-relaxed text-pretty">{now}</p>
        </div>
      </div>
    </Stop>
  );
}
