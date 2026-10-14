// Volt disc with "BACKEND • SYSTEMS • REAL-TIME • APIS •" circling a م.
// The caller positions it (it's absolutely placed in the hero).
const SpinBadge = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    data-xray="spin-badge"
    className={`h-[156px] w-[156px] items-center justify-center rounded-full bg-volt ${className}`}
  >
    <svg viewBox="0 0 156 156" className="animate-spin-slow absolute inset-0 h-full w-full">
      <defs>
        <path
          id="spin-badge-circle"
          d="M78,78 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
        />
      </defs>
      <text
        fontFamily="JetBrains Mono, monospace"
        fontSize="11.5"
        fontWeight="600"
        letterSpacing="2"
        fill="#0A0A0A"
      >
        <textPath href="#spin-badge-circle">BACKEND • SYSTEMS • REAL-TIME • APIS • </textPath>
      </text>
    </svg>
    <span lang="ar" className="font-arabic text-[52px] leading-none text-ink">
      م
    </span>
  </div>
);

export default SpinBadge;
