import { profile } from "@/data/profile";
import { level, levelLabel } from "@/components/chapters";
import { Eyebrow, Stop } from "./Stop";

export function Principles() {
  const { values } = profile;
  return (
    <Stop stop="values" id="principles" label="Principles" level={level("principles")}>
      <Eyebrow>{levelLabel("principles")}</Eyebrow>
      <h2 data-split className="display text-[clamp(2.2rem,4.6vw,4.2rem)] font-bold">
        {values.title}
      </h2>
      <p data-reveal className="mt-5 text-lg text-muted">
        {values.intro}
      </p>

      <ol className="mt-10">
        {values.items.map((v, i) => (
          <li key={v.name} data-scrub className="scrub-item relative grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-6">
            <span aria-hidden="true" className="scrub-rule absolute -top-px left-0 h-0.5 w-full origin-left bg-accent" />
            <span className="pixel pt-2.5 text-accent">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="display text-[clamp(2.2rem,4.8vw,3.75rem)] font-extrabold uppercase tracking-[-0.03em]">{v.name}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-muted text-pretty">{v.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <figure data-reveal className="panel mt-12 p-6 sm:p-8">
        <figcaption className="pixel mb-4 flex items-center gap-2 text-accent">
          <span aria-hidden="true">★</span> {values.pull.title}
        </figcaption>
        <blockquote className="text-2xl font-medium italic leading-snug text-balance sm:text-[1.9rem]">
          “{values.pull.body}”
        </blockquote>
      </figure>
    </Stop>
  );
}
