import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function Principles() {
  const { values } = profile;
  return (
    <Stop stop="values" id="principles" label="Principles">
      <Eyebrow>Ch. 02 — Principles</Eyebrow>
      <h2 data-split className="display text-[clamp(2.4rem,5.2vw,4.75rem)]">
        {values.title}
      </h2>
      <p data-reveal className="mt-5 text-lg text-muted">
        {values.intro}
      </p>

      <ol className="mt-12">
        {values.items.map((v, i) => (
          <li key={v.name} data-scrub className="scrub-item relative grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-line py-7">
            <span aria-hidden="true" className="scrub-rule absolute -top-px left-0 h-px w-full origin-left bg-accent" />
            <span className="hud pt-3 text-accent">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="display text-4xl sm:text-5xl">{v.name}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted text-pretty">{v.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <figure data-reveal className="mt-14 border-l-2 border-accent pl-6">
        <figcaption className="hud mb-3 text-muted">{values.pull.title}</figcaption>
        <blockquote className="display text-3xl italic leading-tight text-balance sm:text-[2.6rem]">
          “{values.pull.body}”
        </blockquote>
      </figure>
    </Stop>
  );
}
