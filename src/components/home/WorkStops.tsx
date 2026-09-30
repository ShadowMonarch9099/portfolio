import Link from "next/link";
import { work } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function WorkStops() {
  return (
    <div id="work">
      {work.map((w, i) => (
        <Stop key={w.slug} stop={w.slug} label={w.title}>
          <Eyebrow>
            {i === 0 ? "Ch. 03 — Work · " : ""}
            {String(i + 1).padStart(2, "0")} / {String(work.length).padStart(2, "0")}
          </Eyebrow>

          <p data-reveal className="hud mb-4 text-muted">
            {w.context} <span aria-hidden="true">·</span> {w.period}
          </p>
          <h2 data-split className="display text-[clamp(3.4rem,9vw,8rem)]">
            {w.title}
          </h2>
          <p data-reveal className="display mt-4 text-2xl italic leading-snug text-balance sm:text-3xl">
            {w.tagline}
          </p>
          <p data-reveal className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted text-pretty">
            {w.summary}
          </p>
          <p data-reveal className="hud mt-6 leading-relaxed text-muted">
            {w.stack.slice(0, 6).join(" / ")}
          </p>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={`/work/${w.slug}`}
              data-magnetic
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-fg pl-7 pr-6 font-medium text-bg transition-colors hover:bg-accent hover:text-accent-contrast"
            >
              Read the case study
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
            {w.liveUrl && (
              <a href={w.liveUrl} target="_blank" rel="noopener noreferrer" className="link-draw font-medium">
                Visit live site ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </Stop>
      ))}
    </div>
  );
}
