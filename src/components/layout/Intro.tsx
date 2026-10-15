import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { audioContext, INTRO_BEATS, loadLocalTrack, playGunIntro, playLocalTrack, unlockAudio, type LocalTrack } from "../../utils/gunfx";
import { EASE_OUT_CUBIC, markIntroSeen } from "../../utils/motion";
import { Breech, ShellSide } from "../atoms/IntroArt";
import SmokeCanvas from "../atoms/SmokeCanvas";
import Wordmark from "../atoms/Wordmark";

// First-visit intro, on the beats of RDR2's opening: smoke drifting up a black
// screen and a red shell falling past, the breech of a double-barrel with two
// shells stamped with my name, the shot, and a hard cut to the logo in red,
// held, then faded out. Browsers only allow sound after the visitor does
// something, so it starts on "Press any key" (like the game), unless sound is
// already allowed; with no answer it plays silently after a few seconds.
// Esc or Skip jumps straight to the site.
// The sound is RDR2's original opening (© Rockstar Games, used with their
// permission), and the whole timeline follows its shot; if it can't load, the
// synthesized sounds in utils/gunfx play instead.

const BREECH_BEFORE_S = 0.85; // the breech shows this long before the shot
const HOLD_S = 5.4; // the logo on screen after the shot
const FADE_S = 0.5;
const SILENT_AFTER_MS = 7000;
const LIFT_S = 0.9;
const RED = "200 16 46";
const wait = (ms: number) => new Promise<null>((resolve) => window.setTimeout(() => resolve(null), ms));

type Phase = "gate" | "open" | "breech" | "logo" | "out" | "lift";
type Props = {
  /** Called when the curtain starts lifting, so the hero can rise with it. */
  onReveal: () => void;
  /** Called once the curtain is fully off screen. */
  onDone: () => void;
};

const Intro = ({ onReveal, onDone }: Props) => {
  const [phase, setPhase] = useState<Phase>("gate");
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const local = useRef<Promise<LocalTrack | null> | null>(null);
  const lifted = useRef(false);

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
      // In the tap or key press itself, before any await: iOS only unlocks
      // audio from a gesture.
      const resumed = ctx ? unlockAudio(ctx).then(() => true, () => false) : Promise.resolve(false);
      // The picture never waits on the sound.
      setPhase("open");
      const tapped = performance.now();

      void (async () => {
        let fire = INTRO_BEATS.fire;
        let soundAt = tapped;
        // At most 0.7 s for the sound to be ready; after that the picture goes on without it.
        const running = (await Promise.race([resumed, wait(500)])) === true && ctx?.state === "running";
        if (ctx && running && !lifted.current) {
          const left = Math.max(0, 700 - (performance.now() - tapped));
          const track = await Promise.race([local.current ?? Promise.resolve(null), wait(left)]);
          if (lifted.current) return;
          try {
            if (track) {
              const delay = 0.05;
              playLocalTrack(ctx, track, delay);
              fire = track.fire;
              soundAt = performance.now() + delay * 1000;
            } else {
              playGunIntro(ctx);
              soundAt = performance.now();
            }
          } catch {
            // No sound: the picture still plays.
          }
        }
        if (lifted.current) return;
        // Every beat is timed from when the sound started (or the tap, with no sound).
        const since = (performance.now() - soundAt) / 1000;
        const at = (s: number, fn: () => void) => timers.current.push(window.setTimeout(fn, Math.max(0, (s - since) * 1000)));
        at(fire - BREECH_BEFORE_S, () => setPhase("breech"));
        at(fire, () => setPhase("logo"));
        at(fire + HOLD_S, () => setPhase("out"));
        at(fire + HOLD_S + FADE_S, lift);
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
    // Fetch and decode a local recording while the gate is up.
    if (ctx) local.current = loadLocalTrack(ctx);
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

  return (
    <motion.div
      aria-label="Opening: press any key"
      role="dialog"
      className="theme-dark fixed inset-0 z-[100] overflow-hidden bg-black text-paper"
      initial={false}
      animate={{ y: phase === "lift" ? "-128%" : "0%" }}
      transition={{ duration: LIFT_S, ease: EASE_OUT_CUBIC }}
      onAnimationComplete={() => {
        if (phase === "lift") onDone();
      }}
    >
      {/* The bottom edge sags into a curve mid-lift, then flattens. */}
      <motion.span
        className="absolute left-[-15%] top-[calc(100%-2px)] h-[33vh] w-[130%] origin-top rounded-b-[50%] bg-black"
        initial={{ scaleY: 0.35 }}
        animate={phase === "lift" ? { scaleY: [0.35, 1, 0.15] } : { scaleY: 0.35 }}
        transition={{ duration: LIFT_S, times: [0, 0.45, 1], ease: "easeOut" }}
      />

      <AnimatePresence>
        {phase === "gate" && (
          <motion.button
            key="gate"
            type="button"
            onClick={() => start(true)}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 text-center"
          >
            <motion.span
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="font-fellsc text-[18px] tracking-[0.32em] sm:text-[22px]"
            >
              <span className="[@media(pointer:coarse)]:hidden">Press any key</span>
              <span className="hidden [@media(pointer:coarse)]:inline">Tap to start</span>
            </motion.span>
            <span lang="ar" className="font-ruqaa text-[22px] text-smoke">
              <span className="[@media(pointer:coarse)]:hidden">دوس أي زرار</span>
              <span className="hidden [@media(pointer:coarse)]:inline">دوس في أي حتة</span>
            </span>
            <span className="mt-6 font-fellsc text-[12px] tracking-[0.2em] text-paper/45">Sound on</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* The smoke left by the shot before, and a spent shell falling past the lens. */}
      {phase === "open" && (
        <div aria-hidden="true" className="absolute inset-0">
          <SmokeCanvas from={{ x: 0.6, y: 1.02, spread: 0.26 }} emitFor={1.5} rate={18} alpha={0.55} rise={0.24} className="absolute inset-0" />
          <motion.div
            className="absolute w-[38vw] max-w-[520px] [filter:blur(3px)]"
            initial={{ left: "60%", top: "-45%", rotate: 16 }}
            animate={{ left: "32%", top: ["-45%", "-8%", "-45%"], rotate: -30 }}
            transition={{ duration: 0.75, delay: 1.2, ease: "easeInOut" }}
          >
            <ShellSide className="h-auto w-full" />
          </motion.div>
        </div>
      )}

      {phase === "breech" && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.06 }}
          transition={{ opacity: { duration: 0.18 }, scale: { duration: BREECH_BEFORE_S + 0.2, ease: "linear" } }}
        >
          <div className="aspect-video w-[min(100vw,177.8vh)]">
            <Breech play />
          </div>
        </motion.div>
      )}

      {(phase === "logo" || phase === "out") && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "out" ? 0 : 1 }}
          transition={{ duration: FADE_S }}
        >
          {/* The shot's smoke, drifting across behind the logo. */}
          <SmokeCanvas from={{ x: 0.5, y: 0.8, spread: 0.55 }} emitFor={1.2} rate={10} alpha={0.22} rise={0.09} className="absolute inset-0" />
          {/* The logo in red, framed like a badge, glowing a little. */}
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 1, 0.55, 1, 0.85, 1], scale: 1.035 }}
            transition={{ opacity: { duration: 0.32, times: [0, 0.12, 0.3, 0.45, 0.7, 1] }, scale: { duration: HOLD_S, ease: "linear" } }}
            className="relative flex items-center rounded-[0.32em] border-[3px] border-[rgb(200_16_46)] px-[0.45em] py-[0.2em] text-[clamp(40px,5.4vw,78px)] text-paper [filter:drop-shadow(0_0_16px_rgba(200,16,46,0.5))]"
            style={{ "--frost": RED, "--paper": RED } as CSSProperties}
          >
            <Wordmark />
          </motion.div>
        </motion.div>
      )}

      {phase !== "gate" && (
        <>
          <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 !opacity-[0.14]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(0,0,0,0.75)_100%)]" />
        </>
      )}

      {phase !== "lift" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            lift();
          }}
          className="absolute bottom-8 right-6 z-10 flex items-center gap-2.5 font-fellsc text-[13px] tracking-[0.16em] text-paper/55 hover:text-paper sm:bottom-12 sm:right-12"
        >
          Skip
          <kbd className="inline-flex h-6 min-w-[26px] items-center justify-center rounded-[5px] border-[1.4px] border-current px-1.5 font-mono text-[10px] font-bold">
            Esc
          </kbd>
        </button>
      )}
    </motion.div>
  );
};

export default Intro;
