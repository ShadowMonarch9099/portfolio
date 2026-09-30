import { profile } from "@/data/profile";
import { LocalTime } from "./LocalTime";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="hud mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-8 text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>
          {profile.location.split(",")[0]} · <LocalTime />
        </p>
        <p>Built with Next.js, React Three Fiber &amp; GSAP</p>
      </div>
    </footer>
  );
}
