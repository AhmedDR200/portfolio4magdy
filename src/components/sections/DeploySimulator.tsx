import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bug,
  Check,
  CheckCircle2,
  Rocket,
  XCircle,
} from "lucide-react";

import { SectionWrapper } from "../../hoc";
import { fadeIn, textVariant } from "../../utils/motion";
import { styles } from "../../constants/styles";

const STAGES = ["Lint", "Test", "Build", "Deploy", "Health Check"] as const;
const STAGE_DURATION = 1800;
const TOTAL_DURATION = STAGES.length * STAGE_DURATION;
const BUG_LIFETIME = 1800;
const BUG_SPAWN_INTERVAL = 650;
const FAIL_THRESHOLD = 4;

type LogType = "info" | "success" | "warn";
type LogLine = { t: number; text: string; type: LogType };

const PIPELINE_LOGS: LogLine[] = [
  { t: 120, text: "$ eslint . --max-warnings 0", type: "info" },
  { t: 650, text: "✓ 0 errors, 0 warnings", type: "success" },
  { t: 1200, text: "✓ prettier --check passed", type: "success" },
  { t: 1950, text: "$ jest --coverage", type: "info" },
  { t: 2550, text: "PASS  src/auth/auth.service.spec.ts", type: "success" },
  { t: 2950, text: "PASS  src/orders/orders.controller.spec.ts", type: "success" },
  { t: 3350, text: "✓ 128 tests passed · coverage 92%", type: "success" },
  { t: 3750, text: "$ docker build -t api:$(git rev-parse --short HEAD) .", type: "info" },
  { t: 4400, text: "=> exporting layers", type: "info" },
  { t: 5050, text: "✓ image built · 142MB", type: "success" },
  { t: 5550, text: "$ kubectl rollout restart deploy/api", type: "info" },
  { t: 6100, text: "waiting for rollout: 2 of 3 pods ready...", type: "warn" },
  { t: 6750, text: "✓ deployment.apps/api successfully rolled out", type: "success" },
  { t: 7350, text: "GET /healthz → 200 OK (12ms)", type: "success" },
  { t: 7900, text: "GET /readyz → 200 OK (8ms)", type: "success" },
  { t: 8500, text: "✓ health checks green · traffic shifted to new build", type: "success" },
];

const LOG_COLORS: Record<LogType, string> = {
  info: "text-secondary",
  success: "text-[#00FF88]",
  warn: "text-[#FFB700]",
};

type Bug = { id: number; x: number; y: number; spawnedAt: number };
type Status = "idle" | "running" | "success" | "failed";

type SavedStats = {
  deploys: number;
  bestSquashed: number;
  uptime: number;
};

const DEFAULT_STATS: SavedStats = {
  deploys: 0,
  bestSquashed: 0,
  uptime: 100,
};

const loadStats = (): SavedStats => {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem("deploy-sim-stats");
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
};

const Stat: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="bg-black-100 rounded-xl p-3 text-center">
    <div className="text-secondary text-[10px] tracking-wider uppercase sm:text-[12px]">
      {label}
    </div>
    <div className="mt-1 text-[18px] font-bold text-white sm:text-[22px]">
      {value}
    </div>
  </div>
);

const DeploySimulator = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [squashed, setSquashed] = useState(0);
  const [missed, setMissed] = useState(0);
  const [stats, setStats] = useState<SavedStats>(loadStats);
  const [logs, setLogs] = useState<LogLine[]>([]);

  const startTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const bugIdRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const missedRef = useRef<number>(0);
  const logCountRef = useRef<number>(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    missedRef.current = missed;
  }, [missed]);

  useEffect(() => {
    if (status !== "running") return;

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const t = now - startTimeRef.current;
      setElapsed(t);

      const visibleCount = PIPELINE_LOGS.filter((l) => l.t <= t).length;
      if (visibleCount !== logCountRef.current) {
        logCountRef.current = visibleCount;
        setLogs(PIPELINE_LOGS.slice(0, visibleCount));
      }

      if (now - lastSpawnRef.current > BUG_SPAWN_INTERVAL) {
        lastSpawnRef.current = now;
        setBugs((prev) => [
          ...prev,
          {
            id: bugIdRef.current++,
            x: 6 + Math.random() * 86,
            y: 8 + Math.random() * 76,
            spawnedAt: now,
          },
        ]);
      }

      setBugs((prev) => {
        const expired = prev.filter((b) => now - b.spawnedAt > BUG_LIFETIME);
        if (expired.length) {
          setMissed((m) => m + expired.length);
        }
        return prev.filter((b) => now - b.spawnedAt <= BUG_LIFETIME);
      });

      if (t >= TOTAL_DURATION) {
        setStatus(missedRef.current >= FAIL_THRESHOLD ? "failed" : "success");
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status]);

  useEffect(() => {
    if (status === "success") {
      setLogs((prev) => [
        ...prev,
        { t: TOTAL_DURATION, text: "🚀 Shipped to production", type: "success" },
      ]);
      const next: SavedStats = {
        deploys: stats.deploys + 1,
        bestSquashed: Math.max(stats.bestSquashed, squashed),
        uptime: Math.min(100, stats.uptime + 1),
      };
      setStats(next);
      localStorage.setItem("deploy-sim-stats", JSON.stringify(next));
    } else if (status === "failed") {
      setLogs((prev) => [
        ...prev,
        {
          t: TOTAL_DURATION,
          text: "✗ rollback triggered — too many bugs reached prod",
          type: "warn",
        },
      ]);
      const next: SavedStats = {
        ...stats,
        uptime: Math.max(0, stats.uptime - 5),
      };
      setStats(next);
      localStorage.setItem("deploy-sim-stats", JSON.stringify(next));
    }
    // Runs once per terminal status transition; stats/squashed are read as
    // the latest snapshot intentionally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [logs]);

  const start = () => {
    startTimeRef.current = 0;
    lastSpawnRef.current = 0;
    setElapsed(0);
    setBugs([]);
    setSquashed(0);
    setMissed(0);
    missedRef.current = 0;
    setLogs([]);
    logCountRef.current = 0;
    setStatus("running");
  };

  const squashBug = (id: number) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
    setSquashed((s) => s + 1);
  };

  const currentStage = Math.min(
    STAGES.length - 1,
    Math.floor(elapsed / STAGE_DURATION)
  );
  const stageProgress = ((elapsed % STAGE_DURATION) / STAGE_DURATION) * 100;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Take a break</p>
        <h2 className={`${styles.sectionHeadText} flex items-center gap-3`}>
          Deploy Simulator
          <Rocket className="h-8 w-8 text-[#00FF88] sm:h-10 sm:w-10" />
        </h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="text-secondary mt-4 max-w-3xl text-[15px] leading-[28px] sm:text-[17px] sm:leading-[30px]"
      >
        Squash the bugs before they reach prod. Survive five pipeline stages —
        lint, test, build, deploy and health check — without missing{" "}
        {FAIL_THRESHOLD} and you ship a clean build. Watch the deploy logs
        stream live as the pipeline runs.
      </motion.p>

      <motion.div
        variants={fadeIn("up", "spring", 0.2, 0.8)}
        className="mt-10 flex flex-col gap-4"
      >
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Stat label="Deploys" value={stats.deploys} />
          <Stat label="Uptime" value={`${stats.uptime}%`} />
          <Stat label="Best Run" value={stats.bestSquashed} />
        </div>

        <div className="bg-tertiary rounded-2xl p-4 sm:p-6">
          <div className="mb-4 flex gap-2">
            {STAGES.map((s, i) => (
              <div key={s} className="flex-1">
                <div className="text-secondary mb-1 text-[10px] sm:text-[13px]">
                  {s}
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full transition-colors ${
                      i < currentStage && status !== "idle"
                        ? "bg-green-400"
                        : i === currentStage && status === "running"
                          ? "bg-[#00FF88]"
                          : "bg-transparent"
                    }`}
                    style={{
                      width:
                        status === "idle"
                          ? "0%"
                          : i < currentStage
                            ? "100%"
                            : i === currentStage
                              ? `${stageProgress}%`
                              : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/60 relative h-[220px] overflow-hidden rounded-xl border border-white/5 sm:h-[300px]">
            <AnimatePresence>
              {bugs.map((bug) => (
                <motion.button
                  key={bug.id}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 1.6, opacity: 0, rotate: 25 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  onClick={() => squashBug(bug.id)}
                  style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                  className="bg-[#00FF88]/15 text-[#00FF88] hover:bg-[#00FF88]/30 absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#00FF88]/40 transition-all hover:scale-110 sm:h-14 sm:w-14"
                  aria-label="Squash bug"
                >
                  <Bug className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.button>
              ))}
            </AnimatePresence>

            {status === "idle" && (
              <button
                onClick={start}
                className="hover:bg-black/40 absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white transition-colors"
              >
                <Rocket className="h-9 w-9 text-[#00FF88] sm:h-12 sm:w-12" />
                <span className="text-[16px] font-bold sm:text-[20px]">
                  Push to deploy
                </span>
                <span className="text-secondary text-[11px] sm:text-[13px]">
                  Click bugs to squash them mid-pipeline
                </span>
              </button>
            )}

            {(status === "success" || status === "failed") && (
              <div className="bg-black/75 absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                {status === "success" ? (
                  <CheckCircle2 className="h-10 w-10 text-green-400 sm:h-14 sm:w-14" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-400 sm:h-14 sm:w-14" />
                )}
                <div className="text-[16px] font-bold text-white sm:text-[22px]">
                  {status === "success"
                    ? `Shipped! ${squashed} bugs squashed.`
                    : `Build failed — too many bugs slipped through.`}
                </div>
                <button
                  onClick={start}
                  className="rounded-full bg-[#00FF88] px-6 py-2 text-[14px] font-bold text-white transition-colors hover:bg-[#00CC66] sm:text-[16px]"
                >
                  Deploy again
                </button>
              </div>
            )}
          </div>

          <div className="bg-black-200 mt-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
              <span className="h-3 w-3 rounded-full bg-[#FF0044]" />
              <span className="h-3 w-3 rounded-full bg-[#FFB700]" />
              <span className="h-3 w-3 rounded-full bg-[#00FF88]" />
              <span className="text-secondary ml-2 text-[11px] sm:text-[12px]">
                pipeline.log
              </span>
            </div>
            <div className="h-[150px] overflow-y-auto px-4 py-3 font-mono text-[11px] leading-[20px] sm:text-[12.5px]">
              {logs.length === 0 ? (
                <span className="text-secondary">
                  {status === "idle"
                    ? "// push to deploy to start the pipeline"
                    : "// booting runner..."}
                </span>
              ) : (
                logs.map((line, i) => (
                  <div key={i} className={LOG_COLORS[line.type]}>
                    <span className="text-secondary mr-2 select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {line.text}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

          <div className="text-secondary mt-3 flex items-center justify-between text-[11px] sm:text-[14px]">
            <span
              className={`inline-flex items-center gap-1 ${
                status === "running" ? "text-green-400" : ""
              }`}
            >
              <Check className="h-4 w-4" /> Squashed: {squashed}
            </span>
            <span
              className={`inline-flex items-center gap-1 ${
                missed >= FAIL_THRESHOLD - 1
                  ? "text-red-400"
                  : missed >= 2
                    ? "text-yellow-400"
                    : ""
              }`}
            >
              <AlertTriangle className="h-4 w-4" /> Missed: {missed}/
              {FAIL_THRESHOLD}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper(DeploySimulator, "deploy-sim");
