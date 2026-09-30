"use client";

import { useEffect } from "react";
import { sceneStore } from "../scene/store";

/** Points the camera at this case study's planet and eases it back as you read. */
export function FocusPlanet({ slug }: { slug: string }) {
  useEffect(() => {
    sceneStore.focus = slug;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      sceneStore.pageProgress = max > 0 ? scrollY / max : 0;
      sceneStore.invalidate();
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      sceneStore.focus = null;
      sceneStore.pageProgress = 0;
    };
  }, [slug]);
  return null;
}
