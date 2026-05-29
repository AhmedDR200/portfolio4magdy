import { useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Database,
  HardDrive,
  KeyRound,
  ListTree,
  Radio,
  Server,
  Smartphone,
  Workflow,
} from "lucide-react";

import { SectionWrapper } from "../../hoc";
import { fadeIn, textVariant } from "../../utils/motion";
import { styles } from "../../constants/styles";
import { useSettings } from "../../context/Settings";

type NodeId =
  | "client"
  | "gateway"
  | "auth"
  | "core"
  | "realtime"
  | "worker"
  | "db"
  | "redis"
  | "queue"
  | "storage";

type ArchNode = {
  id: NodeId;
  label: string;
  tech: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  Icon: React.FC<{ className?: string }>;
  description: string;
  stack: string[];
  metric: string;
};

const NODES: ArchNode[] = [
  {
    id: "client",
    label: "Clients",
    tech: "Web / iOS / Android",
    cx: 110,
    cy: 280,
    w: 160,
    h: 80,
    Icon: Smartphone,
    description:
      "Web and mobile clients talk to a single versioned API surface. Responses are cache-friendly and paginated to keep payloads small.",
    stack: ["REST", "WebSocket", "JWT"],
    metric: "15k+ active users served",
  },
  {
    id: "gateway",
    label: "API Gateway",
    tech: "Load Balancer",
    cx: 330,
    cy: 280,
    w: 140,
    h: 80,
    Icon: Server,
    description:
      "Edge layer handling TLS, rate limiting, request validation and routing to the right service. Health checks gate every deploy.",
    stack: ["Nginx", "Rate limiting", "TLS"],
    metric: "Single entrypoint, zero-downtime rollouts",
  },
  {
    id: "auth",
    label: "Auth Service",
    tech: "Identity & Access",
    cx: 580,
    cy: 90,
    w: 170,
    h: 64,
    Icon: KeyRound,
    description:
      "Stateless JWT auth with refresh rotation and role-based access. Sessions and revocation lists live in Redis for fast lookups.",
    stack: ["NestJS", "JWT", "RBAC"],
    metric: "40% fewer auth-related incidents",
  },
  {
    id: "core",
    label: "Core API",
    tech: "Business Logic",
    cx: 580,
    cy: 215,
    w: 170,
    h: 64,
    Icon: Boxes,
    description:
      "Domain services for portfolios, orders and analytics. Heavy reads are cached; writes emit events to the queue for async work.",
    stack: ["Node.js", "Express", "FastAPI"],
    metric: "API latency cut by ~30%",
  },
  {
    id: "realtime",
    label: "Realtime Service",
    tech: "WebSockets",
    cx: 580,
    cy: 340,
    w: 170,
    h: 64,
    Icon: Radio,
    description:
      "Pushes live notifications, chat and price updates over WebSockets. Fan-out is coordinated through Redis pub/sub across instances.",
    stack: ["Socket.io", "Redis pub/sub"],
    metric: "50% faster notification delivery",
  },
  {
    id: "worker",
    label: "Workers",
    tech: "Background Jobs",
    cx: 580,
    cy: 465,
    w: 170,
    h: 64,
    Icon: Workflow,
    description:
      "Consume queued jobs for emails, AI generation and report builds. Horizontally scalable and retried with backoff on failure.",
    stack: ["BullMQ", "OpenAI", "Cron"],
    metric: "150+ automation workflows / month",
  },
  {
    id: "db",
    label: "Database",
    tech: "MongoDB / MySQL",
    cx: 870,
    cy: 90,
    w: 150,
    h: 64,
    Icon: Database,
    description:
      "Primary persistence with indexed queries and read replicas. Schema and migrations are versioned alongside the services.",
    stack: ["MongoDB", "MySQL", "Indexes"],
    metric: "Query optimization → 30% faster",
  },
  {
    id: "redis",
    label: "Redis Cache",
    tech: "In-memory store",
    cx: 870,
    cy: 215,
    w: 150,
    h: 64,
    Icon: HardDrive,
    description:
      "Caches hot reads, holds sessions, and backs pub/sub for realtime fan-out. The first line of defense for read latency.",
    stack: ["Redis", "Pub/Sub", "TTL cache"],
    metric: "Cache hits absorb most read load",
  },
  {
    id: "queue",
    label: "Message Queue",
    tech: "Async events",
    cx: 870,
    cy: 340,
    w: 150,
    h: 64,
    Icon: ListTree,
    description:
      "Decouples the API from slow work. Events flow to workers reliably with retries, dead-letter queues and ordering guarantees.",
    stack: ["RabbitMQ", "DLQ", "Retries"],
    metric: "Resilient async processing",
  },
  {
    id: "storage",
    label: "Object Storage",
    tech: "Files & media",
    cx: 870,
    cy: 465,
    w: 150,
    h: 64,
    Icon: HardDrive,
    description:
      "Secure uploads to S3 with signed URLs, retries and progress tracking via a custom Web SDK. Serves media through a CDN.",
    stack: ["AWS S3", "Signed URLs", "CDN"],
    metric: "Reliable resumable uploads",
  },
];

const EDGES: [NodeId, NodeId][] = [
  ["client", "gateway"],
  ["gateway", "auth"],
  ["gateway", "core"],
  ["gateway", "realtime"],
  ["core", "db"],
  ["core", "redis"],
  ["core", "queue"],
  ["realtime", "redis"],
  ["auth", "redis"],
  ["queue", "worker"],
  ["worker", "db"],
  ["worker", "storage"],
];

const nodeById = (id: NodeId) => NODES.find((n) => n.id === id)!;

const Architecture = () => {
  const { reduceMotion } = useSettings();
  const [activeId, setActiveId] = useState<NodeId>("core");
  const active = nodeById(activeId);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>How it fits together</p>
        <h2 className={styles.sectionHeadText}>System Architecture.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="text-secondary mt-4 max-w-3xl text-[15px] leading-[28px] sm:text-[17px] sm:leading-[30px]"
      >
        A reference design of the backends I build — from the edge gateway down
        to caches, queues and storage. Hover or tap any node to see the stack
        and the impact it carries.
      </motion.p>

      <motion.div
        variants={fadeIn("up", "spring", 0.2, 0.8)}
        className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]"
      >
        <div className="bg-tertiary rounded-2xl border border-white/5 p-3 sm:p-5">
          <svg
            viewBox="0 0 1000 540"
            className="h-auto w-full"
            role="img"
            aria-label="System architecture diagram"
          >
            {EDGES.map(([from, to], i) => {
              const a = nodeById(from);
              const b = nodeById(to);
              const isActive = activeId === from || activeId === to;
              return (
                <g key={`${from}-${to}`}>
                  <line
                    x1={a.cx}
                    y1={a.cy}
                    x2={b.cx}
                    y2={b.cy}
                    stroke={
                      isActive
                        ? "rgba(0,255,136,0.55)"
                        : "rgba(0,255,136,0.16)"
                    }
                    strokeWidth={isActive ? 2 : 1.25}
                  />
                  {!reduceMotion && (
                    <motion.circle
                      r={isActive ? 4 : 3}
                      fill={isActive ? "#00FF88" : "#00CC66"}
                      initial={{ cx: a.cx, cy: a.cy }}
                      animate={{ cx: [a.cx, b.cx], cy: [a.cy, b.cy] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: (i % 4) * 0.5,
                      }}
                    />
                  )}
                </g>
              );
            })}

            {NODES.map((n) => {
              const isActive = activeId === n.id;
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.label} — ${n.tech}`}
                  onMouseEnter={() => setActiveId(n.id)}
                  onFocus={() => setActiveId(n.id)}
                  onClick={() => setActiveId(n.id)}
                  className="cursor-pointer focus:outline-none"
                >
                  <rect
                    x={n.cx - n.w / 2}
                    y={n.cy - n.h / 2}
                    width={n.w}
                    height={n.h}
                    rx={14}
                    style={{ fill: "rgb(var(--color-primary))" }}
                    stroke={isActive ? "#00FF88" : "rgba(0,255,136,0.25)"}
                    strokeWidth={isActive ? 2.5 : 1.25}
                  />
                  <text
                    x={n.cx}
                    y={n.cy - 4}
                    textAnchor="middle"
                    className="text-[16px] font-bold"
                    style={{ fill: "rgb(var(--color-fg))" }}
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.cx}
                    y={n.cy + 15}
                    textAnchor="middle"
                    className="text-[11px]"
                    style={{ fill: "rgb(var(--color-secondary))" }}
                  >
                    {n.tech}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-tertiary flex flex-col rounded-2xl border border-white/5 p-5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00FF88]/40 bg-[#00FF88]/10 text-[#00FF88]">
              <active.Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[20px] font-bold text-white">
                {active.label}
              </h3>
              <p className="text-secondary text-[13px]">{active.tech}</p>
            </div>
          </div>

          <p className="text-secondary mt-4 text-[14px] leading-[24px]">
            {active.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {active.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-black-100 px-3 py-1 text-[12px] font-medium text-white"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-5">
            <div className="rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 px-4 py-3">
              <div className="text-secondary text-[10px] uppercase tracking-wider">
                Impact
              </div>
              <div className="mt-1 text-[15px] font-bold text-[#00FF88]">
                {active.metric}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SectionWrapper(Architecture, "architecture");
