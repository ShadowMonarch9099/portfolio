/**
 * Smooth-scroll helper with no dependencies, so any component can use it
 * without pulling Lenis or GSAP into the first-load bundle. SmoothScroll
 * registers the Lenis instance here once it has loaded.
 */
type Scroller = { scrollTo: (target: string | HTMLElement | number, options?: { duration?: number }) => void };

let scroller: Scroller | null = null;

export function registerScroller(next: Scroller | null) {
  scroller = next;
}

/** Smoothly scroll to an element or position; falls back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (scroller) {
    scroller.scrollTo(target, { duration: 1.6 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView();
}
