import { work } from "@/data/profile";

/** Labels for every stop on the journey, in the same order as scene/world.ts WAYPOINTS. */
export const STOP_LABELS = [
  "Start",
  "Origin",
  "Principles",
  ...work.map((w) => w.title),
  "Experience",
  "Loadout",
  "Off the clock",
  "Contact",
];

/** Chapters shown in the menu. `stop` is the index of the stop each chapter starts at. */
export const CHAPTERS = [
  { id: "origin", label: "Origin", note: "How I got here", stop: 1 },
  { id: "principles", label: "Principles", note: "What I care about", stop: 2 },
  { id: "work", label: "Work", note: `${work.length} case studies`, stop: 3 },
  { id: "experience", label: "Experience", note: "Internship and education", stop: 3 + work.length },
  { id: "loadout", label: "Loadout", note: "Tools and skills", stop: 4 + work.length },
  { id: "off-clock", label: "Off the clock", note: "Gaming and achievements", stop: 5 + work.length },
  { id: "contact", label: "Contact", note: "Say hello", stop: 6 + work.length },
];
