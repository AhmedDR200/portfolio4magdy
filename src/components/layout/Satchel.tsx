import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { pauseScroll } from "../../utils/lenis";
import { EASE_OUT_EXPO } from "../../utils/motion";

// The satchel, RDR2's inventory, as the page about what I use: press I (or
// Satchel in the menu, or the link in The Stack). The drawings and logos load
// only when it first opens. It follows the theme like the rest of the site.

const EVENT = "satchel:open";
export const openSatchel = () => window.dispatchEvent(new Event(EVENT));

const SatchelPanel = lazy(() => import("./SatchelPanel"));

const isTyping = (target: EventTarget | null) =>
  !!(target as HTMLElement | null)?.closest?.("input, textarea, select, [contenteditable='true']");

const Satchel = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || isTyping(e.target)) return;
      if (e.key === "i" || e.key === "I") setOpen((v) => !v);
      else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    pauseScroll(true);
    return () => pauseScroll(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="satchel"
          role="dialog"
          aria-modal="true"
          aria-label="Satchel: what I use"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          className="fixed inset-0 z-[88] overflow-y-auto bg-[radial-gradient(ellipse_at_40%_30%,rgb(var(--graphite)),rgb(var(--ink))_75%)] px-4 py-6 text-paper sm:px-10 sm:py-10"
        >
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}>
            <Suspense fallback={<p className="m-0 font-fellsc text-[16px] tracking-[0.14em] text-smoke">Opening the satchel…</p>}>
              <SatchelPanel onClose={() => setOpen(false)} />
            </Suspense>
          </motion.div>
          <div aria-hidden="true" className="grain pointer-events-none fixed inset-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Satchel;
