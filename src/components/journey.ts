/**
 * Which home-page stop is currently in view, as a tiny external store so the
 * HUD and menu can subscribe with useSyncExternalStore.
 */
let index = 0;
const listeners = new Set<() => void>();

export const journey = {
  get: () => index,
  set(next: number) {
    if (next === index) return;
    index = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
