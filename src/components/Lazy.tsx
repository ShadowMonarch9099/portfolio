"use client";

import dynamic from "next/dynamic";

/*
 * GSAP, SplitText and Lenis load after the page has rendered, so they never
 * delay the first paint. Until they arrive the page is fully readable; the
 * animations simply start a moment later.
 */
export const Motion = dynamic(() => import("./Motion"), { ssr: false });
export const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
