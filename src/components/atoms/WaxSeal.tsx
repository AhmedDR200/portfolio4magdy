// The hero's spinning badge as a red wax seal, pressed with a م, with the
// old ring of words still turning around it.
const BLOB = "M95.3 50.0 L93.6 57.7 L90.6 64.8 L88.7 72.3 L84.3 78.8 L78.4 83.9 L70.4 85.4 L65.8 93.4 L57.4 91.8 L50.0 92.3 L41.3 99.4 L35.0 91.2 L26.9 90.0 L21.8 83.6 L15.6 78.9 L11.2 72.4 L7.8 65.3 L4.3 58.0 L5.9 50.0 L5.1 42.1 L4.8 33.5 L14.3 29.4 L15.0 20.7 L21.3 15.8 L28.6 13.0 L35.0 8.7 L42.0 4.4 L50.0 6.2 L57.9 5.3 L65.9 6.4 L74.2 8.1 L80.0 14.2 L83.2 22.1 L89.8 27.0 L91.0 35.1 L99.0 41.4Z";

const WaxSeal = ({ className = "" }: { className?: string }) => (
  <div aria-hidden="true" data-xray="wax-seal" className={`relative h-[124px] w-[124px] items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="animate-spin-slow absolute -inset-4 h-[calc(100%+32px)] w-[calc(100%+32px)]">
      <defs>
        <path id="wax-seal-ring" d="M50,50 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <text className="fill-paper font-fellsc" fontSize="7.6" letterSpacing="1">
        <textPath href="#wax-seal-ring" textLength="285" lengthAdjust="spacing">
          APIS · BACKEND · SYSTEMS · REAL-TIME ·{" "}
        </textPath>
      </text>
    </svg>
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)]">
      <path d={BLOB} className="fill-bandana" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#7E1219" strokeWidth="3" />
      <circle cx="50" cy="50" r="27" fill="#9A1A23" />
      <path d="M30 26 C 40 18, 58 18, 68 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <span lang="ar" className="relative font-arabic text-[42px] leading-none text-[#6E0F16] [text-shadow:0_1px_0_rgba(255,255,255,0.25)]">
      م
    </span>
  </div>
);

export default WaxSeal;
