import { Fragment } from "react";
import Link from "next/link";
import { profile } from "@/data/profile";
import { featured, level, levelLabel, missionLabel, missionTag, side } from "@/components/chapters";
import { Eyebrow, Stop } from "./Stop";
import { Transit } from "./Transit";

/** The featured missions, one stop each, then a pointer to the rest in the archive. */
export function WorkStops() {
  return (
    <div id="work">
      {featured.map((w, i) => (
        <Fragment key={w.slug}>
          <Transit to={w.slug} next={`${missionLabel(i)} · ${w.title}`} />
          <Stop stop={w.slug} label={w.title} level={i === 0 ? level("work") : undefined}>
            <Eyebrow>
              {i === 0 ? `${levelLabel("work")} · ` : ""}
              {missionTag(w.slug)}
            </Eyebrow>

            <div data-reveal className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="pixel inline-flex items-center gap-2 border border-line-strong px-2.5 py-1 text-[0.65rem]">
                <span aria-hidden="true" className={w.liveUrl ? "blink text-signal" : "text-accent"}>
                  ●
                </span>
                {w.status}
              </span>
              <span className="meta text-muted">
                {w.context} · {w.period}
              </span>
            </div>

            <h2 data-split className="display text-[clamp(3.2rem,8.5vw,7.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em]">
              {w.title}
            </h2>
            <p data-reveal className="mt-5 text-2xl font-medium italic leading-snug text-balance sm:text-[1.75rem]">
              {w.tagline}
            </p>
            <p data-reveal className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted text-pretty">
              {w.summary}
            </p>

            {w.highlights && (
              <>
                <h3 data-reveal className="pixel mt-8 text-[0.65rem] text-muted">My part</h3>
                <ul className="mt-3 space-y-2.5">
                  {w.highlights.map((h) => (
                    <li key={h} data-reveal className="grid grid-cols-[1.25rem_1fr] leading-relaxed text-pretty">
                      <span aria-hidden="true" className="pixel pt-1 text-[0.6rem] text-accent">
                        ▸
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {w.takeaway && (
              <p data-reveal className="panel mt-7 flex gap-3 p-4 leading-relaxed text-pretty">
                <span className="pixel shrink-0 pt-0.5 text-[0.65rem] text-signal">+XP</span>
                <span>{w.takeaway}</span>
              </p>
            )}

            <ul data-reveal aria-label="Stack" className="mt-6 flex flex-wrap gap-1.5">
              {w.stack.slice(0, 6).map((s) => (
                <li key={s} className="meta border border-line px-2 py-1 text-[0.68rem] text-muted">
                  {s}
                </li>
              ))}
            </ul>

            <div data-reveal className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={`/work/${w.slug}`} data-magnetic className="btn">
                View mission <span aria-hidden="true">▶</span>
              </Link>
              {w.liveUrl && (
                <a href={w.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Live site ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </Stop>
        </Fragment>
      ))}

      {side.length > 0 && (
        <div className="relative pb-4">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="max-w-[42rem] lg:w-[50%]">
              <div data-reveal className="brackets p-5 sm:p-6">
                <h3 className="pixel flex items-center justify-between gap-4 text-muted">
                  <span>Side missions</span>
                  <span className="text-signal">+{side.length} in the archive</span>
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-pretty">{profile.archive.teaser}</p>
                <ul className="mt-5 border-t border-line">
                  {side.map((w) => (
                    <li key={w.slug} className="border-b border-line">
                      <Link
                        href={`/work/${w.slug}`}
                        className="group flex items-center gap-4 py-3 transition-colors hover:text-accent"
                      >
                        <span className="display text-xl font-bold">{w.title}</span>
                        <span className="meta hidden min-w-0 flex-1 truncate text-[0.68rem] text-muted sm:inline">
                          {w.context} · {w.period}
                        </span>
                        <span aria-hidden="true" className="pixel ml-auto transition-transform duration-500 group-hover:translate-x-1">
                          ▶
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/work" data-magnetic className="btn mt-6">
                  Open the archive <span aria-hidden="true">▶</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
