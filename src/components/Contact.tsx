import { profile } from "@/data/profile";
import { MailIcon } from "./Icons";
import { SocialLinks } from "./SocialLinks";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-70" />
          <div aria-hidden="true" className="bg-glow absolute inset-0 -z-10" />
          <p className="font-mono text-sm text-accent">
            06 <span aria-hidden="true">/</span> Contact
          </p>
          <h2 id="contact-heading" className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {profile.contact.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted text-pretty">{profile.contact.text}</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-9 inline-flex h-12 max-w-full items-center gap-2 rounded-full bg-accent px-6 font-medium text-accent-contrast shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            <MailIcon className="size-5 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </a>
          <SocialLinks className="mt-8 justify-center" />
        </div>
      </div>
    </section>
  );
}
