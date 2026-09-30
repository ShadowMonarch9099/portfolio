"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { BODIES, restPosition } from "./world";

interface Pose {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

/**
 * Camera pose for a stop. On wide screens the body sits to the right of the
 * text column; on tall screens it sits above the text.
 */
function poseFor(index: number, wide: boolean): Pose {
  const body = BODIES[index];
  const [x, y, z] = restPosition(body);
  const isHero = index === 0;
  const isLast = index === BODIES.length - 1;

  if (wide) {
    const back = isHero ? 36 : isLast ? 32 : 22;
    const up = isHero ? 15 : 7;
    const side = isHero ? 16 : 12;
    const lead = isHero ? 11 : 8.5;
    return {
      pos: new THREE.Vector3(x - side, y + up, z + back),
      target: new THREE.Vector3(x - lead, y - (isHero ? 3 : 0.5), z),
    };
  }
  const back = isHero ? 40 : isLast ? 30 : 26;
  return {
    pos: new THREE.Vector3(x, y + (isHero ? 18 : 10), z + back),
    target: new THREE.Vector3(x, y - (isHero ? 9 : 5.5), z),
  };
}

/** Close-up framing for a case-study page, pulled back slightly as you scroll. */
function focusPose(id: string, wide: boolean, t: number, scroll: number): Pose | null {
  const body = BODIES.find((b) => b.id === id);
  if (!body) return null;
  const [x, y, z] = restPosition(body);
  const orbit = t * 0.05;
  if (wide) {
    const dist = 17 + scroll * 10;
    return {
      pos: new THREE.Vector3(x - 8 + Math.sin(orbit) * 1.5, y + 3 + scroll * 5, z + dist + Math.cos(orbit)),
      target: new THREE.Vector3(x - 6, y - 0.5, z),
    };
  }
  // Tall screens: keep the planet small and high, above the text.
  const dist = 30 + scroll * 12;
  return {
    pos: new THREE.Vector3(x + Math.sin(orbit) * 1.5, y + 6, z + dist),
    target: new THREE.Vector3(x, y - 13 - scroll * 6, z),
  };
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function CameraRig() {
  const { camera, size } = useThree();
  const current = useMemo(() => ({ target: new THREE.Vector3(), ready: false }), []);
  const want = useMemo(() => ({ pos: new THREE.Vector3(), target: new THREE.Vector3() }), []);

  useFrame(({ clock }, dt) => {
    const wide = size.width / size.height > 1.05;
    const reduced = sceneStore.reducedMotion;
    const t = reduced ? 0 : clock.elapsedTime;

    const focused = sceneStore.focus ? focusPose(sceneStore.focus, wide, t, sceneStore.pageProgress) : null;
    if (focused) {
      want.pos.copy(focused.pos);
      want.target.copy(focused.target);
    } else {
      const max = BODIES.length - 1;
      const p = Math.min(Math.max(sceneStore.progress, 0), max);
      // Reduced motion: cut between stops instead of flying.
      const i = reduced ? Math.round(p) : Math.floor(p);
      const f = reduced ? 0 : smooth(p - i);
      const a = poseFor(i, wide);
      const b = poseFor(Math.min(i + 1, max), wide);
      want.pos.lerpVectors(a.pos, b.pos, f);
      want.target.lerpVectors(a.target, b.target, f);
      // Lift the camera between stops so it arcs over the grid rather than skimming it.
      want.pos.y += Math.sin(f * Math.PI) * 6;
    }

    // Gentle parallax from the pointer.
    if (!reduced && sceneStore.pointer.active) {
      want.pos.x += sceneStore.pointer.x * 1.2;
      want.pos.y += sceneStore.pointer.y * 0.6;
    }

    if (!current.ready || reduced) {
      camera.position.copy(want.pos);
      current.target.copy(want.target);
      current.ready = true;
    } else {
      const k = 1 - Math.exp(-dt * 2.6);
      camera.position.lerp(want.pos, k);
      current.target.lerp(want.target, k);
    }
    camera.lookAt(current.target);
  });

  return null;
}
