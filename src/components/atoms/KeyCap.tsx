// A keyboard key in RDR2's prompt style: a small outlined box. With `ring`,
// a circle around it fills on hover, like the game's hold-to-confirm prompts.
type Props = { children: string; ring?: boolean; className?: string };

const KeyCap = ({ children, ring = false, className = "" }: Props) => {
  const key = (
    <kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-[5px] border-[1.6px] border-paper bg-ink/50 px-1.5 font-mono text-[12px] font-bold not-italic leading-none text-paper">
      {children}
    </kbd>
  );
  if (!ring) return <span className={`inline-flex ${className}`}>{key}</span>;
  return (
    <span className={`relative inline-flex h-11 w-11 items-center justify-center ${className}`}>
      <svg viewBox="0 0 44 44" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          className="stroke-frost transition-[stroke-dashoffset] duration-700 ease-out [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
          strokeWidth="2.5"
          pathLength={100}
          strokeDasharray="100 100"
        />
      </svg>
      {key}
    </span>
  );
};

export default KeyCap;
