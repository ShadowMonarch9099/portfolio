import Image from "next/image";
import type { Media } from "@/data/profile";
import { InViewVideo } from "./InViewVideo";

interface MediaFrameProps {
  media?: Media;
  /** Shown instead of media until a screenshot or video is added. */
  placeholder: string;
  aspect?: string;
  sizes: string;
  preload?: boolean;
  /** Show the alt text as a caption under the media. */
  caption?: boolean;
}

/** A screenshot or video in a thin frame, or a designed placeholder until one is added. */
export function MediaFrame({ media, placeholder, aspect = "aspect-[16/10]", sizes, preload, caption = true }: MediaFrameProps) {
  return (
    <figure data-reveal className="brackets p-2">
      <div className={`relative ${aspect} overflow-hidden bg-bg-2`}>
        {media?.kind === "video" ? (
          <InViewVideo src={media.src} poster={media.poster} label={media.alt} className="absolute inset-0 size-full object-cover" />
        ) : media ? (
          <Image src={media.src} alt={media.alt} fill sizes={sizes} preload={preload} className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <span className="pixel relative text-muted">Loading… coming soon</span>
            <span className="display relative text-2xl font-bold uppercase text-muted sm:text-3xl">{placeholder}</span>
          </div>
        )}
      </div>
      {media && caption && <figcaption className="mt-2 px-1 text-sm italic text-muted">{media.alt}</figcaption>}
    </figure>
  );
}
