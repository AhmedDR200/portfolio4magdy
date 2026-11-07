import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { bbGeiger } from "../../assets";
import { labAudio, startGeiger, type Geiger as GeigerCounter } from "../../utils/labfx";
import { useSkin } from "../../utils/theme";

// Dead Eye, from RDR2: hold E and time slows. The page drains to grey, the
// edges darken with a heartbeat, and every link and button in view gets a red
// mark, one after another in reading order. Click a mark to go there; let go
// of E and the colour comes back. The focus runs out after 6 s. Phones (and
// the menu) start it with a tap instead. It shows a visitor everything they
// can press.
//
// In the lab skin the same slot is Geiger mode (GeigerMode below): hold G and
// the pointer is a probe.

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

const DeadEyeFrontier = () => {
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


// ---- The lab: Geiger mode ----
//
// Hold G (or start it from the menu, the HUD or a tap): the page goes phosphor
// green and dark except around the pointer, which becomes a probe. A Geiger
// counter ticks at random, faster the nearer the probe is to anything you can
// press, and rings pulse on the ones in range. The ticks are synthesized in
// the browser (utils/labfx). Held with G it lasts as long as the key; started
// any other way it runs 10 s, and on a touch screen the overlay takes the
// finger so you can drag the probe and tap a ring to go there.

const RANGE = 300; // px at which the probe starts to feel a target
const RUN_MS = 10_000;
const BARS = 40;

type Target = { el: HTMLElement; left: number; top: number; right: number; bottom: number; cx: number; cy: number };
type Blip = { id: number; x: number; y: number; near: number };

const findTargets = (root: HTMLElement | null): Target[] => {
  const found: Target[] = [];
  const seen: HTMLElement[] = [];
  for (const el of document.querySelectorAll<HTMLElement>(SELECTOR)) {
    if (root?.contains(el) || el.closest('[aria-hidden="true"], [inert]')) continue;
    if (seen.some((other) => other.contains(el))) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6 || r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || Number(style.opacity) === 0) continue;
    seen.push(el);
    found.push({ el, left: r.left, top: r.top, right: r.right, bottom: r.bottom, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
    if (found.length >= 80) break;
  }
  return found;
};

const distanceTo = (t: Target, x: number, y: number) => Math.hypot(Math.max(t.left - x, 0, x - t.right), Math.max(t.top - y, 0, y - t.bottom));

const GeigerMode = () => {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"key" | "run" | null>(null);
  const [capture, setCapture] = useState(false);
  const [blips, setBlips] = useState<Blip[]>([]);
  const [cpm, setCpm] = useState(0);
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: BARS }, () => 0));
  const [found, setFound] = useState(0);
  const [total, setTotal] = useState(0);
  const layer = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const targets = useRef<Target[]>([]);
  const counter = useRef<GeigerCounter | null>(null);
  const touched = useRef<Set<HTMLElement>>(new Set());
  const holding = useRef<"key" | "run" | null>(null);
  const downAt = useRef<{ x: number; y: number } | null>(null);

  const active = mode !== null;

  const stop = useCallback(() => {
    holding.current = null;
    counter.current?.stop();
    counter.current = null;
    setMode(null);
    setCapture(false);
    setBlips([]);
  }, []);

  const start = useCallback((how: "key" | "run") => {
    if (holding.current) return;
    holding.current = how;
    const ctx = labAudio();
    counter.current = ctx ? startGeiger(ctx) : null;
    touched.current.clear();
    setFound(0);
    setCapture(how === "run" && window.matchMedia("(pointer: coarse)").matches);
    setMode(how);
  }, []);

  // The pointer is tracked all the time, so the probe starts where it is.
  useEffect(() => {
    pos.current = { x: window.innerWidth / 2, y: window.innerHeight * 0.55 };
    const move = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Hold G; let go to stop. The menu, the HUD's Focus core and the hero prompt start a timed run.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") return stop();
      if (e.key.toLowerCase() !== "g" || e.repeat || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      start("key");
    };
    const up = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && holding.current === "key") stop();
    };
    const onStart = () => start("run");
    const onLeave = () => {
      if (holding.current === "key") stop();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onLeave);
    window.addEventListener(EVENT, onStart);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onLeave);
      window.removeEventListener(EVENT, onStart);
    };
  }, [start, stop]);

  // A timed run ends by itself; a held one ends on release.
  useEffect(() => {
    if (mode !== "run") return;
    const id = window.setTimeout(stop, RUN_MS);
    return () => window.clearTimeout(id);
  }, [mode, stop]);

  // While on: keep the target rectangles fresh, and every frame move the
  // flashlight, work out how near the nearest target is, and set the ticking.
  useEffect(() => {
    if (!active) return;
    const refresh = () => {
      targets.current = findTargets(layer.current);
      setTotal(targets.current.length);
    };
    refresh();
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        refresh();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = 0;
    let n = 0;
    let lastKey = "";
    const tick = () => {
      const { x, y } = pos.current;
      const root = layer.current;
      if (root) {
        root.style.setProperty("--px", `${x}px`);
        root.style.setProperty("--py", `${y}px`);
      }
      let best = 0;
      const near: Blip[] = [];
      targets.current.forEach((t, id) => {
        const d = distanceTo(t, x, y);
        const k = Math.max(0, 1 - d / RANGE);
        if (d < 40) touched.current.add(t.el);
        if (k > 0.04) near.push({ id, x: t.cx, y: t.cy, near: k });
        if (k > best) best = k;
      });
      counter.current?.setProximity(best);
      if (++n % 3 === 0) {
        const top = near.sort((a, b) => b.near - a.near).slice(0, 14);
        const key = top.map((b) => `${b.id}:${b.near.toFixed(1)}`).join(",");
        if (key !== lastKey) {
          lastKey = key;
          setBlips(top);
        }
        setFound(touched.current.size);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const meter = window.setInterval(() => {
      const rate = counter.current?.rate() ?? 1.6;
      setCpm(Math.round(rate * 60 * (0.93 + Math.random() * 0.14)));
      setBars((b) => [...b.slice(1), Math.min(1, rate / 40)]);
    }, 125);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollFrame);
      window.clearInterval(meter);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active]);

  // On a touch screen the overlay takes the finger: drag to move the probe,
  // tap near a ring to press what is under it.
  const onTouchDown = (e: ReactPointerEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };
    downAt.current = { x: e.clientX, y: e.clientY };
  };
  const onTouchMove = (e: ReactPointerEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };
  };
  const onTouchUp = (e: ReactPointerEvent) => {
    const from = downAt.current;
    downAt.current = null;
    if (!from || Math.hypot(e.clientX - from.x, e.clientY - from.y) > 12) return;
    let nearest: Target | null = null;
    let best = 44;
    for (const t of targets.current) {
      const d = distanceTo(t, e.clientX, e.clientY);
      if (d < best) {
        best = d;
        nearest = t;
      }
    }
    if (!nearest) return;
    stop();
    nearest.el.focus({ preventScroll: true });
    nearest.el.click();
  };

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Straight over the page, so it turns everything under it phosphor green. */}
          <motion.div
            key="tint"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-0 z-[94] bg-[#1d6b3c] mix-blend-color"
          />
          <motion.div
            key="geiger"
            ref={layer}
            role="dialog"
            aria-label="Geiger mode: everything you can press"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onPointerDown={capture ? onTouchDown : undefined}
            onPointerMove={capture ? onTouchMove : undefined}
            onPointerUp={capture ? onTouchUp : undefined}
            style={{ "--px": "50%", "--py": "55%", touchAction: capture ? "none" : undefined } as CSSProperties}
            className={`theme-dark fixed inset-0 z-[95] ${capture ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            {/* The flashlight: dark everywhere but around the probe. */}
            <div className="absolute inset-0 [background:radial-gradient(circle_270px_at_var(--px)_var(--py),rgba(3,8,5,0)_0%,rgba(3,8,5,0)_40%,rgba(3,8,5,0.86)_100%)]" />
            <div className="scanlines absolute inset-0 opacity-50" />
            <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(0,0,0,0.5)_100%)] ${reduce ? "" : "animate-heartbeat"}`} />

            {/* Rings pulse on what can be pressed: the nearer, the brighter. */}
            {blips.map((b) => {
              const base = 0.14 + 0.86 * b.near;
              return (
                <span key={b.id} aria-hidden="true" className="absolute h-0 w-0" style={{ left: b.x, top: b.y }}>
                  {[
                    { size: 36, o: base },
                    { size: 76 + b.near * 20, o: base * 0.62 },
                    { size: 120 + b.near * 40, o: base * 0.3 },
                  ].map((r, i) => (
                    <span
                      key={i}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-frost ${i === 2 && !reduce ? "animate-ping [animation-duration:1.6s]" : ""}`}
                      style={{ width: r.size, height: r.size, opacity: r.o }}
                    />
                  ))}
                </span>
              );
            })}

            {/* The probe. */}
            <span aria-hidden="true" className="absolute h-0 w-0" style={{ left: "var(--px)", top: "var(--py)" }}>
              <span className="absolute -left-[90px] -top-[90px] h-[180px] w-[180px] rounded-full border-[1.5px] border-dashed border-paper/50" />
              <span className="absolute -left-[46px] -top-[46px] h-[92px] w-[92px] rounded-full border-[2.5px] border-paper bg-[radial-gradient(circle,rgb(79_209_127/0.25),transparent)]" />
              <span className="absolute -left-[64px] -top-px h-0.5 w-9 bg-paper" />
              <span className="absolute left-7 -top-px h-0.5 w-9 bg-paper" />
              <span className="absolute -left-px -top-[64px] h-9 w-0.5 bg-paper" />
              <span className="absolute -left-px top-7 h-9 w-0.5 bg-paper" />
              <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-frost" />
            </span>

            {/* What you've found. */}
            <div className="absolute right-5 top-24 flex flex-col items-end gap-1 sm:right-16 sm:top-[92px]" aria-live="polite">
              <span className="font-mono text-[11px] tracking-[0.16em] text-smoke">FOUND</span>
              <span className="font-display text-[44px] leading-none text-frost sm:text-[56px]">
                {found}
                <span className="text-[22px] text-smoke sm:text-[28px]"> / {total}</span>
              </span>
            </div>

            {/* The gauge: a real survey meter, and what it reads. */}
            <div className="absolute inset-x-0 bottom-0 h-[150px] bg-[linear-gradient(transparent,rgba(0,0,0,0.85))]" />
            <div className="absolute bottom-4 left-4 flex items-end gap-3 sm:bottom-8 sm:left-12 sm:gap-7">
              <img
                src={bbGeiger}
                alt=""
                draggable={false}
                className="h-auto w-[130px] shrink-0 select-none [filter:drop-shadow(0_14px_16px_rgba(0,0,0,0.7))] sm:w-[300px]"
              />
              <div className="flex flex-col gap-1.5 pb-1 sm:gap-2.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-[40px] leading-none tabular-nums text-paper sm:text-[64px]">{cpm}</span>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-smoke sm:text-[12px]">COUNTS PER MIN</span>
                </div>
                <div className="flex h-7 items-end gap-[3px] sm:h-10" aria-hidden="true">
                  {bars.map((v, i) => (
                    <span key={i} className="w-[3px] bg-frost sm:w-1" style={{ height: `${Math.max(12, v * 100)}%`, opacity: 0.35 + v * 0.65 }} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={stop}
                  className="pointer-events-auto mt-1 flex h-9 w-fit items-center gap-2.5 border border-paper/40 bg-ink/70 px-3.5 font-fellsc text-[14px] tracking-[0.16em] text-paper hover:border-frost hover:text-frost"
                >
                  Stop
                  <kbd className="rounded-[3px] border border-current px-1.5 font-mono text-[10px] font-bold">Esc</kbd>
                </button>
              </div>
            </div>

            <div className="absolute bottom-8 right-12 hidden w-[360px] flex-col gap-2.5 border border-paper/15 bg-ink/90 p-5 lg:flex">
              <div className="flex items-center justify-between">
                <span className="font-fellsc text-[16px] tracking-[0.14em]">Geiger mode</span>
                <kbd className="inline-flex h-8 min-w-8 items-center justify-center rounded-[4px] border-[1.5px] border-smoke px-2 font-mono text-[13px] font-bold">G</kbd>
              </div>
              <p className="m-0 text-[12px] leading-relaxed text-mist">
                The pointer is a probe. The ticking speeds up near anything you can press, and a ring pulses on the ones in range.
              </p>
              <p lang="ar" dir="rtl" className="m-0 font-arabic text-[16px] text-smoke">
                قرّب الإشعاع من أي حاجة تتدوس
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DeadEye = () => (useSkin() === "bb" ? <GeigerMode /> : <DeadEyeFrontier />);

export default DeadEye;
