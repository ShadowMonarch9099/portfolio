"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { live } from "./live";
import { ROUTE, ROUTE_BOUNDS, WAYPOINTS, routeAt, toWorld } from "./world";

const BASE_FOV = 42;
// Mostly linear, eased a little at each stop, so the route keeps moving while you read.
const ease = (t: number) => t + (t * t * (3 - 2 * t) - t) * 0.4;

/**
 * Bird's-eye camera that follows the head of the GPS route.
 * - Wide screens: the head sits right of centre, beside the text column.
 * - Tall screens: the head sits above the text.
 * - The last stop pulls back to show the whole route.
 * - Case-study pages zoom in on their waypoint.
 * - Scrolling fast widens the field of view a little ("speed boost").
 */
export function CameraRig() {
  const { camera, size } = useThree();
  const state = useMemo(
    () => ({
      target: new THREE.Vector3(),
      wantPos: new THREE.Vector3(),
      wantTarget: new THREE.Vector3(),
      ready: false,
      lastProgress: 0,
      fov: BASE_FOV,
    }),
    [],
  );

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const wide = size.width / size.height > 1.05;
    const reduced = sceneStore.reducedMotion;
    const max = WAYPOINTS.length - 1;
    const progress = Math.min(Math.max(sceneStore.progress, 0), max);

    // Where along the route are we? Reduced motion jumps straight to each stop.
    let dist: number;
    if (reduced) dist = ROUTE.stopDist[Math.round(progress)];
    else {
      const i = Math.floor(progress);
      const f = ease(progress - i);
      dist = THREE.MathUtils.lerp(ROUTE.stopDist[i], ROUTE.stopDist[Math.min(i + 1, max)], f);
    }

    const focusIndex = sceneStore.focus ? WAYPOINTS.findIndex((w) => w.id === sceneStore.focus) : -1;
    if (focusIndex >= 0) dist = ROUTE.stopDist[focusIndex];
    live.headDist = dist;
    const head = routeAt(dist);
    live.head.set(head.x, 0, head.z);
    live.current = focusIndex >= 0 ? focusIndex : Math.round(progress);

    // Scroll speed (stops per second), smoothed.
    const v = dt > 0 ? Math.abs(progress - state.lastProgress) / dt : 0;
    state.lastProgress = progress;
    live.speed += (Math.min(v / 2.5, 1) - live.speed) * Math.min(1, dt * 4);
    if (reduced || focusIndex >= 0) live.speed = 0;

    // End-of-journey overview.
    live.overview = focusIndex >= 0 ? 0 : THREE.MathUtils.smoothstep(progress, max - 0.6, max);

    const { wantPos, wantTarget } = state;
    if (focusIndex >= 0) {
      const [wx, wz] = toWorld(WAYPOINTS[focusIndex].cell);
      const back = sceneStore.pageProgress * 10;
      if (wide) {
        wantTarget.set(wx - 12, 4, wz - 1);
        wantPos.set(wx - 13, 66 + back, wz + 28 + back);
      } else {
        wantTarget.set(wx, 4, wz + 16);
        wantPos.set(wx, 80 + back, wz + 44 + back);
      }
    } else {
      if (wide) {
        wantTarget.set(head.x - 19, 0, head.z + 2);
        wantPos.set(head.x - 20, 112, head.z + 34);
      } else {
        wantTarget.set(head.x, 0, head.z + 24);
        wantPos.set(head.x, 124, head.z + 52);
      }
      if (live.overview > 0) {
        const o = live.overview;
        // Wide screens: shift the map right, clear of the text column.
        const ox = ROUTE_BOUNDS.cx - (wide ? Math.min(320, (size.width / size.height) * 200) : 0);
        const oz = ROUTE_BOUNDS.cz + (wide ? 0 : 60);
        wantTarget.lerp(new THREE.Vector3(ox, 0, oz), o);
        wantPos.lerp(new THREE.Vector3(ox - 10, wide ? 1000 : 1150, oz + 150), o);
      }
    }

    // Fog widens for the overview so the whole route stays visible.
    live.fogNear = THREE.MathUtils.lerp(150, 950, live.overview);
    live.fogFar = THREE.MathUtils.lerp(400, 1800, live.overview);

    if (!state.ready || reduced) {
      cam.position.copy(wantPos);
      state.target.copy(wantTarget);
      state.ready = true;
    } else {
      const k = 1 - Math.exp(-dt * 3);
      cam.position.lerp(wantPos, k);
      state.target.lerp(wantTarget, k);
    }
    cam.lookAt(state.target);

    // Speed boost: the view widens slightly while you scroll fast.
    const wantFov = BASE_FOV + live.speed * 9;
    state.fov += (wantFov - state.fov) * Math.min(1, dt * 5);
    if (Math.abs(cam.fov - state.fov) > 0.01) {
      cam.fov = state.fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
