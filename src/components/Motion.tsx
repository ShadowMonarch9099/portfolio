"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Page-wide animations, mounted once.
 * - [data-hero]   : staggered entrance on load
 * - [data-reveal] : fade-up when scrolled into view
 * Elements are pre-hidden by CSS only when `.motion-ok` is set (see ThemeScript),
 * so reduced-motion users and no-JS visitors always see the content.
 */
export function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-hero]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.05 },
      );

      gsap.set("[data-reveal]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    });

    // If motion gets disabled mid-visit, make sure nothing stays hidden.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      document.documentElement.classList.remove("motion-ok");
      gsap.set("[data-hero], [data-reveal]", { clearProps: "all" });
    });

    return () => mm.revert();
  });

  return null;
}
