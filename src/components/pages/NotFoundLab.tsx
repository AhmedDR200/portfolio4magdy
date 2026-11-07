import { useEffect } from "react";
import { MotionConfig, motion } from "framer-motion";

import { config } from "../../constants/config";
import { unlock } from "../../utils/achievements";
import Arrow from "../atoms/Arrow";
import ElementTile from "../atoms/ElementTile";
import Wordmark from "../atoms/Wordmark";
import Cursor from "../layout/Cursor";
import Toasts from "../layout/Toasts";

// The lab's 404: the missing page is a new element, Nf, Notfoundium, which does
// not survive at room temperature. Served as 404.html on Vercel, and by the app
// itself for any unknown path in dev.
const Facts = ({ path }: { path: string }) => (
  <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-mono text-[12px] tracking-[0.08em]">
    {[
      ["STATE", "gone at room temperature"],
      ["HALF-LIFE", "0 ms"],
      ["DISCOVERED", "just now, by you"],
      ["LAST SEEN", path],
    ].map(([k, v]) => (
      <div key={k} className="contents">
        <dt className="text-smoke">{k}</dt>
        <dd className="m-0 min-w-0 truncate text-paper">{v}</dd>
      </div>
    ))}
  </dl>
);

const NotFoundLab = () => {
  const path = window.location.pathname;

  useEffect(() => {
    document.title = "404 — Notfoundium · Ahmed Magdy";
    unlock("outlaw");
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <Toasts />
      <main className="lab-grid relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper">
        <div aria-hidden="true" className="tape h-9 shrink-0" />
        <header className="flex items-center justify-between px-5 py-5 sm:px-12 sm:py-7">
          <a href="/" aria-label="Ahmed Magdy, home">
            <Wordmark className="text-[27px] sm:text-[32px]" />
          </a>
        </header>

        <div className="mx-auto grid w-full max-w-[1344px] flex-1 items-center gap-12 px-5 pb-16 pt-2 sm:px-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">
          <motion.div
            className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <ElementTile symbol="Nf" number={404} name="Notfoundium" size={Math.min(300, Math.round((typeof window === "undefined" ? 1200 : window.innerWidth) * 0.7))} tone="solid" />
              <span className="absolute -right-3 -top-3 rotate-[6deg] bg-bandana px-2.5 py-1 font-fellsc text-[15px] tracking-[0.14em] text-ink">Unstable</span>
            </div>
            <Facts path={path} />
          </motion.div>

          <div className="flex flex-col gap-5">
            <p className="m-0 break-all font-mono text-[14px] text-smoke">
              <span className="text-frost">›</span> GET {path} → <span className="text-frost">404 Not Found</span>
            </p>
            <h1 className="m-0 font-display text-[clamp(52px,7vw,96px)] font-normal uppercase leading-[0.95]">
              This page
              <br />
              evaporated<span className="text-frost">.</span>
            </h1>
            <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[clamp(26px,3vw,34px)] leading-snug text-mist">
              الصفحة دي اتبخّرت من المعمل.
            </p>
            <p className="m-0 max-w-[470px] text-[14px] leading-[1.75] text-smoke">
              The address does not exist, or it was here once and left no residue. Nothing is broken on your side.
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              <a
                href="/"
                className="flex h-[52px] items-center bg-frost px-6 text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-105"
              >
                <Arrow dir="left" className="mr-2" /> Back to the lab
              </a>
              <a
                href={`mailto:${config.html.email}?subject=${encodeURIComponent(`Broken link on magdy.digital: ${path}`)}`}
                className="flex h-[52px] items-center border border-paper/30 px-[22px] text-[13px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-frost hover:text-frost"
              >
                Report it <Arrow dir="up-right" className="ml-1.5" />
              </a>
            </div>
          </div>
        </div>
        <div className="tape flex h-9 shrink-0 items-center justify-center overflow-hidden">
          <span className="whitespace-nowrap bg-ink px-4 py-0.5 font-fellsc text-[15px] tracking-[0.12em] text-bandana sm:text-[17px]">Caution · page not found<span className="hidden sm:inline"> · do not cross</span></span>
        </div>
      </main>
    </MotionConfig>
  );
};

export default NotFoundLab;
