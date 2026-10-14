import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { skillGroups } from "../../constants";
import { unlock } from "../../utils/achievements";
import { pauseScroll, scrollToSection } from "../../utils/lenis";
import { EASE_OUT_EXPO } from "../../utils/motion";

// Hold Tab for a weapon wheel of skill groups, like the game. Point (or use
// the arrows) to pick, let go to "equip": the page goes to Skills and lights
// that row. A quick Tab still moves focus as usual; only a hold opens it.
// From the menu (or on touch) it stays open until a slice is tapped.

export const SKILL_HIGHLIGHT_EVENT = "skills:highlight";

const HOLD_MS = 280;
const SIZE = 640;
const C = SIZE / 2;
const R = 300;
const r = 128;
const SLICE = 360 / skillGroups.length;

const polar = (radius: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)];
};

const slicePath = (i: number, outer: number) => {
  const a0 = -90 - SLICE / 2 + i * SLICE + 0.8;
  const a1 = a0 + SLICE - 1.6;
  const [x0, y0] = polar(outer, a0);
  const [x1, y1] = polar(outer, a1);
  const [x2, y2] = polar(r, a1);
  const [x3, y3] = polar(r, a0);
  return `M${x0},${y0} A${outer},${outer} 0 0 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 0 0 ${x3},${y3} Z`;
};

/** Which slice a point is in, by its angle around the centre. */
const sliceAt = (x: number, y: number) => {
  const deg = (Math.atan2(y, x) * 180) / Math.PI + 90 + SLICE / 2;
  return Math.floor((((deg % 360) + 360) % 360) / SLICE);
};

type Props = { open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> };

const SkillWheel = ({ open, onOpenChange }: Props) => {
  const [selected, setSelected] = useState(1);
  const held = useRef(false);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const wheel = useRef<HTMLDivElement>(null);

  const equip = useCallback(
    (index: number) => {
      onOpenChange(false);
      held.current = false;
      unlock("gunslinger");
      window.setTimeout(() => scrollToSection("skills"), 200);
      window.setTimeout(() => window.dispatchEvent(new CustomEvent(SKILL_HIGHLIGHT_EVENT, { detail: index })), 900);
    },
    [onOpenChange]
  );

  useEffect(() => {
    let timer = 0;
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (held.current) {
          e.preventDefault();
          return;
        }
        if (!e.repeat && !timer) {
          timer = window.setTimeout(() => {
            held.current = true;
            onOpenChange(true);
          }, HOLD_MS);
        }
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        held.current = false;
        onOpenChange(false);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") setSelected((s) => (s + 1) % skillGroups.length);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") setSelected((s) => (s - 1 + skillGroups.length) % skillGroups.length);
      else if (e.key === "Enter") equip(selectedRef.current);
      else return;
      e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      window.clearTimeout(timer);
      timer = 0;
      if (held.current) {
        e.preventDefault();
        equip(selectedRef.current);
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [open, onOpenChange, equip]);

  useEffect(() => {
    if (!open) return;
    pauseScroll(true);
    return () => pauseScroll(false);
  }, [open]);

  const onPointerMove = (e: React.PointerEvent) => {
    const box = wheel.current?.getBoundingClientRect();
    if (!box) return;
    const x = e.clientX - (box.left + box.width / 2);
    const y = e.clientY - (box.top + box.height / 2);
    // Ignore the hole in the middle.
    if (Math.hypot(x, y) > (box.width / SIZE) * (r - 10)) setSelected(sliceAt(x, y));
  };

  const group = skillGroups[selected];
  const others = group.items.filter((item) => !group.daily.includes(item));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="wheel"
          role="dialog"
          aria-modal="true"
          aria-label="Skill wheel"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onPointerMove={onPointerMove}
          onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
          className="fixed inset-0 z-[88] flex flex-col items-center justify-center gap-6 bg-ink/80 px-4 text-paper backdrop-blur-md"
        >
          <motion.div
            ref={wheel}
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="relative aspect-square w-[min(640px,92vw,78vh)]"
          >
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full">
              {skillGroups.map((g, i) => {
                const on = i === selected;
                const mid = -90 + i * SLICE;
                const [lx, ly] = polar((R + r) / 2 + (on ? 7 : 0), mid);
                return (
                  <g
                    key={g.title}
                    role="button"
                    aria-label={g.title}
                    aria-pressed={on}
                    onClick={() => (on ? equip(i) : setSelected(i))}
                    className="cursor-pointer"
                    data-cursor-target
                  >
                    <path
                      d={slicePath(i, on ? R + 14 : R)}
                      className={on ? "fill-frost stroke-frost" : "fill-graphite/95 stroke-paper/15"}
                      strokeWidth="1.5"
                    />
                    <text x={lx} y={ly - 8} textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="19" className={on ? "fill-ink" : "fill-paper"}>
                      {g.title.toUpperCase()}
                    </text>
                    <text x={lx} y={ly + 14} textAnchor="middle" fontFamily="Rakkas, serif" fontSize="15" className={on ? "fill-ink" : "fill-smoke"}>
                      {g.titleAr}
                    </text>
                    <text x={lx} y={ly + 32} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10.5" className={on ? "fill-ink" : "fill-smoke"}>
                      {g.items.length} tools
                    </text>
                  </g>
                );
              })}
              <circle cx={C} cy={C} r={r - 10} className="fill-ink stroke-paper/15" strokeWidth="1.5" />
            </svg>

            <div className="pointer-events-none absolute left-1/2 top-1/2 flex w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center">
              <span className="text-[10px] uppercase tracking-[0.16em] text-smoke">Equip</span>
              <span className="font-display text-[clamp(20px,4.6vw,32px)] uppercase leading-none text-frost">{group.title}</span>
              {group.daily.length > 0 && (
                <span className="text-[clamp(10px,1.8vw,12px)] leading-snug">{group.daily.join(" · ")}</span>
              )}
              {others.length > 0 && (
                <span className="hidden text-[clamp(9px,1.6vw,11px)] leading-snug text-smoke sm:block">
                  {group.daily.length ? "+ " : ""}
                  {others.join(", ")}
                </span>
              )}
            </div>
          </motion.div>

          <p className="m-0 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[12px] uppercase tracking-[0.1em] text-mist">
            <span className="hidden items-center gap-2 md:flex">
              <kbd className="rounded border border-paper/40 border-b-[3px] px-2 py-0.5 font-mono">Tab</kbd> Hold · point · let go
            </span>
            <span className="md:hidden">Tap a slice, then tap it again</span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-paper/25 px-3.5 py-2 hover:border-frost hover:text-frost md:hidden"
            >
              Close
            </button>
            <span lang="ar" className="font-arabic text-[19px] normal-case tracking-normal text-frost">
              اختار سلاحك
            </span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkillWheel;
