"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { journey } from "./journey";
import { STOP_LABELS } from "./chapters";

/** Game-style HUD: an XP bar for scroll progress and a level readout. */
export function HUD() {
  const index = useSyncExternalStore(journey.subscribe, journey.get, () => 0);
  const total = STOP_LABELS.length;
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-line">
        <span
          ref={bar}
          className="block h-full origin-left bg-gradient-to-r from-signal to-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div className="pointer-events-none fixed bottom-5 right-5 z-30 hidden items-center gap-4 sm:flex lg:bottom-8 lg:right-12">
        <div className="pixel text-right text-muted">
          <span className="text-fg">
            LVL {String(index + 1).padStart(2, "0")}
          </span>
          /{String(total).padStart(2, "0")}
          <span className="block text-fg">{STOP_LABELS[index]}</span>
        </div>
        <div className="flex h-24 flex-col justify-between">
          {STOP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`block h-1 transition-all duration-500 ${
                i < index ? "w-3 bg-signal" : i === index ? "w-6 bg-accent" : "w-3 bg-line-strong"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
