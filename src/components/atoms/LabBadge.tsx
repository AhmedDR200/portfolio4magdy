import { bbMe } from "../../assets";
import { coffeeAt, focusAt } from "../layout/Hud";
import { useCairo } from "./CairoClock";
import ElementTile from "./ElementTile";

// The lab's version of the hero portrait: a dosimeter ID badge. It stays pale in
// both modes (it is a printed card). The three windows at the bottom are the
// cores: they dim as they drain, following the Cairo hour.
const INK = "#0a100d";

const Window = ({ label, level, tint }: { label: string; level: number; tint: string }) => (
  <div className="flex flex-col items-center gap-1" title={`${label}: ${Math.round(level)}%`}>
    <span
      aria-hidden="true"
      className="h-[26px] w-[26px] rounded-full border-[3px] sm:h-[30px] sm:w-[30px]"
      style={{ borderColor: INK, background: tint, opacity: 0.3 + (level / 100) * 0.7 }}
    />
    <span className="font-mono text-[8px] font-bold tracking-[0.06em]">{label}</span>
  </div>
);

const Corner = ({ className }: { className: string }) => <span aria-hidden="true" className={`absolute h-[18px] w-[18px] border-[#1c6e93] ${className}`} />;

const LabBadge = ({ className = "" }: { className?: string }) => {
  const { hour } = useCairo();
  return (
    <figure data-xray="badge" className={`m-0 ${className}`}>
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-[#e9f0e4] text-[#0e1812] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(233,240,228,0.18)]"
        style={{ border: `3px solid ${INK}` }}
      >
        <div className="tape h-[22px] shrink-0" style={{ borderBottom: `3px solid ${INK}` }} />
        <div className="flex items-baseline justify-between px-[7%] pt-[3.5%]">
          <span className="font-fellsc text-[clamp(11px,1.15vw,15px)] tracking-[0.1em]">Authorized personnel</span>
          <span className="font-mono text-[9px] font-bold tracking-[0.08em]">LEVEL 5</span>
        </div>
        <div className="relative mx-[9%] mt-[3%] min-h-0 flex-1">
          <img
            src={bbMe}
            alt="Portrait of Ahmed Magdy"
            className="block h-full w-full object-cover object-[50%_18%]"
            style={{ border: `3px solid ${INK}` }}
          />
          <Corner className="-left-[7px] -top-[7px] border-l-4 border-t-4" />
          <Corner className="-right-[7px] -top-[7px] border-r-4 border-t-4" />
          <Corner className="-bottom-[7px] -left-[7px] border-b-4 border-l-4" />
          <ElementTile
            symbol="Mg"
            number={12}
            size={62}
            tone="solid"
            className="!absolute -bottom-3.5 -right-6 rotate-[-4deg] !border-[3px] !border-[#0a100d] shadow-[0_6px_0_rgba(0,0,0,0.25)]"
          />
        </div>
        <div className="flex flex-col gap-0.5 px-[7%] pt-[4%]">
          <span className="font-display text-[clamp(24px,2.5vw,34px)] uppercase leading-none">Ahmed Magdy</span>
          <span className="flex items-baseline justify-between">
            <span className="font-fellsc text-[11px] tracking-[0.18em] text-[#0f6b3b] sm:text-[12px]">Backend engineer</span>
            <span lang="ar" dir="rtl" className="font-arabic text-[18px] leading-none">
              أحمد مجدي
            </span>
          </span>
        </div>
        <div className="flex items-end justify-between gap-3 px-[7%] pb-[4%] pt-[3%]">
          <div className="flex flex-col gap-1.5">
            <span
              aria-hidden="true"
              className="block h-[22px] w-[110px] max-w-full"
              style={{ background: "repeating-linear-gradient(90deg,#0e1812 0 2px,transparent 2px 4px,#0e1812 4px 5px,transparent 5px 8px,#0e1812 8px 11px,transparent 11px 12px,#0e1812 12px 13px,transparent 13px 16px)" }}
            />
            <span className="font-mono text-[9px] font-bold tracking-[0.1em]">ID 0012 · CAIRO</span>
          </div>
          <div className="flex gap-2.5">
            <Window label="UP" level={100} tint="radial-gradient(circle at 35% 30%,#bfeaf8,#1c6e93)" />
            <Window label="FOCUS" level={focusAt(hour)} tint="radial-gradient(circle at 35% 30%,#8ff0b0,#0f6b3b)" />
            <Window label="COFFEE" level={coffeeAt(hour)} tint="radial-gradient(circle at 35% 30%,#fffbb0,#e6dc3a)" />
          </div>
        </div>
      </div>
    </figure>
  );
};

export default LabBadge;
