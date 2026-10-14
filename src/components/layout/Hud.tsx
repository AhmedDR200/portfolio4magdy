import { useCairo } from "../atoms/CairoClock";
import { deadEye } from "./DeadEye";

// Bottom left of the hero, like RDR2's HUD: a minimap that is the Cairo clock
// (time and temperature under it, the way the game shows them) beside three
// cores. The cores follow the Cairo hour: coffee drains through the day,
// focus is up in working hours, and a core turns bandana red when it's low.

const GLYPHS = {
  heart:
    "M12 20.5 C5 15 2.5 11.5 2.5 8.2 C2.5 5.4 4.6 3.5 7.1 3.5 C9.1 3.5 10.8 4.7 12 6.6 C13.2 4.7 14.9 3.5 16.9 3.5 C19.4 3.5 21.5 5.4 21.5 8.2 C21.5 11.5 19 15 12 20.5 Z",
  cup: "M4 8 H17 V14 C17 17.3 14.3 20 11 20 H10 C6.7 20 4 17.3 4 14 Z M17 9.5 H18.5 C20.4 9.5 21.5 10.8 21.5 12.4 C21.5 14 20.3 15.3 18.6 15.3 H17 V13.6 H18.5 C19.3 13.6 19.8 13.1 19.8 12.4 C19.8 11.7 19.3 11.2 18.5 11.2 H17 Z M7 2.5 C8 3.5 6.2 4.6 7.2 5.8 L6.1 6.6 C4.6 5 6.5 3.9 5.9 3.2 Z M11 2.5 C12 3.5 10.2 4.6 11.2 5.8 L10.1 6.6 C8.6 5 10.5 3.9 9.9 3.2 Z",
  eye: "M12 5 C6.5 5 2.8 9.4 1.5 12 C2.8 14.6 6.5 19 12 19 C17.5 19 21.2 14.6 22.5 12 C21.2 9.4 17.5 5 12 5 Z M12 8.2 A3.8 3.8 0 1 1 12 15.8 A3.8 3.8 0 1 1 12 8.2 Z M12 10.3 A1.7 1.7 0 1 0 12 13.7 A1.7 1.7 0 1 0 12 10.3 Z",
  thermo: "M10 3.5 A2 2 0 0 1 14 3.5 V13.4 A4.2 4.2 0 1 1 10 13.4 Z M11.2 6 V14.6 A2.7 2.7 0 1 0 12.8 14.6 V6 Z",
} as const;

const Glyph = ({ name, className = "" }: { name: keyof typeof GLYPHS; className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
    <path d={GLYPHS[name]} fillRule="evenodd" />
  </svg>
);

type CoreProps = { icon: keyof typeof GLYPHS; level: number; label: string; note: string; onClick?: () => void };

const Core = ({ icon, level, label, note, onClick }: CoreProps) => {
  const low = level < 25;
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      title={`${label}: ${note}`}
      className="flex flex-col items-center gap-1.5 bg-transparent p-0 text-inherit"
    >
      <span className={`relative h-16 w-16 ${low ? "text-bandana" : "text-paper"}`}>
        <svg viewBox="0 0 66 66" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="33" cy="33" r="30" fill="none" className="stroke-paper/20" strokeWidth="3.5" />
          <circle cx="33" cy="33" r="30" fill="none" stroke="currentColor" strokeWidth="3.5" pathLength={100} strokeDasharray={`${level} 100`} />
          <circle cx="33" cy="33" r="23" className="fill-ink/60" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
        </svg>
        <Glyph name={icon} className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
      </span>
      <span className="font-fellsc text-[11px] tracking-[0.12em] text-paper/80">{label}</span>
    </Tag>
  );
};

// Pine stands on the map, placed once.
const TREES = [
  [38, 52], [61, 36], [112, 44], [130, 70], [27, 96], [52, 120], [140, 112], [98, 132], [118, 150], [44, 70], [150, 88], [76, 58],
];

const Minimap = () => (
  <svg viewBox="0 0 176 176" aria-hidden="true" className="h-[150px] w-[150px]">
    <defs>
      <clipPath id="hud-map">
        <circle cx="88" cy="88" r="84" />
      </clipPath>
    </defs>
    <circle cx="88" cy="88" r="84" className="fill-ink/80" />
    <g clipPath="url(#hud-map)">
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${-20 + i * 6} ${40 + i * 22} C 40 ${10 + i * 24}, 90 ${70 + i * 20}, 200 ${30 + i * 24}`}
          fill="none"
          className="stroke-paper/10"
          strokeWidth="1"
        />
      ))}
      {TREES.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} l4 -9 l4 9 Z`} className="fill-frost/25" />
      ))}
      <path d="M-10 130 C 40 120, 70 96, 92 90 C 120 82, 140 50, 190 40" fill="none" className="stroke-paper/40" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M30 -10 C 50 40, 30 70, 60 110 C 80 140, 70 160, 90 190" fill="none" className="stroke-frost/50" strokeWidth="4" strokeLinecap="round" />
    </g>
    <circle cx="88" cy="88" r="84" fill="none" className="stroke-paper/45" strokeWidth="2" />
    <path d="M88 76 L97 98 L88 93 L79 98 Z" className="fill-paper" />
    <circle cx="88" cy="9" r="10" className="fill-ink/90 stroke-paper/45" strokeWidth="1.5" />
    <text x="88" y="13.5" textAnchor="middle" className="fill-paper font-fellsc" fontSize="13">
      N
    </text>
    <text x="88" y="150" textAnchor="middle" className="fill-paper/70 font-fellsc" fontSize="11" letterSpacing="2">
      CAIRO
    </text>
  </svg>
);

const coffeeAt = (h: number) => (h < 6 ? 12 : Math.max(10, 100 - Math.max(0, h - 7) * 7));
const focusAt = (h: number) => (h >= 9 && h < 18 ? 92 : (h >= 7 && h < 9) || (h >= 18 && h < 23) ? 55 : 15);

const Hud = ({ className = "" }: { className?: string }) => {
  const { hour, weather, time } = useCairo();
  return (
    <div data-xray="hud" className={`items-end gap-5 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Minimap />
        <p className="m-0 flex items-center gap-2.5 font-fell text-[17px] text-paper">
          {time}
          {weather && (
            <>
              <span aria-hidden="true" className="h-3.5 w-px bg-paper/30" />
              <Glyph name="thermo" className="h-4 w-4 text-frost" />
              {weather.temp}°C
            </>
          )}
        </p>
      </div>
      {/* Cores from xl up: below that the printed photo needs the room. */}
      <div className="mb-9 hidden gap-3.5 xl:flex">
        <Core icon="heart" level={100} label="Uptime" note="the site is up" />
        <Core icon="cup" level={coffeeAt(hour)} label="Coffee" note="drains through the Cairo day" />
        <Core icon="eye" level={focusAt(hour)} label="Focus" note="high in working hours, Cairo time. Click (or hold E) for Dead Eye" onClick={deadEye} />
      </div>
    </div>
  );
};

export default Hud;
