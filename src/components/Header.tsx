"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { CHAPTERS } from "./chapters";
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
          className="sr-only bg-accent px-4 py-2 text-accent-contrast focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="display text-2xl leading-none">{profile.name}</span>
            <span className="hud hidden text-muted transition-colors group-hover:text-accent sm:inline">
              {profile.role}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={profile.resumeUrl} download className="hud link-draw hidden py-1 text-muted hover:text-fg sm:inline">
              Résumé ↓
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              aria-haspopup="dialog"
              className="hud group inline-flex h-10 items-center gap-3 rounded-full border border-line-strong px-4 transition-colors hover:border-fg"
            >
              Menu
              <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
                <span className="h-px w-full bg-current transition-transform group-hover:translate-x-0.5" />
                <span className="h-px w-2/3 bg-current transition-all group-hover:w-full" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        aria-label="Chapter select"
        className="menu-dialog fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-bg p-0 text-fg"
      >
        <div className="mx-auto flex h-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <p className="hud text-muted">Chapter select</p>
            <form method="dialog">
              <button
                type="submit"
                className="hud inline-flex h-10 items-center gap-3 rounded-full border border-line-strong px-4 transition-colors hover:border-fg"
              >
                Close <span aria-hidden="true">✕</span>
              </button>
            </form>
          </div>

          <nav aria-label="Chapters" className="flex flex-1 items-center overflow-y-auto py-6">
            <ol className="w-full">
              {CHAPTERS.map((c, i) => (
                <li key={c.id} className="border-t border-line last:border-b">
                  <a
                    href={`/#${c.id}`}
                    onClick={(e) => go(e, c.id)}
                    className="group flex items-baseline gap-4 py-3 transition-colors hover:text-accent sm:gap-8 sm:py-4"
                  >
                    <span className="hud w-8 shrink-0 text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-4xl transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-3 sm:text-6xl">
                      {c.label}
                    </span>
                    <span className="hud ml-auto hidden text-muted sm:inline">{c.note}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted">
            <a className="link-draw hover:text-fg" href={`mailto:${profile.contact.email}`}>
              {profile.contact.email}
            </a>
            <a className="link-draw hover:text-fg" href={profile.resumeUrl} download>
              Download résumé
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
