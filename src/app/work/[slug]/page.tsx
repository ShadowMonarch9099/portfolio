import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudy, work } from "@/data/profile";
import { FocusPlanet } from "@/components/work/FocusPlanet";
import { MediaFrame } from "@/components/work/MediaFrame";
import { Motion } from "@/components/Lazy";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} case study`,
    description: `${study.tagline} ${study.summary}`,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { url: `/work/${study.slug}`, title: `${study.title} · case study`, description: study.tagline },
  };
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <h2 data-split className="display text-3xl font-bold uppercase tracking-[-0.02em] sm:text-4xl">
        {heading}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = work.findIndex((w) => w.slug === slug);
  const next = work[(index + 1) % work.length];
  const meta = [
    { label: "Context", value: study.context },
    { label: "Period", value: study.period },
    ...(study.role ? [{ label: "Role", value: study.role }] : []),
    { label: "Status", value: study.status },
  ];
  const gallery = study.gallery.length
    ? study.gallery.map((m) => ({ media: m, label: m.alt }))
    : study.galleryPlaceholders.map((label) => ({ media: undefined, label }));

  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <article className="mx-auto max-w-[1440px] px-5 pb-32 pt-32 sm:px-8 sm:pt-40 lg:px-12">
          <div className="max-w-[46rem] lg:w-[56%]">
            <Link href={`/#${study.slug}`} className="pixel link-draw text-muted hover:text-fg">
              ◀ Back to the journey
            </Link>

            <p className="pixel mt-12 flex items-center gap-3 text-muted">
              <span aria-hidden="true" className="size-2 bg-accent" />
              Mission {String(index + 1).padStart(2, "0")}/{String(work.length).padStart(2, "0")} · Debrief
            </p>
            <h1 className="display mt-4 text-[clamp(3.4rem,9.5vw,8.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em]">
              {study.title}
            </h1>
            <p className="mt-5 text-2xl font-medium italic leading-snug text-balance sm:text-3xl">{study.tagline}</p>

            <dl data-reveal className="panel mt-12 grid grid-cols-2 gap-x-8 gap-y-5 p-6 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="pixel text-[0.65rem] text-muted">{m.label}</dt>
                  <dd className="display mt-1.5 font-semibold text-pretty">{m.value}</dd>
                </div>
              ))}
            </dl>
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                className="btn btn-ghost btn-sm mt-6"
              >
                {study.liveUrl.replace(/^https?:\/\//, "")} ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}

            <div className="mt-14">
              <MediaFrame
                media={study.cover}
                placeholder={`${study.title} in action`}
                sizes="(min-width: 1024px) 736px, 100vw"
                preload
              />
            </div>

            <Section heading="Overview">
              <div className="space-y-5 text-lg leading-relaxed text-muted">
                {study.overview.map((p) => (
                  <p key={p} data-reveal className="text-pretty">
                    {p}
                  </p>
                ))}
              </div>
            </Section>

            <Section heading={study.built.heading}>
              <ol className="border-t border-line">
                {study.built.points.map((p, i) => (
                  <li key={p} data-reveal className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-5">
                    <span className="pixel pt-1 text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <p className="leading-relaxed text-pretty">{p}</p>
                  </li>
                ))}
              </ol>
            </Section>

            {[study.challenge, study.decision].map(
              (block) =>
                block && (
                  <Section key={block.heading} heading={block.heading}>
                    <div className="panel space-y-5 p-6 text-lg leading-relaxed sm:p-8">
                      {block.body.map((p) => (
                        <p key={p} data-reveal className="text-pretty">
                          {p}
                        </p>
                      ))}
                    </div>
                  </Section>
                ),
            )}

            <Section heading="Stack">
              <ul data-reveal className="flex flex-wrap gap-2">
                {study.stack.map((s) => (
                  <li key={s} className="meta border border-line-strong px-3 py-1.5 text-[0.72rem]">
                    {s}
                  </li>
                ))}
              </ul>
            </Section>

            <Section heading="Gallery">
              <div className="grid gap-5 sm:grid-cols-2">
                {gallery.map((g, i) => (
                  <div key={g.label} className={i === 0 ? "sm:col-span-2" : ""}>
                    <MediaFrame
                      media={g.media}
                      placeholder={g.label}
                      aspect={i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}
                      sizes="(min-width: 1024px) 736px, 100vw"
                    />
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <Link
            href={`/work/${next.slug}`}
            className="group mt-32 block border-t border-line pt-10"
          >
            <span className="pixel text-muted">Next mission ▶</span>
            <span className="display mt-3 flex items-baseline gap-6 text-[clamp(3rem,9vw,8rem)] font-extrabold uppercase tracking-[-0.035em] transition-colors group-hover:text-accent">
              {next.title}
              <span aria-hidden="true" className="text-[0.5em] transition-transform duration-500 group-hover:translate-x-3">
                →
              </span>
            </span>
          </Link>
        </article>
      </main>
      <FocusPlanet slug={study.slug} />
      <Motion />
    </>
  );
}
