// One drawn arrow for the whole site, instead of the font's ↗ → ↓ glyphs,
// which every typeface draws differently. A straight shaft with an open,
// square-cut head; it sizes with the text (1em) and takes the text colour.
// Inside a link or button it nudges in its direction on hover.

export type ArrowDir = "up-right" | "right" | "left" | "down" | "up" | "enter" | "left-right";

const PATHS: Record<ArrowDir, string> = {
  "up-right": "M6.5 17.5 L17.5 6.5 M8.5 6.5 H17.5 V15.5",
  right: "M4 12 H19.5 M13.5 6 L19.5 12 L13.5 18",
  left: "M20 12 H4.5 M10.5 6 L4.5 12 L10.5 18",
  down: "M12 4 V19.5 M6 13.5 L12 19.5 L18 13.5",
  up: "M12 20 V4.5 M6 10.5 L12 4.5 L18 10.5",
  enter: "M19 5 V13 H6 M10.5 8.5 L6 13 L10.5 17.5",
  "left-right": "M3.5 12 H20.5 M8.5 7 L3.5 12 L8.5 17 M15.5 7 L20.5 12 L15.5 17",
};

const NUDGE: Record<ArrowDir, string> = {
  "up-right": "[a:hover_&]:translate-x-[0.12em] [a:hover_&]:-translate-y-[0.12em] [button:hover_&]:translate-x-[0.12em] [button:hover_&]:-translate-y-[0.12em]",
  right: "[a:hover_&]:translate-x-[0.16em] [button:hover_&]:translate-x-[0.16em]",
  left: "[a:hover_&]:-translate-x-[0.16em] [button:hover_&]:-translate-x-[0.16em]",
  down: "[a:hover_&]:translate-y-[0.14em] [button:hover_&]:translate-y-[0.14em]",
  up: "[a:hover_&]:-translate-y-[0.14em] [button:hover_&]:-translate-y-[0.14em]",
  enter: "",
  "left-right": "",
};

type Props = { dir?: ArrowDir; className?: string; label?: string };

const Arrow = ({ dir = "up-right", className = "", label }: Props) => (
  <svg
    viewBox="0 0 24 24"
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    className={`inline-block h-[1em] w-[1em] shrink-0 align-[-0.14em] transition-transform duration-200 ease-out ${NUDGE[dir]} ${className}`}
  >
    <path d={PATHS[dir]} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

export default Arrow;
