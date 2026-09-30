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
          {origin.body.map((p) => (
            <p key={p} data-reveal className="text-pretty">
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
    </Stop>
  );
}
