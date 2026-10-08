import { profile } from "@/data/profile";

interface TransitProps {
  /** Stop id this bridge leads into (a key of profile.transitions). */
  to: string;
  /** Label of the next stop, e.g. "LVL 02 · Principles". */
  next: string;
  /**
   * The save point between the two acts: once the briefing is done, visitors
   * can carry on into the story, skip straight to contact, or grab the résumé.
   */
  savePoint?: boolean;
}

/**
 * A bridge between two stops, styled as a game dialogue box. The dashed
 * trail above it is the stretch of road the map route travels between
 * waypoints; the box itself sits right above the section it introduces.
 * Its words light up as you scroll past (see Motion).
 */
export function Transit({ to, next, savePoint }: TransitProps) {
  const line = profile.transitions[to];
  if (!line) return null;
  return (
    <div className="relative pb-4 sm:pb-8">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[42rem] lg:w-[50%]">
          <span aria-hidden="true" className="trail block h-32 sm:h-44" />
          <div data-reveal className="panel mt-4 max-w-[36rem] px-5 pb-4 pt-6 sm:px-6">
            <p className="pixel absolute -top-2.5 left-4 bg-accent px-2 py-0.5 text-[0.6rem] text-accent-contrast">P1 · Kush</p>
            <p data-words className="display text-[clamp(1.25rem,2.3vw,1.75rem)] font-semibold leading-snug text-balance">
              {line}
            </p>
            {savePoint ? (
              <div className="mt-5 border-t border-line pt-4">
                <p className="pixel flex items-center gap-2 text-[0.6rem] text-signal">
                  <span aria-hidden="true" className="blink">
                    ◆
                  </span>
                  Save point · briefing complete
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <a href={`#${to}`} className="btn btn-sm">
                    Continue <span aria-hidden="true">▼</span>
                  </a>
                  <a href="#contact" className="btn btn-ghost btn-sm">
                    Skip to contact <span aria-hidden="true">▶</span>
                  </a>
                  <a href={profile.resumeUrl} download className="btn btn-ghost btn-sm">
                    Résumé <span aria-hidden="true">↓</span>
                  </a>
                </div>
                <p className="pixel mt-4 text-[0.6rem] text-muted">Next: {next}</p>
              </div>
            ) : (
              <p className="pixel mt-4 flex items-center justify-between gap-4 text-[0.6rem] text-muted">
                <span>Next: {next}</span>
                <span aria-hidden="true" className="blink text-accent">
                  ▼
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
