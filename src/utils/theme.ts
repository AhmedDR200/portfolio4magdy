import { useSyncExternalStore } from "react";

// Two choices, kept apart:
//   skin: which world the site lives in. "bb" is the lab (Breaking Bad, the
//         default); "rdr2" is the old frontier (Red Dead).
//   mode: dark or light within that skin. Lab · night / Class · day for bb;
//         Ambarino / Wanted for rdr2.
// A visitor's choices are saved; until they choose, the mode follows the
// system. index.html sets both before the first paint, so there's no flash.
export type Mode = "dark" | "light";
export type Theme = Mode;
export type Skin = "bb" | "rdr2";

const MODE_KEY = "theme";
const SKIN_KEY = "skin";
export const SKINS: Record<Skin, { name: string; nameAr: string; dark: string; light: string }> = {
  bb: { name: "Breaking Bad", nameAr: "الكيميائي", dark: "Lab · night", light: "Class · day" },
  rdr2: { name: "Red Dead", nameAr: "الغرب", dark: "Ambarino", light: "Wanted" },
};
const COLORS: Record<Skin, Record<Mode, string>> = {
  bb: { dark: "#0A100D", light: "#EDF0E7" },
  rdr2: { dark: "#0E1916", light: "#E9E5DC" },
};

const savedMode = (): Mode | null => {
  try {
    const value = localStorage.getItem(MODE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
};
const savedSkin = (): Skin | null => {
  try {
    const value = localStorage.getItem(SKIN_KEY);
    return value === "bb" || value === "rdr2" ? value : null;
  } catch {
    return null;
  }
};
const system = window.matchMedia("(prefers-color-scheme: light)");
const listeners = new Set<() => void>();

let mode: Mode = savedMode() ?? (system.matches ? "light" : "dark");
let skin: Skin = savedSkin() ?? "bb";

const apply = () => {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.skin = skin;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLORS[skin][mode]);
  listeners.forEach((listener) => listener());
};

system.addEventListener("change", (e) => {
  if (savedMode()) return;
  mode = e.matches ? "light" : "dark";
  apply();
});

const typing = (e: KeyboardEvent) =>
  Boolean((e.target as HTMLElement | null)?.closest?.("input, textarea, select, [contenteditable='true']"));

window.addEventListener("keydown", (e) => {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing(e)) return;
  const key = e.key.toLowerCase();
  if (key === "l") toggleTheme();
  else if (key === "t") toggleSkin();
});

const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the choice lasts for the visit.
  }
};

/** Dark or light, within the current skin (L). */
export function toggleTheme() {
  mode = mode === "dark" ? "light" : "dark";
  save(MODE_KEY, mode);
  apply();
}

export function setSkin(next: Skin) {
  if (next === skin) return;
  skin = next;
  save(SKIN_KEY, skin);
  apply();
}

/** The lab or the frontier (T). */
export function toggleSkin() {
  setSkin(skin === "bb" ? "rdr2" : "bb");
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useTheme = () => useSyncExternalStore(subscribe, () => mode);
export const useSkin = () => useSyncExternalStore(subscribe, () => skin);
/** For code outside React (sounds, timers). */
export const currentSkin = () => skin;
