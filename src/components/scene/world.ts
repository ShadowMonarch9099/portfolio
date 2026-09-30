import { work } from "@/data/profile";

/**
 * World layout. The spacetime grid lies on the XZ plane and the journey
 * travels towards -Z. Each stop on the home page has a body the camera visits.
 */

export type BodyKind = "star" | "planet" | "ringed" | "blackhole" | "moons" | "binary" | "belt" | "comet";

export interface Body {
  id: string;
  kind: BodyKind;
  /** x and z place the body on the grid; y is extra lift above its well. */
  position: [number, number, number];
  radius: number;
  color: string;
  glow: string;
  /** How deep the body's well sinks into the grid, and how wide it is. */
  well: { depth: number; width: number };
}

const byWork = Object.fromEntries(work.map((w) => [w.slug, w.planet]));

export const BODIES: Body[] = [
  { id: "hero", kind: "star", position: [10, 0.8, -20], radius: 3.2, color: "#ffd2a6", glow: "#ff7a3d", well: { depth: 9, width: 8 } },
  { id: "origin", kind: "star", position: [5, 0.6, -62], radius: 1.1, color: "#fff1dc", glow: "#ffc48a", well: { depth: 3, width: 4 } },
  { id: "values", kind: "moons", position: [13, 0.8, -104], radius: 1.3, color: "#ffe0c2", glow: "#ff9a5c", well: { depth: 4.5, width: 6 } },
  ...work.map((w, i): Body => ({
    id: w.slug,
    kind: byWork[w.slug].kind === "ringed" ? "ringed" : byWork[w.slug].kind === "blackhole" ? "blackhole" : "planet",
    position: [[8, 15, 6, 12][i % 4], 0.6, -146 - i * 42],
    radius: byWork[w.slug].kind === "blackhole" ? 1.7 : 2.4,
    color: byWork[w.slug].color,
    glow: byWork[w.slug].glow,
    well: { depth: byWork[w.slug].kind === "blackhole" ? 11 : 6, width: byWork[w.slug].kind === "blackhole" ? 5 : 6.5 },
  })),
  { id: "experience", kind: "binary", position: [9, 0.8, -326], radius: 1.4, color: "#e9d8c4", glow: "#ffb07a", well: { depth: 5, width: 7 } },
  { id: "loadout", kind: "belt", position: [14, 0.6, -366], radius: 1.6, color: "#c9b8a4", glow: "#ff9a5c", well: { depth: 3.5, width: 6 } },
  { id: "offclock", kind: "comet", position: [13, 2.5, -404], radius: 0.8, color: "#fff6ea", glow: "#8fd0ff", well: { depth: 1.5, width: 3 } },
  { id: "contact", kind: "star", position: [15, 1.2, -452], radius: 4.2, color: "#fff0dc", glow: "#ff7a3d", well: { depth: 12, width: 10 } },
];

/** Home-page stops, in scroll order. Each maps to a body above and a DOM section. */
export const STOPS = BODIES.map((b) => b.id);

export const GRID = { minX: -80, maxX: 80, minZ: -500, maxZ: 40 };

/** Where a body actually floats: just above the bottom of its own well. */
export function restPosition(b: Body): [number, number, number] {
  return [b.position[0], -b.well.depth * 0.45 + b.radius * 0.5 + b.position[1], b.position[2]];
}

/** Small seeded random generator (mulberry32): deterministic, so the scene is the same on every visit. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
