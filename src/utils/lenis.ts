import type Lenis from "lenis";

// The page's Lenis instance, so overlays (the map, the skills wheel) can glide
// to a section the same way anchor links do. Null before the intro lifts and
// with reduced motion; callers fall back to a plain scroll.
let current: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  current = lenis;
};

export const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  if (current) current.scrollTo(target, { offset: -24, duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Stop or restart smooth scrolling while an overlay covers the page. */
export const pauseScroll = (paused: boolean) => {
  document.documentElement.style.overflow = paused ? "hidden" : "";
  if (paused) current?.stop();
  else current?.start();
};
