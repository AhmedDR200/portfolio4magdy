import type { CSSProperties } from "react";

type Tone = "solid" | "outline" | "dim" | "crystal" | "hazard";

type Props = {
  /** The symbol, one to three letters: "Mg". */
  symbol: string;
  /** Top left, like an atomic number. */
  number?: number | string;
  /** Under the symbol, small: "Magdy". */
  name?: string;
  /** Side length in px; the type scales with it. */
  size?: number;
  tone?: Tone;
  className?: string;
};

const TONES: Record<Tone, string> = {
  solid: "border-frost bg-frost text-ink",
  outline: "border-frost bg-transparent text-frost",
  dim: "border-dim/60 bg-transparent text-dim",
  crystal: "border-crystal bg-crystal text-ink",
  hazard: "border-bandana bg-bandana text-ink",
};

// A periodic-table tile: the lab's signature shape. Solid for things earned or
// used every day, outlined for the rest, dim for locked.
const ElementTile = ({ symbol, number, name, size = 64, tone = "outline", className = "" }: Props) => {
  const style: CSSProperties = { width: size, height: size };
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`relative inline-flex shrink-0 select-none flex-col items-center justify-center border-2 font-archivo leading-none ${TONES[tone]} ${className}`}
    >
      {number !== undefined && (
        <span className="absolute font-bold" style={{ left: size * 0.09, top: size * 0.08, fontSize: Math.max(8, size * 0.16) }}>
          {number}
        </span>
      )}
      <span className="font-extrabold tracking-[-0.03em]" style={{ fontSize: size * 0.46 }}>
        {symbol}
      </span>
      {name && (
        <span className="absolute font-semibold tracking-wide" style={{ bottom: size * 0.07, fontSize: Math.max(7, size * 0.12) }}>
          {name}
        </span>
      )}
    </span>
  );
};

export default ElementTile;
