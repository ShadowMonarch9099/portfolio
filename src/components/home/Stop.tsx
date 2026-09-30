import type { ReactNode } from "react";

interface StopProps {
  /** Scene stop id (see scene/world.ts). */
  stop: string;
  /** Anchor id for links, if different from the stop. */
  id?: string;
  label?: string;
  children: ReactNode;
  className?: string;
}

/**
 * One stop on the journey: a full-height section whose centre drives the
 * camera. Content sits in a left column so the 3D body can live on the right.
 */
export function Stop({ stop, id, label, children, className = "" }: StopProps) {
  return (
    <section
      id={id ?? stop}
      data-stop={stop}
      aria-label={label}
      className={`relative flex min-h-svh items-center py-28 sm:py-32 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[42rem] lg:w-[50%]">{children}</div>
      </div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p data-reveal className="hud mb-6 flex items-center gap-3 text-muted">
      <span aria-hidden="true" className="h-px w-8 bg-accent" />
      {children}
    </p>
  );
}
