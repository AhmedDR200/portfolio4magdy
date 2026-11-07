import { useSyncExternalStore } from 'react';

import { ACHIEVEMENTS, useUnlocked } from './achievements';

// The lab's honor: purity, in percent. You arrive at 24% (crude); every
// achievement is an equal share of the next 75 points, and staying for the
// end credits adds the last 0.1, so a visitor who finds everything and reads
// to the end reaches 99.1% (the batch that was never quite 100). Derived from
// the achievements, so there is nothing more to save except the credits flag.
export const PURITY_START = 24;
export const PURITY_MAX = 99.1;

const CREDITS_KEY = 'purity-credits';
let credits = (() => {
  try {
    return localStorage.getItem(CREDITS_KEY) === '1';
  } catch {
    return false;
  }
})();
const listeners = new Set<() => void>();

/** The visitor stayed for the end credits: +0.1. */
export const markCredits = () => {
  if (credits) return;
  credits = true;
  try {
    localStorage.setItem(CREDITS_KEY, '1');
  } catch {
    // Storage blocked: it counts for this visit.
  }
  listeners.forEach(listener => listener());
};

export const resetCredits = () => {
  credits = false;
  try {
    localStorage.removeItem(CREDITS_KEY);
  } catch {
    // Ignored.
  }
  listeners.forEach(listener => listener());
};

// Contamination: spam-clicking or rushing the page spoils the batch. It lasts
// for the visit only (session storage), and each action counts once.
const DIRT_KEY = 'purity-dirt';
type Dirt = { points: number; actions: string[] };
let dirt: Dirt = (() => {
  try {
    const value = JSON.parse(sessionStorage.getItem(DIRT_KEY) ?? '{}');
    return {
      points: Number(value.points) || 0,
      actions: Array.isArray(value.actions) ? value.actions : [],
    };
  } catch {
    return { points: 0, actions: [] };
  }
})();

/** Spoils the batch by `points` for this visit. Each `action` counts once; returns whether it did. */
export const contaminate = (points: number, action: string) => {
  if (dirt.actions.includes(action)) return false;
  dirt = { points: dirt.points + points, actions: [...dirt.actions, action] };
  try {
    sessionStorage.setItem(DIRT_KEY, JSON.stringify(dirt));
  } catch {
    // Storage blocked: it counts for this page load.
  }
  listeners.forEach(listener => listener());
  return true;
};

/** The journal's reset link: credits and contamination both go. */
export const resetPurity = () => {
  dirt = { points: 0, actions: [] };
  try {
    sessionStorage.removeItem(DIRT_KEY);
  } catch {
    // Ignored.
  }
  resetCredits();
};

export const purityOf = (earned: number, stayedForCredits: boolean) =>
  Math.round(
    (PURITY_START + earned * (75 / ACHIEVEMENTS.length) + (stayedForCredits ? 0.1 : 0)) * 10
  ) / 10;

export const PURITY_LEVELS = [
  { at: 0, name: 'Crude', ar: 'خام' },
  { at: 40, name: 'Refined', ar: 'مكرّر' },
  { at: 90, name: 'Reagent grade', ar: 'درجة مخبرية' },
] as const;

export const purityLevel = (purity: number) =>
  [...PURITY_LEVELS].reverse().find(l => purity >= l.at) ?? PURITY_LEVELS[0];

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Purity in percent, one decimal: 24 to 99.1 (less while the batch is contaminated). */
export const usePurity = () => {
  const earned = useUnlocked().length;
  const stayed = useSyncExternalStore(subscribe, () => credits);
  const spoiled = useSyncExternalStore(subscribe, () => dirt).points;
  return Math.max(0, Math.round((purityOf(earned, stayed) - spoiled) * 10) / 10);
};
