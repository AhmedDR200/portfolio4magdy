import { useSyncExternalStore } from "react";

import { unlock } from "./achievements";
import { showToast } from "./toast";

// Bonding with the horse, like RDR2: every whistle builds it, over four
// levels, and at the last one the visitor names the horse. Saved in this
// browser only.

export const BOND_LEVELS = [
  { level: 1, at: 0, en: "Strangers", ar: "لسه بنتعرف" },
  { level: 2, at: 3, en: "Friends", ar: "بقينا صحاب" },
  { level: 3, at: 8, en: "Trusted", ar: "واخد عليك" },
  { level: 4, at: 15, en: "Bonded", ar: "عِشرة عمر" },
] as const;

export const NAME_IDEAS = ["برق", "نجمة", "سلطان", "ريح"];

type Bond = { whistles: number; name: string };
const KEY = "horse-bond";

const read = (): Bond => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return { whistles: Number(value.whistles) || 0, name: typeof value.name === "string" ? value.name.slice(0, 16) : "" };
  } catch {
    return { whistles: 0, name: "" };
  }
};

let bond = read();
const listeners = new Set<() => void>();
const save = (next: Bond) => {
  bond = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(bond));
  } catch {
    // Storage blocked: the bond lasts for the visit.
  }
  listeners.forEach((listener) => listener());
};

export const levelOf = (whistles: number) => [...BOND_LEVELS].reverse().find((l) => whistles >= l.at) ?? BOND_LEVELS[0];

/** One more whistle. Announces a new level; a named horse says it's here. */
export const addWhistle = (): number => {
  const before = levelOf(bond.whistles);
  save({ ...bond, whistles: bond.whistles + 1 });
  const after = levelOf(bond.whistles);
  if (after.level > before.level) {
    showToast({ icon: "horseshoe", kicker: "Bonding increased", title: `Level ${after.level} · ${after.en}`, ar: after.ar, tone: "frost" });
    if (after.level === 4) unlock("bonded");
  } else if (bond.name) {
    showToast({ icon: "horseshoe", kicker: "Your horse", title: `${bond.name} is here`, ar: `${bond.name} وصل`, tone: "paper" });
  }
  return after.level;
};

export const nameHorse = (name: string) => save({ ...bond, name: name.trim().slice(0, 16) });

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useBond = () => useSyncExternalStore(subscribe, () => bond);
