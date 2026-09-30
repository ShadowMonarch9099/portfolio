/** Scene colours for each theme. Kept in step with the CSS tokens in globals.css. */
const DARK = {
  grid: "#efe9df",
  gridAlpha: 0.26,
  accent: "#ff7a3d",
  stars: "#efe9df",
  starAlpha: 0.9,
  additive: true,
  glowOpacity: 1,
};

const LIGHT = {
  grid: "#1a1714",
  gridAlpha: 0.3,
  accent: "#b3380a",
  stars: "#1a1714",
  starAlpha: 0.35,
  additive: false,
  glowOpacity: 0.55,
};

export type Palette = typeof DARK;

export function palette(isDark: boolean): Palette {
  return isDark ? DARK : LIGHT;
}
