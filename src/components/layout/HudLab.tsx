import { bbCrystal } from "../../assets";
import { PURITY_MAX, PURITY_START, purityLevel, usePurity } from "../../utils/purity";
import { useCairo } from "../atoms/CairoClock";

// Bottom left of the lab's hero, like the board: purity as a real crystal that
// clears as it rises (blur, saturation and brightness follow the percent), ringed
// by a conic gauge, beside the Cairo clock. The ring opens the collection.
type Props = { className?: string; onJournal?: () => void };

const HudLab = ({ className = "", onJournal }: Props) => {
  const purity = usePurity();
  const level = purityLevel(purity);
  const { weather, time, status } = useCairo();
  // 0 at arrival, 1 at the full batch.
  const clear = Math.max(0, Math.min(1, (purity - PURITY_START) / (PURITY_MAX - PURITY_START)));
  const Ring = onJournal ? "button" : "div";

  return (
    <div data-xray="hud" className={`items-end gap-6 ${className}`}>
      <Ring
        type={onJournal ? "button" : undefined}
        onClick={onJournal}
        title={`Purity ${purity.toFixed(1)}% · ${level.name}. Open the collection (J)`}
        aria-label={`Purity ${purity.toFixed(1)} percent, ${level.name}. Open the collection`}
        className="group relative h-[92px] w-[92px] shrink-0 rounded-full bg-transparent p-0"
        style={{ background: `conic-gradient(rgb(var(--crystal)) 0 ${purity}%, rgb(var(--graphite)) ${purity}% 100%)` }}
      >
        <span className="absolute inset-[6px] overflow-hidden rounded-full bg-black">
          <img
            src={bbCrystal}
            alt=""
            draggable={false}
            className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
            style={{ filter: `blur(${(1 - clear) * 3.2 + 0.2}px) saturate(${0.55 + clear * 0.55}) brightness(${0.72 + clear * 0.32})` }}
          />
        </span>
      </Ring>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[10px] tracking-[0.14em] text-smoke">PURITY</span>
        <span className="font-display text-[40px] leading-none text-crystal">
          {purity.toFixed(1)}
          <span className="text-[20px]">%</span>
        </span>
        <span className="font-fellsc text-[12px] tracking-[0.16em] text-mist">{level.name}</span>
      </div>
      <span aria-hidden="true" className="mb-1 h-[72px] w-px bg-paper/15" />
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[10px] tracking-[0.14em] text-smoke">CAIRO · NOW</span>
        <span className="font-display text-[40px] leading-none">{time.replace(/\s?[AP]M$/, "")}</span>
        <span className="font-mono text-[12px] text-mist">
          {weather ? `${weather.temp}°C · ` : ""}
          {status.awake ? "online" : "asleep"}
        </span>
      </div>
    </div>
  );
};

export default HudLab;
