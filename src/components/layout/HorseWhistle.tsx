import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { addWhistle, nameHorse, NAME_IDEAS, useBond } from "../../utils/bond";
import Horse, { HORSE_FRAMES } from "../atoms/Horse";

// Press H (or "Whistle" in the menu): a two-note whistle, made with the Web
// Audio API (no sound file), then a real horse races right to left across the
// bottom of the screen. Every whistle builds the bond (utils/bond), and the
// horse comes differently at each level: a trot, a canter, a gallop with
// dust, and at level 4 a full gallop that rears up halfway, after which the
// visitor names it. With reduced motion there's only the whistle.

const WHISTLE_EVENT = "horse:whistle";
export const whistle = () => window.dispatchEvent(new Event(WHISTLE_EVENT));

const RIDES = {
  1: { seconds: 2.6, frameMs: 120, dust: 0 },
  2: { seconds: 2.1, frameMs: 95, dust: 2 },
  3: { seconds: 1.7, frameMs: 70, dust: 5 },
  4: { seconds: 2.6, frameMs: 55, dust: 5 },
} as const;
type Level = keyof typeof RIDES;

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

// In pixels throughout: keyframes can't mix units. At level 4 the horse
// stops a little left of centre, rears up, then carries on.
const rideMotion = (level: Level) => {
  const from = window.innerWidth;
  const off = -260;
  return level === 4
    ? {
        initial: { x: from, rotate: 0 },
        animate: { x: [from, from * 0.42, from * 0.42, from * 0.42, off], rotate: [0, 0, -16, 0, 0] },
        transition: { duration: RIDES[4].seconds, ease: "linear", times: [0, 0.3, 0.44, 0.58, 1], delay: 0.3 },
      }
    : { initial: { x: from }, animate: { x: off }, transition: { duration: RIDES[level].seconds, ease: "linear", delay: 0.3 } };
};

const NameCard = ({ onDone }: { onDone: () => void }) => {
  const [name, setName] = useState(NAME_IDEAS[0]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    nameHorse(name);
    onDone();
  };
  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      aria-label="Name your horse"
      className="torn-2 fixed bottom-5 left-4 z-[63] flex w-[min(360px,calc(100vw-32px))] flex-col gap-3 bg-graphite p-5 text-paper shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] sm:left-8"
    >
      <span className="font-fellsc text-[13px] tracking-[0.14em] text-smoke">Level 4 · Bonded</span>
      <label htmlFor="horse-name" className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-fell text-[26px] leading-tight">Name your horse</span>
        <span lang="ar" className="font-ruqaa text-[20px] text-smoke">
          سمّي حصانك
        </span>
      </label>
      <input
        id="horse-name"
        dir="auto"
        value={name}
        maxLength={16}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        className="h-11 rounded-none border-0 border-b-2 border-paper bg-transparent px-1 font-fell text-[22px] italic text-paper shadow-none outline-none focus:border-frost focus-visible:outline-none"
      />
      <span className="flex flex-wrap gap-2">
        {NAME_IDEAS.map((idea) => (
          <button
            key={idea}
            type="button"
            lang="ar"
            onClick={() => setName(idea)}
            className={`border px-3 py-0.5 font-arabic text-[17px] ${name === idea ? "border-frost text-frost" : "border-paper/30"}`}
          >
            {idea}
          </button>
        ))}
      </span>
      <span className="mt-1 flex items-center gap-4">
        <button type="submit" className="torn flex h-11 items-center bg-frost px-5 font-fellsc text-[16px] tracking-[0.12em] text-ink">
          Saddle up
        </button>
        <button type="button" onClick={onDone} className="font-fellsc text-[14px] tracking-[0.12em] text-smoke hover:text-paper">
          Later
        </button>
      </span>
    </motion.form>
  );
};

const HorseWhistle = () => {
  const reduce = useReducedMotion();
  const bond = useBond();
  const [ride, setRide] = useState<Level | null>(null);
  const [frame, setFrame] = useState(0);
  const [naming, setNaming] = useState(false);
  const busy = useRef(false);

  const call = useCallback(() => {
    if (busy.current) return;
    playWhistle();
    const level = addWhistle() as Level;
    if (reduce) {
      if (level === 4 && !bond.name) setNaming(true);
      return;
    }
    busy.current = true;
    setRide(level);
  }, [reduce, bond.name]);

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

  // The gallop: faster frames the closer the bond.
  useEffect(() => {
    if (!ride) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % HORSE_FRAMES), RIDES[ride].frameMs);
    return () => window.clearInterval(id);
  }, [ride]);

  const done = () => {
    busy.current = false;
    if (ride === 4 && !bond.name) setNaming(true);
    setRide(null);
  };

  const motionProps = ride ? rideMotion(ride) : null;
  return (
    <>
      <AnimatePresence>
        {ride && motionProps && (
          <motion.div
            key="horse"
            aria-hidden="true"
            initial={motionProps.initial}
            animate={motionProps.animate}
            transition={motionProps.transition}
            onAnimationComplete={done}
            style={{ transformOrigin: "30% 100%" }}
            className="pointer-events-none fixed bottom-3 left-0 z-[62] flex items-end"
          >
            <span className="relative">
              {bond.name && ride === 4 && (
                <span lang="ar" dir="auto" className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-arabic text-[22px] text-frost">
                  {bond.name}
                </span>
              )}
              <Horse frame={frame} flip className="h-[110px] w-[176px] text-frost sm:h-[150px] sm:w-[240px]" />
            </span>
            {/* Dust kicked up behind (to the right, since it runs left). */}
            {Array.from({ length: RIDES[ride].dust }, (_, i) => (
              <span
                key={i}
                className="mb-1 rounded-full bg-frost blur-[1px]"
                style={{ width: 12 - i * 2, height: 12 - i * 2, marginLeft: 8, opacity: 0.4 - i * 0.07 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{naming && <NameCard key="name" onDone={() => setNaming(false)} />}</AnimatePresence>
    </>
  );
};

export default HorseWhistle;
