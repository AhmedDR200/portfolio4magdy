import type { ReactNode } from "react";

// "Before" on the Bee3a card: the paper notebook a shop runs on, which Bee3a
// replaces (its own line is «ودّع الكشكول!»). It's the same day as the demo
// phone beside it: the same three bookings, a crossed-out slot, a debt in
// highlighter and a sum that's off by 50 (250 + 450 + 350 is 1,050). Written
// in Aref Ruqaa, the hand most Egyptian shop notebooks are kept in.

const RULE = 52; // px between the ruled lines; each written line sits on one

const LINES: { text: ReactNode; indent: number }[] = [
  {
    text: <span className="text-[24px] font-bold underline decoration-2 underline-offset-[10px] sm:text-[30px]">حجوزات الأربع</span>,
    indent: 0,
  },
  { text: "١٢ — ندى · صبغة جذور ✓", indent: 6 },
  {
    text: (
      <>
        <s className="decoration-[3px]">١ — سلمى</s> ١:٣٠ سلمى · قص ؟؟
      </>
    ),
    indent: 2,
  },
  { text: <span className="text-[16px] sm:text-[20px]">(اتصلت مردتش)</span>, indent: 48 },
  { text: "٣ — هبة · تنظيف بشرة", indent: 10 },
  {
    text: (
      <span className="px-1.5" style={{ backgroundImage: "linear-gradient(transparent 38%, rgba(191,224,236,0.8) 38% 82%, transparent 82%)" }}>
        باقي ٥٠ على أم أحمد
      </span>
    ),
    indent: 4,
  },
  {
    text: (
      <>
        ٢٥٠ + ٤٥٠ + ٣٥٠ ={" "}
        <span className="inline-block -rotate-6 rounded-[50%] border-[2.5px] border-current px-2.5 leading-[1.4]">١٠٠٠ ؟</span>
      </>
    ),
    indent: 8,
  },
];

const margin = "absolute inset-y-0 border-l-[1.5px] border-[rgba(80,120,190,0.55)]";

const Bee3aNotebook = ({ className = "" }: { className?: string }) => (
  <div
    role="img"
    aria-label="Before: a shop's paper notebook, with bookings, a crossed-out slot, a debt and a wrong sum"
    data-xray="bee3a-notebook"
    className={`theme-dark overflow-hidden bg-paper ${className}`}
    style={{
      backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${RULE - 1.5}px, rgba(80,120,190,0.35) ${RULE - 1.5}px ${RULE}px)`,
    }}
  >
    {/* The written page: all of it on phones, the left half beside the app. */}
    <div className="absolute inset-y-0 left-0 right-0 lg:right-1/2">
      <span className={`${margin} right-[44px] sm:right-[56px]`} />
      <span className={`${margin} right-[50px] sm:right-[62px]`} />
      <ul
        lang="ar"
        dir="rtl"
        className="m-0 list-none p-0 pr-[60px] font-ruqaa text-[20px] text-[#1F3A93] sm:pr-[84px] sm:text-[26px]"
        // Down by 12px so the writing sits on its line, not between two.
        style={{ paddingTop: RULE + 12 }}
      >
        {LINES.map((line, i) => (
          <li key={i} className="whitespace-nowrap" style={{ height: RULE, lineHeight: `${RULE}px`, marginRight: line.indent }}>
            {line.text}
          </li>
        ))}
      </ul>
      {/* A tea glass was put down on it once. */}
      <span className="absolute bottom-8 left-8 hidden h-28 w-28 rounded-full border-[9px] border-ink/[0.07] sm:block" />
    </div>

    <span className="absolute left-4 top-4 rounded-lg bg-ink px-2.5 py-1 text-[11px] tracking-[0.12em] text-paper sm:left-5 sm:top-5">
      BEFORE ·{" "}
      <span lang="ar" className="font-arabic text-[14px] tracking-normal">
        الكشكول
      </span>
    </span>
  </div>
);

export default Bee3aNotebook;
