import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

import { loggedFetch } from "../../utils/apiLog";
import { changeHonor } from "../../utils/honor";
import Icon from "../atoms/Icon";

// "Tip your hat": a counter every visitor shares, backed by api/tip.ts (a
// Vercel Function on Upstash Redis). Until that storage is connected the
// endpoint isn't there, and this hides itself rather than show a fake number.

type Tips = { count: number; countries: number; latest: string[]; already?: boolean };

const TIPPED_KEY = "hat-tipped-on";
const today = () => new Date().toISOString().slice(0, 10);
const tippedToday = () => {
  try {
    return localStorage.getItem(TIPPED_KEY) === today();
  } catch {
    return false;
  }
};

const HatTip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "300px" });
  const [tips, setTips] = useState<Tips | null>(null);
  const [state, setState] = useState<"idle" | "tipping" | "done">(() => (tippedToday() ? "done" : "idle"));

  useEffect(() => {
    if (!inView) return;
    loggedFetch("/api/tip")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Tips | null) => data && typeof data.count === "number" && setTips(data))
      .catch(() => undefined);
  }, [inView]);

  const tip = async () => {
    if (state !== "idle") return;
    setState("tipping");
    try {
      const res = await loggedFetch("/api/tip", { method: "POST" });
      const data = (await res.json()) as Tips;
      if (!res.ok || typeof data.count !== "number") throw new Error();
      // Let the hat finish its lift before the number changes.
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setTips(data);
      setState("done");
      changeHonor(1, "tip-hat");
      try {
        localStorage.setItem(TIPPED_KEY, today());
      } catch {
        // Storage blocked: the server still counts it once a day.
      }
    } catch {
      setState("idle");
    }
  };

  if (!tips) return <div ref={ref} />;

  const done = state === "done";
  return (
    <div ref={ref} className="mt-10 flex flex-col gap-4 border-t border-paper/15 pt-8">
      <p className="m-0 text-[12px] uppercase tracking-[0.14em] text-smoke">
        Not hiring? Tip your hat instead ·{" "}
        <span lang="ar" className="font-arabic text-[16px] normal-case tracking-normal">
          شيل القبعة
        </span>
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="button"
          onClick={tip}
          disabled={state !== "idle"}
          aria-live="polite"
          className={`flex h-14 items-center gap-3.5 rounded-full border py-1.5 pl-1.5 pr-6 transition-colors ${
            done
              ? "border-volt bg-volt text-ink"
              : state === "tipping"
                ? "border-volt bg-volt/10 text-volt"
                : "border-paper/30 hover:border-volt hover:text-volt"
          }`}
        >
          <span className={`relative flex h-11 w-11 items-center justify-center rounded-full ${done ? "bg-ink text-volt" : "bg-volt text-ink"}`}>
            <motion.span
              className="flex"
              animate={state === "tipping" ? { y: -12, rotate: -14 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Icon name="hat" size={24} />
            </motion.span>
          </span>
          <span className="text-[13px] font-extrabold uppercase tracking-[0.1em]">
            {done ? "Tipped · thanks, partner" : state === "tipping" ? "Tipping…" : "Tip your hat"}
          </span>
        </button>

        <span className="flex items-baseline gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={tips.count}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              className="font-display text-[44px] leading-none text-volt"
            >
              {tips.count.toLocaleString("en")}
            </motion.span>
          </AnimatePresence>
          <span className="text-[12px] text-smoke">
            {tips.count === 1 ? "tip" : "tips"}
            {tips.countries > 0 && ` from ${tips.countries} ${tips.countries === 1 ? "country" : "countries"}`}
          </span>
        </span>

        {tips.latest.length > 0 && (
          <span className="flex items-center gap-1.5 text-[11px] text-dim">
            {tips.latest.map((code, i) => (
              <span key={`${code}-${i}`} className="rounded-md border border-paper/20 px-2 py-0.5 text-mist">
                {code}
              </span>
            ))}
            latest
          </span>
        )}
      </div>
    </div>
  );
};

export default HatTip;
