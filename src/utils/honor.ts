import { useSyncExternalStore } from "react";

import { showToast } from "./toast";

// Honor, like the game: good deeds raise it, mischief lowers it. It runs from
// −5 to +5 and is saved in the visitor's browser. Nothing here is serious.
export const HONOR_MIN = -5;
export const HONOR_MAX = 5;

const KEY = "honor";
const ONCE_KEY = "honor-once";

const read = () => {
  try {
    const n = Number(localStorage.getItem(KEY));
    return Number.isFinite(n) ? Math.max(HONOR_MIN, Math.min(HONOR_MAX, Math.round(n))) : 0;
  } catch {
    return 0;
  }
};

// Each action counts once per visit, so a button can't be farmed for honor.
const counted = new Set<string>(
  (() => {
    try {
      return JSON.parse(sessionStorage.getItem(ONCE_KEY) ?? "[]") as string[];
    } catch {
      return [];
    }
  })()
);

export type HonorChange = { delta: number; value: number; at: number };

let honor = read();
let lastChange: HonorChange | null = null;
const listeners = new Set<() => void>();

/**
 * Change honor for an action; `action` names it so it only counts once per
 * visit. Returns whether it counted.
 */
export const changeHonor = (delta: number, action: string) => {
  if (counted.has(action)) return false;
  counted.add(action);
  try {
    sessionStorage.setItem(ONCE_KEY, JSON.stringify([...counted]));
  } catch {
    // Storage blocked: it still counts once for this page load.
  }

  const before = honor;
  honor = Math.max(HONOR_MIN, Math.min(HONOR_MAX, honor + delta));
  try {
    localStorage.setItem(KEY, String(honor));
  } catch {
    // Ignored: honor then lasts for the visit.
  }
  lastChange = { delta, value: honor, at: Date.now() };
  listeners.forEach((listener) => listener());

  if (honor === HONOR_MAX && before < HONOR_MAX) {
    showToast({ icon: "star", kicker: "Honor maxed", title: "Sheriff", ar: "شريف المدينة — انت من أهل الخير", tone: "legend" });
  } else if (honor === HONOR_MIN && before > HONOR_MIN) {
    showToast({ icon: "hat", kicker: "Honor at rock bottom", title: "Wanted", ar: "انت مطلوب! ارجع عن طريق الشر", tone: "paper" });
  }
  return true;
};

/** Back to neutral (the journal's reset link). */
export const resetHonor = () => {
  honor = 0;
  lastChange = null;
  counted.clear();
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(ONCE_KEY);
  } catch {
    // Ignored.
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useHonor = () => useSyncExternalStore(subscribe, () => honor);
export const useLastHonorChange = () => useSyncExternalStore(subscribe, () => lastChange);
