"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerScroller } from "./scroll";

gsap.registerPlugin(ScrollTrigger);

/** Weighted smooth scrolling (Lenis), kept in step with GSAP ScrollTrigger. Off for reduced motion. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: true, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    registerScroller(lenis);
    return () => {
      gsap.ticker.remove(tick);
      registerScroller(null);
      lenis.destroy();
    };
  }, []);

  // Recalculate sizes after client-side navigation.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
