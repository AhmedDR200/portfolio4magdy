import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { unlock } from "../../utils/achievements";
import { changeHonor } from "../../utils/honor";
import { EASE_OUT_EXPO } from "../../utils/motion";
import Icon from "../atoms/Icon";

type Props = { on: boolean; onChange: Dispatch<SetStateAction<boolean>> };

// The torch's lit circle and the fade to dark around it, in px.
const LIT = 90;
const DARK = 200;

// The next full hour, in Arabic: when the power is "back".
const backAt = () => {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return d.toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" });
};

// «الكهربا قطعت»: a load-shedding joke. The page goes dark and the pointer
// becomes a torch. The darkness ignores the pointer, so everything under it
// still works. P toggles it; Esc or «رجّع النور» brings the lights back.
const PowerCut = ({ on, onChange }: Props) => {
  const reduce = useReducedMotion();
  const dark = useRef<HTMLDivElement>(null);
  // Where the pointer was last, so the torch starts there, not mid-screen.
  const pointer = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      dark.current?.style.setProperty("--x", `${e.clientX}px`);
      dark.current?.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    unlock("lights-out");
    // Leaving the town in the dark for a minute costs a little honor.
    const id = window.setTimeout(() => changeHonor(-1, "power-left-on"), 60_000);
    return () => window.clearTimeout(id);
  }, [on]);

  // P toggles it from anywhere; Esc turns the lights back on.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "p" || e.key === "P") onChange((v) => !v);
      else if (e.key === "Escape") onChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <AnimatePresence>
      {on && (
        <motion.div key="power-cut" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <motion.div
            ref={dark}
            aria-hidden="true"
            // The lights flicker a few times before they die.
            initial={{ opacity: 0 }}
            animate={{ opacity: reduce ? 1 : [0, 0.9, 0.2, 1, 0.5, 1] }}
            transition={{ duration: reduce ? 0 : 0.7, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }}
            className="pointer-events-none fixed inset-0 z-[84]"
            style={
              {
                "--x": `${pointer.current.x}px`,
                "--y": `${pointer.current.y}px`,
                background: `radial-gradient(circle at var(--x) var(--y), rgba(238,242,238,0.07) 0, rgba(5,5,5,0) ${LIT}px, rgba(5,5,5,0.97) ${DARK}px)`,
              } as React.CSSProperties
            }
          />

          <div className="pointer-events-none fixed inset-x-0 top-5 z-[87] flex justify-center px-5">
            <motion.div
              role="status"
              dir="rtl"
              lang="ar"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.7, duration: 0.4, ease: EASE_OUT_EXPO }}
              className="pointer-events-auto flex flex-col items-center gap-1 rounded-[20px] border border-paper/15 bg-ink/90 px-6 py-4 text-center font-bee3a backdrop-blur-md"
            >
              <p className="m-0 flex items-center gap-2.5 font-arabic text-[28px] leading-[1.2] text-frost">
                <Icon name="bulb-off" size={26} />
                الكهربا قطعت
              </p>
              <p className="m-0 text-[13px] text-mist">تخفيف أحمال · راجعة الساعة {backAt()} إن شاء الله</p>
              <p className="m-0 text-[12px] text-smoke">حرّك الكشاف عشان تشوف</p>
              <button
                type="button"
                onClick={() => onChange(false)}
                className="mt-2 rounded-full bg-frost px-4 py-1.5 text-[13px] font-semibold text-ink transition-transform hover:scale-105"
              >
                رجّع النور
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PowerCut;
