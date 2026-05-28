import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const EMOJIS = ["🚀", "🐛", "⚡", "🛰️", "💾", "📦", "✅"];

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
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
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
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black/40 backdrop-blur-[2px]"
        >
          {drops.map((d) => (
            <motion.span
              key={d.id}
              initial={{ y: "-12vh", rotate: 0, opacity: 0 }}
              animate={{ y: "112vh", rotate: 360, opacity: 1 }}
              transition={{
                duration: d.duration,
                delay: d.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: `${d.left}%`,
                fontSize: `${d.size}px`,
                position: "absolute",
                top: 0,
              }}
            >
              {d.emoji}
            </motion.span>
          ))}

          <motion.div
            initial={{ scale: 0.7, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-tertiary relative z-10 mx-4 max-w-md rounded-2xl border border-[#00FF88]/40 px-8 py-7 text-center shadow-2xl"
          >
            <div className="text-[40px]">🚀</div>
            <h3 className="mt-2 text-[22px] font-black text-white">
              Cheat code unlocked!
            </h3>
            <p className="text-secondary mt-2 text-[14px] leading-[22px]">
              <span className="font-mono text-[#00FF88]">--ship-it</span> mode
              engaged. All tests green, zero downtime, infinite uptime. You found
              the secret — now go build something great.
            </p>
            <button
              type="button"
              onClick={() => setActive(false)}
              className="mt-5 rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 px-5 py-2 text-[14px] font-semibold text-white transition-all hover:scale-105 hover:border-[#00FF88]"
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
