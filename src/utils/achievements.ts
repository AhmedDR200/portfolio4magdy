import { useSyncExternalStore } from "react";

import type { IconName } from "../components/atoms/Icon";
import { showToast } from "./toast";

export type TAchievement = { id: string; title: string; ar: string; icon: IconName; secret?: boolean };

// Every badge points at something on the site, so collecting them is a tour.
export const ACHIEVEMENTS: TAchievement[] = [
  { id: "lights-out", title: "Lights out", ar: "قطعت الكهربا", icon: "bulb-off" },
  { id: "x-ray", title: "X-ray vision", ar: "شفت الموقع من جوّه", icon: "eye" },
  { id: "hired", title: "Hired?", ar: "حمّلت الـ CV", icon: "document" },
  { id: "first-sale", title: "First sale", ar: "عملت بيعة في ديمو بيعة", icon: "receipt" },
  { id: "trail-rider", title: "Trail rider", ar: "وصلت لآخر الطريق · 200 OK", icon: "horseshoe" },
  { id: "outlaw", title: "Outlaw", ar: "وصلت لصفحة مش موجودة", icon: "hat" },
  { id: "subscriber", title: "Subscriber", ar: "دوست اشترك في القناة", icon: "bell" },
  { id: "scaled-out", title: "Scaled out", ar: "شغّلت ١٢ pod بالسكرول", icon: "crates" },
  { id: "gunslinger", title: "Gunslinger", ar: "استخدمت عجلة المهارات", icon: "cylinder" },
  { id: "fast-traveler", title: "Fast traveler", ar: "سافرت بالخريطة", icon: "compass" },
  { id: "case-closed", title: "Case closed", ar: "فتحت ٣ case studies", icon: "magnifier" },
  { id: "old-school", title: "Old school", ar: "عرفت الكود السري", icon: "keyhole", secret: true },
];

// Saved in the visitor's browser only. Storage can be blocked; then badges
// last for the visit.
const KEY = "achievements";
const CASES_KEY = "achievements-cases";

const readList = (key: string): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
const writeList = (key: string, list: string[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Ignored: see above.
  }
};

let unlocked: string[] = readList(KEY).filter((id) => ACHIEVEMENTS.some((a) => a.id === id));
const listeners = new Set<() => void>();

export const unlock = (id: string) => {
  const achievement = ACHIEVEMENTS.find((a) => a.id === id);
  if (!achievement || unlocked.includes(id)) return;
  unlocked = [...unlocked, id];
  writeList(KEY, unlocked);
  listeners.forEach((listener) => listener());

  const count = `${unlocked.length} / ${ACHIEVEMENTS.length}`;
  showToast({
    icon: achievement.icon,
    kicker: achievement.secret ? "Secret achievement" : "Achievement unlocked",
    title: achievement.title,
    ar: achievement.ar,
    tone: achievement.secret ? "paper" : "volt",
    meta: count,
  });
  if (unlocked.length === ACHIEVEMENTS.length) {
    showToast({
      icon: "star",
      kicker: `All ${ACHIEVEMENTS.length} unlocked`,
      title: "Legend of the West",
      ar: "خلّصت البورتفوليو ١٠٠٪ — كلّمني بقى",
      tone: "legend",
    });
  }
};

/** "Case closed" needs three different case studies opened. */
export const noteCaseStudy = (name: string) => {
  const seen = readList(CASES_KEY);
  if (!seen.includes(name)) writeList(CASES_KEY, [...seen, name]);
  if (new Set([...seen, name]).size >= 3) unlock("case-closed");
};

/** Clears every badge (the journal's reset link). */
export const resetAchievements = () => {
  unlocked = [];
  writeList(KEY, []);
  writeList(CASES_KEY, []);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useUnlocked = () => useSyncExternalStore(subscribe, () => unlocked);
