import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { unlock } from "../../utils/achievements";
import { pauseScroll, scrollToSection } from "../../utils/lenis";
import { EASE_OUT_EXPO } from "../../utils/motion";

// Press M: the page as a western map. Each section is a town on a railway
// that runs in page order; pick one and fast-travel there. The town names
// are the game's (Red Dead Redemption 2), as a nod for fans.

type Town = { id: string; name: string; section: string; ar: string; blurb: string };

const TOWNS: Town[] = [
  { id: "about", name: "Valentine", section: "(01) About", ar: "عني", blurb: "Where it starts: who I am and what I build." },
  { id: "services", name: "Strawberry", section: "(02) What I do", ar: "بعمل إيه", blurb: "Three trades: APIs, system design and real-time." },
  { id: "skills", name: "Rhodes", section: "(03) Skills", ar: "مهاراتي", blurb: "The stack: 43 tools, the daily ones marked." },
  { id: "work", name: "Saint Denis", section: "(04) Selected work", ar: "أعمالي", blurb: "The big city: Bee3a and nine projects, case studies inside." },
  { id: "experience", name: "Blackwater", section: "(05) Experience", ar: "مشواري", blurb: "The trail so far, job by job." },
  { id: "principles", name: "Annesburg", section: "(06) How I work", ar: "بشتغل إزاي", blurb: "House rules, in Arabic." },
  { id: "channel", name: "Van Horn", section: "(07) The channel", ar: "على يوتيوب", blurb: "٢٠٠ تمام, with live numbers from YouTube." },
  { id: "contact", name: "Armadillo", section: "(08) Contact", ar: "كلّمني", blurb: "End of the line: say hello." },
];

// Town positions for a wide map and a tall (phone) map, in viewBox units.
const LAYOUTS = {
  wide: {
    w: 1440,
    h: 900,
    pts: [[230, 200], [170, 470], [380, 690], [640, 520], [560, 230], [860, 170], [960, 420], [820, 740]],
    hills: [[330, 300, 1.4, 0.3], [1000, 260, 1.2, 1.1], [560, 640, 1.6, 2], [1180, 700, 1.1, 0.7]],
    river: "M-20,560 C140,520 260,600 420,560 S700,420 820,470 S1060,620 1200,560 S1380,470 1460,500",
  },
  tall: {
    w: 720,
    h: 1100,
    pts: [[170, 150], [480, 260], [220, 390], [500, 520], [200, 640], [470, 760], [190, 880], [470, 990]],
    hills: [[180, 260, 1.1, 0.4], [560, 470, 1, 1.3], [200, 760, 1.2, 2.1], [560, 960, 1, 0.8]],
    river: "M-20,330 C160,300 300,380 420,330 S640,260 740,300",
  },
};

const ring = (cx: number, cy: number, base: number, phase: number, sx: number) => {
  let d = "";
  for (let i = 0; i <= 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const r = base + (8 + base * 0.04) * Math.sin(3 * t + phase) + 5 * Math.sin(5 * t + phase * 2);
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(t) * sx).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`;
  }
  return `${d}Z`;
};

/** A smooth line through points (Catmull-Rom as cubic Béziers). */
const through = (pts: number[][]) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
};

const useWide = () => {
  const query = "(min-width: 768px)";
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setWide(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return wide;
};

/** The section whose top is nearest above the middle of the screen. */
const currentTown = () => {
  const mid = window.innerHeight / 2;
  let index = 0;
  TOWNS.forEach((town, i) => {
    const el = document.getElementById(town.id);
    if (el && el.getBoundingClientRect().top < mid) index = i;
  });
  return index;
};

type Props = { open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> };

const MapOverlay = ({ open, onOpenChange }: Props) => {
  const wide = useWide();
  const layout = wide ? LAYOUTS.wide : LAYOUTS.tall;
  const [here, setHere] = useState(0);
  const [selected, setSelected] = useState(0);

  const art = useMemo(
    () => ({
      contours: layout.hills.flatMap(([cx, cy, sx, ph]) =>
        Array.from({ length: 7 }, (_, j) => ring(cx, cy, 30 + j * 26, ph + j * 0.3, sx))
      ),
      rail: through(layout.pts),
    }),
    [layout]
  );

  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const travel = useCallback(
    (index: number) => {
      onOpenChange(false);
      unlock("fast-traveler");
      // Let the map fade first, then glide there.
      window.setTimeout(() => scrollToSection(TOWNS[index].id), 260);
    },
    [onOpenChange]
  );

  // M toggles from anywhere; inside the map, arrows pick and Enter travels.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "m" || e.key === "M") onOpenChange((v) => !v);
      if (!open) return;
      if (e.key === "Escape") onOpenChange(false);
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") setSelected((s) => (s + 1) % TOWNS.length);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") setSelected((s) => (s - 1 + TOWNS.length) % TOWNS.length);
      else if (e.key === "Enter") travel(selectedRef.current);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, travel]);

  useEffect(() => {
    if (!open) return;
    const now = currentTown();
    setHere(now);
    setSelected(now);
    pauseScroll(true);
    return () => pauseScroll(false);
  }, [open]);

  const town = TOWNS[selected];
  const [hx, hy] = layout.pts[here];
  const [sx, sy] = layout.pts[selected];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="map"
          role="dialog"
          aria-modal="true"
          aria-label="Map of the site"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[88] flex flex-col bg-[radial-gradient(circle_at_50%_50%,#121212_0,#0A0A0A_75%)] text-paper"
        >
          <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-12 sm:pt-10">
            <p className="m-0 flex items-baseline gap-4">
              <span className="font-western text-[32px] sm:text-[40px]">Map</span>
              <span lang="ar" className="font-arabic text-[22px] text-smoke">
                الخريطة
              </span>
            </p>
            <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.1em] text-mist">
              <span className="hidden items-center gap-2 md:flex">
                <kbd className="rounded border border-paper/40 border-b-[3px] px-2 py-0.5 font-mono">← →</kbd> Pick
                <kbd className="ml-2 rounded border border-paper/40 border-b-[3px] px-2 py-0.5 font-mono">Enter</kbd> Travel
              </span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full border border-paper/25 px-3.5 py-2 hover:border-volt hover:text-volt"
              >
                Close · M
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <svg
              viewBox={`0 0 ${layout.w} ${layout.h}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
            >
              {art.contours.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(244,244,239,0.06)" strokeWidth="1.2" />
              ))}
              <path d={layout.river} fill="none" stroke="rgba(212,255,58,0.2)" strokeWidth="10" strokeLinecap="round" />
              <path d={art.rail} fill="none" stroke="rgba(244,244,239,0.3)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
              {selected !== here && (
                <path
                  d={`M${hx},${hy} Q${(hx + sx) / 2},${Math.min(hy, sy) - 90} ${sx},${sy}`}
                  fill="none"
                  stroke="#D4FF3A"
                  strokeWidth="3"
                  strokeDasharray="10 10"
                  className="animate-map-route"
                />
              )}

              {TOWNS.map((t, i) => {
                const [x, y] = layout.pts[i];
                const on = i === selected;
                return (
                  <g
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${t.name}: ${t.section}`}
                    aria-pressed={on}
                    onClick={() => (on ? travel(i) : setSelected(i))}
                    onKeyDown={(e) => {
                      if (e.key !== " ") return;
                      e.preventDefault();
                      setSelected(i);
                    }}
                    className="cursor-pointer outline-none"
                    data-cursor-target
                  >
                    <circle cx={x} cy={y} r="34" fill="transparent" />
                    {on && <circle cx={x} cy={y} r="20" fill="rgba(212,255,58,0.18)" />}
                    <circle cx={x} cy={y} r="9" fill={on ? "#D4FF3A" : "#0A0A0A"} stroke="#D4FF3A" strokeWidth="3" />
                    <text x={x + 18} y={y - 2} fontFamily="Rye, serif" fontSize={on ? 26 : 20} fill={on ? "#D4FF3A" : "#F4F4EF"}>
                      {t.name}
                    </text>
                    <text x={x + 18} y={y + 18} fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#8C8C86">
                      {t.section}
                    </text>
                  </g>
                );
              })}

              {/* The bob animates an inner group, so it doesn't replace the position. */}
              <g transform={`translate(${hx} ${hy - 30})`} pointerEvents="none">
                <g className="animate-map-you">
                  <path d="M0 18 L-12 -6 L0 0 L12 -6 Z" fill="#F4F4EF" stroke="#0A0A0A" strokeWidth="2" />
                  <rect x="-46" y="-34" width="92" height="20" rx="10" fill="#F4F4EF" />
                  <text x="0" y="-20" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="800" letterSpacing="1.2" fill="#0A0A0A">
                    YOU ARE HERE
                  </text>
                </g>
              </g>
            </svg>
          </div>

          <motion.div
            key={town.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="m-4 flex flex-col gap-2.5 rounded-[22px] border border-volt/45 bg-ink/95 p-5 md:absolute md:right-12 md:top-[calc(50%-150px)] md:m-0 md:w-[330px] md:p-6"
          >
            <span className="text-[10px] uppercase tracking-[0.16em] text-smoke">{selected === here ? "You are here" : "Selected town"}</span>
            <span className="font-western text-[30px] leading-none text-volt sm:text-[36px]">{town.name}</span>
            <span className="text-[13px]">
              {town.section} ·{" "}
              <span lang="ar" className="font-arabic text-[16px] text-mist">
                {town.ar}
              </span>
            </span>
            <span className="text-[12px] leading-relaxed text-smoke">{town.blurb}</span>
            <button
              type="button"
              onClick={() => travel(selected)}
              className="mt-1 flex h-[50px] items-center justify-between rounded-full bg-volt px-6 text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02]"
            >
              Fast travel <span aria-hidden="true">→</span>
            </button>
            <span lang="ar" className="font-arabic text-[16px] text-mist">
              ودّيني هناك
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapOverlay;
