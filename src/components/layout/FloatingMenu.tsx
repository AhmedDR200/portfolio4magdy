import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { navLinks } from "../../constants";
import { config } from "../../constants/config";
import { ACHIEVEMENTS, useUnlocked } from "../../utils/achievements";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { whistle } from "./HorseWhistle";
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
  "flex h-10 items-center gap-2.5 rounded-full border border-paper/25 px-4 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors hover:border-volt hover:text-volt aria-pressed:border-volt aria-pressed:text-volt";
const kbd = "rounded border border-current px-1.5 font-mono text-[11px] leading-[1.4]";

// A round volt button that appears once the hero scrolls away, plus the
// full-screen menu it opens (also opened by the hero's Menu button on phones).
const FloatingMenu = ({ open, onOpenChange, xray, onXray, powerCut, onPowerCut, onMap, onWheel, onJournal }: Props) => {
  const unlocked = useUnlocked();
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
            className="fixed right-5 top-5 z-[80] flex h-[68px] w-[68px] flex-col items-center justify-center gap-[7px] rounded-full bg-volt text-ink shadow-[0_10px_40px_-10px_rgba(212,255,58,0.6)] sm:right-8 sm:top-8 sm:h-20 sm:w-20"
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
                <p className="m-0 border-b border-paper/15 pb-4 text-[12px] uppercase tracking-[0.14em] text-smoke">
                  Navigation
                </p>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        onClick={close}
                        className="group flex items-center gap-4 py-1 font-display text-[clamp(48px,7vw,72px)] uppercase leading-[1.05] transition-colors hover:text-volt"
                      >
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 scale-0 rounded-full bg-volt transition-transform group-hover:scale-100"
                        />
                        {link.title}
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
                  className="flex h-14 w-fit items-center rounded-full bg-volt px-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink"
                >
                  Resume ↓
                </a>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] uppercase tracking-[0.1em]">
                  <a href={config.socials.github} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-volt">
                    GitHub
                  </a>
                  <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-volt">
                    LinkedIn
                  </a>
                  <a href={config.youtube.url} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-volt">
                    YouTube
                  </a>
                  <a href={`mailto:${config.html.email}`} className="py-2 hover:text-volt">
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
                      Whistle <kbd className={kbd}>H</kbd>
                    </button>
                  </div>
                </div>
                <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[28px] text-volt">
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
