/**
 * Scene colours for each theme. Kept in step with the CSS tokens in globals.css.
 * Dark is a holographic map at night; light is the same map in ink on paper.
 */
const DARK = {
  fog: "#0c0b0a",
  fill: "#0b0c11",
  edge: "#5ee6d0",
  edgeAlpha: 0.5,
  lot: "#10121a",
  walk: "#181b24",
  road: "#050608",
  curb: "#3fa597",
  lane: "#c99b3c",
  streetName: "#5ee6d0",
  done: "#5ee6d0",
  head: "#ff7a3d",
  ahead: "#a39b8f",
  upcoming: "#6b6660",
  scan: "#5ee6d0",
  poi: "#ff3d8b",
  traffic: ["#5ee6d0", "#ff7a3d"],
  rain: "#9fb4ff",
  rainAlpha: 0.12,
  additive: true,
  ink: false,
};

const LIGHT = {
  fog: "#f2ede4",
  fill: "#ece6db",
  edge: "#1a1714",
  edgeAlpha: 0.42,
  lot: "#ece6db",
  walk: "#e0d8ca",
  road: "#cfc5b3",
  curb: "#8a847b",
  lane: "#a07a52",
  streetName: "#5e574e",
  done: "#0b6e62",
  head: "#b3380a",
  ahead: "#5e574e",
  upcoming: "#8a847b",
  scan: "#0b6e62",
  poi: "#b3380a",
  traffic: ["#0b6e62", "#b3380a"],
  rain: "#1a1714",
  rainAlpha: 0.06,
  additive: false,
  ink: true,
};

export type Palette = typeof DARK;

export function palette(isDark: boolean): Palette {
  return isDark ? DARK : LIGHT;
}
