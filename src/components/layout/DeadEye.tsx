import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Dead Eye, from RDR2: hold E and time slows. The page drains to grey, the
// edges darken with a heartbeat, and every link and button in view gets a red
// mark, one after another in reading order. Click a mark to go there; let go
// of E and the colour comes back. The focus runs out after 6 s. Phones (and
// the menu) start it with a tap instead. It shows a visitor everything they
// can press.

const EVENT = "dead-eye:start";
export const deadEye = () => window.dispatchEvent(new Event(EVENT));

const LIMIT_MS = 6000;
const STEP_MS = 70;
const MAX_MARKS = 30;
const SELECTOR = 'a[href], button:not([disabled]), [role="slider"], input:not([type="hidden"]), textarea, select';

type Mark = { el: HTMLElement; x: number; y: number; size: number; label: string };

const isTyping = (target: EventTarget | null) =>
  !!(target as HTMLElement | null)?.closest?.("input, textarea, select, [contenteditable='true']");

// What's pressable in view, in reading order, with nested ones dropped.
const findMarks = (root: HTMLElement | null): Mark[] => {
  const found: Mark[] = [];
  const seen: HTMLElement[] = [];
  for (const el of document.querySelectorAll<HTMLElement>(SELECTOR)) {
    if (root?.contains(el) || el.closest('[aria-hidden="true"], [inert]')) continue;
    if (seen.some((other) => other.contains(el))) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) continue;
    // In view, and clear of Dead Eye's own labels along the bottom.
    if (r.bottom < 8 || r.top + r.height / 2 > window.innerHeight - 96 || r.right < 0 || r.left > window.innerWidth) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || Number(style.opacity) === 0) continue;
    seen.push(el);
    // Wide rows get the mark on their key prompt, or at their end, not over
    // the middle of the text.
    const key = r.width > 320 ? el.querySelector("kbd")?.getBoundingClientRect() : undefined;
    const spot = key ?? (r.width > 320 ? { left: r.right - 68, width: 68, top: r.top, height: r.height } : r);
    found.push({
      el,
      x: spot.left + spot.width / 2,
      y: spot.top + spot.height / 2,
      size: Math.max(34, Math.min(56, Math.min(r.width, r.height) + 18)),
      label: (el.getAttribute("aria-label") || el.textContent || "this").trim().slice(0, 40),
    });
  }
  return found.sort((a, b) => Math.round(a.y / 28) - Math.round(b.y / 28) || a.x - b.x).slice(0, MAX_MARKS);
};

const MarkIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full overflow-visible drop-shadow-[0_0_6px_rgba(227,38,47,0.85)]">
    <circle cx="32" cy="32" r="22" fill="rgba(179,32,42,0.18)" stroke="#E3262F" strokeWidth="2.6" />
    <path d="M22 22 L42 42 M42 22 L22 42" stroke="#E3262F" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const DeadEye = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [shown, setShown] = useState(0);
  const layer = useRef<HTMLDivElement>(null);
  const audio = useRef<AudioContext | null>(null);

  const stop = useCallback(() => setActive(false), []);
  const start = useCallback(() => {
    try {
      audio.current ??= new AudioContext();
    } catch {
      // No sound; the marks still come.
    }
    setActive(true);
  }, []);

  // Hold E; let go to stop. The menu and the HUD's Focus core start a 6 s run.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e" || e.repeat || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      // Inside an open dialog (the satchel uses E to switch pouch), E is theirs.
      if (document.querySelector('[aria-modal="true"]')) return;
      start();
    };
    const up = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e") stop();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener(EVENT, start);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener(EVENT, start);
    };
  }, [start, stop]);

  // Find the marks, keep them in place while the page scrolls, and run out of focus.
  useEffect(() => {
    if (!active) return;
    setMarks(findMarks(layer.current));
    setShown(0);
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setMarks(findMarks(layer.current));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const limit = window.setTimeout(stop, LIMIT_MS);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(limit);
    };
  }, [active, stop]);

  // One mark at a time, with a soft click each.
  useEffect(() => {
    if (!active || shown >= marks.length) return;
    if (reduce) return setShown(marks.length);
    const id = window.setTimeout(() => {
      const ctx = audio.current;
      if (ctx) {
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1900, t);
        gain.gain.setValueAtTime(0.035, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      }
      setShown((n) => n + 1);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [active, shown, marks.length, reduce]);

  const go = (mark: Mark) => {
    stop();
    mark.el.focus({ preventScroll: true });
    mark.el.click();
  };

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Straight over the page, so it drains the colour of everything under it. */}
          <motion.div
            key="grey"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none fixed inset-0 z-[94] bg-[#808080] mix-blend-saturation"
          />
          <motion.div
            key="marks"
            ref={layer}
            role="dialog"
            aria-label="Dead Eye: everything you can press"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="theme-dark pointer-events-none fixed inset-0 z-[95]"
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,transparent_40%,rgba(0,0,0,0.78)_100%)] ${reduce ? "" : "animate-heartbeat"}`} />

            {marks.slice(0, shown).map((mark) => (
              <motion.button
                key={`${Math.round(mark.x)}-${Math.round(mark.y)}`}
                type="button"
                aria-label={`Go to ${mark.label}`}
                onClick={() => go(mark)}
                initial={reduce ? false : { scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-auto absolute rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-paper"
                style={{ left: mark.x - mark.size / 2, top: mark.y - mark.size / 2, width: mark.size, height: mark.size }}
              >
                <MarkIcon />
              </motion.button>
            ))}

            <div className="absolute inset-x-0 bottom-0 h-[110px] bg-[linear-gradient(transparent,rgba(0,0,0,0.85))]" />
            <div className="absolute bottom-6 left-5 flex items-center gap-4 [text-shadow:0_1px_8px_#000] sm:bottom-9 sm:left-10">
              <span className="relative h-[60px] w-[60px] text-bandana">
                <svg viewBox="0 0 66 66" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="33" cy="33" r="30" fill="none" className="stroke-paper/20" strokeWidth="3.5" />
                  <motion.circle
                    cx="33"
                    cy="33"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    pathLength={1}
                    strokeDasharray="1 1"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 1 }}
                    transition={{ duration: LIMIT_MS / 1000, ease: "linear" }}
                  />
                  <circle cx="33" cy="33" r="23" fill="rgba(5,10,8,0.62)" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
                </svg>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 fill-current">
                  <path
                    fillRule="evenodd"
                    d="M12 5 C6.5 5 2.8 9.4 1.5 12 C2.8 14.6 6.5 19 12 19 C17.5 19 21.2 14.6 22.5 12 C21.2 9.4 17.5 5 12 5 Z M12 8.2 A3.8 3.8 0 1 1 12 15.8 A3.8 3.8 0 1 1 12 8.2 Z M12 10.3 A1.7 1.7 0 1 0 12 13.7 A1.7 1.7 0 1 0 12 10.3 Z"
                  />
                </svg>
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-fellsc text-[17px] tracking-[0.12em] text-paper">Dead Eye</span>
                <span className="font-fellsc text-[12px] tracking-[0.1em] text-paper/75">
                  {marks.length} marked · click a mark to go
                  <span className="hidden sm:inline"> · let go of E to stop</span>
                </span>
              </span>
            </div>
            <span className="absolute bottom-9 right-6 hidden font-fellsc text-[15px] tracking-[0.5em] text-[#E3262F] [text-shadow:0_0_12px_rgba(227,38,47,0.7)] sm:block sm:right-10">
              Dead Eye
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeadEye;
