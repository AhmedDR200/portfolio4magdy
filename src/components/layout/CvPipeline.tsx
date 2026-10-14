import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { config } from "../../constants/config";
import { unlock } from "../../utils/achievements";
import { changeHonor } from "../../utils/honor";
import { EASE_OUT_EXPO } from "../../utils/motion";

// Clicking a Resume link (any <a data-cv>) runs a small CI pipeline before the
// download starts: build → test → deploy → "CV delivered". It mirrors the
// real one, .github/workflows/sync-cv.yml, which copies the CV from Overleaf
// to a GitHub release every 3 hours. Modified clicks (new tab, etc.) and
// reduced motion skip the show. The whole run stays under the browser's
// ~5 s window for starting a download from a click.

const STEPS = [
  { job: "build", label: "Fetch the latest CV from Overleaf", ms: 700 },
  { job: "test", label: "Check it's a real PDF", ms: 500 },
  { job: "deploy", label: "Deliver to your downloads", ms: 600 },
];
const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const CLOSE_AFTER_MS = 2600;

const download = () => {
  const a = document.createElement("a");
  a.href = config.cvUrl;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const CvPipeline = () => {
  const reduce = useReducedMotion();
  // -1: closed. 0…STEPS.length-1: that step is running. STEPS.length: done.
  const [step, setStep] = useState(-1);
  const [frame, setFrame] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.("a[data-cv]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      setRun((r) => r + 1);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Each click starts a fresh run.
  useEffect(() => {
    if (!run) return;
    unlock("hired");
    changeHonor(2, "cv");
    if (reduce) {
      download();
      setStep(STEPS.length);
      return;
    }
    setStep(0);
    const timers: number[] = [];
    let at = 0;
    STEPS.forEach((s, i) => {
      at += s.ms;
      timers.push(window.setTimeout(() => setStep(i + 1), at));
    });
    timers.push(window.setTimeout(download, at));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [run, reduce]);

  // Close a while after it's delivered.
  useEffect(() => {
    if (step !== STEPS.length) return;
    const id = window.setTimeout(() => setStep(-1), CLOSE_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [step, run]);

  // The terminal spinner on the running step.
  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % SPINNER.length), 80);
    return () => window.clearInterval(id);
  }, [step]);

  const done = step === STEPS.length;

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[96] flex justify-center px-5">
      <AnimatePresence>
        {step >= 0 && (
          <motion.div
            key="cv-pipeline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="pointer-events-auto w-full max-w-[440px] overflow-hidden rounded-[22px] border border-frost/40 bg-ink/95 text-[12px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-5 py-3">
              <span className="text-smoke">
                <span className="text-frost">›</span> gh run watch <span className="text-paper">sync-cv.yml</span>
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setStep(-1)}
                className="text-[16px] leading-none text-smoke hover:text-frost"
              >
                ×
              </button>
            </div>
            <div className="h-[2px] bg-paper/10">
              <div
                className="h-full bg-frost transition-[width] duration-500 ease-out"
                style={{ width: `${(Math.max(step, 0) / STEPS.length) * 100}%` }}
              />
            </div>

            <ol className="m-0 flex list-none flex-col gap-2 px-5 py-4">
              {STEPS.map((s, i) => {
                const state = i < step ? "done" : i === step ? "running" : "queued";
                return (
                  <li key={s.job} className="flex items-baseline gap-3">
                    <span className={`w-3 shrink-0 ${state === "queued" ? "text-dim" : "text-frost"}`}>
                      {state === "done" ? "✓" : state === "running" ? SPINNER[frame] : "○"}
                    </span>
                    <span className={`w-[52px] shrink-0 uppercase tracking-[0.1em] ${state === "queued" ? "text-dim" : "text-paper"}`}>
                      {s.job}
                    </span>
                    <span className={`min-w-0 flex-1 truncate ${state === "queued" ? "text-dim" : "text-mist"}`}>{s.label}</span>
                    <span className="shrink-0 tabular-nums text-smoke">
                      {state === "done" ? `${(s.ms / 1000).toFixed(1)}s` : ""}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-paper/10 px-5 py-3 transition-colors ${
                done ? "bg-frost text-ink" : "text-smoke"
              }`}
            >
              {done ? (
                <>
                  <b className="text-[13px]">✓ CV delivered · Ahmed_Magdy_CV.pdf</b>
                  <a href={config.cvUrl} download className="underline">
                    Didn't start? Download ↓
                  </a>
                </>
              ) : (
                <span>The real pipeline runs every 3 h on GitHub Actions.</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CvPipeline;
