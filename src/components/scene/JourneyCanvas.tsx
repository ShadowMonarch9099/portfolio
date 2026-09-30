"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { sceneStore } from "./store";
import { Grid } from "./Grid";
import { Bodies } from "./Bodies";
import { Stars } from "./Stars";
import { CameraRig } from "./CameraRig";

/** Lets DOM code request a redraw when the canvas renders on demand (reduced motion). */
function InvalidateBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    sceneStore.invalidate = () => invalidate();
    return () => {
      sceneStore.invalidate = () => {};
    };
  }, [invalidate]);
  return null;
}

export default function JourneyCanvas({ onReady }: { onReady: () => void }) {
  const [lite] = useState(
    () => window.matchMedia("(max-width: 767px), (pointer: coarse)").matches || navigator.hardwareConcurrency <= 4,
  );
  const reduced = sceneStore.reducedMotion;

  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.1, far: 420, position: [0, 20, 30] }}
      frameloop={reduced ? "demand" : "always"}
      onCreated={() => requestAnimationFrame(onReady)}
      aria-hidden="true"
      tabIndex={-1}
    >
      <InvalidateBridge />
      <CameraRig />
      <Grid lite={lite} />
      <Stars lite={lite} />
      <Bodies lite={lite} />
    </Canvas>
  );
}
