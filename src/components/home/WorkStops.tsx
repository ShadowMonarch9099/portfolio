import Link from "next/link";
import { work } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function WorkStops() {
  return (
    <div id="work">
      {work.map((w, i) => (
        <Stop key={w.slug} stop={w.slug} label={w.title} level={i === 0 ? "03" : undefined}>
          <Eyebrow>
            {i === 0 ? "LVL 03 · Work · " : ""}Mission {String(i + 1).padStart(2, "0")}/{String(work.length).padStart(2, "0")}
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
      ))}
    </div>
  );
}
