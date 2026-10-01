import { work } from "@/data/profile";

/**
 * World layout for the holographic mission map. The city is a grid of
 * blocks on the XZ plane, seen from a tilted bird's-eye view. Each home-page
 * stop is a waypoint at a street intersection, and a GPS-style route runs
 * along the streets from one waypoint to the next.
 */

export const NEON = {
  orange: "#ff7a3d",
  teal: "#5ee6d0",
  pink: "#ff3d8b",
  yellow: "#ffd23d",
};

/** Distance between street centre-lines. */
export const BLOCK = 14;
/** Every fourth street is a wide avenue. */
export const AVENUE_EVERY = 4;
export const isAvenue = (i: number) => ((i % AVENUE_EVERY) + AVENUE_EVERY) % AVENUE_EVERY === 0;
/** Road width for the street at grid line i. */
export const roadWidth = (i: number) => (isAvenue(i) ? 4.6 : 2.6);
/** Sidewalk between a road and the buildings. */
export const SIDEWALK = 0.9;

/** Map extent, in blocks. */
export const MAP = { minX: -10, maxX: 17, minZ: -42, maxZ: 8 };

export interface Waypoint {
  id: string;
  label: string;
  /** Intersection, in block coordinates. */
  cell: [number, number];
  /** Screenshot shown on a floating card (projects only). */
  image?: string;
  color: string;
}

const projects: Waypoint[] = work.map((w, i) => ({
  id: w.slug,
  label: `MISSION 0${i + 1} · ${w.title.toUpperCase()}`,
  cell: [[6, -9], [3, -13], [8, -16], [2, -19]][i % 4] as [number, number],
  image: w.billboard,
  color: w.neon,
}));

/** One waypoint per home-page stop, in scroll order. */
export const WAYPOINTS: Waypoint[] = [
  { id: "hero", label: "START · KUSH", cell: [2, 0], color: NEON.orange },
  { id: "origin", label: "LVL 01 · ORIGIN", cell: [5, -3], color: NEON.teal },
  { id: "values", label: "LVL 02 · PRINCIPLES", cell: [1, -6], color: NEON.teal },
  ...projects,
  { id: "experience", label: "LVL 04 · QUEST LOG", cell: [6, -22], color: NEON.yellow },
  { id: "loadout", label: "LVL 05 · LOADOUT", cell: [0, -25], color: NEON.teal },
  { id: "offclock", label: "LVL 06 · OFF THE CLOCK", cell: [5, -28], color: NEON.pink },
  { id: "contact", label: "LVL 07 · PRESS START", cell: [2, -32], color: NEON.orange },
];

/** Home-page stops, in scroll order. Each maps to a waypoint above and a DOM section. */
export const STOPS = WAYPOINTS.map((w) => w.id);

export const toWorld = ([cx, cz]: [number, number]): [number, number] => [cx * BLOCK, cz * BLOCK];

/** Small seeded random generator (mulberry32): deterministic, so the map is the same on every visit. */
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

/* ------------------------------------------------------------------ */
/* GPS route                                                          */
/* ------------------------------------------------------------------ */

/**
 * A route that follows the street grid: from each waypoint to the next it
 * alternates between east-west and north-south legs, splitting each into a
 * couple of turns so it winds like real navigation.
 */
function buildRoute() {
  const random = seededRandom(404);
  const cells: [number, number][] = [WAYPOINTS[0].cell];
  const stopCell: number[] = [0];

  for (let i = 1; i < WAYPOINTS.length; i++) {
    let [x, z] = cells[cells.length - 1];
    const [tx, tz] = WAYPOINTS[i].cell;
    const split = (d: number) => {
      const n = Math.abs(d);
      if (n <= 1) return n ? [d] : [];
      const a = 1 + Math.floor(random() * (n - 1));
      return [Math.sign(d) * a, Math.sign(d) * (n - a)];
    };
    const xs = split(tx - x);
    const zs = split(tz - z);
    let alongX = random() < 0.5;
    while (xs.length || zs.length) {
      const from = alongX ? xs : zs;
      const step = from.shift();
      if (step !== undefined) {
        if (alongX) x += step;
        else z += step;
        cells.push([x, z]);
      }
      alongX = !alongX;
    }
    stopCell.push(cells.length - 1);
  }

  const points = cells.map(toWorld);
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  return { points, cum, stopDist: stopCell.map((c) => cum[c]), length: cum[cum.length - 1] };
}

export const ROUTE = buildRoute();

/** Point along the route at a given distance, plus the direction of travel there. */
export function routeAt(dist: number): { x: number; z: number; dx: number; dz: number } {
  const { points, cum } = ROUTE;
  const d = Math.min(Math.max(dist, 0), ROUTE.length);
  let i = 1;
  while (i < cum.length - 1 && cum[i] < d) i++;
  const [ax, az] = points[i - 1];
  const [bx, bz] = points[i];
  const seg = cum[i] - cum[i - 1] || 1;
  const t = (d - cum[i - 1]) / seg;
  return { x: ax + (bx - ax) * t, z: az + (bz - az) * t, dx: (bx - ax) / seg, dz: (bz - az) / seg };
}

/** Bounds of the whole route, for the end-of-journey overview. */
export const ROUTE_BOUNDS = (() => {
  const xs = ROUTE.points.map((p) => p[0]);
  const zs = ROUTE.points.map((p) => p[1]);
  return { cx: (Math.min(...xs) + Math.max(...xs)) / 2, cz: (Math.min(...zs) + Math.max(...zs)) / 2 };
})();

/* ------------------------------------------------------------------ */
/* City blocks                                                        */
/* ------------------------------------------------------------------ */

export interface Lot {
  position: [number, number, number];
  scale: [number, number, number];
}

/**
 * Buildings. Each block is split into a few lots (some left as plazas).
 * Towers downtown along the route are tall and stepped (tiers that narrow as
 * they rise), with rooftop units and the odd antenna spire.
 */
export function buildLots(lite: boolean): Lot[] {
  const random = seededRandom(2077);
  const lots: Lot[] = [];
  const box = (cx: number, y0: number, cz: number, w: number, h: number, d: number) =>
    lots.push({ position: [cx, y0 + h / 2, cz], scale: [w, h, d] });
  const minX = lite ? -6 : MAP.minX;
  const maxX = lite ? 12 : MAP.maxX;

  for (let bx = minX; bx < maxX; bx++) {
    for (let bz = MAP.minZ; bz < MAP.maxZ; bz++) {
      if (random() < 0.06) continue; // a plaza
      const x0 = bx * BLOCK + roadWidth(bx) / 2 + SIDEWALK;
      const x1 = (bx + 1) * BLOCK - roadWidth(bx + 1) / 2 - SIDEWALK;
      const z0 = bz * BLOCK + roadWidth(bz) / 2 + SIDEWALK;
      const z1 = (bz + 1) * BLOCK - roadWidth(bz + 1) / 2 - SIDEWALK;
      const sx = x1 - x0;
      const sz = z1 - z0;
      // Taller downtown along the route, lower blocks further out.
      const downtown = Math.exp(-((bx - 4) ** 2) / 30) * (0.65 + 0.35 * Math.sin(bz * 0.5));
      const r = random();
      const parts = r < 0.3 ? [[0, 0, 1, 1]] : r < 0.65 ? [[0, 0, 0.5, 1], [0.5, 0, 0.5, 1]] : [[0, 0, 1, 0.5], [0, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]];
      for (const [px, pz, pw, pd] of parts) {
        if (random() < 0.06) continue;
        const gap = 0.5;
        const w = sx * pw - gap;
        const d = sz * pd - gap;
        const cx = x0 + sx * px + (sx * pw) / 2;
        const cz = z0 + sz * pz + (sz * pd) / 2;
        let h = 1.5 + Math.pow(random(), 1.8) * (5 + downtown * 30);
        if (downtown > 0.5 && random() < 0.12) h += 18 + random() * 20; // the odd skyscraper

        if (h > 16 && !lite) {
          // Stepped tower: base, mid and crown, each narrower.
          const h1 = h * 0.55;
          const h2 = h * 0.3;
          const h3 = h * 0.15;
          box(cx, 0, cz, w, h1, d);
          box(cx, h1, cz, w * 0.78, h2, d * 0.78);
          box(cx, h1 + h2, cz, w * 0.52, h3, d * 0.52);
          if (h > 30 && random() < 0.7) box(cx, h, cz, 0.22, 4 + random() * 5, 0.22); // spire
        } else {
          box(cx, 0, cz, w, h, d);
          // Rooftop units on mid-rise blocks.
          const units = !lite && h > 4 && random() < 0.55 ? 1 + Math.floor(random() * 2) : 0;
          for (let u = 0; u < units; u++) {
            const uw = 0.7 + random() * 1.1;
            box(cx + (random() - 0.5) * (w - uw) * 0.8, h, cz + (random() - 0.5) * (d - uw) * 0.8, uw, 0.5 + random() * 0.9, uw);
          }
        }
      }
    }
  }
  return lots;
}

/** Street names painted along the avenues, like a map. */
const AVENUES_NS = ["REACT AVE", "NEXT.JS AVE", "TYPESCRIPT AVE", "TAILWIND AVE", "THREE.JS AVE", "NODE AVE", "VITE AVE"];
const AVENUES_EW = ["PIXEL ST", "LOOT ST", "RESPAWN ST", "COMBO ST", "HIGH SCORE ST", "SAVE POINT ST", "BOSS RUSH ST", "CO-OP ST", "SPEEDRUN ST", "GG ST", "1UP ST", "QUEST ST", "XP ST"];

export interface StreetLabel {
  text: string;
  position: [number, number, number];
  /** Rotation about Y so the text runs along the street. */
  rotationY: number;
}

export const STREET_LABELS: StreetLabel[] = (() => {
  const out: StreetLabel[] = [];
  let ns = 0;
  for (let ix = MAP.minX; ix <= MAP.maxX; ix++) {
    if (!isAvenue(ix)) continue;
    const text = AVENUES_NS[ns++ % AVENUES_NS.length];
    for (let k = 0; k < 4; k++) out.push({ text, position: [ix * BLOCK, 0.05, (-3.5 - k * 9) * BLOCK], rotationY: Math.PI / 2 });
  }
  let ew = 0;
  for (let iz = MAP.maxZ; iz >= MAP.minZ; iz--) {
    if (!isAvenue(iz)) continue;
    const text = AVENUES_EW[ew++ % AVENUES_EW.length];
    for (const bx of [-2.5, 6.5, 13.5]) out.push({ text, position: [bx * BLOCK, 0.05, iz * BLOCK], rotationY: 0 });
  }
  return out;
})();

/** Gamer points of interest scattered over the map. */
const EGGS = ["ARCADE", "GG", "RESPAWN", "1UP", "60 FPS", "NO LAG", "HIGH SCORE", "LOOT", "CO-OP", "AFK", "INSERT COIN", "SAVE POINT", "COMBO x3", "BOSS"];
export const POIS = EGGS.map((label, i) => {
  const random = seededRandom(900 + i);
  const cx = -3 + Math.floor(random() * 14);
  const cz = -2 - i * 2.4 - Math.floor(random() * 2);
  return {
    label,
    position: [cx * BLOCK + BLOCK / 2, 0, cz * BLOCK + BLOCK / 2] as [number, number, number],
    color: [NEON.pink, NEON.yellow, NEON.teal][i % 3],
  };
});
