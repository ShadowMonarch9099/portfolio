import { work } from "@/data/profile";

/** Projects that get their own stop on the home page; the rest live in the archive (/work). */
export const featured = work.filter((w) => w.featured);

/** Neon colours used by the map. */
export const NEON = {
  orange: "#ff7a3d",
  teal: "#5ee6d0",
  pink: "#ff3d8b",
  yellow: "#ffd23d",
};

/**
 * Chapters shown in the menu, in page order. Act 1 is the briefing (what a
 * recruiter needs: experience, projects, skills, achievements); act 2 is the
 * person behind it. `stop` is the scene stop each chapter starts at.
 */
export const CHAPTERS = [
  { id: "experience", stop: "experience", act: 1, label: "Quest log", note: "Internship and education" },
  { id: "work", stop: featured[0].slug, act: 1, label: "Missions", note: `${featured.length} on the map · ${work.length} in the archive` },
  { id: "loadout", stop: "loadout", act: 1, label: "Loadout", note: "Tools and skills" },
  { id: "trophies", stop: "trophies", act: 1, label: "Trophies", note: "Achievements" },
  { id: "origin", stop: "origin", act: 2, label: "Origin", note: "How I got here" },
  { id: "principles", stop: "values", act: 2, label: "Principles", note: "What I care about" },
  { id: "off-clock", stop: "offclock", act: 2, label: "Off the clock", note: "Gaming and languages" },
  { id: "contact", stop: "contact", act: 2, label: "Contact", note: "Say hello" },
];

export const ACTS = [
  { act: 1, label: "Act I · The briefing" },
  { act: 2, label: "Act II · The player" },
];

/** Two-digit level number of a chapter, e.g. level("loadout") → "03". */
export function level(id: string) {
  return String(CHAPTERS.findIndex((c) => c.id === id) + 1).padStart(2, "0");
}

/** "LVL 03 · Loadout" */
export function levelLabel(id: string, label = CHAPTERS.find((c) => c.id === id)?.label) {
  return `LVL ${level(id)} · ${label}`;
}

/** "Mission 01" */
export const missionLabel = (i: number) => `Mission ${String(i + 1).padStart(2, "0")}`;

/** Projects that only appear in the archive. */
export const side = work.filter((w) => !w.featured);

/** "Mission 02/04" for featured projects, "Side mission 01/04" for archive-only ones. */
export function missionTag(slug: string) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const f = featured.findIndex((w) => w.slug === slug);
  if (f >= 0) return `${missionLabel(f)}/${pad(featured.length)}`;
  return `Side ${missionLabel(side.findIndex((w) => w.slug === slug)).toLowerCase()}/${pad(side.length)}`;
}

/**
 * Every stop on the home page, in scroll order. Each one is a DOM section
 * (data-stop), a waypoint on the map (scene/world.ts) and a tick on the HUD.
 */
export const STOPS: { id: string; label: string; map: string; color: string; image?: string }[] = [
  { id: "hero", label: "Start", map: "START · KUSH", color: NEON.orange },
  { id: "experience", label: "Quest log", map: levelLabel("experience"), color: NEON.yellow },
  ...featured.map((w, i) => ({
    id: w.slug,
    label: w.title,
    map: `${missionLabel(i)} · ${w.title}`,
    color: w.neon ?? NEON.orange,
    image: w.billboard,
  })),
  { id: "loadout", label: "Loadout", map: levelLabel("loadout"), color: NEON.teal },
  { id: "trophies", label: "Trophies", map: levelLabel("trophies"), color: NEON.yellow },
  { id: "origin", label: "Origin", map: levelLabel("origin"), color: NEON.teal },
  { id: "values", label: "Principles", map: levelLabel("principles"), color: NEON.teal },
  { id: "offclock", label: "Off the clock", map: levelLabel("off-clock"), color: NEON.pink },
  { id: "contact", label: "Contact", map: levelLabel("contact", "Press start"), color: NEON.orange },
].map((s) => ({ ...s, map: s.map.toUpperCase() }));

/** HUD labels, one per stop. */
export const STOP_LABELS = STOPS.map((s) => s.label);
