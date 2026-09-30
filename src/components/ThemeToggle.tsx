"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./ThemeScript";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDarkNow = () => document.documentElement.classList.contains("dark");

function readStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Sun/moon switch. Follows the system until the visitor chooses, then remembers the choice. */
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => true);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (!readStoredTheme()) document.documentElement.classList.toggle("dark", e.matches);
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  function toggle() {
    const next = !isDarkNow();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage unavailable: the choice lasts for this visit only.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={isDark}
      title={isDark ? "Switch to paper (light) theme" : "Switch to space (dark) theme"}
      className="relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-line-strong transition-colors hover:border-fg"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.6}>
        {/* A planet whose lit side flips with the theme. */}
        <circle cx="12" cy="12" r="7" />
        <path d="M12 5a7 7 0 0 1 0 14Z" fill="currentColor" className="origin-center transition-transform duration-500 dark:rotate-180" />
      </svg>
    </button>
  );
}
