import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { skillGroups } from "../../constants";
import { unlock } from "../../utils/achievements";
import { pauseScroll, scrollToSection } from "../../utils/lenis";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { useSkin } from "../../utils/theme";

// Hold Tab for a weapon wheel of skill groups, like the game. Point (or use
// the arrows) to pick, let go to "equip": the page goes to Skills and lights
// that row. A quick Tab still moves focus as usual; only a hold opens it.
// From the menu (or on touch) it stays open until a slice is tapped.
// In the lab the wheel is a selector instead: one element-style tile per group,
// picked the same ways (point or the arrows, let go to equip).

export const SKILL_HIGHLIGHT_EVENT = "skills:highlight";

const HOLD_MS = 280;
const SIZE = 640;
const C = SIZE / 2;
const R = 300;
const r = 128;
const SLICE = 360 / skillGroups.length;
const COLUMNS = 4;

// The lab's tile for each group: two letters, like a symbol.
const GROUP_SYMBOLS: Record<string, string> = {
  Languages: "Lg",
  Backend: "Bk",
  Data: "Da",
  "Real-time": "Rt",
  "Cloud & DevOps": "Cd",
  "AI & automation": "Ai",
  Tools: "Tl",
  "Beyond backend": "Bb",
};

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
  const lab = useSkin() === "bb";
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
      } else if (e.key === "ArrowRight" || (e.key === "ArrowDown" && !lab)) setSelected((s) => (s + 1) % skillGroups.length);
      else if (e.key === "ArrowLeft" || (e.key === "ArrowUp" && !lab)) setSelected((s) => (s - 1 + skillGroups.length) % skillGroups.length);
      // A grid has rows: down and up move a whole row.
      else if (e.key === "ArrowDown") setSelected((s) => (s + COLUMNS) % skillGroups.length);
      else if (e.key === "ArrowUp") setSelected((s) => (s - COLUMNS + skillGroups.length) % skillGroups.length);
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
  }, [open, onOpenChange, equip, lab]);

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
          aria-label={lab ? "Skill selector" : "Skill wheel"}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onPointerMove={lab ? undefined : onPointerMove}
          onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
          className="fixed inset-0 z-[88] flex flex-col items-center justify-center gap-6 bg-ink/80 px-4 text-paper backdrop-blur-md"
        >
          {lab ? (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="flex max-h-[80vh] w-[min(940px,94vw)] flex-col gap-4 overflow-y-auto"
            >
              <p className="m-0 flex items-baseline justify-between font-mono text-[12px] tracking-[0.16em] text-smoke">
                <span>THE STACK · PICK A GROUP</span>
                <span>
                  {selected + 1} / {skillGroups.length}
                </span>
              </p>
              <ul className="m-0 grid list-none grid-cols-2 gap-2.5 p-0 sm:grid-cols-4 sm:gap-3">
                {skillGroups.map((g, i) => {
                  const on = i === selected;
                  return (
                    <li key={g.title} className="flex">
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${g.title}, ${g.items.length} tools`}
                        onClick={() => (on ? equip(i) : setSelected(i))}
                        // A mouse points; a finger taps once to pick and again to equip.
                        onPointerEnter={(e) => e.pointerType === "mouse" && setSelected(i)}
                        data-cursor-target
                        className={`relative flex aspect-[2/1] w-full flex-col items-start justify-between border-2 p-2.5 text-left font-archivo transition-colors sm:aspect-square sm:p-3.5 ${
                          on ? "border-frost bg-frost text-ink" : "border-dim/60 bg-graphite/90 text-paper hover:border-frost"
                        }`}
                      >
                        <span className={`font-mono text-[11px] font-bold leading-none ${on ? "text-ink" : "text-smoke"}`}>{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[clamp(30px,6vw,60px)] font-extrabold leading-none tracking-[-0.03em]">{GROUP_SYMBOLS[g.title] ?? g.title.slice(0, 2)}</span>
                        <span className="flex w-full items-end justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase leading-tight tracking-[0.06em] sm:text-[12px]">{g.title}</span>
                          <span className={`font-mono text-[10px] ${on ? "text-ink" : "text-smoke"}`}>{g.items.length}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div aria-live="polite" className="flex flex-col gap-2 border border-paper/15 bg-graphite/95 p-4 sm:flex-row sm:items-baseline sm:gap-6">
                <div className="flex shrink-0 items-baseline gap-3">
                  <span className="font-display text-[clamp(26px,4vw,34px)] uppercase leading-none text-frost">{group.title}</span>
                  <span lang="ar" dir="rtl" className="font-arabic text-[18px] text-smoke">
                    {group.titleAr}
                  </span>
                </div>
                <p className="m-0 text-[13px] leading-snug">
                  {group.daily.length > 0 && <b className="font-bold text-frost">{group.daily.join(" · ")}</b>}
                  {others.length > 0 && (
                    <span className="text-smoke">
                      {group.daily.length ? " + " : ""}
                      {others.join(", ")}
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          ) : (
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
          )}

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
              {lab ? "اختار المجموعة" : "اختار سلاحك"}
            </span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkillWheel;
