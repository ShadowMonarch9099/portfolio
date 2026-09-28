import Image from "next/image";
import { profile } from "@/data/profile";
import { ArrowRightIcon, DownloadIcon, MapPinIcon } from "./Icons";
import { SocialLinks } from "./SocialLinks";

export function Hero() {
  const [lead, ...rest] = profile.headline.split(" ");
  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="bg-glow absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-44">
        <div className="order-2 lg:order-1">
          <p
            data-hero
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted"
          >
            <MapPinIcon className="size-4 text-accent" />
            {profile.location}
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tighter text-balance sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          <p className="mt-4 text-xl font-medium tracking-tight sm:text-2xl">
            <span className="text-accent">{lead}</span> {rest.join(" ")}
          </p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            {profile.subtext}
          </p>

          <div data-hero className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-medium text-accent-contrast shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              View Projects
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-surface px-6 font-medium transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <DownloadIcon className="size-4" />
              Download Resume
            </a>
          </div>

          <div data-hero className="mt-8">
            <SocialLinks />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-40 sm:w-52 lg:w-80">
            {/* GSAP animates the wrapper so it doesn't reset the frame's CSS rotation. */}
            <div aria-hidden="true" data-hero className="absolute inset-0">
              <div className="absolute -inset-3 rotate-6 rounded-[2rem] border border-accent/40 bg-accent-soft lg:-inset-4" />
            </div>
            <Image
              src={profile.photo}
              alt={profile.photoAlt}
              width={640}
              height={640}
              preload
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 208px, 160px"
              className="relative aspect-square w-full rounded-[1.75rem] border border-border object-cover shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
