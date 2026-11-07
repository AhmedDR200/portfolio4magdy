import { useCallback, useSyncExternalStore } from 'react';

import type { IconName } from '../components/atoms/Icon';
import { currentSkin, useSkin, type Skin } from './theme';
import { showToast } from './toast';

export type TAchievement = {
  id: string;
  title: string;
  ar: string;
  icon: IconName;
  secret?: boolean;
};

// Every badge points at something on the site, so collecting them is a tour.
export const ACHIEVEMENTS: TAchievement[] = [
  { id: 'lights-out', title: 'Lights out', ar: 'قطعت الكهربا', icon: 'bulb-off' },
  { id: 'x-ray', title: 'X-ray vision', ar: 'شفت الموقع من جوّه', icon: 'eye' },
  { id: 'hired', title: 'Hired?', ar: 'حمّلت الـ CV', icon: 'document' },
  { id: 'first-sale', title: 'First sale', ar: 'عملت بيعة في ديمو بيعة', icon: 'receipt' },
  { id: 'trail-rider', title: 'Trail rider', ar: 'وصلت لآخر الطريق · 200 OK', icon: 'horseshoe' },
  { id: 'outlaw', title: 'Outlaw', ar: 'وصلت لصفحة مش موجودة', icon: 'hat' },
  { id: 'subscriber', title: 'Subscriber', ar: 'دوست اشترك في القناة', icon: 'bell' },
  { id: 'scaled-out', title: 'Scaled out', ar: 'شغّلت ١٢ pod بالسكرول', icon: 'crates' },
  { id: 'gunslinger', title: 'Gunslinger', ar: 'استخدمت عجلة المهارات', icon: 'cylinder' },
  { id: 'fast-traveler', title: 'Fast traveler', ar: 'سافرت بالخريطة', icon: 'compass' },
  { id: 'case-closed', title: 'Case closed', ar: 'فتحت ٣ case studies', icon: 'magnifier' },
  { id: 'bonded', title: 'Bonded', ar: 'بقيت عِشرة عمر مع حصانك', icon: 'horseshoe' },
  { id: 'old-school', title: 'Old school', ar: 'عرفت الكود السري', icon: 'keyhole', secret: true },
];

// The lab's copy: in the Breaking Bad skin every achievement is an element of
// the table, with its real atomic number where a pun works (Li, Xe, Cu, Be,
// Rn, Yb, Sc, Tb, Ta, Cs, Ho, Cr) and the board's invented Nf, Notfoundium,
// for the 404 (its "number" is the status code). Same ids, same triggers.
export type LabElement = {
  symbol: string;
  number: number | string;
  title: string;
  ar: string;
  how: string;
};
export const LAB_ELEMENTS: Record<string, LabElement> = {
  'lights-out': {
    symbol: 'Li',
    number: 3,
    title: 'Lights out',
    ar: 'فصلت النور في المعمل',
    how: 'Cut the power (P)',
  },
  'x-ray': {
    symbol: 'Xe',
    number: 54,
    title: 'X-ray',
    ar: 'شفت الموقع بالأشعة',
    how: 'Open X-ray mode (X)',
  },
  hired: {
    symbol: 'Cu',
    number: 29,
    title: 'Curriculum',
    ar: 'سحبت الـ CV',
    how: 'Download the CV',
  },
  'first-sale': {
    symbol: 'Be',
    number: 4,
    title: 'Bee3a',
    ar: 'بعت أول بيعة في ديمو بيعة',
    how: 'Ring up a sale in the Bee3a demo',
  },
  'trail-rider': {
    symbol: 'Rn',
    number: 86,
    title: 'Road trip',
    ar: 'وصّلت الكرافان · 200 OK',
    how: 'Ride to the end of the page: 200 OK',
  },
  outlaw: {
    symbol: 'Nf',
    number: 404,
    title: 'Notfoundium',
    ar: 'لقيت صفحة مش موجودة',
    how: "Land on a page that doesn't exist",
  },
  subscriber: {
    symbol: 'Yb',
    number: 70,
    title: 'YouTube',
    ar: 'اشتركت في القناة',
    how: 'Subscribe to the channel',
  },
  'scaled-out': {
    symbol: 'Sc',
    number: 21,
    title: 'Scaled out',
    ar: 'شغّلت ١٢ pod بالسكرول',
    how: 'Scroll until 12 pods are running',
  },
  gunslinger: {
    symbol: 'Tb',
    number: 65,
    title: 'Tab',
    ar: 'فتحت اختيار المهارات',
    how: 'Hold Tab and pick a skill',
  },
  'fast-traveler': {
    symbol: 'Ta',
    number: 73,
    title: 'The table',
    ar: 'سافرت بجدول العناصر',
    how: 'Travel with the table (M)',
  },
  'case-closed': {
    symbol: 'Cs',
    number: 55,
    title: 'Case closed',
    ar: 'فتحت ٣ case studies',
    how: 'Open three case studies',
  },
  bonded: {
    symbol: 'Ho',
    number: 67,
    title: 'Honk',
    ar: 'زمّرت لحد الكرافان ما عرفك',
    how: 'Honk the horn 15 times (H)',
  },
  'old-school': {
    symbol: 'Cr',
    number: 24,
    title: 'Cracked',
    ar: 'فكّيت الشفرة السرية',
    how: 'A code every gamer knows',
  },
};

export type AchievementCopy = {
  title: string;
  ar: string;
  /** How to earn it (lab only). */
  how?: string;
  /** The element tile (lab only). */
  tile?: { symbol: string; number: number | string };
};

/** An achievement's title, Arabic line and (in the lab) tile, for a skin (default: the current one). */
export const copyOf = (a: TAchievement, skin: Skin = currentSkin()): AchievementCopy => {
  const lab = skin === 'bb' ? LAB_ELEMENTS[a.id] : undefined;
  if (!lab) return { title: a.title, ar: a.ar };
  return {
    title: lab.title,
    ar: lab.ar,
    how: lab.how,
    tile: { symbol: lab.symbol, number: lab.number },
  };
};

/** copyOf for React: re-renders when the skin changes. */
export const useAchievementCopy = () => {
  const skin = useSkin();
  return useCallback((a: TAchievement) => copyOf(a, skin), [skin]);
};

// Saved in the visitor's browser only. Storage can be blocked; then badges
// last for the visit.
const KEY = 'achievements';
const CASES_KEY = 'achievements-cases';

const readList = (key: string): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
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

let unlocked: string[] = readList(KEY).filter(id => ACHIEVEMENTS.some(a => a.id === id));
const listeners = new Set<() => void>();

export const unlock = (id: string) => {
  const achievement = ACHIEVEMENTS.find(a => a.id === id);
  if (!achievement || unlocked.includes(id)) return;
  unlocked = [...unlocked, id];
  writeList(KEY, unlocked);
  listeners.forEach(listener => listener());

  const lab = currentSkin() === 'bb';
  const copy = copyOf(achievement);
  const count = `${unlocked.length} / ${ACHIEVEMENTS.length}`;
  showToast({
    icon: achievement.icon,
    kicker: lab
      ? achievement.secret
        ? 'Secret element'
        : 'Element unlocked'
      : achievement.secret
        ? 'Secret achievement'
        : 'Achievement unlocked',
    title: copy.title,
    ar: copy.ar,
    tone: achievement.secret ? 'paper' : 'frost',
    meta: count,
    tile: copy.tile,
  });
  if (unlocked.length === ACHIEVEMENTS.length) {
    showToast(
      lab
        ? {
            icon: 'star',
            kicker: `All ${ACHIEVEMENTS.length} elements`,
            title: 'Reagent grade',
            ar: 'كمّلت الجدول — كلّمني بقى',
            tone: 'legend',
            tile: { symbol: 'Mg', number: 12 },
          }
        : {
            icon: 'star',
            kicker: `All ${ACHIEVEMENTS.length} unlocked`,
            title: 'Legend of the West',
            ar: 'خلّصت البورتفوليو ١٠٠٪ — كلّمني بقى',
            tone: 'legend',
          }
    );
  }
};

/** "Case closed" needs three different case studies opened. */
export const noteCaseStudy = (name: string) => {
  const seen = readList(CASES_KEY);
  if (!seen.includes(name)) writeList(CASES_KEY, [...seen, name]);
  if (new Set([...seen, name]).size >= 3) unlock('case-closed');
};

/** Clears every badge (the journal's reset link). */
export const resetAchievements = () => {
  unlocked = [];
  writeList(KEY, []);
  writeList(CASES_KEY, []);
  listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useUnlocked = () => useSyncExternalStore(subscribe, () => unlocked);
