import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";

const TARGETS = "a, button, [data-cursor-target]";
const CORNER = 12; // bracket arm length
const BOX = 18; // half-size of the resting square
const PAD = 6; // gap between a framed element and its brackets

type Point = { x: number; y: number };

// Brackets around the dot at rest: top-left, top-right, bottom-right, bottom-left.
const REST: Point[] = [
  { x: -BOX, y: -BOX },
  { x: BOX - CORNER, y: -BOX },
  { x: BOX - CORNER, y: BOX - CORNER },
  { x: -BOX, y: BOX - CORNER },
];

const BORDERS = [
  "border-l-[3px] border-t-[3px]",
  "border-r-[3px] border-t-[3px]",
  "border-b-[3px] border-r-[3px]",
  "border-b-[3px] border-l-[3px]",
];

// Target cursor: a dot inside four spinning corner brackets. Over a link or
// button the spin stops and the brackets jump out to frame it. The system
// cursor stays visible; this is decoration only.
const Cursor = () => {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const [corners, setCorners] = useState<Point[]>(REST);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rotate = useMotionValue(0);
  const spin = useRef<AnimationPlaybackControls | null>(null);
  const target = useRef<Element | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(finePointer.matches && !reduce);
    update();
    finePointer.addEventListener("change", update);
    return () => finePointer.removeEventListener("change", update);
  }, [reduce]);

  const startSpin = useCallback(() => {
    spin.current?.stop();
    const from = rotate.get() % 360;
    rotate.set(from);
    spin.current = animate(rotate, from + 360, {
      duration: 2,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
  }, [rotate]);

  const stopSpin = useCallback(() => {
    spin.current?.stop();
    const current = rotate.get() % 360;
    rotate.set(current);
    spin.current = animate(rotate, current > 180 ? 360 : 0, { duration: 0.2, ease: "easeOut" });
  }, [rotate]);

  // Bracket positions relative to the cursor, framing the current target.
  const frameTarget = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = target.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = x.get();
      const py = y.get();
      setCorners([
        { x: r.left - PAD - px, y: r.top - PAD - py },
        { x: r.right + PAD - CORNER - px, y: r.top - PAD - py },
        { x: r.right + PAD - CORNER - px, y: r.bottom + PAD - CORNER - py },
        { x: r.left - PAD - px, y: r.bottom + PAD - CORNER - py },
      ]);
    });
  }, [x, y]);

  const setTarget = useCallback(
    (next: Element | null) => {
      if (next === target.current) return;
      target.current = next;
      if (next) {
        setLocked(true);
        stopSpin();
        frameTarget();
      } else {
        setLocked(false);
        setCorners(REST);
        startSpin();
      }
    },
    [frameTarget, startSpin, stopSpin]
  );

  useEffect(() => {
    if (!enabled) return;
    startSpin();

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      if (target.current) frameTarget();
    };
    const onOver = (e: PointerEvent) => {
      setTarget((e.target as Element | null)?.closest?.(TARGETS) ?? null);
    };
    const onLeaveWindow = (e: PointerEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };
    // Scrolling moves elements under a still pointer.
    const onScroll = () => {
      const under = document.elementFromPoint(x.get(), y.get());
      setTarget(under?.closest(TARGETS) ?? null);
      if (target.current) frameTarget();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onLeaveWindow);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      spin.current?.stop();
      cancelAnimationFrame(frame.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onLeaveWindow);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, x, y, frameTarget, setTarget, startSpin]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, rotate, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[90] h-0 w-0 transition-opacity duration-200"
    >
      <span className="absolute left-0 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
      {corners.map((corner, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ x: corner.x, y: corner.y }}
          transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.6 }}
          className={`absolute left-0 top-0 h-3 w-3 transition-colors duration-200 ${BORDERS[i]} ${
            locked ? "border-volt" : "border-paper"
          }`}
        />
      ))}
    </motion.div>
  );
};

export default Cursor;
