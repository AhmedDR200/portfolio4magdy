// Pencil sketches for the journal pages in About, drawn once and kept as
// paths. Each line is drawn twice, the second a hair off and fainter, the way
// a pencil goes over a line.

const Pencil = ({ d, width = 1.5 }: { d: string; width?: number }) => (
  <>
    <path d={d} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity="0.88" />
    <path d={d} fill="none" stroke="currentColor" strokeWidth={width * 0.7} strokeLinecap="round" opacity="0.32" transform="translate(0.9 0.6)" />
  </>
);

const RACK =
  "M14 10 H138 V196 H14 Z M14 40 H138 M14 70 H138 M14 100 H138 M14 130 H138 M14 160 H138 M66 20 H116 M66 26 H116 M66 50 H116 M66 56 H116 M66 80 H116 M66 86 H116 M66 110 H116 M66 116 H116 M66 140 H116 M66 146 H116 M66 170 H116 M66 176 H116 M22 196 L18 206 M130 196 L134 206 M4 210 C 40 214, 110 214, 150 210";
const RACK_HATCH =
  "M118.0 12.0 L118.0 12.0 M118.0 19.0 L125.0 12.0 M118.0 26.0 L132.0 12.0 M118.0 33.0 L136.0 15.0 M118.0 40.0 L136.0 22.0 M118.0 47.0 L136.0 29.0 M118.0 54.0 L136.0 36.0 M118.0 61.0 L136.0 43.0 M118.0 68.0 L136.0 50.0 M118.0 75.0 L136.0 57.0 M118.0 82.0 L136.0 64.0 M118.0 89.0 L136.0 71.0 M118.0 96.0 L136.0 78.0 M118.0 103.0 L136.0 85.0 M118.0 110.0 L136.0 92.0 M118.0 117.0 L136.0 99.0 M118.0 124.0 L136.0 106.0 M118.0 131.0 L136.0 113.0 M118.0 138.0 L136.0 120.0 M118.0 145.0 L136.0 127.0 M118.0 152.0 L136.0 134.0 M118.0 159.0 L136.0 141.0 M118.0 166.0 L136.0 148.0 M118.0 173.0 L136.0 155.0 M118.0 180.0 L136.0 162.0 M118.0 187.0 L136.0 169.0 M118.0 194.0 L136.0 176.0 M125.0 194.0 L136.0 183.0";
const RACK_LEDS: [number, number][] = [
  [26, 26],
  [37, 26],
  [26, 56],
  [37, 56],
  [26, 86],
  [37, 86],
  [26, 116],
  [37, 116],
  [26, 146],
  [37, 146],
  [26, 176],
  [37, 176],
];

export const RackSketch = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 156 218" aria-hidden="true" className={className}>
    <Pencil d={RACK} />
    <Pencil d={RACK_HATCH} width={0.9} />
    {RACK_LEDS.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
    ))}
  </svg>
);

const WIRES =
  "M30 18 L28 150 M34 18 L32 150 M8 30 H56 M12 44 H52 M160 18 L158 150 M164 18 L162 150 M138 30 H186 M142 44 H182 M290 18 L288 150 M294 18 L292 150 M268 30 H316 M272 44 H312 M8 34 Q 95 66 160 30 Q 225 66 290 30 Q 330 50 352 44 M12 48 Q 95 78 160 44 Q 225 78 290 44 Q 330 62 352 58 M196 59 c3 -6 9 -6 11 -1 c3 -2 6 -1 7 1 M204 58 l-2 6 M208 58 l1 6";
const INSULATORS: [number, number][] = [
  [12, 27],
  [52, 27],
  [16, 41],
  [48, 41],
  [142, 27],
  [182, 27],
  [146, 41],
  [178, 41],
  [272, 27],
  [312, 27],
  [276, 41],
  [308, 41],
];

export const TelegraphSketch = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 360 156" aria-hidden="true" className={className}>
    <Pencil d={WIRES} />
    {INSULATORS.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="currentColor" opacity="0.8" />
    ))}
  </svg>
);

const CUP =
  "M22 40 H92 V70 C92 92 76 104 57 104 C38 104 22 92 22 70 Z M92 50 C108 48 112 70 92 78 M8 110 C 30 120, 86 120, 108 110 M14 108 C 40 102, 76 102, 102 108 M44 30 C38 22 50 16 44 6 M60 30 C54 22 66 16 60 6 M76 30 C70 22 82 16 76 6";
const CUP_HATCH =
  "M70.0 44.0 L70.0 44.0 M70.0 50.0 L76.0 44.0 M70.0 56.0 L82.0 44.0 M70.0 62.0 L88.0 44.0 M70.0 68.0 L90.0 48.0 M70.0 74.0 L90.0 54.0 M70.0 80.0 L90.0 60.0 M70.0 86.0 L90.0 66.0 M70.0 92.0 L90.0 72.0 M72.0 96.0 L90.0 78.0 M78.0 96.0 L90.0 84.0 M84.0 96.0 L90.0 90.0";

export const CupSketch = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 116 122" aria-hidden="true" className={className}>
    <Pencil d={CUP} />
    <Pencil d={CUP_HATCH} width={0.9} />
  </svg>
);

// A wavy pencil underline, stretched under a phrase.
export const Underline = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" className={className}>
    <Pencil d="M2 7 C 40 3, 80 10, 120 6 S 180 4, 198 7" width={1.6} />
  </svg>
);
