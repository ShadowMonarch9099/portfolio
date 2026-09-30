"use client";

import { useSyncExternalStore } from "react";
import { journey } from "./journey";
import { STOP_LABELS } from "./chapters";

/** A small game-style readout of where you are on the journey. */
export function HUD() {
  const index = useSyncExternalStore(journey.subscribe, journey.get, () => 0);
  const total = STOP_LABELS.length;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 right-5 z-30 hidden items-center gap-4 sm:flex lg:bottom-8 lg:right-12"
    >
      <div className="hud text-right text-muted">
        <span className="text-fg">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
        <span className="mx-2">·</span>
        <span className="text-fg">{STOP_LABELS[index]}</span>
      </div>
      <div className="flex h-24 flex-col justify-between">
        {STOP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`block h-px transition-all duration-500 ${i === index ? "w-6 bg-accent" : "w-3 bg-line-strong"}`}
          />
        ))}
      </div>
    </div>
  );
}
