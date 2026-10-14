import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { unlock } from "../../utils/achievements";
import Arrow from "../atoms/Arrow";

// Scrolling speed as traffic, Kubernetes-style: faster scrolling means more
// requests per second, and pods are added to keep each one under its target
// load. Like a real HPA, scaling up is immediate but scaling down waits for a
// stabilization window, then removes one pod at a time. Purely for show.

type Pod = { id: number; ready: boolean };

const IDLE_RPS = 8;
const RPS_PER_PX_S = 0.5; // 1,000 px/s of scrolling ≈ 500 requests/s
const TARGET_RPS_PER_POD = 200;
const MAX_PODS = 12;
const BOOT_MS = 450; // ContainerCreating → Running
const STABILIZE_MS = 1200; // calm this long before scaling down
const SCALE_DOWN_STEP_MS = 450;

const useAutoscaler = () => {
  const [rps, setRps] = useState(IDLE_RPS);
  const [pods, setPods] = useState<Pod[]>([{ id: 0, ready: true }]);
  const [trend, setTrend] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let lastT = 0;
    let velocity = 0; // px/s, smoothed
    let count = 1;
    let nextId = 1;
    let calmSince = 0;
    let lastDown = 0;
    const boots: number[] = [];

    const tick = (t: number) => {
      const dt = lastT ? Math.max(1, t - lastT) : 16;
      const y = window.scrollY;
      velocity = velocity * 0.85 + (Math.abs(y - lastY) / dt) * 1000 * 0.15;
      lastY = y;
      lastT = t;

      const current = Math.round(IDLE_RPS + velocity * RPS_PER_PX_S);
      setRps((prev) => (prev === current ? prev : current));
      const desired = Math.min(MAX_PODS, Math.max(1, Math.ceil(current / TARGET_RPS_PER_POD)));

      if (desired > count) {
        const added = Array.from({ length: desired - count }, () => ({ id: nextId++, ready: false }));
        setPods((prev) => [...prev, ...added]);
        added.forEach((pod) => boots.push(window.setTimeout(() => setPods((prev) => prev.map((p) => (p.id === pod.id ? { ...p, ready: true } : p))), BOOT_MS)));
        count = desired;
        calmSince = 0;
        setTrend("up");
        if (count === MAX_PODS) unlock("scaled-out");
      } else if (desired < count) {
        calmSince ||= t;
        if (t - calmSince > STABILIZE_MS && t - lastDown > SCALE_DOWN_STEP_MS) {
          setPods((prev) => prev.slice(0, -1));
          count -= 1;
          lastDown = t;
          setTrend("down");
        }
      } else {
        calmSince = 0;
        setTrend(null);
      }

      // Nothing moving and back to one pod: stop until the next scroll.
      if (velocity < 1 && count === 1) {
        frame = 0;
        lastT = 0;
        setRps(IDLE_RPS);
        setTrend(null);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame) return;
      lastY = window.scrollY;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      boots.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("scroll", wake);
    };
  }, []);

  return { rps, pods, trend };
};

/** The pods row of the request-trace pill; shown only while scaled out. */
const Autoscaler = () => {
  const { rps, pods, trend } = useAutoscaler();

  return (
    <AnimatePresence initial={false}>
      {pods.length > 1 && (
        <motion.div
          key="pods"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="mt-2.5 flex items-center gap-4 border-t border-paper/10 pt-2.5">
            <span className="hidden whitespace-nowrap text-smoke sm:inline">
              <span className="text-frost">›</span> HPA
            </span>
            <span className="flex w-[110px] shrink-0 flex-wrap gap-[3px] sm:w-[190px]">
              <AnimatePresence initial={false}>
                {pods.map((pod) => (
                  <motion.span
                    key={pod.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`h-2.5 w-2.5 rounded-[2px] border border-frost ${pod.ready ? "bg-frost" : "animate-pulse bg-transparent"}`}
                  />
                ))}
              </AnimatePresence>
            </span>
            <span className="w-[120px] shrink-0 whitespace-nowrap tabular-nums">
              {pods.length} pods <span className="text-smoke">{rps}rps</span>
              {trend && (
                <span className="ml-1 text-frost">
                  <Arrow dir={trend === "up" ? "up" : "down"} />
                </span>
              )}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Autoscaler;
