"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerScroller } from "./scroll";

gsap.registerPlugin(ScrollTrigger);

/** Weighted smooth scrolling (Lenis), kept in step with GSAP ScrollTrigger. Off for reduced motion. */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const backForward = useRef(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: true, autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    registerScroller(lenis);
    const onPopState = () => (backForward.current = true);
    addEventListener("popstate", onPopState);
    return () => {
      removeEventListener("popstate", onPopState);
      gsap.ticker.remove(tick);
      registerScroller(null);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // After moving to another page, drop any glide still running from the old
  // page (it would drag the new page down), and start at the top, or at the
  // section in the link's #hash. Back/forward keeps the browser's position.
  // The first page load is left alone, so a reload keeps its place.
  const lastPath = useRef(pathname);
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis && pathname !== lastPath.current) {
      // Measure the new page (Lenis still has the old page's height, which
      // would clamp the jump), then stop the glide and sync to the real position.
      lenis.resize();
      lenis.stop();
      lenis.start();
      if (!backForward.current) {
        const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
        lenis.scrollTo(target ?? 0, { immediate: true, force: true });
      }
    }
    lastPath.current = pathname;
    backForward.current = false;
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
