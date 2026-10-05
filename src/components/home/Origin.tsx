import Image from "next/image";
import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function Origin() {
  const { origin, photo } = profile;
  return (
    <Stop stop="origin" label="Origin" level="01">
      <Eyebrow>LVL 01 · Origin</Eyebrow>
      <h2 data-split className="display text-[clamp(2.2rem,4.6vw,4.2rem)] font-bold">
        {origin.title}
      </h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
        <figure data-reveal className="w-40 sm:w-48">
          <div className="brackets brackets-accent p-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-bg-2">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 176px, 144px"
                className="object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
              />
            </div>
          </div>
          <figcaption className="pixel mt-2 flex justify-between text-[0.65rem] text-muted">
            <span>P1 · Kush</span>
            <span className="text-signal">● Online</span>
          </figcaption>
        </figure>

        <div className="space-y-5 text-lg leading-relaxed text-muted">
          {origin.body.map((p, i) => (
            <p key={p} data-reveal className={`text-pretty ${i === 0 ? "text-fg" : ""}`}>
              {p}
            </p>
          ))}
        </div>
      </div>

      <dl data-reveal className="mt-12 grid gap-px overflow-hidden border-y border-line sm:grid-cols-3">
        {origin.facts.map((f) => (
          <div key={f.label} className="py-4 sm:pr-4">
            <dt className="pixel text-[0.65rem] text-muted">{f.label}</dt>
            <dd className="display mt-1.5 font-semibold">{f.value}</dd>
          </div>
        ))}
      </dl>

      <h3 data-reveal className="pixel mt-14 flex items-center justify-between text-muted">
        <span>The run so far</span>
        <span className="text-signal">Save file</span>
      </h3>
      <ol className="relative mt-6 space-y-5 border-l border-line pl-6">
        {origin.timeline.map((t, i) => {
          const last = i === origin.timeline.length - 1;
          return (
            <li key={t.when} data-reveal className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[1.85rem] top-1.5 size-2.5 ${last ? "border border-accent bg-bg" : "bg-accent"}`}
              />
              <p className="pixel text-[0.65rem] text-accent">{t.when}</p>
              <p className={`mt-1 leading-relaxed text-pretty ${last ? "text-muted italic" : ""}`}>{t.what}</p>
            </li>
          );
        })}
      </ol>
    </Stop>
  );
}
