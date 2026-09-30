"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

/**
 * Page animations. Mount once per page.
 * - [data-split]   headings reveal line by line through a mask
 * - [data-reveal]  fades up when scrolled into view
 * - [data-scrub]   lights up (heading colour and rule) as it scrolls into the middle of the screen
 * - [data-magnetic] is pulled gently towards the cursor ("gravity")
 * - [data-scramble] decodes like a game UI when it scrolls into view
 * Everything is skipped for visitors who prefer reduced motion.
 */
export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Split each heading only when it first reaches the viewport, so the
      // work is spread across the visit instead of all happening on load.
      const splits: SplitText[] = [];
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          once: true,
          onEnter: () => {
            splits.push(
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                linesClass: "split-line",
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 115,
                    duration: 1.2,
                    ease: "expo.out",
                    stagger: 0.09,
                    delay: 0.1,
                    // Restore plain text afterwards so it reflows naturally on resize.
                    onComplete: () => self.revert(),
                  }),
              }),
            );
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-scramble]").forEach((el) => {
        const text = el.textContent ?? "";
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(el, { duration: 0.9, delay: 0.15, scrambleText: { text, chars: "01<>/#*+▮", speed: 0.5 } }),
        });
      });

      gsap.set("[data-reveal]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((el) => {
        gsap.fromTo(
          el,
          { "--lit": 0 },
          { "--lit": 1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "top 45%", scrub: true } },
        );
      });

      const cleanups: (() => void)[] = [];
      if (matchMedia("(pointer: fine)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const leave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });
      }

      return () => {
        splits.forEach((s) => s.revert());
        cleanups.forEach((c) => c());
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      document.documentElement.classList.remove("motion-ok");
    });

    return () => mm.revert();
  });

  return null;
}
