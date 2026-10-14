import { useId } from "react";

// A Victorian rule: fading lines, two curls, two dots and a diamond, like the
// ornaments around RDR2's chapter cards.
const Ornament = ({ className = "" }: { className?: string }) => {
  const id = `orn-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 520 24" aria-hidden="true" className={`block h-6 w-full max-w-[520px] ${className}`}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="11.4" width="214" height="1.2" fill={`url(#${id}l)`} />
      <rect x="306" y="11.4" width="214" height="1.2" fill={`url(#${id}r)`} />
      <g fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M214 12 C222 4,232 4,232 11 C232 16,226 16,225 12" />
        <path d="M306 12 C298 4,288 4,288 11 C288 16,294 16,295 12" />
        <path d="M260 3 L269 12 L260 21 L251 12 Z" />
      </g>
      <circle cx="241" cy="12" r="2.2" fill="currentColor" />
      <circle cx="279" cy="12" r="2.2" fill="currentColor" />
      <path d="M260 7.5 L264.5 12 L260 16.5 L255.5 12 Z" fill="currentColor" />
    </svg>
  );
};

export default Ornament;
