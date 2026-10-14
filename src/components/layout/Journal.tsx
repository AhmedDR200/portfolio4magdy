import { useEffect, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ACHIEVEMENTS, resetAchievements, useUnlocked } from "../../utils/achievements";
import { resetHonor } from "../../utils/honor";
import { pauseScroll } from "../../utils/lenis";
import { EASE_OUT_EXPO } from "../../utils/motion";
import Medal from "../atoms/Medal";

type Props = { open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> };

// Press J: the journal of achievements, unlocked ones in volt. Secret ones
// stay a mystery until found.
const Journal = ({ open, onOpenChange }: Props) => {
  const unlocked = useUnlocked();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "j" || e.key === "J") onOpenChange((v) => !v);
      else if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    pauseScroll(true);
    return () => pauseScroll(false);
  }, [open]);

  const done = unlocked.length;
  const total = ACHIEVEMENTS.length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="journal"
          role="dialog"
          aria-modal="true"
          aria-label="Achievements"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
          className="fixed inset-0 z-[88] overflow-y-auto bg-ink/85 px-4 py-6 backdrop-blur-md sm:px-10 sm:py-12"
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="mx-auto flex max-w-[1100px] flex-col gap-6 rounded-[28px] border border-paper/15 bg-[#0F0F0F] p-5 text-paper sm:p-9"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="m-0 flex items-baseline gap-3.5">
                  <span className="font-western text-[32px] leading-none sm:text-[40px]">Achievements</span>
                  <span lang="ar" className="font-arabic text-[22px] text-smoke">
                    الإنجازات
                  </span>
                </p>
                <p className="m-0 max-w-[560px] text-[13px] leading-relaxed text-smoke">
                  Every badge points at something on the site: a mode, a demo, a section. Kept in this browser only.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full border border-paper/25 px-3.5 py-2 text-[12px] uppercase tracking-[0.1em] hover:border-volt hover:text-volt"
              >
                Close · J
              </button>
            </div>

            <div className="flex items-center gap-4 text-[12px] text-mist">
              <span className="shrink-0 tabular-nums">
                {done} / {total} unlocked
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
                <span className="block h-full bg-volt transition-[width] duration-700" style={{ width: `${(done / total) * 100}%` }} />
              </span>
            </div>

            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {ACHIEVEMENTS.map((a) => {
                const has = unlocked.includes(a.id);
                const hidden = a.secret && !has;
                return (
                  <li
                    key={a.id}
                    className={`flex items-center gap-3.5 rounded-2xl border p-3.5 ${
                      has ? "border-paper/10 bg-[#151515]" : "border-paper/5 bg-transparent"
                    }`}
                  >
                    <Medal name={hidden ? "keyhole" : a.icon} size={46} tone={has ? "volt" : "dim"} />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className={`font-western text-[17px] leading-tight ${has ? "" : "text-dim"}`}>
                        {hidden ? "???" : a.title}
                      </span>
                      <span lang="ar" dir="rtl" className="text-left font-arabic text-[15px] text-smoke">
                        {hidden ? "إنجاز سري" : a.ar}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-dim">
              <span lang="ar" className="font-arabic text-[18px] text-smoke">
                {done === total ? "أسطورة الغرب. كلّمني بقى." : "لسه فيه حاجات مستخبية في الموقع."}
              </span>
              <button type="button" onClick={() => {
                  resetAchievements();
                  resetHonor();
                }} className="underline-offset-4 hover:text-paper hover:underline">
                Reset progress
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Journal;
