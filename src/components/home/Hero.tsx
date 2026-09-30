import { profile } from "@/data/profile";
import { Stop } from "./Stop";

export function Hero() {
  return (
    <Stop stop="hero" id="top" label="Introduction" className="!items-end pb-20 sm:!items-center">
      <p className="hud mb-8 text-muted">
        {profile.role} <span aria-hidden="true">·</span> {profile.location}{" "}
        <span className="hidden sm:inline">
          <span aria-hidden="true">·</span> 18.52°N 73.86°E
        </span>
      </p>

      <h1 className="display text-[clamp(3.1rem,8.2vw,8.25rem)] text-balance">
        {profile.hero.lead} <em className="text-accent">{profile.hero.emphasis}</em>
      </h1>

      <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-muted text-pretty sm:text-xl">
        {profile.hero.intro}
      </p>

      <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
        <a
          href="#origin"
          data-magnetic
          className="group inline-flex h-14 items-center gap-3 rounded-full bg-fg pl-7 pr-6 font-medium text-bg transition-colors hover:bg-accent hover:text-accent-contrast"
        >
          Start the journey
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-1">
            ↓
          </span>
        </a>
        <a
          href={profile.resumeUrl}
          download
          data-magnetic
          className="inline-flex h-14 items-center rounded-full border border-line-strong px-7 font-medium transition-colors hover:border-fg"
        >
          Download résumé
        </a>
      </div>

      <p aria-hidden="true" className="hud absolute bottom-8 left-5 hidden items-center gap-3 text-muted sm:left-8 sm:flex lg:left-12">
        <span className="relative block h-8 w-px overflow-hidden bg-line-strong">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-fg motion-reduce:animate-none" />
        </span>
        Scroll to travel
      </p>
    </Stop>
  );
}
