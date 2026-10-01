"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sceneStore } from "./store";

const JourneyCanvas = dynamic(() => import("./JourneyCanvas"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The fixed background layer: a CSS grid floor that paints instantly, and the
 * WebGL journey that loads once the page is idle and fades in over it.
 */
export function SceneRoot() {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  // Keep the scene in sync with theme, motion preference and pointer.
  useEffect(() => {
    const root = document.documentElement;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      sceneStore.isDark = root.classList.contains("dark");
      sceneStore.reducedMotion = motion.matches;
      sceneStore.invalidate();
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    motion.addEventListener("change", sync);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const p = sceneStore.pointer;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = -(e.clientY / innerHeight) * 2 + 1;
      p.moved = Math.min(p.moved + Math.hypot(x - p.x, y - p.y) * 2.5, 1.5);
      p.x = x;
      p.y = y;
      p.active = true;
    };
    const onLeave = () => (sceneStore.pointer.active = false);
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Load WebGL once the page is idle. On phones, wait for the first touch or
  // scroll instead, so the 3D engine never competes with the first paint.
  useEffect(() => {
    if (!hasWebGL()) return;
    let idleId = 0;
    let timer = 0;
    const interactions = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    const start = () => {
      interactions.forEach((e) => removeEventListener(e, start));
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idleId = ric(() => setLoad(true), { timeout: 2500 }) as number;
    };
    const phone = matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    if (phone) interactions.forEach((e) => addEventListener(e, start, { once: true, passive: true }));
    else if (document.readyState === "complete") timer = window.setTimeout(start, 300);
    else addEventListener("load", start, { once: true });
    return () => {
      interactions.forEach((e) => removeEventListener(e, start));
      removeEventListener("load", start);
      clearTimeout(timer);
      window.cancelIdleCallback?.(idleId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="city-sky absolute inset-0" />
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] ${ready ? "opacity-0" : "opacity-100"}`}
      >
        <div className="css-floor" />
      </div>
      {load && (
        <div className={`absolute inset-0 transition-opacity duration-[1600ms] ${ready ? "opacity-100" : "opacity-0"}`}>
          <JourneyCanvas onReady={() => setReady(true)} />
        </div>
      )}
      <div className="scrim-left absolute inset-0" />
    </div>
  );
}
