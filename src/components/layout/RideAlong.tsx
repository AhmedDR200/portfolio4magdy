import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useBond } from "../../utils/bond";
import Horse from "../atoms/Horse";

// Reading progress as a rail across the top of the page, with a real horse
// riding it (Muybridge's 1878 gallop). The gallop advances with the distance
// scrolled, so it only runs while you scroll; dust builds up with speed; at
// the end it pulls in at the 200 OK station. Shown once the hero is gone.
// Reduced motion keeps the rail and drops the horse. The rail and its
// station stop short of the round menu button at the top right, over a fade
// to ink so the page scrolls under it cleanly.

const PX_PER_FRAME = 36;

const RideAlong = () => {
  const reduce = useReducedMotion();
  const { name } = useBond();
  const [state, setState] = useState({ visible: false, progress: 0, frame: 0, speed: 0 });
  const travelled = useRef(0);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let calm = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const now = performance.now();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const delta = Math.abs(y - lastY);
      travelled.current += delta;
      const speed = delta / Math.max(16, now - lastT); // px per ms
      lastY = y;
      lastT = now;
      setState({
        visible: y > window.innerHeight * 0.8,
        progress: max > 0 ? Math.min(1, y / max) : 0,
        frame: Math.floor(travelled.current / PX_PER_FRAME),
        speed,
      });
      // Let the dust settle once scrolling stops.
      window.clearTimeout(calm);
      calm = window.setTimeout(() => setState((s) => ({ ...s, speed: 0 })), 160);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(calm);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const arrived = state.progress > 0.995;
  const dust = arrived ? 0 : Math.min(4, Math.round(state.speed * 2.5));
  const pct = `${state.progress * 100}%`;

  return (
    <AnimatePresence>
      {state.visible && (
        <motion.div
          key="ride"
          aria-hidden="true"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[66px] bg-gradient-to-b from-ink via-ink/85 to-transparent"
        >
          <div className="absolute left-4 right-[104px] top-0 h-[50px] sm:left-6 sm:right-[204px]">
            {/* The rail, and how far along it you are. */}
            <span className="absolute inset-x-0 top-[44px] border-t border-dashed border-paper/20" />
            <span className="absolute left-0 top-[43px] h-[3px] rounded-full bg-frost" style={{ width: pct }} />

            {!reduce && (
              <span className="absolute top-[7px] -translate-x-full" style={{ left: pct }}>
                <span className="relative flex">
                  {Array.from({ length: dust }, (_, i) => (
                    <span
                      key={i}
                      className="absolute rounded-full bg-frost"
                      style={{
                        right: `calc(100% - 6px + ${i * 11}px)`,
                        top: `${30 - (i % 2) * 5}px`,
                        width: 6 - i,
                        height: 6 - i,
                        opacity: 0.55 - i * 0.1,
                      }}
                    />
                  ))}
                  {/* Once named (bond level 4), the horse carries its name. */}
                  {name && (
                    <span lang="ar" dir="auto" className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap font-arabic text-[13px] leading-none text-frost">
                      {name}
                    </span>
                  )}
                  <Horse frame={arrived ? 0 : state.frame} className="h-[38px] w-[61px] text-frost" />
                </span>
              </span>
            )}

            {/* The station at the end of the line. */}
            <span className="absolute -right-[84px] top-[6px] hidden flex-col items-center sm:flex">
              <span
                className={`rounded border-2 px-2 py-0.5 font-western text-[12px] leading-tight transition-colors ${
                  arrived ? "border-frost bg-frost text-ink" : "border-paper/35 bg-ink/80 text-mist"
                }`}
              >
                200 OK
              </span>
              <span className="h-4 w-0.5 bg-paper/35" />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RideAlong;
