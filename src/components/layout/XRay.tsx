import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { unlock } from "../../utils/achievements";
import { useApiCalls } from "../../utils/apiLog";
import { EASE_OUT_EXPO } from "../../utils/motion";

type Target = { selector: string; name: string; note: string };
type Box = Target & { key: number; top: number; left: number; width: number; height: number };

// What X-ray mode labels. Selectors use ids, aria labels or data-xray hooks.
const TARGETS: Target[] = [
  { selector: "#top", name: "<Hero />", note: "halftone print · role rotates every 2.8 s" },
  { selector: 'header a[aria-label="Ahmed Magdy, home"]', name: "<Wordmark />", note: "types 120 ms a letter · blinks every 1.06 s" },
  { selector: "header a[download]", name: "Resume", note: "click runs <CvPipeline /> · real sync: GitHub Action every 3 h" },
  { selector: '[data-xray="wax-seal"]', name: "<WaxSeal />", note: "SVG wax and textPath · CSS spin" },
  { selector: '[data-xray="hud"]', name: "<Hud />", note: "Cairo time + Open-Meteo · cores by the hour" },
  { selector: '[data-xray="name-marquee"]', name: "<NameMarquee />", note: "rAF loop · flips with scroll direction" },
  { selector: "#about", name: "<About />", note: "journal pages · pencil sketches as SVG paths" },
  { selector: '[aria-label^="Stack: "]', name: "<Ticker />", note: "CSS marquee · content twice for a seamless loop" },
  { selector: "#impact", name: "<Impact />", note: "static data from constants/index.ts" },
  { selector: "#services", name: "<Services />", note: "WANTED posters · aria-pressed picks the detail" },
  { selector: "#skills", name: "<Skills />", note: "skillGroups in constants/index.ts" },
  { selector: '[aria-label="Founder project: Bee3a"]', name: "<Bee3aCard />", note: "bee3a.site · my own SaaS" },
  { selector: '[data-xray="bee3a-demo"]', name: "<Bee3aDemo />", note: "useReducer · no server, nothing saved" },
  { selector: '[data-xray="bee3a-notebook"]', name: "<Bee3aNotebook />", note: "clip-path follows the handle" },
  { selector: '[data-xray="projects"]', name: "<ProjectList />", note: "preview follows the pointer · case studies open in a portal" },
  { selector: "#experience", name: "<Experience />", note: "the camp ledger · torn clip-path" },
  { selector: "#principles", name: "<Principles />", note: "Arabic sayings in Rakkas" },
  { selector: "#channel", name: "<Channel />", note: "youtube.com/@200tamam" },
  { selector: '[data-xray="channel-stats"]', name: "<ChannelStats />", note: "YouTube Data API v3 + /api/tiktok (reads the public profile) · polls every 30 s while on screen" },
  { selector: "#contact", name: "<Contact />", note: "mailto + socials · no form, no backend" },
  { selector: '[data-xray="status"]', name: "<StatusPanel />", note: "GitHub REST: events → commit · cached 10 min" },
  { selector: '[data-xray="contributions"]', name: "<ContributionGraph />", note: "contributions API · cached 60 min" },
  { selector: 'footer > p[aria-hidden="true"]', name: "Footer name", note: "18.5vw Anton · gradient-clipped text" },
  { selector: 'button[aria-controls="site-menu"]', name: "<FloatingMenu />", note: "appears after 80% of the hero" },
  { selector: '[data-xray="cairo-clock"]', name: "<CairoClock />", note: "Intl in Africa/Cairo · Open-Meteo every 15 min" },
  { selector: '[data-xray="trace"]', name: "<RequestTrace />", note: "scroll position → hops · scroll speed → pods (HPA)" },
];

const STACK: [string, string][] = [
  ["Build", "React 18 · TypeScript · Vite"],
  ["Style", "Tailwind · Anton, Rakkas, JetBrains Mono"],
  ["Motion", "framer-motion · Lenis smooth scroll"],
  ["Live data", "GitHub REST + contributions API, cached in sessionStorage"],
  ["CV", "Overleaf → Playwright in GitHub Actions → release"],
];

/** The boxes of every target that's on screen, in viewport coordinates. */
const measure = (): Box[] => {
  const boxes: Box[] = [];
  TARGETS.forEach((target, key) => {
    const el = document.querySelector(target.selector);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.bottom < 0 || r.top > window.innerHeight) return;
    boxes.push({ ...target, key, top: r.top, left: r.left, width: r.width, height: r.height });
  });
  return boxes;
};

const shortUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\?.*$/, "");

type Props = { open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> };

// Press X: the page turns into a blueprint of how it's built. Each component
// gets a dashed box with its name, how it works and its size, and a panel
// lists the stack and the live API calls made so far.
const XRay = ({ open, onOpenChange }: Props) => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const calls = useApiCalls();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "x" || e.key === "X") onOpenChange((v) => !v);
      else if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    unlock("x-ray");
    let frame = 0;
    const update = () => {
      frame = 0;
      setBoxes(measure());
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    // Accordions, images and the menu button change the layout without a scroll.
    const id = window.setInterval(schedule, 500);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(id);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="xray" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[85] bg-ink/45 [background-image:linear-gradient(rgb(var(--frost)/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--frost)/0.07)_1px,transparent_1px)] [background-size:24px_24px]"
          >
            {boxes.map((box) => {
              // Small boxes get their label outside, so it doesn't cover them.
              const small = box.width < 260 || box.height < 90;
              const chip: React.CSSProperties = small
                ? {
                    // Above the box, unless that would cover the labels along the top edge.
                    top: box.top > 50 ? -20 : box.height + 1,
                    ...(box.left + 360 > window.innerWidth ? { right: -1 } : { left: -1 }),
                    maxWidth: Math.min(360, window.innerWidth - 16),
                  }
                : // Keep the label on screen when the box starts above the viewport.
                  { top: Math.min(Math.max(-1, -box.top), box.height - 20), left: -1, maxWidth: "calc(100% + 2px)" };
              return (
                <div
                  key={box.key}
                  className="absolute border border-dashed border-frost/70"
                  style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
                >
                  <span className="absolute truncate bg-frost px-1.5 py-0.5 text-[10.5px] text-ink" style={chip}>
                    <b>{box.name}</b> · {box.note}
                  </span>
                  {!small && (
                    <span className="absolute bottom-1 right-1.5 text-[10px] tabular-nums text-frost/80">
                      {Math.round(box.width)} × {Math.round(box.height)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <motion.aside
            aria-label="X-ray mode"
            data-lenis-prevent
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="fixed bottom-[84px] left-5 right-5 z-[86] max-h-[46vh] overflow-y-auto rounded-[22px] border border-frost/50 bg-ink/90 p-5 text-[12px] backdrop-blur-md sm:bottom-8 sm:left-auto sm:right-8 sm:max-h-[70vh] sm:w-[400px]"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="m-0 font-display text-[24px] uppercase leading-none">
                X-ray<span className="text-frost">.</span>
              </p>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full border border-paper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] hover:border-frost hover:text-frost"
              >
                Close · Esc
              </button>
            </div>
            <p className="m-0 mt-2 text-smoke">How this page is built. Press X any time to toggle.</p>

            <p className="m-0 mt-3 sm:hidden">React 18 · TypeScript · Vite · Tailwind · framer-motion · Lenis</p>
            <dl className="m-0 mt-4 hidden grid-cols-[76px_1fr] gap-x-3 gap-y-1.5 sm:grid">
              {STACK.map(([term, value]) => (
                <div key={term} className="contents">
                  <dt className="uppercase tracking-[0.1em] text-smoke">{term}</dt>
                  <dd className="m-0">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="m-0 mt-4 border-t border-paper/15 pt-4 uppercase sm:mt-5 tracking-[0.14em] text-smoke">
              Network <span className="text-frost">· live</span>
            </p>
            {calls.length ? (
              <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
                {calls.map((call, i) => (
                  <li key={i} className="flex items-baseline gap-2">
                    <span className="text-frost">GET</span>
                    <span className="min-w-0 flex-1 truncate">{shortUrl(call.url)}</span>
                    <span className={call.result === "error" ? "text-paper" : "text-frost"}>
                      {call.result === "cache" ? "cached" : call.result}
                    </span>
                    {call.result !== "cache" && <span className="w-[52px] text-right tabular-nums text-smoke">{call.ms} ms</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 mt-2 text-smoke">
                No calls yet. Scroll to the footer: the status panel fetches from GitHub when it comes into view.
              </p>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XRay;
