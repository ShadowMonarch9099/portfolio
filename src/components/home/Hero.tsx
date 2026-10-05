import { profile } from "@/data/profile";
import { Stop } from "./Stop";

export function Hero() {
  const { hero, player } = profile;
  return (
    <Stop stop="hero" id="top" label="Introduction" className="min-h-svh !items-end pb-24 sm:!items-center">
      <p className="pixel mb-7 flex items-center gap-2 text-muted">
        <span className="text-accent">▶</span> Player 1 <span aria-hidden="true">·</span> {profile.location}
      </p>

      {/* Three sizes, three weights: a small lead-in, a big line, and a huge glitching word. */}
      <h1 className="display">
        <span className="block text-[clamp(1.35rem,2.6vw,2.2rem)] font-medium tracking-tight text-muted">{hero.lead}</span>{" "}
        <span className="mt-2 block text-[clamp(2.8rem,6.6vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
          {hero.middle}
        </span>{" "}
        <span className="glitch inline-block text-[clamp(4.2rem,10.5vw,10rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-accent">
          {hero.emphasis}
        </span>
      </h1>

      <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted text-pretty">{hero.intro}</p>
      <p className="mt-3 flex max-w-[34rem] gap-2.5 leading-relaxed text-pretty">
        <span aria-hidden="true" className="pixel pt-1 text-[0.7rem] text-signal">
          ◆
        </span>
        {hero.guide}
      </p>

      <div data-reveal className="mt-7 flex flex-wrap items-center gap-4">
        <a href="#origin" data-magnetic className="btn">
          Press start <span aria-hidden="true">▶</span>
        </a>
        <a href={profile.resumeUrl} download data-magnetic className="btn btn-ghost">
          Résumé <span aria-hidden="true">↓</span>
        </a>
      </div>

      {/* Player card */}
      <dl data-reveal className="panel mt-8 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-4 p-5 sm:grid-cols-3">
        <div>
          <dt className="pixel text-[0.65rem] text-muted">Class</dt>
          <dd className="display mt-1 text-base font-semibold">{player.class}</dd>
        </div>
        <div>
          <dt className="pixel text-[0.65rem] text-muted">Main</dt>
          <dd className="display mt-1 text-base font-semibold">{player.main}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="pixel text-[0.65rem] text-muted">Base</dt>
          <dd className="display mt-1 text-base font-semibold">{player.base}</dd>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <dt className="pixel text-[0.65rem] text-muted">Build</dt>
          <dd className="mt-2">
            <div className="flex h-2.5 gap-0.5" role="img" aria-label={player.build.map((b) => `${b.label} ${b.value}%`).join(", ")}>
              {player.build.map((b, i) => (
                <span key={b.label} style={{ width: `${b.value}%` }} className={i === 0 ? "bg-accent" : "bg-signal"} />
              ))}
            </div>
            <div aria-hidden="true" className="pixel mt-2 flex justify-between text-[0.65rem]">
              {player.build.map((b, i) => (
                <span key={b.label} className={i === 0 ? "text-accent" : "text-signal"}>
                  {b.label} {b.value}%
                </span>
              ))}
            </div>
          </dd>
        </div>
      </dl>

      <p aria-hidden="true" className="pixel mt-10 hidden items-center gap-3 text-muted sm:flex">
        <span className="blink text-accent">▼</span> Scroll to play
      </p>
    </Stop>
  );
}
