/**
 * A tiny mutable store shared between the DOM and the WebGL scene.
 * Scroll and pointer handlers write plain numbers here; the scene reads them
 * every frame. Nothing here triggers React re-renders.
 */
export const sceneStore = {
  /** Continuous journey position: 0 = first stop, 1 = second stop, ... */
  progress: 0,
  /** When set, the camera frames this case study's planet instead of the journey. */
  focus: null as string | null,
  /** Scroll progress within a case-study page (0–1). */
  pageProgress: 0,
  /** Pointer in normalised device coordinates. */
  pointer: { x: 0, y: 0, active: false, moved: 0 },
  reducedMotion: false,
  isDark: true,
  /** Bumped when anything changes, so a paused (demand) renderer can redraw. */
  invalidate: () => {},
};
