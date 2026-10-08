"use client";

import { useEffect } from "react";
import { sceneStore } from "../scene/store";

/**
 * Points the camera at this page's waypoint on the map and eases it back as
 * you read. A focus that isn't a waypoint (e.g. "archive") shows the whole map.
 */
export function FocusStop({ slug }: { slug: string }) {
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
