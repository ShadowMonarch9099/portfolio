import Image from "next/image";
import type { Media } from "@/data/profile";

interface MediaFrameProps {
  media?: Media;
  /** Shown instead of media until a screenshot or video is added. */
  placeholder: string;
  aspect?: string;
  sizes: string;
  preload?: boolean;
}

/** A screenshot or video in a thin frame, or a designed placeholder until one is added. */
export function MediaFrame({ media, placeholder, aspect = "aspect-[16/10]", sizes, preload }: MediaFrameProps) {
  return (
    <figure data-reveal>
      <div className={`relative ${aspect} overflow-hidden rounded-sm border border-line bg-bg-2`}>
        {media?.kind === "video" ? (
          <video
            src={media.src}
            aria-label={media.alt}
            className="absolute inset-0 size-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            controls
          />
        ) : media ? (
          <Image src={media.src} alt={media.alt} fill sizes={sizes} preload={preload} className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <span className="hud relative text-muted">Coming soon</span>
            <span className="display relative text-2xl text-muted sm:text-3xl">{placeholder}</span>
          </div>
        )}
      </div>
      {media && <figcaption className="hud mt-3 text-muted">{media.alt}</figcaption>}
    </figure>
  );
}
