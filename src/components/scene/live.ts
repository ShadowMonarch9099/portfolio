import * as THREE from "three";

/**
 * Per-frame values shared between scene components (set by CameraRig and
 * the scanner, read by the map, route and waypoints). Plain mutable values,
 * so nothing re-renders.
 */
export const live = {
  /** Where the route has reached, in world units along the route. */
  headDist: 0,
  head: new THREE.Vector3(),
  /** Index of the waypoint you're at (rounded journey progress, or the case-study focus). */
  current: 0,
  /** 0 → 1: how far the camera has pulled back for the end-of-journey overview. */
  overview: 0,
  /** Scroll speed, smoothed (0 = still). Drives the speed-boost effect. */
  speed: 0,
  /** Cursor scanner on the map (x, z) and how strongly it's showing (0–1). */
  scan: new THREE.Vector3(0, 0, 0),
  /** Fog distances, widened during the overview. */
  fogNear: 90,
  fogFar: 280,
};
