import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { unlock } from "../../utils/achievements";
import { EASE_OUT_EXPO } from "../../utils/motion";
import Autoscaler from "./Autoscaler";

// Scrolling the page is a request travelling through a backend: each hop is
// a section, reached when its top crosses the middle of the screen. The ms
// per hop are for show; they add up to a quick 80 ms round trip.
const HOPS = [
  { section: "about", name: "Client", ms: 0 },
  { section: "impact", name: "Edge", ms: 4 },
  { section: "services", name: "Gateway", ms: 9 },
  { section: "work", name: "Service", ms: 38 },
  { section: "experience", name: "Cache miss", ms: 2 },
  { section: "principles", name: "DB", ms: 21 },
  { section: "contact", name: "200 OK", ms: 6 },
];
const LAST = HOPS.length - 1;

type Trace = { visible: boolean; position: number };

/** position runs from 0 (Client) to LAST (200 OK), fractional between hops. */
const readTrace = (): Trace => {
  const mid = window.scrollY + window.innerHeight / 2;
  const tops = HOPS.map(({ section }) => {
    const el = document.getElementById(section);
    return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
  });
  let position = 0;
  for (let i = 0; i < LAST; i++) {
    if (mid >= tops[i + 1]) {
      position = i + 1;
      continue;
    }
    if (mid > tops[i]) position = i + (mid - tops[i]) / (tops[i + 1] - tops[i]);
    break;
  }
  // Shown from the moment the request leaves the client (About reaches the middle).
  return { visible: mid >= tops[0], position };
};

const latencyAt = (position: number) => {
  const passed = Math.floor(position);
  let ms = 0;
  for (let i = 1; i <= passed; i++) ms += HOPS[i].ms;
  if (passed < LAST) ms += (position - passed) * HOPS[passed + 1].ms;
  return Math.round(ms);
};

const RequestTrace = () => {
  const [trace, setTrace] = useState<Trace>({ visible: false, position: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = readTrace();
      setTrace((prev) =>
        prev.visible === next.visible && Math.abs(prev.position - next.position) < 0.002 ? prev : next
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const { visible, position } = trace;
  const done = position >= LAST - 0.001;

  useEffect(() => {
    if (done) unlock("trail-rider");
  }, [done]);
  // Name the hop the packet is heading to (or sitting on).
  const hop = HOPS[Math.max(0, Math.ceil(position - 0.001))];
  const progress = `${(position / LAST) * 100}%`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="trace"
          aria-hidden="true"
          data-xray="trace"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="pointer-events-none fixed bottom-5 left-5 z-[60] flex flex-col rounded-[24px] border border-paper/15 bg-ink/80 py-3 pl-4 pr-5 text-[11px] uppercase tracking-[0.12em] backdrop-blur-md sm:bottom-8 sm:left-8"
        >
          <div className="flex items-center gap-4">
            <span className="hidden whitespace-nowrap text-smoke sm:inline">
              <span className="text-volt">›</span> GET /ahmed
            </span>

            <span className="relative h-3 w-[110px] shrink-0 sm:w-[190px]">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper/20" />
              <span className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-volt" style={{ width: progress }} />
              {HOPS.map((h, i) => (
                <span
                  key={h.section}
                  className={`absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    i <= position + 0.001 ? "bg-volt" : "bg-paper/30"
                  }`}
                  style={{ left: `${(i / LAST) * 100}%` }}
                />
              ))}
              <span
                className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt ${
                  done ? "animate-pulse-volt" : "shadow-[0_0_14px_rgba(212,255,58,0.85)]"
                }`}
                style={{ left: progress }}
              />
            </span>

            <span className="w-[120px] shrink-0 whitespace-nowrap tabular-nums">
              <span className={done ? "text-volt" : ""}>{hop.name}</span>{" "}
              <span className="text-smoke">{latencyAt(position)}ms</span>
            </span>
          </div>
          <Autoscaler />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestTrace;
