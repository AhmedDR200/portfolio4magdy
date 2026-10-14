import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { dismissToast, useToasts, type Toast } from "../../utils/toast";
import { EASE_OUT_EXPO } from "../../utils/motion";
import Medal from "../atoms/Medal";

// RDR2's notifications: a smoky strip with a torn edge, fading out to the right.
const SMOKE = "bg-[linear-gradient(90deg,rgb(var(--graphite)/0.98)_55%,rgb(var(--graphite)/0.88))] text-paper";
const TONES = {
  frost: { card: SMOKE, kicker: "text-frost", ar: "text-smoke", medal: "frost" },
  paper: { card: SMOKE, kicker: "text-paper", ar: "text-smoke", medal: "paper" },
  legend: { card: "bg-frost text-ink", kicker: "text-ink", ar: "text-ink", medal: "ink" },
} as const;

const ToastCard = ({ toast }: { toast: Toast }) => {
  const tone = TONES[toast.tone ?? "frost"];

  useEffect(() => {
    const id = window.setTimeout(() => dismissToast(toast.id), 4500);
    return () => window.clearTimeout(id);
  }, [toast.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -48 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      onClick={() => dismissToast(toast.id)}
      className={`torn-2 pointer-events-auto flex w-full cursor-pointer items-center gap-3.5 p-3.5 pr-5 ${tone.card}`}
    >
      <Medal name={toast.icon} size={46} tone={tone.medal} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <b className={`font-fellsc text-[13px] font-normal tracking-[0.14em] ${tone.kicker}`}>{toast.kicker}</b>
        <span className="font-fell text-[22px] leading-tight">{toast.title}</span>
        <span lang="ar" dir="rtl" className={`text-left font-arabic text-[15px] leading-snug ${tone.ar}`}>
          {toast.ar}
        </span>
      </span>
      {toast.meta && <span className="shrink-0 text-[11px] opacity-60">{toast.meta}</span>}
    </motion.div>
  );
};

// Achievement and honor notifications, top left like the game's.
// Each hides after 4.5 s, or on click.
const Toasts = () => {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed left-4 top-[84px] [filter:drop-shadow(0_12px_20px_rgba(0,0,0,0.28))] z-[97] flex w-[min(420px,calc(100vw-32px))] flex-col items-start gap-2.5 sm:left-8 sm:top-[96px]"
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
