"use client";

import { useEffect, useRef } from "react";

interface InViewVideoProps {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}

/**
 * A muted demo video that only downloads and plays while it's on screen, so
 * it never slows down the page load. Visitors who prefer reduced motion get
 * the poster and the play button instead.
 */
export function InViewVideo({ src, poster, label, className }: InViewVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      className={className}
      preload="none"
      muted
      loop
      playsInline
      controls
    />
  );
}
