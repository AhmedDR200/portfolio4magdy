import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { bbMask } from "../../assets";
import { BB_BEATS, level, loadBbTrack, playBbTrack, type BbTrack } from "../../utils/bbsound";
import { audioContext, unlockAudio } from "../../utils/gunfx";
import { EASE_OUT_CUBIC, markIntroSeen } from "../../utils/motion";
import ElementTile from "../atoms/ElementTile";
import SmokeCanvas from "../atoms/SmokeCanvas";
import Wordmark from "../atoms/Wordmark";

// The lab's cold open, on the Breaking Bad main title theme. An illustrated gas
// mask breathes in the dark, its filter glowing with the music; on the swell (6.3 s
// into the theme) it fogs away and the Mg tile slams in; on the theme's last hit
// (11.4 s) the curtain lifts and the tail of the music rings out under the page.
// Browsers only allow sound after the visitor does something, so it starts on
// "Press any key"; with no answer it plays silently after a few seconds, on a
// shorter timeline, and the same goes if the music can't load.
// Esc or Skip jumps straight to the site.
// The music is the Breaking Bad main title theme, used with permission.

const SILENT = { swell: 2.2, hit: 4.8 };
const SILENT_AFTER_MS = 7000;
const LIFT_S = 0.9;
const PURITY_FROM = 24;
const PURITY_TO = 99.1;
const wait = (ms: number) => new Promise<null>((resolve) => window.setTimeout(() => resolve(null), ms));

type Phase = "gate" | "mask" | "tile" | "lift";
type Props = {
  /** Called when the curtain starts lifting, so the hero can rise with it. */
  onReveal: () => void;
  /** Called once the curtain is fully off screen. */
  onDone: () => void;
};

const IntroLab = ({ onReveal, onDone }: Props) => {
  const [phase, setPhase] = useState<Phase>("gate");
  const [flash, setFlash] = useState(0);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const lifted = useRef(false);
  const track = useRef<Promise<BbTrack | null> | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const t0 = useRef(0);
  const beats = useRef(SILENT);
  const glow = useRef<HTMLDivElement>(null);
  const purity = useRef<HTMLSpanElement>(null);

  const lift = useCallback(() => {
    lifted.current = true;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPhase("lift");
    onReveal();
  }, [onReveal]);

  const start = useCallback(
    (withSound: boolean) => {
      if (started.current) return;
      started.current = true;
      const ctx = withSound ? audioContext() : null;
      // In the tap or key press itself, before any await: iOS only unlocks audio from a gesture.
      const resumed = ctx ? unlockAudio(ctx).then(() => true, () => false) : Promise.resolve(false);
      setPhase("mask");
      const tapped = performance.now();

      void (async () => {
        let soundAt = tapped;
        let b = SILENT;
        // At most 0.7 s for the sound to be ready; after that the picture goes on without it.
        const running = (await Promise.race([resumed, wait(500)])) === true && ctx?.state === "running";
        if (ctx && running && !lifted.current) {
          const left = Math.max(0, 700 - (performance.now() - tapped));
          const loaded = await Promise.race([track.current ?? Promise.resolve(null), wait(left)]);
          if (lifted.current) return;
          if (loaded) {
            try {
              const delay = 0.05;
              analyser.current = playBbTrack(ctx, loaded, delay);
              b = { swell: BB_BEATS.swell, hit: BB_BEATS.hit };
              soundAt = performance.now() + delay * 1000;
            } catch {
              // No sound: the picture still plays.
            }
          }
        }
        if (lifted.current) return;
        beats.current = b;
        t0.current = soundAt;
        // Every beat is timed from when the sound started (or the tap, with no sound).
        const since = (performance.now() - soundAt) / 1000;
        const at = (s: number, fn: () => void) => timers.current.push(window.setTimeout(fn, Math.max(0, (s - since) * 1000)));
        at(b.swell, () => {
          setPhase("tile");
          setFlash((n) => n + 1);
        });
        at(b.hit, () => {
          setFlash((n) => n + 1);
          lift();
        });
      })();
    },
    [lift]
  );

  useEffect(() => {
    markIntroSeen();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    // Some browsers already allow sound here: then there's nothing to ask.
    const ctx = audioContext();
    // Fetch and decode the music while the gate is up.
    if (ctx) track.current = loadBbTrack(ctx);
    if (ctx?.state === "running") start(true);
    const silent = window.setTimeout(() => start(false), SILENT_AFTER_MS);
    return () => {
      root.style.overflow = "";
      window.clearTimeout(silent);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, [start]);

  // While the intro is up, keys belong to it, not to the site's shortcuts.
  useEffect(() => {
    if (phase === "lift") return;
    const onKey = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.key === "Escape") lift();
      else if (phase === "gate" && !e.metaKey && !e.ctrlKey && !e.altKey) start(true);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [phase, start, lift]);

  // The filter's glow follows the music's level (or breathes, with no music),
  // and the purity readout climbs to 99.1% by the swell.
  useEffect(() => {
    if (phase === "gate" || phase === "lift") return;
    const bytes = new Uint8Array(512);
    let raf = 0;
    const tick = () => {
      const t = (performance.now() - t0.current) / 1000;
      const node = analyser.current;
      const lvl = node ? Math.min(1, level(node, bytes) * 3.6) : 0.5 + 0.5 * Math.sin(t * 2.4);
      if (glow.current) {
        glow.current.style.opacity = String(0.3 + lvl * 0.7);
        glow.current.style.transform = `scale(${0.92 + lvl * 0.2})`;
      }
      if (purity.current) {
        const k = Math.max(0, Math.min(1, t / beats.current.swell));
        purity.current.textContent = (PURITY_FROM + (PURITY_TO - PURITY_FROM) * k * k).toFixed(1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <motion.div
      aria-label="Opening: press any key"
      role="dialog"
      className="theme-dark fixed inset-0 z-[100] overflow-hidden bg-ink text-paper"
      initial={false}
      animate={{ y: phase === "lift" ? "-128%" : "0%" }}
      transition={{ duration: LIFT_S, ease: EASE_OUT_CUBIC }}
      onAnimationComplete={() => {
        if (phase === "lift") onDone();
      }}
    >
      {/* The bottom edge sags into a curve mid-lift, then flattens. */}
      <motion.span
        className="absolute left-[-15%] top-[calc(100%-2px)] h-[33vh] w-[130%] origin-top rounded-b-[50%] bg-ink"
        initial={{ scaleY: 0.35 }}
        animate={phase === "lift" ? { scaleY: [0.35, 1, 0.15] } : { scaleY: 0.35 }}
        transition={{ duration: LIFT_S, times: [0, 0.45, 1], ease: "easeOut" }}
      />
      <div aria-hidden="true" className="lab-grid pointer-events-none absolute inset-0 opacity-60" />

      <AnimatePresence>
        {phase === "gate" && (
          <motion.button
            key="gate"
            type="button"
            onClick={() => start(true)}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 text-center"
          >
            <ElementTile symbol="Mg" number={12} size={72} tone="outline" />
            <motion.span
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-2 font-fellsc text-[22px] tracking-[0.32em] sm:text-[26px]"
            >
              <span className="[@media(pointer:coarse)]:hidden">Press any key</span>
              <span className="hidden [@media(pointer:coarse)]:inline">Tap to start</span>
            </motion.span>
            <span lang="ar" className="font-arabic text-[22px] text-smoke">
              <span className="[@media(pointer:coarse)]:hidden">دوس أي زرار</span>
              <span className="hidden [@media(pointer:coarse)]:inline">دوس في أي حتة</span>
            </span>
            <span className="mt-6 font-fellsc text-[13px] tracking-[0.24em] text-paper/45">Sound on</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* The mask: a cut-out illustration (amber pulled to lemon), breathing in the dark. */}
      <AnimatePresence>
        {phase === "mask" && (
          <motion.div
            key="mask"
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.35 } }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative w-[min(88vw,780px)]"
              initial={{ scale: 1.14 }}
              animate={{ scale: 1 }}
              transition={{ duration: BB_BEATS.swell + 0.4, ease: "linear" }}
            >
              {/* The filter canister's glow, driven by the music. */}
              <div className="absolute left-[81%] top-[36%] h-[62%] w-[44%] -translate-x-1/2 -translate-y-1/2">
                <div
                  ref={glow}
                  className="h-full w-full rounded-full bg-[radial-gradient(circle,rgb(79_209_127/0.85),rgb(79_209_127/0.25)_45%,transparent_70%)] mix-blend-screen blur-[14px]"
                />
              </div>
              <img src={bbMask} alt="" draggable={false} className="relative block w-full select-none [filter:drop-shadow(0_30px_60px_rgb(0_0_0/0.7))]" />
              {/* Breath at the exhale valve. */}
              <SmokeCanvas from={{ x: 0.74, y: 0.88, spread: 0.1 }} emitFor={8} rate={9} alpha={0.4} rise={0.14} className="absolute inset-0 h-full w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The tile and the name, on the swell. */}
      {phase !== "gate" && phase !== "mask" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <motion.div
            ref={glow}
            aria-hidden="true"
            className="absolute h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle,rgb(79_209_127/0.5),transparent_65%)] blur-[10px]"
          />
          <motion.div
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.28, ease: EASE_OUT_CUBIC }}
            className="relative [filter:drop-shadow(0_0_26px_rgb(79_209_127/0.55))]"
          >
            <ElementTile symbol="Mg" number={12} name="Magdy" size={Math.min(window.innerWidth * 0.42, window.innerHeight * 0.3, 190)} tone="solid" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
            <Wordmark typing className="text-[clamp(34px,5.4vw,66px)]" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="m-0 font-fellsc text-[14px] tracking-[0.34em] text-smoke sm:text-[17px]"
          >
            Backend engineer · Cairo
          </motion.p>
        </div>
      )}

      {/* Tape across the top and the bottom, and the lab's readout. */}
      {phase !== "gate" && (
        <>
          <motion.div
            aria-hidden="true"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_CUBIC }}
            className="tape pointer-events-none absolute inset-x-0 top-0 h-3.5"
          />
          <motion.div
            aria-hidden="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_CUBIC }}
            className="tape pointer-events-none absolute inset-x-0 bottom-0 h-3.5"
          />
          <p aria-hidden="true" className="pointer-events-none absolute bottom-8 left-6 m-0 flex flex-col gap-0.5 font-mono text-[11px] tracking-[0.14em] text-smoke sm:bottom-10 sm:left-12">
            <span>SAMPLE 001 · CAIRO</span>
            <span className="text-crystal">
              PURITY <span ref={purity}>{PURITY_FROM.toFixed(1)}</span>%
            </span>
          </p>
        </>
      )}

      {/* The theme's hits, as light. */}
      <motion.div
        key={flash}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(220_255_230/0.55),rgb(79_209_127/0.22)_45%,transparent_75%)]"
        initial={{ opacity: flash ? 1 : 0 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      />

      {phase !== "gate" && (
        <>
          <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-40" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgb(0_0_0/0.75)_100%)]" />
        </>
      )}

      {phase !== "lift" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            lift();
          }}
          className="absolute bottom-10 right-6 z-10 flex items-center gap-2.5 font-fellsc text-[14px] tracking-[0.16em] text-paper/55 hover:text-paper sm:bottom-12 sm:right-12"
        >
          Skip
          <kbd className="inline-flex h-6 min-w-[26px] items-center justify-center rounded-[3px] border-[1.4px] border-current px-1.5 font-mono text-[10px] font-bold">
            Esc
          </kbd>
        </button>
      )}
    </motion.div>
  );
};

export default IntroLab;
