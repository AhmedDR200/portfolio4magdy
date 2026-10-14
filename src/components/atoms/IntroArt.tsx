import { motion } from "framer-motion";

// The illustrations in the intro, drawn as SVG: a shotgun shell from the side,
// and the back of a double-barrel with two shells loaded, stamped with my
// name. Brass is turned (lathe rings), the stamp is embossed (a light and a
// dark offset), the steel is brushed, and a band of light sweeps the shells.

const BRASS = { hi: "#F6EDCF", mid: "#B79F63", low: "#5A4A24", deep: "#1F1709" };
const RED = { hi: "#E2333F", mid: "#A3161C", low: "#4A070B" };
const SHELLS = [
  { cx: 252, top: "AHMED MAGDY", bottom: "12 · GA" },
  { cx: 388, top: "AHMED MAGDY", bottom: "200 · OK" },
];
const BODY = "M232 104 H408 A78 78 0 0 1 408 256 H232 A78 78 0 0 1 232 104 Z";

// ---------- The shell, from the side ----------

/** A shell in flight: ribbed red hull, folded crimp, brass head, motion blur. */
export const ShellSide = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 320 110" aria-hidden="true" className={className}>
    <defs>
      <linearGradient id="ss-hull" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={RED.hi} />
        <stop offset="0.35" stopColor={RED.mid} />
        <stop offset="1" stopColor={RED.low} />
      </linearGradient>
      <linearGradient id="ss-brass" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={BRASS.hi} />
        <stop offset="0.3" stopColor={BRASS.mid} />
        <stop offset="0.8" stopColor={BRASS.low} />
        <stop offset="1" stopColor={BRASS.deep} />
      </linearGradient>
      <linearGradient id="ss-shine" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {/* Motion blur along the shell's length. */}
      <filter id="ss-blur" x="-20%" y="-30%" width="140%" height="160%">
        <feGaussianBlur stdDeviation="7 1.2" />
      </filter>
    </defs>
    <g filter="url(#ss-blur)">
      {/* Hull, with the folded star crimp at its end. */}
      <path d="M26 14 H232 V96 H26 Q8 96 6 76 L4 55 L6 34 Q8 14 26 14 Z" fill="url(#ss-hull)" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1="30" x2="232" y1={22 + i * 7} y2={22 + i * 7} stroke="#2A0306" strokeOpacity="0.35" strokeWidth="1.2" />
      ))}
      <path d="M8 34 L22 55 L8 76 M14 22 L24 55 L14 88" fill="none" stroke="#2A0306" strokeOpacity="0.55" strokeWidth="1.6" />
      <rect x="26" y="24" width="206" height="9" fill="url(#ss-shine)" opacity="0.8" />
      {/* Brass head and rim. */}
      <rect x="228" y="12" width="70" height="86" rx="3" fill="url(#ss-brass)" />
      <rect x="292" y="6" width="18" height="98" rx="4" fill="url(#ss-brass)" />
      <rect x="228" y="12" width="70" height="86" rx="3" fill="none" stroke={BRASS.deep} strokeOpacity="0.5" />
      <line x1="236" x2="296" y1="22" y2="22" stroke="#fff" strokeOpacity="0.55" strokeWidth="2.5" />
      <line x1="296" x2="309" y1="14" y2="14" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
    </g>
  </svg>
);

// ---------- The breech ----------

const ShellHead = ({ cx, top, bottom, i }: { cx: number; top: string; bottom: string; i: number }) => {
  const id = `sh${i}`;
  return (
    <g>
      {/* The bore's chamfer, the red hull inside it, the brass rim. */}
      <circle cx={cx} cy="180" r="71" fill="url(#br-chamfer)" />
      <circle cx={cx} cy="180" r="63" fill="#050101" />
      <circle cx={cx} cy="180" r="61" fill="url(#br-hull)" />
      <path d={`M${cx - 53} ${180 - 22} A58 58 0 0 1 ${cx + 4} ${180 - 58}`} fill="none" stroke="#FF7A80" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx={cx} cy="180" r="56.5" fill="#000" opacity="0.55" />
      <circle cx={cx} cy="180" r="55" fill="url(#br-brass)" />
      <circle cx={cx} cy="180" r="55" fill="none" stroke="url(#br-rim)" strokeWidth="4.5" />
      <circle cx={cx} cy="180" r="50.5" fill="none" stroke={BRASS.deep} strokeOpacity="0.55" strokeWidth="1.2" />
      {/* Lathe rings: the turned face of the head. */}
      {Array.from({ length: 14 }, (_, k) => (
        <circle key={k} cx={cx} cy="180" r={20 + k * 2.1} fill="none" stroke={k % 2 ? "#fff" : BRASS.deep} strokeOpacity={k % 2 ? 0.07 : 0.1} strokeWidth="0.8" />
      ))}
      <defs>
        <path id={`${id}-t`} d={`M${cx - 39} 180 A39 39 0 0 1 ${cx + 39} 180`} />
        <path id={`${id}-b`} d={`M${cx - 41} 180 A41 41 0 0 0 ${cx + 41} 180`} />
      </defs>
      {/* The stamp, embossed: a dark offset below, a light one above. */}
      {[
        { dx: 0.7, dy: 0.9, fill: BRASS.deep, op: 0.7 },
        { dx: -0.5, dy: -0.6, fill: "#FFF6DA", op: 0.45 },
        { dx: 0, dy: 0, fill: "#7A6533", op: 1 },
      ].map((l, k) => (
        <g key={k} transform={`translate(${l.dx} ${l.dy})`} opacity={l.op}>
          <text fontFamily="'IM Fell English SC', Georgia, serif" fontSize="12.5" fontWeight="700" letterSpacing="1.7" fill={l.fill}>
            <textPath href={`#${id}-t`} startOffset="50%" textAnchor="middle">
              {top}
            </textPath>
          </text>
          <text fontFamily="'IM Fell English SC', Georgia, serif" fontSize="11.5" fontWeight="700" letterSpacing="2.6" fill={l.fill}>
            <textPath href={`#${id}-b`} startOffset="50%" textAnchor="middle">
              {bottom}
            </textPath>
          </text>
        </g>
      ))}
      {/* The primer: a crimped cup and its pocket. */}
      <circle cx={cx} cy="180" r="18" fill="#2A200E" />
      <circle cx={cx} cy="180" r="15.5" fill="url(#br-primer)" />
      <circle cx={cx} cy="180" r="11" fill="none" stroke={BRASS.deep} strokeOpacity="0.35" strokeWidth="0.8" />
      <ellipse cx={cx - 5} cy="174" rx="5" ry="3" fill="#fff" opacity="0.6" transform={`rotate(-30 ${cx - 5} 174)`} />
      <ellipse cx={cx - 18} cy="160" rx="16" ry="7" fill="#fff" opacity="0.32" filter="url(#br-bloom)" transform={`rotate(-35 ${cx - 18} 160)`} />
      {/* Scratches from the loading. */}
      <path d={`M${cx + 14} ${160} q10 6 16 16 M${cx - 30} ${196} q8 2 14 8`} fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.7" />
    </g>
  );
};

/** The back of the double-barrel, two shells loaded. `play` runs the light sweep. */
export const Breech = ({ play = true }: { play?: boolean }) => (
  <svg viewBox="90 50 460 259" aria-hidden="true" className="h-full w-full">
    <defs>
      <radialGradient id="br-brass" cx="38%" cy="32%" r="72%">
        <stop offset="0" stopColor={BRASS.hi} />
        <stop offset="0.3" stopColor={BRASS.mid} />
        <stop offset="0.75" stopColor={BRASS.low} />
        <stop offset="1" stopColor={BRASS.deep} />
      </radialGradient>
      <linearGradient id="br-rim" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#FFF4D2" />
        <stop offset="0.45" stopColor={BRASS.mid} />
        <stop offset="1" stopColor={BRASS.deep} />
      </linearGradient>
      <radialGradient id="br-primer" cx="36%" cy="32%" r="75%">
        <stop offset="0" stopColor="#F6F0DE" />
        <stop offset="0.5" stopColor="#B8A675" />
        <stop offset="1" stopColor="#4D3F1E" />
      </radialGradient>
      <radialGradient id="br-hull" cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor={RED.hi} />
        <stop offset="0.45" stopColor={RED.mid} />
        <stop offset="1" stopColor={RED.low} />
      </radialGradient>
      <radialGradient id="br-chamfer" cx="50%" cy="50%" r="50%">
        <stop offset="0.86" stopColor="#000" />
        <stop offset="0.93" stopColor="#3C413F" />
        <stop offset="0.97" stopColor="#0B0C0C" />
        <stop offset="1" stopColor="#000" />
      </radialGradient>
      <linearGradient id="br-steel" x1="0.2" x2="0.8" y1="0" y2="1">
        <stop offset="0" stopColor="#1D2120" />
        <stop offset="0.45" stopColor="#0A0B0B" />
        <stop offset="1" stopColor="#020202" />
      </linearGradient>
      <filter id="br-bloom" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="br-brushed" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9 0.03" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" />
      </filter>
      <clipPath id="br-body">
        <path d={BODY} />
      </clipPath>
      <clipPath id="br-faces">
        {SHELLS.map((s) => (
          <circle key={s.cx} cx={s.cx} cy="180" r="55" />
        ))}
      </clipPath>
      <linearGradient id="br-sweep" x1="0" x2="1">
        <stop offset="0.12" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.6" />
        <stop offset="0.88" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="br-falloff" cx="50%" cy="50%" r="62%">
        <stop offset="0.5" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.95" />
      </radialGradient>
      <linearGradient id="br-edge-red" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0.45" stopColor="#C8102E" stopOpacity="0" />
        <stop offset="1" stopColor="#E0283A" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="br-edge-light" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
        <stop offset="0.28" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="br-redside" x1="0" x2="1" y1="0.3" y2="0.7">
        <stop offset="0" stopColor="#C8102E" stopOpacity="0.34" />
        <stop offset="0.3" stopColor="#C8102E" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* The breech face: brushed steel, a bevel catching the light. */}
    <path d={BODY} fill="url(#br-steel)" />
    <g clipPath="url(#br-body)" opacity="0.07">
      <rect x="140" y="90" width="360" height="190" filter="url(#br-brushed)" />
    </g>
    {/* The bevel: light along the top edge, inside the body only. */}
    <path d={BODY} fill="none" stroke="url(#br-edge-light)" strokeWidth="4" clipPath="url(#br-body)" />
    {/* The top lever and the rib between the barrels. */}
    <path d="M306 104 V82 Q306 76 300 75 H296 Q290 74 291 68 Q292 62 300 62 H340 Q348 62 349 68 Q350 74 344 75 H340 Q334 76 334 82 V104 Z" fill="url(#br-steel)" stroke="#000" strokeWidth="1.5" />
    <path d="M293 66 Q300 63 340 63" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" />
    <circle cx="320" cy="90" r="4" fill="#0B0C0C" stroke="#4B504E" strokeWidth="1" />
    <path d="M317 90 H323" stroke="#4B504E" strokeWidth="1" />
    <rect x="315" y="40" width="10" height="24" rx="2.5" fill="#BFC4C2" />
    <rect x="315" y="40" width="3" height="24" rx="1.5" fill="#fff" opacity="0.75" />
    <path d="M312 104 h16 v8 a8 8 0 0 1 -16 0 z" fill="#020202" stroke="#2A2E2D" strokeWidth="1" />
    <line x1="320" x2="320" y1="118" y2="250" stroke="#000" strokeWidth="2" />
    <line x1="321.5" x2="321.5" y1="112" y2="248" stroke="#fff" strokeOpacity="0.08" />

    {SHELLS.map((s, i) => (
      <ShellHead key={s.cx} i={i} {...s} />
    ))}

    {/* A band of light passing over the brass. */}
    <g clipPath="url(#br-faces)" style={{ mixBlendMode: "screen" }}>
      <motion.g
        initial={{ x: -120 }}
        animate={play ? { x: 360 } : { x: -120 }}
        transition={{ duration: 1.1, delay: 0.12, ease: [0.45, 0, 0.25, 1] }}
      >
        <rect x="130" y="60" width="110" height="250" fill="url(#br-sweep)" transform="rotate(22 185 185)" />
      </motion.g>
    </g>

    {/* Red light from the left, and the dark closing in at the edges. */}
    <path d={BODY} fill="url(#br-redside)" style={{ mixBlendMode: "screen" }} />
    <path d={BODY} fill="none" stroke="url(#br-edge-red)" strokeWidth="6" clipPath="url(#br-body)" />
    <rect x="90" y="50" width="460" height="259" fill="url(#br-falloff)" />
  </svg>
);
