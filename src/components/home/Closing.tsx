import { profile } from "@/data/profile";
import { CopyEmail } from "./CopyEmail";
import { Eyebrow, Stop } from "./Stop";

export function Closing() {
  const { closing, contact } = profile;
  const rows = [
    { label: "Phone", value: contact.phoneDisplay, href: `tel:${contact.phone}` },
    { label: "LinkedIn", value: "in/kush-honkalse", href: contact.linkedin, external: true },
  ];

  return (
    <Stop stop="contact" label="Contact">
      <Eyebrow>Ch. 07 — Contact</Eyebrow>
      <h2 data-split className="display text-[clamp(3rem,7vw,6.5rem)]">
        {closing.title}
      </h2>
      <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-muted text-pretty">
        {closing.body}
      </p>

      <ul data-reveal className="mt-12 border-t border-line">
        <li className="border-b border-line">
          <CopyEmail email={contact.email} />
        </li>
        {rows.map((r) => (
          <li key={r.label} className="border-b border-line">
            <a
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-baseline justify-between gap-4 py-5 transition-colors hover:text-accent"
            >
              <span className="hud w-16 shrink-0 text-muted sm:w-24">{r.label}</span>
              <span className="display flex-1 text-xl sm:text-3xl">{r.value}</span>
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
              {r.external && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
    </Stop>
  );
}
