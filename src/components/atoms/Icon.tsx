import { useId, type ReactNode } from "react";

// The site's icons: solid silhouettes with their details carved out, like a
// stamp or an engraving (the same hand as the WANTED poster and the medals).
// The carving is a mask, so the cuts show whatever sits behind the icon.
// Each glyph is drawn on a 24×24 grid: `shape` is solid, `cut` is removed,
// and `top` is drawn back on after the cuts.

type Glyph = { shape: ReactNode; cut?: ReactNode; top?: ReactNode };

const ring = { fill: "none", stroke: "white", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const carve = { fill: "none", stroke: "black", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const GLYPHS = {
  // Modes
  "bulb-off": {
    shape: (
      <>
        <path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.7.5 1.1 1.3 1.1 2.2h5.4c0-.9.4-1.7 1.1-2.2A6.5 6.5 0 0 0 12 2.5z" />
        <rect x="9.3" y="17.6" width="5.4" height="1.9" rx=".6" />
        <rect x="10" y="20.3" width="4" height="1.7" rx=".6" />
      </>
    ),
    cut: (
      <>
        <path {...carve} strokeWidth={1.3} d="M9.6 9.4l1.2 1.6 1.2-1.6 1.2 1.6 1.2-1.6" />
        <path {...carve} strokeWidth={4.2} d="M3.5 3.5l17 17" />
      </>
    ),
    top: <path {...ring} strokeWidth={2} d="M3.5 3.5l17 17" />,
  },
  eye: {
    shape: (
      <>
        <path d="M1.5 12S5.2 5.5 12 5.5 22.5 12 22.5 12 18.8 18.5 12 18.5 1.5 12 1.5 12z" />
        <path {...ring} strokeWidth={1.8} d="M12 .8v2.6M12 20.6v2.6M3.6 3l1.6 1.9M20.4 3l-1.6 1.9" />
      </>
    ),
    cut: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path {...carve} strokeWidth={1.2} d="M7 9.3c1.3-1 3-1.7 5-1.7" />
      </>
    ),
    top: <circle cx="12" cy="12" r="1.9" />,
  },
  // Contact
  letter: {
    shape: <rect x="2" y="5" width="20" height="14" rx="1.6" />,
    cut: (
      <>
        <path {...carve} strokeWidth={1.6} d="M3.2 6.4l8.8 6.6 8.8-6.6" />
        <circle cx="12" cy="13.4" r="3.6" />
      </>
    ),
    top: (
      <>
        <circle cx="12" cy="13.4" r="2.6" />
      </>
    ),
  },
  briefcase: {
    shape: (
      <>
        <rect x="2" y="7" width="20" height="13.5" rx="2" />
        <path {...ring} strokeWidth={2.2} d="M8 7V5.2A2.2 2.2 0 0 1 10.2 3h3.6A2.2 2.2 0 0 1 16 5.2V7" />
      </>
    ),
    cut: (
      <>
        <path {...carve} strokeWidth={1.5} d="M2 12.8h20" />
        <rect x="10.2" y="11.2" width="3.6" height="3.4" rx=".6" />
      </>
    ),
  },
  branch: {
    shape: (
      <>
        <circle cx="6" cy="5" r="2.8" />
        <circle cx="6" cy="19" r="2.8" />
        <circle cx="18" cy="7.5" r="2.8" />
        <path {...ring} strokeWidth={2.4} d="M6 7.8v8.4M18 10.3v.9a4.4 4.4 0 0 1-4.4 4.4H8.4" />
      </>
    ),
    cut: (
      <>
        <circle cx="6" cy="5" r="1" />
        <circle cx="6" cy="19" r="1" />
        <circle cx="18" cy="7.5" r="1" />
      </>
    ),
  },
  reel: {
    shape: (
      <>
        <circle cx="11" cy="11" r="9" />
        <rect x="14" y="18.6" width="8.5" height="2.8" rx=".8" />
      </>
    ),
    cut: (
      <>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle
            key={a}
            cx={(11 + 4.8 * Math.cos(((a - 90) * Math.PI) / 180)).toFixed(2)}
            cy={(11 + 4.8 * Math.sin(((a - 90) * Math.PI) / 180)).toFixed(2)}
            r="2"
          />
        ))}
        <circle cx="11" cy="11" r="1.1" />
      </>
    ),
  },
  // Services
  gear: {
    shape: (
      <path d="M20.10 10.72 L22.54 10.92 L22.54 13.08 L20.10 13.28 L18.63 16.82 L20.22 18.69 L18.69 20.22 L16.82 18.63 L13.28 20.10 L13.08 22.54 L10.92 22.54 L10.72 20.10 L7.18 18.63 L5.31 20.22 L3.78 18.69 L5.37 16.82 L3.90 13.28 L1.46 13.08 L1.46 10.92 L3.90 10.72 L5.37 7.18 L3.78 5.31 L5.31 3.78 L7.18 5.37 L10.72 3.90 L10.92 1.46 L13.08 1.46 L13.28 3.90 L16.82 5.37 L18.69 3.78 L20.22 5.31 L18.63 7.18 Z" />
    ),
    cut: (
      <>
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="12" cy="12" r="6.2" fill="none" stroke="black" strokeWidth="1" strokeDasharray="1.4 1.8" />
      </>
    ),
  },
  divider: {
    shape: (
      <>
        <circle cx="12" cy="4.2" r="2.6" />
        <path {...ring} strokeWidth={2.6} d="M11 6.4L5.4 21M13 6.4L18.6 21" />
        <path {...ring} strokeWidth={1.8} d="M6.6 15.4c3.4 2 7.4 2 10.8 0" />
      </>
    ),
    cut: <circle cx="12" cy="4.2" r="1" />,
  },
  bolt: {
    shape: <path d="M13.5 1.5L4 14h7l-1.5 8.5L20 9.5h-7l1.8-8z" />,
    cut: <path {...carve} strokeWidth={1.2} d="M12.6 5L8.2 11.4" />,
  },
  // Impact
  crowd: {
    shape: (
      <>
        <circle cx="5" cy="9" r="2.5" />
        <path d="M.5 19.5a4.6 4.6 0 0 1 9 0z" />
        <circle cx="19" cy="9" r="2.5" />
        <path d="M14.5 19.5a4.6 4.6 0 0 1 9 0z" />
      </>
    ),
    cut: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M3.6 21.5a8.4 8.4 0 0 1 16.8 0z" />
      </>
    ),
    top: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.4 20.5a6.6 6.6 0 0 1 13.2 0z" />
      </>
    ),
  },
  stopwatch: {
    shape: (
      <>
        <circle cx="12" cy="13.5" r="8.5" />
        <rect x="9.6" y="1.5" width="4.8" height="2.4" rx=".8" />
        <rect x="11" y="3.4" width="2" height="2.4" />
        <path {...ring} strokeWidth={2.2} d="M18.4 5.6l1.8 1.8" />
      </>
    ),
    cut: (
      <>
        <path {...carve} strokeWidth={1.8} d="M12 13.5V8.4M12 13.5l3.2 2" />
        <path {...carve} strokeWidth={1.2} d="M12 6.4v.1M12 20.6v.1M4.9 13.5h.1M19 13.5h.1" />
      </>
    ),
  },
  bell: {
    shape: (
      <>
        <path d="M12 2.5a1.5 1.5 0 0 1 1.5 1.5v.3a6.2 6.2 0 0 1 4.7 6.1v5.1l2.3 2.6h-17l2.3-2.6v-5.1a6.2 6.2 0 0 1 4.7-6.1V4A1.5 1.5 0 0 1 12 2.5z" />
        <path d="M9.6 19.6h4.8a2.4 2.4 0 0 1-4.8 0z" />
      </>
    ),
    cut: <path {...carve} strokeWidth={1.3} d="M8.6 9.4c.3-1.6 1.2-2.7 2.6-3.2" />,
  },
  loop: {
    shape: (
      <>
        <path {...ring} strokeWidth={3} d="M19.4 9.6A8 8 0 0 0 5 6.6M4.6 14.4A8 8 0 0 0 19 17.4" />
        <path d="M15.4 9.8h6.1V3.7z" />
        <path d="M8.6 14.2H2.5v6.1z" />
      </>
    ),
  },
  // Status
  hammer: {
    shape: (
      <>
        <path d="M13.3 2.6l7.4 7.4-3 3-7.4-7.4z" />
        <path {...ring} strokeWidth={3.2} d="M12 11.6l-7.6 7.6" />
      </>
    ),
    cut: <path {...carve} strokeWidth={1.2} d="M14.6 5.2l4.4 4.4" />,
  },
  hourglass: {
    shape: (
      <path d="M5.5 2h13v2.6c0 3.1-2.6 5.2-4.8 7.4 2.2 2.2 4.8 4.3 4.8 7.4V22h-13v-2.6c0-3.1 2.6-5.2 4.8-7.4C8.1 9.8 5.5 7.7 5.5 4.6z" />
    ),
    cut: (
      <>
        <path {...carve} strokeWidth={1.4} d="M8 4.6h8M8 19.4h1.6" />
        <path d="M9 6.8h6L12 10.4z" />
      </>
    ),
  },
  // Achievements
  document: {
    shape: <path d="M6 2h8.6L19 6.4V22H6z" />,
    cut: (
      <>
        <path d="M14.4 2v4.6H19z" />
        <path {...carve} strokeWidth={1.4} d="M9 10h7M9 13h7M9 16h3.5" />
        <circle cx="16.2" cy="18.6" r="3.6" />
      </>
    ),
    top: <circle cx="16.2" cy="18.6" r="2.5" />,
  },
  receipt: {
    shape: <path d="M5 2h14v20l-2.3-1.6L14.3 22 12 20.4 9.7 22l-2.4-1.6L5 22z" />,
    cut: <path {...carve} strokeWidth={1.4} d="M8.5 7h7M8.5 10.5h7M8.5 14h4.5" />,
  },
  horseshoe: {
    shape: (
      <>
        <path {...ring} strokeWidth={4.4} strokeLinecap="butt" d="M5.5 3.5v8.5a6.5 6.5 0 0 0 13 0V3.5" />
        <rect x="2.6" y="1.6" width="5.8" height="3" rx="1" />
        <rect x="15.6" y="1.6" width="5.8" height="3" rx="1" />
      </>
    ),
    cut: (
      <>
        <circle cx="5.5" cy="8" r=".9" />
        <circle cx="6.1" cy="12.6" r=".9" />
        <circle cx="18.5" cy="8" r=".9" />
        <circle cx="17.9" cy="12.6" r=".9" />
        <circle cx="12" cy="18.1" r=".9" />
      </>
    ),
  },
  hat: {
    shape: (
      <>
        <path d="M7 15.6c0-6 1.9-10.6 5-10.6s5 4.6 5 10.6z" />
        <path d="M1.5 14.4c1.3 2.9 5.4 4.4 10.5 4.4s9.2-1.5 10.5-4.4c-2.5 1.2-6.2 1.8-10.5 1.8S4 15.6 1.5 14.4z" />
      </>
    ),
    cut: <path {...carve} strokeWidth={1.8} d="M7.4 12.6h9.2M12 5.6v2.6" />,
  },
  crates: {
    shape: (
      <>
        <rect x="2.5" y="12.5" width="8.5" height="8.5" rx=".8" />
        <rect x="13.5" y="12.5" width="8.5" height="8.5" rx=".8" />
        <rect x="8" y="2" width="8.5" height="8.5" rx=".8" />
      </>
    ),
    cut: (
      <path
        {...carve}
        strokeWidth={1.2}
        d="M3.9 13.9l5.7 5.7M2.5 16.75h8.5M14.9 13.9l5.7 5.7M13.5 16.75h8.5M9.4 3.4l5.7 5.7M8 6.25h8.5"
      />
    ),
  },
  cylinder: {
    shape: <circle cx="12" cy="12" r="10" />,
    cut: (
      <>
        <circle cx="12.0" cy="6.4" r="2.3" />
        <circle cx="16.85" cy="9.2" r="2.3" />
        <circle cx="16.85" cy="14.8" r="2.3" />
        <circle cx="12.0" cy="17.6" r="2.3" />
        <circle cx="7.15" cy="14.8" r="2.3" />
        <circle cx="7.15" cy="9.2" r="2.3" />
        <circle cx="12" cy="12" r="1.2" />
      </>
    ),
  },
  compass: {
    shape: <circle cx="12" cy="12" r="10" />,
    cut: (
      <>
        <path d="M12 4.2l2.6 7.8-2.6 7.8-2.6-7.8z" />
        <path {...carve} strokeWidth={1.3} d="M12 2.6v1M12 20.4v1M2.6 12h1M20.4 12h1" />
      </>
    ),
    top: <path d="M12 6.4l1.7 5.6h-3.4z" />,
  },
  magnifier: {
    shape: (
      <>
        <circle {...ring} cx="10" cy="10" r="7.2" strokeWidth={3.2} />
        <path {...ring} strokeWidth={4} d="M15.4 15.4l6 6" />
        <path {...ring} strokeWidth={2} d="M6.9 10.2l2.1 2.2 4-4.5" />
      </>
    ),
  },
  keyhole: {
    shape: (
      <>
        <circle cx="12" cy="8.6" r="4.6" />
        <path d="M9.2 11.4L7.6 21.5h8.8l-1.6-10.1z" />
      </>
    ),
    cut: <path {...carve} strokeWidth={1.3} d="M12 6.4v2.6" />,
  },
  star: {
    shape: (
      <>
        <polygon points="12.00,2.00 14.70,7.32 20.66,7.00 17.40,12.00 20.66,17.00 14.70,16.68 12.00,22.00 9.30,16.68 3.34,17.00 6.60,12.00 3.34,7.00 9.30,7.32" />
        <circle cx="12.0" cy="1.8" r="1.6" />
        <circle cx="20.83" cy="6.9" r="1.6" />
        <circle cx="20.83" cy="17.1" r="1.6" />
        <circle cx="12.0" cy="22.2" r="1.6" />
        <circle cx="3.17" cy="17.1" r="1.6" />
        <circle cx="3.17" cy="6.9" r="1.6" />
      </>
    ),
    cut: <circle cx="12" cy="12" r="3" fill="none" stroke="black" strokeWidth="1.3" />,
  },
  // Weather (the Cairo clock)
  sun: {
    shape: (
      <>
        <circle cx="12" cy="12" r="5.6" />
        <path
          {...ring}
          strokeWidth={2}
          d="M12 1.5v2.6M12 19.9v2.6M1.5 12h2.6M19.9 12h2.6M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"
        />
      </>
    ),
    cut: <path {...carve} strokeWidth={1.1} d="M9.6 10.4c.6-1 1.6-1.6 2.8-1.7" />,
  },
  moon: {
    shape: <path d="M15.5 3.2A9 9 0 1 0 20.8 15 7.4 7.4 0 0 1 15.5 3.2z" />,
    cut: (
      <>
        <circle cx="10" cy="14" r="1.3" />
        <circle cx="13.5" cy="18" r=".8" />
        <circle cx="8" cy="9.5" r=".7" />
      </>
    ),
  },
  cloud: {
    shape: <path d="M7 19.5a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.5-1.4A4.6 4.6 0 0 1 17.6 19.5z" />,
    cut: <path {...carve} strokeWidth={1.2} d="M8.6 15.6h7" />,
  },
  wind: {
    shape: <path {...ring} strokeWidth={2.4} d="M3 8h11a3 3 0 1 0-3-3M3 13h16a3 3 0 1 1-3 3M3 18h8" />,
  },
  whistle: {
    shape: (
      <>
        <circle cx="9.5" cy="14" r="7" />
        <path d="M9.5 7H21.5v5.6h-5.9z" />
        <circle {...ring} cx="3.2" cy="8.4" r="2" strokeWidth={1.6} />
      </>
    ),
    cut: (
      <>
        <circle cx="9.5" cy="14" r="2.6" />
        <path {...carve} strokeWidth={1.2} d="M12.4 9.6h7.2" />
      </>
    ),
  },
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof GLYPHS;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  /** Give it a title only when the icon is the sole label of something. */
  title?: string;
};

const Icon = ({ name, size = 20, className = "", title }: Props) => {
  const id = `icon-${useId().replace(/:/g, "")}`;
  const glyph: Glyph = GLYPHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <g fill="white">{glyph.shape}</g>
        {glyph.cut && <g fill="black">{glyph.cut}</g>}
        {glyph.top && <g fill="white">{glyph.top}</g>}
      </mask>
      <rect width="24" height="24" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
};

export default Icon;
