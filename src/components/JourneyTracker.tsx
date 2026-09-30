"use client";

import { useEffect } from "react";
import { sceneStore } from "./scene/store";
import { journey } from "./journey";

/**
 * Maps the home page's scroll position onto the journey: when the centre of
 * the viewport passes the centre of stop N, progress is N.
 */
export function JourneyTracker() {
  useEffect(() => {
    sceneStore.focus = null;
    let mids: number[] = [];

    const measure = () => {
      mids = [...document.querySelectorAll<HTMLElement>("[data-stop]")].map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + scrollY + r.height / 2;
      });
      update();
    };

    const update = () => {
      if (!mids.length) return;
      const y = scrollY + innerHeight / 2;
      let p = 0;
      if (y <= mids[0]) p = 0;
      else if (y >= mids[mids.length - 1]) p = mids.length - 1;
      else {
        const i = mids.findIndex((m, k) => y >= m && y < mids[k + 1]);
        p = i + (y - mids[i]) / (mids[i + 1] - mids[i]);
      }
      sceneStore.progress = p;
      journey.set(Math.round(p));
      sceneStore.invalidate();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    addEventListener("scroll", update, { passive: true });
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      removeEventListener("scroll", update);
    };
  }, []);

  return null;
}
