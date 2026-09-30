import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="scanlines relative mx-auto flex min-h-svh max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:px-12">
      <p className="pixel text-muted">Error 404 · Lost in space</p>
      <h1 className="display glitch mt-4 text-[clamp(3.5rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-accent">
        Game over
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">This page drifted out of orbit, or never existed.</p>
      <p className="pixel mt-10 text-muted">
        Continue? <span className="blink text-fg">▮</span>
      </p>
      <Link href="/" className="btn mt-4 self-start">
        Yes, back to start ▶
      </Link>
    </main>
  );
}
