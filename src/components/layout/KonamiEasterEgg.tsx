import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { unlock } from "../../utils/achievements";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const SYMBOLS = ["✦", "200", "{ }", "</>", "✓", "API", "تمام"];

const KonamiEasterEgg = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let progress = 0;

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[progress]) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          setActive(true);
          unlock("old-school");
        }
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => setActive(false), 6500);
    return () => clearTimeout(id);
  }, [active]);

  const drops = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 2.8 + Math.random() * 2.5,
        size: 20 + Math.random() * 26,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActive(false)}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink/60 backdrop-blur-[2px]"
        >
          {drops.map((d) => (
            <motion.span
              key={d.id}
              aria-hidden="true"
              initial={{ y: "-12vh", rotate: 0, opacity: 0 }}
              animate={{ y: "112vh", rotate: 360, opacity: 1 }}
              transition={{
                duration: d.duration,
                delay: d.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 font-display text-volt"
              style={{ left: `${d.left}%`, fontSize: `${d.size}px` }}
            >
              {d.symbol}
            </motion.span>
          ))}

          <motion.div
            initial={{ scale: 0.7, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 mx-4 max-w-md rounded-[24px] border-2 border-volt bg-graphite px-8 py-7 text-center"
          >
            <p className="m-0 font-display text-[56px] leading-none text-volt">200 OK</p>
            <h3 className="m-0 mt-3 font-display text-[28px] font-normal uppercase">Cheat code unlocked!</h3>
            <p className="m-0 mt-2 text-[14px] leading-[22px] text-smoke">
              <span className="text-volt">--ship-it</span> mode engaged. All tests green, zero downtime,
              infinite uptime. You found the secret — now go build something great.
            </p>
            <button
              type="button"
              onClick={() => setActive(false)}
              className="mt-5 h-11 rounded-full bg-volt px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink"
            >
              Deploy to prod
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KonamiEasterEgg;
