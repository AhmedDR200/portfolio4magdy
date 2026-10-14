import { useEffect } from "react";
import { MotionConfig, motion } from "framer-motion";

import { config } from "../../constants/config";
import { unlock } from "../../utils/achievements";
import { changeHonor } from "../../utils/honor";
import Wordmark from "../atoms/Wordmark";
import Cursor from "../layout/Cursor";
import HonorMeter from "../layout/HonorMeter";
import Toasts from "../layout/Toasts";
import Arrow from "../atoms/Arrow";

// The torn top and bottom edges of the poster.
const TORN =
  "polygon(0 1.5%, 6% 0, 14% 1.2%, 25% 0.2%, 38% 1.4%, 52% 0, 63% 1.1%, 77% 0.3%, 88% 1.3%, 100% 0.4%, 99.2% 14%, 100% 31%, 99.3% 47%, 100% 63%, 99.1% 80%, 100% 98.6%, 90% 100%, 78% 98.8%, 64% 100%, 50% 99%, 36% 100%, 22% 98.9%, 10% 100%, 0 99%, 0.8% 82%, 0 64%, 0.9% 46%, 0 30%, 0.7% 15%)";

/** The wanted bug: an engraved beetle in front of a mugshot height chart. */
const WantedBug = () => (
  <svg viewBox="0 0 300 210" className="h-full w-full" role="img" aria-label="Sketch of the wanted bug, a beetle">
    <defs>
      <pattern id="wanted-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="#0E1916" strokeWidth="1.7" />
      </pattern>
    </defs>
    <g stroke="rgba(14,25,22,0.2)" strokeWidth="1">
      {[30, 60, 90, 120, 150, 180].map((y) => (
        <line key={y} x1="0" y1={y} x2="300" y2={y} />
      ))}
    </g>
    <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(14,25,22,0.5)">
      {[7, 6, 5, 4, 3, 2].map((ft, i) => (
        <g key={ft}>
          <text x="7" y={27 + i * 30}>{`${ft}'`}</text>
          <text x="282" y={27 + i * 30}>{`${ft}'`}</text>
        </g>
      ))}
    </g>
    <ellipse cx="150" cy="199" rx="62" ry="5" fill="rgba(14,25,22,0.16)" />
    <g fill="none" stroke="#0E1916" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M127 78 L104 70 L92 52 L86 47" />
      <path d="M173 78 L196 70 L208 52 L214 47" />
      <path d="M117 112 L86 108 L68 124 L62 126" />
      <path d="M183 112 L214 108 L232 124 L238 126" />
      <path d="M119 150 L91 162 L79 186 L74 190" />
      <path d="M181 150 L209 162 L221 186 L226 190" />
    </g>
    <g fill="none" stroke="#0E1916" strokeWidth="2.6" strokeLinecap="round">
      <path d="M141 42 C133 28 119 20 104 11" />
      <path d="M159 42 C167 28 181 20 196 11" />
    </g>
    <g fill="#0E1916">
      {[
        [131, 29],
        [121, 22],
        [111, 16],
        [169, 29],
        [179, 22],
        [189, 16],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" />
      ))}
    </g>
    <ellipse cx="150" cy="50" rx="17" ry="13" fill="#0E1916" />
    <ellipse cx="141" cy="47" rx="3" ry="2.4" fill="#EEF2EE" />
    <ellipse cx="159" cy="47" rx="3" ry="2.4" fill="#EEF2EE" />
    <path d="M126 66 Q150 58 174 66 L182 86 Q150 96 118 86 Z" fill="#0E1916" />
    <path d="M132 71 Q150 65 168 71" fill="none" stroke="#EEF2EE" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M149 92 L149 190 Q118 186 108 158 Q100 128 114 98 Q128 90 149 92 Z" fill="url(#wanted-hatch)" stroke="#0E1916" strokeWidth="3" />
    <path d="M151 92 L151 190 Q182 186 192 158 Q200 128 186 98 Q172 90 151 92 Z" fill="url(#wanted-hatch)" stroke="#0E1916" strokeWidth="3" />
    <path d="M114 98 Q100 128 108 158 Q118 186 149 190 L149 181 Q125 177 117 155 Q111 128 123 103 Z" fill="#0E1916" />
    <path d="M186 98 Q200 128 192 158 Q182 186 151 190 L151 181 Q175 177 183 155 Q189 128 177 103 Z" fill="#0E1916" />
    <path d="M126 108 Q120 132 127 160" fill="none" stroke="#EEF2EE" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M174 108 Q180 132 173 160" fill="none" stroke="#EEF2EE" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M150 92 L150 190" stroke="#EEF2EE" strokeWidth="2" />
  </svg>
);

// The 404 page: the missing page is a wanted outlaw. Served as 404.html on
// Vercel, and by the app itself for any unknown path in dev.
const NotFound = () => {
  const path = window.location.pathname;

  useEffect(() => {
    document.title = "404 — This page rode off · Ahmed Magdy";
    unlock("outlaw");
    changeHonor(-1, "404");
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <Toasts />
      <HonorMeter />
      <main className="relative min-h-[100svh] overflow-hidden bg-ink bg-[repeating-linear-gradient(90deg,transparent_0_118px,rgba(238,242,238,0.035)_118px_120px)] text-paper">
        <header className="flex items-center justify-between px-5 py-5 sm:px-12 sm:py-7">
          <a href="/" aria-label="Ahmed Magdy, home">
            <Wordmark className="text-[27px] sm:text-[32px]" />
          </a>
        </header>

        <div className="mx-auto grid max-w-[1344px] items-center gap-12 px-5 pb-20 pt-4 sm:px-12 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-20 lg:pt-8">
          <motion.div
            className="mx-auto w-full max-w-[480px] origin-top"
            initial={{ rotate: -2.6 }}
            animate={{ rotate: [-2.6, -1.8, -2.6] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          >
            <span
              aria-hidden="true"
              className="relative z-10 mx-auto -mb-6 block h-4 w-4 translate-y-4 rounded-full bg-[#3A3A37] shadow-[0_2px_0_#000,inset_0_-3px_0_rgba(0,0,0,0.4)]"
            />
            <div
              className="theme-dark flex flex-col items-center gap-2.5 bg-paper px-7 pb-9 pt-12 text-center text-ink shadow-[inset_0_0_70px_rgba(14,25,22,0.28),0_30px_60px_-20px_rgba(0,0,0,0.9)] sm:px-11"
              style={{ clipPath: TORN }}
            >
              <p className="m-0 font-western text-[clamp(58px,15vw,104px)] leading-none tracking-[0.02em]">WANTED</p>
              <p className="m-0 font-western text-[clamp(17px,4.4vw,26px)] tracking-[0.12em]">— DEAD OR ALIVE —</p>
              <div className="relative mt-2 aspect-[300/210] w-full max-w-[300px] border-4 border-ink bg-ink/[0.04]">
                <WantedBug />
                <span className="absolute -bottom-5 -right-5 rotate-[-12deg] rounded-md border-[3px] border-ink bg-paper px-3 py-1 font-display text-[22px] leading-none">
                  404
                </span>
              </div>
              <p className="m-0 mt-3 font-display text-[clamp(42px,10vw,58px)] uppercase leading-none">Bug 404</p>
              <p lang="ar" className="m-0 font-arabic text-[clamp(21px,5vw,27px)] leading-snug">
                الصفحة دي هربت من السيرفر
              </p>
              <p className="m-0 max-w-full truncate text-[12px] text-[#3C3C38]">
                Last seen in production · <span className="underline">{path}</span>
              </p>
              <span aria-hidden="true" className="my-1.5 h-0.5 w-full bg-ink" />
              <p className="m-0 font-western text-[clamp(18px,4.4vw,26px)] tracking-[0.14em]">REWARD</p>
              <p className="m-0 font-western text-[clamp(44px,12vw,62px)] leading-none">$5,000</p>
              <p className="m-0 mt-1 text-[11px] uppercase tracking-[0.1em] text-[#3C3C38]">Report to the sheriff · magdy.digital</p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-5">
            <p className="m-0 break-all text-[14px] text-smoke">
              <span className="text-frost">›</span> GET {path} → <span className="text-frost">404 Not Found</span>
            </p>
            <h1 className="m-0 font-display text-[clamp(56px,7vw,96px)] font-normal uppercase leading-[0.95]">
              This page
              <br />
              rode off<span className="text-frost">.</span>
            </h1>
            <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[clamp(26px,3vw,34px)] leading-snug text-mist">
              الصفحة دي ركبت الحصان ومشيت.
            </p>
            <p className="m-0 max-w-[470px] text-[14px] leading-[1.75] text-smoke">
              The link might be old, or the page moved towns. The rest of the site is still standing.
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              <a
                href="/"
                className="flex h-[52px] items-center rounded-full bg-frost px-6 text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-105"
              >
                <Arrow dir="left" className="mr-2" /> Back to town
              </a>
              <a
                href={`mailto:${config.html.email}?subject=${encodeURIComponent(`Broken link on magdy.digital: ${path}`)}`}
                className="flex h-[52px] items-center rounded-full border border-paper/25 px-[22px] text-[13px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-frost hover:text-frost"
              >
                Report the bug <Arrow dir="up-right" className="ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
};

export default NotFound;
