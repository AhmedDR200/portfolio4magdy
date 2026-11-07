import { useEffect, useRef } from "react";

import { markCredits, usePurity, PURITY_MAX } from "../../utils/purity";
import ElementTile from "../atoms/ElementTile";

// The lab's end credits, above the footer: who starred, who was with them, who
// worked which shift. Staying with them for two seconds is worth the last
// 0.1% of purity (99.0 to 99.1 once everything else is found).
const LINES: [string, string][] = [
  ["Starring", "Ahmed Magdy as the Backend Engineer"],
  ["Also starring", "Node.js, NestJS, Express"],
  ["With", "MongoDB, MySQL, Redis"],
  ["Real-time by", "WebSockets, Socket.io"],
  ["Day shift", "Madkhol Capital"],
  ["Night shift", "Bee3a, ٢٠٠ تمام"],
  ["Filmed in", "Cairo, Egypt"],
];

const EndCredits = () => {
  const ref = useRef<HTMLDivElement>(null);
  const purity = usePurity();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) timer = window.setTimeout(markCredits, 2000);
      },
      { threshold: 0.7 }
    );
    io.observe(el);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} data-xray="end-credits" className="mx-auto flex w-full max-w-[1060px] flex-col items-center gap-10 px-5 py-16 sm:px-12">
      <div className="flex w-full flex-col gap-3">
        {LINES.map(([role, who]) => (
          <div key={role} className="grid grid-cols-1 items-baseline gap-x-12 gap-y-0.5 text-center sm:grid-cols-2">
            <span className="font-mono text-[12px] tracking-[0.18em] text-smoke sm:text-right">{role.toUpperCase()}</span>
            <span className="text-[20px] font-semibold text-paper sm:text-left sm:text-[22px]">{who}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ElementTile symbol="Mg" number={12} size={64} tone="solid" />
        <div className="flex flex-col gap-0.5 text-left">
          <span className="font-display text-[32px] uppercase leading-none">The end</span>
          <span lang="ar" dir="rtl" className="font-arabic text-[18px] text-smoke">
            النهاية
          </span>
        </div>
        <span aria-hidden="true" className="mx-2 hidden h-[50px] w-px bg-paper/15 sm:block" />
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-crystal">{purity >= PURITY_MAX ? "BATCH COMPLETE · 99.1%" : "PURITY +0.1"}</span>
          <span className="text-[13px] text-mist">{purity >= PURITY_MAX ? "You found everything and stayed for the credits." : "Thanks for staying for the credits."}</span>
        </div>
      </div>
    </div>
  );
};

export default EndCredits;
