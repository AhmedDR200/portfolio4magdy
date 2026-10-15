// The pencil underline on the journal page in About. The line is drawn
// twice, the second a hair off and fainter, the way a pencil goes over a line.

const Pencil = ({ d, width = 1.5 }: { d: string; width?: number }) => (
  <>
    <path d={d} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity="0.88" />
    <path d={d} fill="none" stroke="currentColor" strokeWidth={width * 0.7} strokeLinecap="round" opacity="0.32" transform="translate(0.9 0.6)" />
  </>
);

// A wavy pencil underline, stretched under a phrase.
export const Underline = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" className={className}>
    <Pencil d="M2 7 C 40 3, 80 10, 120 6 S 180 4, 198 7" width={1.6} />
  </svg>
);
