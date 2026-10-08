import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { profile, work, type CaseStudy, type Media } from "@/data/profile";
import { featured, missionTag, side } from "@/components/chapters";
import { FocusStop } from "@/components/work/FocusStop";
import { MediaFrame } from "@/components/work/MediaFrame";
import { Motion } from "@/components/Lazy";

export const metadata: Metadata = {
  title: "Mission archive",
  description: `Every project by ${profile.name}, with screenshots, the stack and what each one does.`,
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: `Mission archive · ${profile.name}`, description: profile.archive.intro },
};

/** The card's main still: the cover (a video's poster frame), or the first screenshot. */
function still(w: CaseStudy): Media | undefined {
  const c = w.cover;
  if (c?.kind === "video") return c.poster ? { src: c.poster, alt: c.alt } : w.gallery[0];
  return c ?? w.gallery[0];
}

function MissionCard({ w }: { w: CaseStudy }) {
  const cover = still(w);
  // A few more screenshots under the cover; phone shots sit four to a row.
  const phones = w.gallery.length > 0 && w.gallery.every((m) => m.portrait);
  const thumbs = w.gallery.filter((m) => m.src !== cover?.src).slice(0, phones ? 4 : 3);

  return (
    <article data-reveal className="panel p-4 sm:p-5">
      <MediaFrame media={cover} placeholder={`${w.title} in action`} caption={false} sizes="(min-width: 1024px) 700px, 100vw" />
      {thumbs.length > 0 && (
        <ul aria-label={`More ${w.title} screenshots`} className={`mt-2 grid gap-2 ${phones ? "grid-cols-4" : "grid-cols-3"}`}>
          {thumbs.map((m) => (
            <li key={m.src} className="brackets p-1">
              {/* Phone shots are cropped to their top half so the card stays compact. */}
              <div className={`relative overflow-hidden bg-bg-2 ${phones ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
                <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 230px, 33vw" className="object-cover object-top" />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
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

      <p className="pixel mt-5 text-[0.6rem] text-muted">{missionTag(w.slug)}</p>
      <h3 className="display mt-1 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
        {w.title}
      </h3>
      <p className="mt-3 text-xl font-medium italic leading-snug text-balance">{w.tagline}</p>
      <p className="mt-3 leading-relaxed text-muted text-pretty">{w.summary}</p>

      <ul aria-label="Stack" className="mt-5 flex flex-wrap gap-1.5">
        {w.stack.slice(0, 8).map((s) => (
          <li key={s} className="meta border border-line px-2 py-1 text-[0.68rem] text-muted">
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/work/${w.slug}`} className="btn btn-sm">
          View mission <span aria-hidden="true">▶</span>
        </Link>
        {w.liveUrl && (
          <a href={w.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            Live site ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function ArchivePage() {
  const groups = [
    { id: "main", label: "Main missions", note: "On the map", items: featured },
    { id: "side", label: "Side missions", note: "Archive only", items: side },
  ];

  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <article className="mx-auto max-w-[1440px] px-5 pb-32 pt-32 sm:px-8 sm:pt-40 lg:px-12">
          <div className="max-w-[46rem] lg:w-[56%]">
            <Link href="/#work" className="pixel link-draw text-muted hover:text-fg">
              ◀ Back to the journey
            </Link>

            <p className="pixel mt-12 flex items-center gap-3 text-muted">
              <span aria-hidden="true" className="size-2 bg-accent" />
              Mission archive · {String(work.length).padStart(2, "0")} missions
            </p>
            <h1 className="display mt-4 text-[clamp(2.8rem,7.5vw,6.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em]">
              {profile.archive.title}
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted text-pretty">{profile.archive.intro}</p>

            {/* Quick index, so a visitor can jump straight to the mission they want. */}
            <nav aria-label="Missions" className="mt-10 grid gap-x-8 border-y border-line py-4 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.id} className="py-2">
                  <p className="pixel text-[0.6rem] text-muted">{g.label}</p>
                  <ul className="mt-2 space-y-1">
                    {g.items.map((w) => (
                      <li key={w.slug}>
                        <a href={`#${w.slug}`} className="display link-draw font-semibold hover:text-accent">
                          {w.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {groups.map((g) => (
              <section key={g.id} aria-labelledby={`group-${g.id}`} className="mt-20">
                <h2 id={`group-${g.id}`} className="pixel flex items-center justify-between gap-4 text-muted">
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="size-2 bg-accent" />
                    {g.label}
                  </span>
                  <span className="text-signal">
                    {g.note} · {g.items.length}
                  </span>
                </h2>
                <ol className="mt-6 space-y-8">
                  {g.items.map((w) => (
                    <li key={w.slug} id={w.slug} className="scroll-mt-28">
                      <MissionCard w={w} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </article>
      </main>
      <FocusStop slug="archive" />
      <Motion />
    </>
  );
}
