import type { Variants } from "framer-motion";

// easeOutCubic: the intro curtain and hero reveal.
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1];
// Close to GSAP's power3.inOut: letter reveals.
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

export const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
  },
});

// Show the intro once per browser session, and never with reduced motion.
const INTRO_KEY = "intro-seen";

export const shouldPlayIntro = (): boolean => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) === null;
  } catch {
    return true;
  }
};

export const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage blocked: the intro may replay, which is harmless */
  }
};
