import type { ReactNode } from "react";

interface StopProps {
  /** Scene stop id (see scene/world.ts). */
  stop: string;
  /** Anchor id for links, if different from the stop. */
  id?: string;
  label?: string;
  /** Big hollow numeral drawn behind the content, e.g. "01". */
  level?: string;
  children: ReactNode;
  className?: string;
}

/**
 * One stop on the journey: a full-height section whose centre drives the
 * camera. Content sits in a left column so the 3D body can live on the right.
 */
export function Stop({ stop, id, label, level, children, className = "" }: StopProps) {
  return (
    <section
      id={id ?? stop}
      data-stop={stop}
      aria-label={label}
      className={`relative flex min-h-svh items-center py-28 sm:py-32 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="relative max-w-[42rem] lg:w-[50%]">
          {level && (
            <span
              aria-hidden="true"
              className="display outline-text pointer-events-none absolute -left-1 -top-32 -z-10 select-none text-[7rem] font-extrabold leading-none sm:-top-44 sm:text-[11rem]"
            >
              {level}
            </span>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Pixel-font chapter label, e.g. "LVL 02 · Principles". Decodes on reveal (see Motion). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p data-reveal className="pixel mb-6 flex items-center gap-3 text-muted">
      <span aria-hidden="true" className="size-2 bg-accent" />
      <span data-scramble>{children}</span>
    </p>
  );
}
