import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { scrollToSection } from "../../utils/lenis";
import { onTravel, setTravelListening } from "../../utils/travel";
import { CHAPTERS, ChapterCard } from "../atoms/SectionHeader";

// Fast travel, like starting a chapter in RDR2: the screen fades to black, the
// section's chapter card holds for a second, and it fades out on the section.
// Only for jumps (menu, navbar, map), never ordinary scrolling. Any key or
// click skips it. With reduced motion it's a plain glide.
const FADE_IN_MS = 280;
const HOLD_MS = 1100;

const ChapterTravel = () => {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const jumped = useRef(false);

  useEffect(() => {
    setTravelListening(!reduce);
    return () => setTravelListening(false);
  }, [reduce]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    const off = onTravel((id) => {
      if (!CHAPTERS[id]) return scrollToSection(id);
      clear();
      jumped.current = false;
      setCurrent(id);
      // Behind the black, the page jumps straight there.
      timers.current.push(
        window.setTimeout(() => {
          scrollToSection(id, true);
          jumped.current = true;
        }, FADE_IN_MS),
        window.setTimeout(() => setCurrent(null), FADE_IN_MS + HOLD_MS)
      );
    });
    return () => {
      off();
      clear();
    };
  }, []);

  // Any key or click skips the card.
  useEffect(() => {
    if (!current) return;
    const skip = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      if (!jumped.current) scrollToSection(current, true);
      setCurrent(null);
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [current]);

  const chapter = current ? CHAPTERS[current] : null;
  return (
    <AnimatePresence>
      {chapter && (
        <motion.div
          key="chapter"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          transition={{ duration: FADE_IN_MS / 1000 }}
          className="fixed inset-0 z-[96] flex items-center justify-center bg-ink px-6"
        >
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }}>
            <ChapterCard {...chapter} />
          </motion.div>
          <span className="absolute bottom-8 left-6 font-fellsc text-[13px] tracking-[0.14em] text-paper/50 sm:left-10">
            Fast travel
          </span>
          <span className="absolute bottom-8 right-6 flex items-center gap-2.5 font-fellsc text-[13px] tracking-[0.14em] text-paper/60 sm:right-10">
            Skip
            <kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-[5px] border-[1.6px] border-paper/80 px-1.5 font-mono text-[11px] font-bold">
              Esc
            </kbd>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChapterTravel;
