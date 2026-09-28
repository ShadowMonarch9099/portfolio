export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint: applies the saved theme (or the system theme) so
 * there is no flash, and flags whether entrance animations may run.
 */
const script = `(() => {
  const d = document.documentElement;
  let t = null;
  try { t = localStorage.getItem("${THEME_STORAGE_KEY}"); } catch (e) {}
  const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  d.classList.toggle("dark", dark);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) d.classList.add("motion-ok");
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
