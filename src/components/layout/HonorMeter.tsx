import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { unlock } from "../../utils/achievements";
import { changeHonor, HONOR_MAX, useHonor, useLastHonorChange } from "../../utils/honor";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { showToast } from "../../utils/toast";
import Icon from "../atoms/Icon";

const standing = (honor: number) =>
  honor >= 4 ? "شريف المدينة" : honor >= 1 ? "سمعتك حلوة" : honor === 0 ? "لسه بنتعرّف" : honor >= -3 ? "سمعتك في النازل" : "مطلوب!";

// The honor moves that come from clicks and scrolling anywhere on the page.
// The rest are called where they happen (the CV, the Bee3a demo, case studies…).
const useHonorTriggers = () => {
  useEffect(() => {
    let last: Element | null = null;
    let clicks: number[] = [];
    let topAt = 0;

    const onClick = (e: MouseEvent) => {
      const el = e.target as Element;
      const link = el.closest?.("a");
      if (link?.href.startsWith("mailto:")) changeHonor(3, "email");
      if (link?.href.includes("sub_confirmation")) {
        changeHonor(2, "subscribe");
        unlock("subscriber");
      }

      // Spam: the same thing clicked six times in 1.5 s. The Bee3a demo is
      // exempt, since ringing up six items quickly is just using it.
      if (el.closest?.('[data-xray="bee3a-demo"]')) return;
      const target = el.closest?.("a, button") ?? el;
      const now = Date.now();
      clicks = target === last ? [...clicks.filter((t) => now - t < 1500), now] : [now];
      last = target;
      if (clicks.length >= 6) {
        clicks = [];
        if (changeHonor(-1, "spam")) {
          showToast({ icon: "stopwatch", kicker: "429 Too Many Requests", title: "Easy, cowboy", ar: "اهدى شوية", tone: "paper" });
        }
      }
    };

    // Speed-running the whole page in under 5 s.
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 200) topAt = Date.now();
      else if (topAt && y >= document.documentElement.scrollHeight - window.innerHeight - 80) {
        if (Date.now() - topAt < 5000) changeHonor(-1, "speedrun");
        topAt = 0;
      }
    };

    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
};

// Honor, bottom right: a sheriff's star that opens into a meter for a few
// seconds whenever honor changes. Hidden until the first change.
const HonorMeter = () => {
  const honor = useHonor();
  const change = useLastHonorChange();
  const [expanded, setExpanded] = useState(false);
  useHonorTriggers();

  useEffect(() => {
    if (!change) return;
    setExpanded(true);
    const id = window.setTimeout(() => setExpanded(false), 3200);
    return () => window.clearTimeout(id);
  }, [change]);

  if (!change && honor === 0) return null;

  const starColor = honor > 0 ? "text-volt" : honor < 0 ? "text-smoke" : "text-paper";

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[61] flex flex-col items-end gap-2 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="meter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="relative flex items-center gap-3 rounded-full border border-paper/15 bg-ink/92 px-4 py-2.5 backdrop-blur-md"
          >
            <span className="text-[11px] uppercase tracking-[0.14em]">Honor</span>
            <span className="relative grid w-[120px] grid-cols-10 gap-[3px] sm:w-[180px]" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => {
                const v = i < 5 ? i - 5 : i - 4;
                const filled = v < 0 ? honor <= v : honor >= v;
                return (
                  <i key={i} className={`h-2.5 rounded-[2px] ${filled ? (v > 0 ? "bg-volt" : "bg-smoke") : "bg-paper/10"}`} />
                );
              })}
              <span className="absolute -bottom-1 -top-1 left-1/2 w-0.5 -translate-x-1/2 bg-paper" />
            </span>
            <span lang="ar" className={`whitespace-nowrap font-arabic text-[15px] ${honor >= HONOR_MAX ? "text-volt" : ""}`}>
              {standing(honor)}
            </span>
            {change && (
              <motion.span
                key={change.at}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0, 1, 1, 0], y: [6, -8, -8, -16] }}
                transition={{ duration: 2.4, times: [0, 0.15, 0.7, 1] }}
                className={`absolute -top-3 right-5 rounded-full px-2 py-0.5 text-[12px] font-extrabold ${
                  change.delta > 0 ? "bg-volt text-ink" : "bg-paper text-ink"
                }`}
              >
                {change.delta > 0 ? `+${change.delta}` : change.delta}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-label={`Honor: ${honor} of ${HONOR_MAX}. ${standing(honor)}`}
        onClick={() => setExpanded((v) => !v)}
        className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 bg-ink/92 backdrop-blur-md ${starColor}`}
      >
        <Icon name="star" size={22} />
      </button>
    </div>
  );
};

export default HonorMeter;
