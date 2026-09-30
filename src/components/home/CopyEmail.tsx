"use client";

import { useState } from "react";

/** Email row: the address opens the mail app; the button copies it. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="flex items-center gap-4 py-5">
      <span className="pixel w-16 shrink-0 text-[0.65rem] text-muted sm:w-24">Email</span>
      <a
        href={`mailto:${email}`}
        className="display min-w-0 flex-1 text-xl font-semibold transition-colors [overflow-wrap:anywhere] hover:text-accent sm:text-3xl"
      >
        {email}
      </a>
      <button type="button" onClick={copy} className="btn btn-ghost btn-sm shrink-0">
        <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
}
