import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { dismissToast, useToasts, type Toast } from "../../utils/toast";
import { EASE_OUT_EXPO } from "../../utils/motion";
import Medal from "../atoms/Medal";

const TONES = {
  volt: { card: "border-volt/45 bg-ink/95 text-paper", kicker: "text-volt", ar: "text-smoke", medal: "volt" },
  paper: { card: "border-paper/20 bg-ink/95 text-paper", kicker: "text-paper", ar: "text-smoke", medal: "paper" },
  legend: { card: "border-volt bg-volt text-ink", kicker: "text-ink", ar: "text-ink", medal: "ink" },
} as const;

const ToastCard = ({ toast }: { toast: Toast }) => {
  const tone = TONES[toast.tone ?? "volt"];

  useEffect(() => {
    const id = window.setTimeout(() => dismissToast(toast.id), 4500);
    return () => window.clearTimeout(id);
  }, [toast.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 48 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      onClick={() => dismissToast(toast.id)}
      className={`pointer-events-auto flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border p-3 pr-4 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md ${tone.card}`}
    >
      <Medal name={toast.icon} size={46} tone={tone.medal} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <b className={`text-[10px] uppercase tracking-[0.16em] ${tone.kicker}`}>{toast.kicker}</b>
        <span className="font-western text-[19px] leading-tight">{toast.title}</span>
        <span lang="ar" dir="rtl" className={`text-left font-arabic text-[15px] leading-snug ${tone.ar}`}>
          {toast.ar}
        </span>
      </span>
      {toast.meta && <span className="shrink-0 text-[11px] opacity-60">{toast.meta}</span>}
    </motion.div>
  );
};

// Achievement and honor notifications, top right under the menu button.
// Each hides after 4.5 s, or on click.
const Toasts = () => {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-[96px] z-[97] flex w-[min(420px,calc(100vw-32px))] flex-col items-end gap-2.5 sm:right-8 sm:top-[124px]"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
