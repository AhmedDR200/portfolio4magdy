import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { mePhoto } from "../../assets";
import { heroRoles } from "../../constants";
import { config } from "../../constants/config";
import { EASE_OUT_CUBIC } from "../../utils/motion";
import CairoClock from "../atoms/CairoClock";
import KeyCap from "../atoms/KeyCap";
import NameMarquee from "../atoms/NameMarquee";
import WaxSeal from "../atoms/WaxSeal";
import Hud from "../layout/Hud";
import { whistle } from "../layout/HorseWhistle";
import Navbar from "../layout/Navbar";


// RDR2's prompts, bottom right: the site's real hotkeys, and clickable too.
const Prompts = ({ onMap, onWheel, onJournal }: Pick<Props, "onMap" | "onWheel" | "onJournal">) => {
  const prompts = [
    { key: "H", label: "Whistle", run: whistle },
    { key: "M", label: "Map", run: onMap },
    { key: "Tab", label: "Skills", run: onWheel },
    { key: "J", label: "Journal", run: onJournal, ring: true },
  ];
  return (
    <ul aria-label="Keyboard shortcuts" className="m-0 flex list-none flex-col items-end gap-2.5 p-0 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
      {prompts.map((p) => (
        <li key={p.key}>
          <button type="button" onClick={p.run} className="group flex items-center gap-3 font-fellsc text-[16px] tracking-[0.12em] text-paper">
            <KeyCap ring={p.ring}>{p.key}</KeyCap>
            {p.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

type Props = {
  /** The intro is about to play: start lowered and scaled down behind it. */
  startHidden: boolean;
  /** The intro's curtain is lifting: rise into place with it. */
  revealed: boolean;
  onMenu: () => void;
  onMap: () => void;
  onWheel: () => void;
  onJournal: () => void;
};

const Hero = ({ startHidden, revealed, onMenu, onMap, onWheel, onJournal }: Props) => {
  const reduce = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setRoleIndex((i) => (i + 1) % heroRoles.length),
      2800
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <motion.section
      id="top"
      aria-label="Intro"
      className="relative flex min-h-[max(680px,100svh)] flex-col justify-between overflow-hidden bg-ink"
      style={{ transformOrigin: "50% 100%" }}
      initial={startHidden ? { y: 160, scale: 0.88 } : false}
      animate={revealed ? { y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.9, ease: EASE_OUT_CUBIC }}
    >
      {/* The photo as a print pinned up: black and white, a halftone screen, a
          snow-white border and a slight tilt, like a WANTED poster's portrait. */}
      <div aria-hidden="true" className="grain absolute inset-0" />
      <figure className="absolute left-1/2 top-[124px] m-0 aspect-[38/45] w-[min(62vw,300px)] -translate-x-1/2 -rotate-[1.4deg] border-[6px] border-paper bg-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] sm:top-[150px] sm:w-[clamp(260px,40vw,440px)] lg:top-[104px] lg:w-[22vw] xl:w-[clamp(300px,30vw,440px)]">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={mePhoto}
            alt="Portrait of Ahmed Magdy"
            className="h-full w-full object-cover object-[51%_30%] contrast-[1.35] brightness-[1.12] grayscale"
          />
          <div aria-hidden="true" className="halftone absolute inset-0" />
        </div>
      </figure>

      <Navbar onMenu={onMenu} ready={revealed} />
      {/* Below lg there's no room for the HUD, so the clock sits under the navbar. */}
      <div className="relative z-10 -mt-1 px-5 sm:mb-auto sm:px-12 lg:hidden">
        <CairoClock />
      </div>

      {/* On phones this sits just above the name, below the face. */}
      <div className="relative mb-4 mt-auto flex flex-col gap-5 pr-5 sm:my-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-8 sm:pr-12 lg:items-stretch">
        <div className="flex flex-col justify-between gap-10">
          <a
            href={config.currentRole.url}
            target="_blank"
            rel="noopener noreferrer"
            className="torn-2 flex w-fit items-center gap-5 bg-frost py-3.5 pl-5 pr-8 text-ink sm:py-4 sm:pl-12"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-fellsc text-[12px] tracking-[0.2em] sm:text-[13px]">Presently</span>
              <span className="font-display text-[20px] uppercase leading-[1.1] sm:text-[26px]">
                {config.currentRole.title}
              </span>
            </span>
            <span aria-hidden="true" className="animate-pulse-ink h-3 w-3 rounded-full bg-ink" />
          </a>
          <Hud className="hidden pl-12 lg:flex" />
        </div>

        {/* The title sizes to the room beside the print (see the lg/xl font sizes). */}
        <div className="flex flex-col pl-5 sm:ml-auto sm:items-end sm:pl-0 sm:text-right">
          <p className="m-0 font-display text-[38px] uppercase leading-none sm:text-[clamp(40px,3.9vw,56px)] lg:text-[length:min(3.9vw,56px,calc((39vw_-_72px)/8.6))] xl:text-[length:min(3.9vw,56px,calc((50vw_-_72px_-_min(15vw,220px))/8.6))]">
            Backend Engineer
          </p>
          <p className="relative m-0 h-[1.05em] overflow-hidden font-display text-[38px] uppercase leading-none text-frost sm:text-[clamp(40px,3.9vw,56px)] lg:text-[length:min(3.9vw,56px,calc((39vw_-_72px)/8.6))] xl:text-[length:min(3.9vw,56px,calc((50vw_-_72px_-_min(15vw,220px))/8.6))]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={roleIndex}
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease: EASE_OUT_CUBIC }}
              >
                &amp; {heroRoles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="m-0 mt-2 text-left font-arabic text-[26px] leading-[1.2] sm:text-right sm:text-[34px]"
          >
            مهندس باك إند
          </p>
          {/* In the flow under the role, so they can never cover the text. */}
          <div className="mt-auto hidden items-end gap-10 pt-8 lg:flex">
            <Prompts onMap={onMap} onWheel={onWheel} onJournal={onJournal} />
            <WaxSeal className="mr-4 hidden xl:flex" />
          </div>
        </div>
      </div>

      <NameMarquee className="worn relative pb-3 font-display text-[clamp(120px,17.4vw,250px)] uppercase leading-none text-frost sm:pb-4" />
    </motion.section>
  );
};

export default Hero;
