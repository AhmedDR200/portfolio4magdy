import type { MouseEvent } from "react";

import { scrollToSection } from "./lenis";

// Fast travel: jumping to a section from the menu, the navbar or the map plays
// its chapter card first (ChapterTravel listens). Without the listener, or
// with reduced motion, it's a plain glide.
const EVENT = "chapter:travel";
let listening = false;

export const setTravelListening = (on: boolean) => {
  listening = on;
};

export const travelTo = (id: string) => {
  if (listening) window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
  else scrollToSection(id);
};

export const onTravel = (handler: (id: string) => void) => {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
};

/** For an <a href="#id"> link: take the jump over from the browser and Lenis. */
export const travelOnClick = (id: string, after?: () => void) => (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  after?.();
  travelTo(id);
};
