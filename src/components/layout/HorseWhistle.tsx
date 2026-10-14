import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Horse, { HORSE_FRAMES } from "../atoms/Horse";

// Press H (or "Whistle" in the menu): a two-note whistle, made with the Web
// Audio API (no sound file), then a real horse races right to left across the
// bottom of the screen. With reduced motion there's only the whistle.

const WHISTLE_EVENT = "horse:whistle";
export const whistle = () => window.dispatchEvent(new Event(WHISTLE_EVENT));

const RIDE_S = 1.7;

const playWhistle = () => {
  try {
    const ctx = new AudioContext();
    const note = (start: number, from: number, to: number, length: number) => {
      const t = ctx.currentTime + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(from, t);
      osc.frequency.exponentialRampToValueAtTime(to, t + length);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + length + 0.02);
    };
    note(0, 1500, 2300, 0.16);
    note(0.22, 1700, 2650, 0.28);
    window.setTimeout(() => ctx.close(), 1000);
  } catch {
    // No audio (blocked or unsupported): the horse still comes.
  }
};

const HorseWhistle = () => {
  const reduce = useReducedMotion();
  const [riding, setRiding] = useState(false);
  const [frame, setFrame] = useState(0);
  const busy = useRef(false);

  const call = useCallback(() => {
    if (busy.current) return;
    playWhistle();
    if (reduce) return;
    busy.current = true;
    setRiding(true);
  }, [reduce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "h" || e.key === "H") call();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(WHISTLE_EVENT, call);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(WHISTLE_EVENT, call);
    };
  }, [call]);

  // The gallop: a new frame every 70 ms while the horse is out.
  useEffect(() => {
    if (!riding) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % HORSE_FRAMES), 70);
    return () => window.clearInterval(id);
  }, [riding]);

  return (
    <AnimatePresence>
      {riding && (
        <motion.div
          key="horse"
          aria-hidden="true"
          initial={{ x: "100vw" }}
          animate={{ x: "-260px" }}
          transition={{ duration: RIDE_S, ease: "linear", delay: 0.3 }}
          onAnimationComplete={() => {
            busy.current = false;
            setRiding(false);
          }}
          className="pointer-events-none fixed bottom-3 left-0 z-[62] flex items-end"
        >
          <Horse frame={frame} flip className="h-[110px] w-[176px] text-volt sm:h-[150px] sm:w-[240px]" />
          {/* Dust kicked up behind (to the right, since it runs left). */}
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="mb-1 rounded-full bg-volt blur-[1px]"
              style={{ width: 12 - i * 2, height: 12 - i * 2, marginLeft: 8, opacity: 0.4 - i * 0.07 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HorseWhistle;
