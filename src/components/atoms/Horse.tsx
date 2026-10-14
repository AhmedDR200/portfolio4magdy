import { useEffect, useState } from "react";

// A real horse: Eadweard Muybridge's "The Horse in Motion" (1878, public
// domain), traced into six silhouettes that make one full gallop stride.
// The frames load on first use, so they stay out of the main bundle.

export const HORSE_FRAMES = 6;
export const HORSE_CREDIT = "Eadweard Muybridge, The Horse in Motion, 1878 · public domain";

let frames: string[] | null = null;
let loading: Promise<string[]> | null = null;

const loadFrames = () => {
  loading ??= import("../../assets/horse/muybridge-gallop.json").then((m) => (frames = m.default.frames));
  return loading;
};

type Props = { frame: number; className?: string; flip?: boolean };

const Horse = ({ frame, className = "", flip = false }: Props) => {
  const [paths, setPaths] = useState(frames);

  useEffect(() => {
    if (paths) return;
    let alive = true;
    loadFrames().then((f) => alive && setPaths(f));
    return () => {
      alive = false;
    };
  }, [paths]);

  if (!paths) return null;
  return (
    <svg viewBox="0 0 273 171" className={className} aria-hidden="true">
      <path
        d={paths[((frame % HORSE_FRAMES) + HORSE_FRAMES) % HORSE_FRAMES]}
        fill="currentColor"
        fillRule="evenodd"
        transform={flip ? "translate(273 0) scale(-1 1)" : undefined}
      />
    </svg>
  );
};

export default Horse;
