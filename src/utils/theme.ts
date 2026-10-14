import { useSyncExternalStore } from "react";

// Dark (Ambarino) or light (Wanted). A visitor's choice is saved; until they
// choose, it follows the system. index.html sets it before the first paint,
// so there's no flash.
export type Theme = "dark" | "light";
const KEY = "theme";
const COLORS: Record<Theme, string> = { dark: "#0E1916", light: "#E9E5DC" };

const saved = (): Theme | null => {
  try {
    const value = localStorage.getItem(KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
};
const system = window.matchMedia("(prefers-color-scheme: light)");
const listeners = new Set<() => void>();

let theme: Theme = saved() ?? (system.matches ? "light" : "dark");

const apply = (next: Theme) => {
  theme = next;
  document.documentElement.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLORS[next]);
  listeners.forEach((listener) => listener());
};

system.addEventListener("change", (e) => {
  if (!saved()) apply(e.matches ? "light" : "dark");
});

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() !== "l" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  if ((e.target as HTMLElement | null)?.closest?.("input, textarea, select, [contenteditable='true']")) return;
  toggleTheme();
});

export function toggleTheme() {
  const next: Theme = theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Storage blocked: the choice lasts for the visit.
  }
  apply(next);
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useTheme = () => useSyncExternalStore(subscribe, () => theme);
