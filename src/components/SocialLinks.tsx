import { profile } from "@/data/profile";
import { socialIcons } from "./Icons";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {profile.socials.map(({ kind, label, href }) => {
        const Icon = socialIcons[kind];
        const external = !href.startsWith("mailto:");
        return (
          <li key={kind}>
            <a
              href={href}
              aria-label={label}
              title={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Icon className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
