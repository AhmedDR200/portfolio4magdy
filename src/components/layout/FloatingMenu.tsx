import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { navLinks } from "../../constants";
import Brush from "../atoms/Brush";
import { travelOnClick } from "../../utils/travel";
import { config } from "../../constants/config";
import { ACHIEVEMENTS, useUnlocked } from "../../utils/achievements";
import { levelOf, useBond } from "../../utils/bond";
import { toggleTheme, useTheme } from "../../utils/theme";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { whistle } from "./HorseWhistle";
import { deadEye } from "./DeadEye";
import { openSatchel } from "./Satchel";
import Icon from "../atoms/Icon";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xray: boolean;
  onXray: () => void;
  powerCut: boolean;
  onPowerCut: () => void;
  onMap: () => void;
  onWheel: () => void;
  onJournal: () => void;
};

const modeButton =
  "flex h-10 items-center gap-2.5 rounded-full border border-paper/25 px-4 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors hover:border-frost hover:text-frost aria-pressed:border-frost aria-pressed:text-frost";
const kbd = "rounded border border-current px-1.5 font-mono text-[11px] leading-[1.4]";

// A round frost button that appears once the hero scrolls away, plus the
// full-screen menu it opens (also opened by the hero's Menu button on phones).
const FloatingMenu = ({ open, onOpenChange, xray, onXray, powerCut, onPowerCut, onMap, onWheel, onJournal }: Props) => {
  const unlocked = useUnlocked();
  const bond = useBond();
  const theme = useTheme();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const close = () => onOpenChange(false);
  // Modes close the menu, so their effect is seen straight away.
  const toggleMode = (toggle: () => void) => () => {
    toggle();
    close();
  };

  return (
    <>
      <AnimatePresence>
        {(scrolledPastHero || open) && (
          <motion.button
            key="menu-button"
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            onClick={() => onOpenChange(!open)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="fixed right-5 top-5 z-[80] flex h-[68px] w-[68px] flex-col items-center justify-center gap-[7px] rounded-full bg-frost text-ink shadow-[0_10px_40px_-10px_rgb(var(--frost)/0.6)] sm:right-8 sm:top-8 sm:h-20 sm:w-20"
          >
            <span
              className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-[4.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70]"
          >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={close}
              className="absolute inset-0 h-full w-full cursor-default bg-ink/70 backdrop-blur-sm"
            />
            <motion.nav
              id="site-menu"
              aria-label="Menu"
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="absolute inset-y-0 right-0 flex w-full flex-col justify-between overflow-y-auto bg-graphite px-8 pb-10 pt-32 sm:w-[520px] sm:px-14"
            >
              <div className="flex flex-col gap-6">
                <p className="m-0 border-b border-paper/15 pb-4 font-fellsc text-[15px] tracking-[0.2em] text-smoke">
                  Chapters
                </p>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {/* RDR2's pause menu: the hovered item gets the brush stroke. */}
                  {navLinks.map((link, i) => (
                    <li key={link.id} className="flex">
                      <a
                        href={`#${link.id}`}
                        onClick={travelOnClick(link.id, close)}
                        className="group relative px-4 py-1.5 font-fellsc text-[clamp(38px,5.4vw,52px)] leading-[1.15] tracking-[0.08em] transition-colors duration-200 hover:text-ink focus-visible:text-ink focus-visible:outline-none"
                      >
                        <Brush
                          variant={i}
                          className="absolute -inset-x-3 inset-y-0 h-full w-[calc(100%+24px)] text-paper transition-[clip-path] duration-300 ease-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]"
                        />
                        <span className="relative">{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 flex flex-col gap-6">
                <a
                  href={config.cvUrl}
                  download
                  data-cv
                  className="torn flex h-14 w-fit items-center bg-frost px-8 font-fellsc text-[18px] tracking-[0.12em] text-ink"
                >
                  Resume ↓
                </a>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] uppercase tracking-[0.1em]">
                  <a href={config.socials.github} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-frost">
                    GitHub
                  </a>
                  <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-frost">
                    LinkedIn
                  </a>
                  <a href={config.youtube.url} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-frost">
                    YouTube
                  </a>
                  <a href={`mailto:${config.html.email}`} className="py-2 hover:text-frost">
                    Email
                  </a>
                </div>
                <div className="flex flex-col gap-2.5 border-t border-paper/15 pt-5">
                  <span className="text-[12px] uppercase tracking-[0.14em] text-smoke">Modes</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" aria-pressed={xray} onClick={toggleMode(onXray)} className={modeButton}>
                      <Icon name="eye" size={16} />
                      X-ray <kbd className={kbd}>X</kbd>
                    </button>
                    <button type="button" onClick={toggleMode(toggleTheme)} className={modeButton}>
                      <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
                      {theme === "dark" ? "Light" : "Dark"} mode <kbd className={kbd}>L</kbd>
                    </button>
                    <button type="button" aria-pressed={powerCut} onClick={toggleMode(onPowerCut)} className={modeButton}>
                      <Icon name="bulb-off" size={16} />
                      {powerCut ? "Lights on" : "Power cut"} <kbd className={kbd}>P</kbd>
                    </button>
                    <button type="button" onClick={toggleMode(onMap)} className={modeButton}>
                      <Icon name="compass" size={16} />
                      Map <kbd className={kbd}>M</kbd>
                    </button>
                    <button type="button" onClick={toggleMode(onWheel)} className={modeButton}>
                      <Icon name="cylinder" size={16} />
                      Skill wheel <kbd className={kbd}>Tab</kbd>
                    </button>
                    <button type="button" onClick={toggleMode(onJournal)} className={modeButton}>
                      <Icon name="star" size={16} />
                      Achievements {unlocked.length}/{ACHIEVEMENTS.length} <kbd className={kbd}>J</kbd>
                    </button>
                    <button type="button" onClick={toggleMode(whistle)} className={modeButton}>
                      <Icon name="whistle" size={16} />
                      Whistle · bond {levelOf(bond.whistles).level}/4 <kbd className={kbd}>H</kbd>
                    </button>
                    <button type="button" onClick={toggleMode(openSatchel)} className={modeButton}>
                      <Icon name="briefcase" size={16} />
                      Satchel <kbd className={kbd}>I</kbd>
                    </button>
                    <button type="button" onClick={toggleMode(deadEye)} className={modeButton}>
                      <Icon name="stopwatch" size={16} />
                      Dead Eye <kbd className={kbd}>E</kbd>
                    </button>
                  </div>
                </div>
                <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[28px] text-frost">
                  {config.motto.ar}
                </p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMenu;
