import { bbCrystal } from '../../assets';
import { PURITY_MAX, PURITY_START } from '../../utils/purity';

type Props = {
  /** Purity in percent: 24 (crude) to 99.1 (reagent grade). */
  purity: number;
  /** Diameter in px. */
  size?: number;
  className?: string;
};

// A real crystal photograph that clears as purity rises: murky and soft at the
// bottom, razor sharp at 99.1%, inside a ring that fills to the percentage.
// CSS filters do the clearing (the photo itself never changes), so it is
// smooth and costs nothing to animate. From 90% the ring turns paper white and
// the crystal glows.
const PurityRing = ({ purity, size = 84, className = '' }: Props) => {
  const clarity = Math.max(0, Math.min(1, (purity - PURITY_START) / (PURITY_MAX - PURITY_START)));
  const eased = Math.pow(clarity, 0.85);
  const blur = 8 * Math.pow(1 - clarity, 1.6) * (size / 168);
  const top = purity >= 90;
  const fill = top ? 'rgb(var(--paper))' : 'rgb(var(--crystal))';
  const pct = Math.max(0, Math.min(100, purity));
  return (
    <span
      role="img"
      aria-label={`Purity ${purity.toFixed(1)} percent`}
      className={`relative inline-block shrink-0 rounded-full transition-shadow duration-700 ${className}`}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${fill} 0 ${pct}%, rgb(var(--graphite)) ${pct}% 100%)`,
        boxShadow: top ? `0 0 ${Math.round(size * 0.22)}px rgb(var(--crystal) / 0.45)` : 'none',
      }}
    >
      <span
        className="absolute overflow-hidden rounded-full bg-black"
        style={{ inset: Math.max(3, size * 0.048) }}
      >
        <img
          src={bbCrystal}
          alt=""
          draggable={false}
          loading="lazy"
          className="h-full w-full select-none object-cover transition-[filter] duration-700"
          style={{
            filter: `blur(${blur.toFixed(2)}px) saturate(${(0.3 + 0.7 * eased).toFixed(
              2
            )}) brightness(${(0.55 + 0.45 * eased).toFixed(2)})`,
          }}
        />
      </span>
    </span>
  );
};

export default PurityRing;
