import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-svh max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:px-12">
      <p className="hud text-muted">Error 404</p>
      <h1 className="display mt-4 text-[clamp(3.5rem,10vw,9rem)]">Lost in space.</h1>
      <p className="mt-6 max-w-md text-lg text-muted">This page drifted out of orbit, or never existed.</p>
      <Link href="/" className="link-draw mt-10 self-start font-medium">
        ← Back to the start
      </Link>
    </main>
  );
}
