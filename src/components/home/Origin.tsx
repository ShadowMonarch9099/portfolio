import Image from "next/image";
import { profile } from "@/data/profile";
import { Eyebrow, Stop } from "./Stop";

export function Origin() {
  const { origin, photo } = profile;
  return (
    <Stop stop="origin" label="Origin">
      <Eyebrow>Ch. 01 — Origin</Eyebrow>
      <h2 data-split className="display text-[clamp(2.4rem,5.2vw,4.75rem)]">
        {origin.title}
      </h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
        <figure data-reveal className="w-40 sm:w-48">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bg-2">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 192px, 160px"
              className="object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
            />
          </div>
          <figcaption className="hud mt-3 text-muted">That&apos;s me</figcaption>
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
            <dt className="hud text-muted">{f.label}</dt>
            <dd className="mt-1.5">{f.value}</dd>
          </div>
        ))}
      </dl>
    </Stop>
  );
}
