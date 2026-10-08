import { profile } from "@/data/profile";
import { CopyEmail } from "./CopyEmail";
import { level, levelLabel } from "@/components/chapters";
import { Eyebrow, Stop } from "./Stop";

export function Closing() {
  const { closing, contact } = profile;
  const rows = [
    { label: "Phone", value: contact.phoneDisplay, href: `tel:${contact.phone}` },
    { label: "LinkedIn", value: "in/kush-honkalse", href: contact.linkedin, external: true },
  ];
  // "Let's build something people notice." → last two words get the accent.
  const words = closing.title.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");

  return (
    <Stop stop="contact" label="Contact" level={level("contact")}>
      <Eyebrow>{levelLabel("contact", "Player 2, press start")}</Eyebrow>
      <h2 data-split className="display text-[clamp(2.8rem,6.6vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]">
        {head} <span className="text-accent">{tail}</span>
      </h2>
      <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-muted text-pretty">
        {closing.body}
      </p>

      <h3 data-reveal className="pixel mt-10 text-muted">What you get with Player 1</h3>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {closing.offer.map((o, i) => (
          <li key={o.title} data-reveal className="panel p-4">
            <p className="pixel text-[0.6rem] text-accent">Perk {String(i + 1).padStart(2, "0")}</p>
            <p className="display mt-1 text-lg font-bold">{o.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">{o.body}</p>
          </li>
        ))}
      </ul>

      <ul data-reveal className="mt-12 border-t border-line">
        <li className="border-b border-line">
          <CopyEmail email={contact.email} />
        </li>
        {rows.map((r) => (
          <li key={r.label} className="border-b border-line">
            <a
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-accent"
            >
              <span className="pixel w-16 shrink-0 text-[0.65rem] text-muted sm:w-24">{r.label}</span>
              <span className="display flex-1 text-xl font-semibold sm:text-3xl">{r.value}</span>
              <span aria-hidden="true" className="pixel transition-transform duration-500 group-hover:translate-x-1">
                ▶
              </span>
              {r.external && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
    </Stop>
  );
}
