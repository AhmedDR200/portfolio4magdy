import Icon, { type IconName } from "./Icon";

const TONES = {
  volt: { coin: "bg-volt text-ink", ring: "#0A0A0A", track: "rgba(10,10,10,0.35)" },
  ink: { coin: "bg-ink text-volt", ring: "#D4FF3A", track: "rgba(212,255,58,0.45)" },
  dim: { coin: "bg-[#151515] text-paper/30", ring: "rgba(244,244,239,0.2)", track: "rgba(244,244,239,0.14)" },
  paper: { coin: "bg-paper text-ink", ring: "#0A0A0A", track: "rgba(10,10,10,0.3)" },
};

type Props = { name: IconName; size?: number; tone?: keyof typeof TONES; className?: string };

// A stamped coin around an icon: an outer ring and a dashed inner track.
const Medal = ({ name, size = 48, tone = "volt", className = "" }: Props) => {
  const t = TONES[tone];
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${t.coin} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full">
        <circle cx="24" cy="24" r="22.2" fill="none" stroke={t.ring} strokeWidth="1.6" />
        <circle cx="24" cy="24" r="19.4" fill="none" stroke={t.track} strokeWidth="1.1" strokeDasharray="1.6 2.4" />
      </svg>
      <Icon name={name} size={Math.round(size * 0.5)} />
    </span>
  );
};

export default Medal;
