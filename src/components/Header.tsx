"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { ACTS, CHAPTERS, level } from "./chapters";
import { scrollToTarget } from "./scroll";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    dialogRef.current?.close();
    if (pathname === "/") scrollToTarget(`#${id}`);
    else router.push(`/#${id}`);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-bg via-bg/85 to-transparent sm:h-32"
        />
        <a
          href="#main"
          className="pixel sr-only bg-accent px-4 py-2 text-accent-contrast focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-center gap-3">
            <span
              aria-hidden="true"
              className="pixel grid size-9 place-items-center bg-fg text-bg transition-colors group-hover:bg-accent group-hover:text-accent-contrast"
            >
              KH
            </span>
            <span className="flex flex-col leading-none">
              <span className="display text-lg font-semibold tracking-tight">{profile.name}</span>
              <span className="pixel mt-1 hidden text-[0.62rem] text-muted sm:inline">{profile.role}</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={profile.resumeUrl} download className="pixel link-draw hidden py-1 text-muted hover:text-fg sm:inline">
              Résumé ↓
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              aria-haspopup="dialog"
              className="btn btn-ghost btn-sm"
            >
              Menu
              <span aria-hidden="true" className="flex w-4 flex-col gap-[4px]">
                <span className="h-0.5 w-full bg-current" />
                <span className="h-0.5 w-2/3 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        aria-label="Level select"
        className="menu-dialog scanlines fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-bg p-0 text-fg"
      >
        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <p className="pixel text-muted">
              <span className="text-accent">▶</span> Level select
            </p>
            <form method="dialog">
              <button type="submit" className="btn btn-ghost btn-sm">
                Close <span aria-hidden="true">✕</span>
              </button>
            </form>
          </div>

          {/* my-auto (not items-center) keeps the top reachable when the list is taller than the screen. */}
          <nav aria-label="Chapters" className="flex flex-1 overflow-y-auto py-6">
            <div className="my-auto w-full space-y-5">
              {ACTS.map((a) => (
                <div key={a.act}>
                  <p className="pixel mb-2 text-[0.6rem] text-signal">{a.label}</p>
                  <ol>
                    {CHAPTERS.filter((c) => c.act === a.act).map((c) => (
                      <li key={c.id} className="border-t border-line last:border-b">
                        <a
                          href={`/#${c.id}`}
                          onClick={(e) => go(e, c.id)}
                          className="group flex items-center gap-4 py-2.5 transition-colors hover:text-accent sm:gap-8 sm:py-3"
                        >
                          <span className="pixel w-14 shrink-0 text-muted group-hover:text-accent">LVL {level(c.id)}</span>
                          <span className="display text-3xl font-extrabold uppercase transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-3 sm:text-[min(3.75rem,5.6vh)]">
                            {c.label}
                          </span>
                          <span aria-hidden="true" className="pixel text-accent opacity-0 transition-opacity group-hover:opacity-100">
                            ◀
                          </span>
                          <span className="meta ml-auto hidden text-muted sm:inline">{c.note}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted">
            <a className="link-draw hover:text-fg" href={`mailto:${profile.contact.email}`}>
              {profile.contact.email}
            </a>
            <span className="flex flex-wrap items-center gap-6">
              <Link className="pixel link-draw hover:text-fg" href="/work" onClick={() => dialogRef.current?.close()}>
                Mission archive ▶
              </Link>
              <a className="pixel link-draw hover:text-fg" href={profile.resumeUrl} download>
                Download résumé
              </a>
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}
