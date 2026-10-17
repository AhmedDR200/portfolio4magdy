import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { towns } from "../../constants";
import { config } from "../../constants/config";
import { ACHIEVEMENTS, useUnlocked } from "../../utils/achievements";
import { levelOf, useBond } from "../../utils/bond";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { toggleTheme, useTheme } from "../../utils/theme";
import { travelOnClick, travelTo } from "../../utils/travel";
import Arrow from "../atoms/Arrow";
import Brush from "../atoms/Brush";
import Icon, { type IconName } from "../atoms/Icon";
import KeyCap from "../atoms/KeyCap";
import Ornament from "../atoms/Ornament";
import { CHAPTERS, chapterAr, roman } from "../atoms/SectionHeader";
import Wordmark from "../atoms/Wordmark";
import { deadEye } from "./DeadEye";
import { whistle } from "./HorseWhistle";
import { openSatchel } from "./Satchel";

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

type Mode = { icon: IconName; name: string; desc: string; keyName: string; run: () => void; state?: string; pressed?: boolean };

const CHAPTER_IDS = Object.keys(CHAPTERS);
const label = "m-0 font-fellsc text-[13px] tracking-[0.24em] text-smoke";

// IM Fell's old-style 3 reads as a z: set it in a serif with lining figures.
const withBee3a = (text: string): ReactNode => {
  const [before, after] = text.split("Bee3a");
  if (after === undefined) return text;
  return (
    <>
      {before}Bee<span style={{ fontFamily: "'Times New Roman', Times, serif" }}>3</span>a{after}
    </>
  );
};

// The chapter the reader is on: the last section whose top is above 40% of the screen.
const currentChapter = () => {
  let at = 0;
  CHAPTER_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) at = i;
  });
  return at;
};

// RDR2's pause screen. All eight chapters, the picked one in the brush stroke
// (where you are when it opens; hover, focus or the arrows move it), with its
// fast-travel card: the town from the map and what is there. The modes sit in
// three groups, each with what it does, its state and its key. A round frost
// button opens it once the hero scrolls away; the hero's Menu button does too.
const FloatingMenu = ({ open, onOpenChange, xray, onXray, powerCut, onPowerCut, onMap, onWheel, onJournal }: Props) => {
  const unlocked = useUnlocked();
  const bond = useBond();
  const theme = useTheme();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [picked, setPicked] = useState(0);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    setPicked(currentChapter());
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const close = () => onOpenChange(false);
  // Modes close the menu, so their effect is seen straight away.
  const use = (run: () => void) => () => {
    run();
    close();
  };

  // Up and down move through the chapters, like the game's menu.
  const onChapterKey = (e: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (picked + step + CHAPTER_IDS.length) % CHAPTER_IDS.length;
    setPicked(next);
    links.current[next]?.focus();
  };

  const groups: { name: string; modes: Mode[] }[] = [
    {
      name: "Look",
      modes: [
        theme === "dark"
          ? { icon: "sun", name: "Light mode", desc: "Wanted: paper and ink", keyName: "L", run: toggleTheme }
          : { icon: "moon", name: "Dark mode", desc: "Ambarino: the snowy night", keyName: "L", run: toggleTheme },
        {
          icon: "bulb-off",
          name: "Power cut",
          desc: "Lights out, a lantern follows you",
          keyName: "P",
          run: onPowerCut,
          state: powerCut ? "On" : "Off",
          pressed: powerCut,
        },
        { icon: "eye", name: "X-ray", desc: "The code behind every part", keyName: "X", run: onXray, state: xray ? "On" : "Off", pressed: xray },
        { icon: "stopwatch", name: "Dead Eye", desc: "Mark everything you can press", keyName: "E", run: deadEye },
      ],
    },
    {
      name: "Ride",
      modes: [
        { icon: "compass", name: "Map", desc: "Fast travel between chapters", keyName: "M", run: onMap },
        { icon: "whistle", name: "Whistle", desc: "Call your horse", keyName: "H", run: whistle, state: `Bond ${levelOf(bond.whistles).level}/4` },
      ],
    },
    {
      name: "Records",
      modes: [
        { icon: "briefcase", name: "Satchel", desc: "What I carry", keyName: "I", run: openSatchel },
        { icon: "cylinder", name: "Skill wheel", desc: "Hold Tab to pick a skill", keyName: "Tab", run: onWheel },
        {
          icon: "star",
          name: "Achievements",
          desc: "Badges hidden around the site",
          keyName: "J",
          run: onJournal,
          state: `${unlocked.length}/${ACHIEVEMENTS.length}`,
        },
      ],
    },
  ];

  const id = CHAPTER_IDS[picked];
  const chapter = CHAPTERS[id];
  const town = towns.find((t) => t.id === id);

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
            <span className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-[4.5px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            id="site-menu"
            aria-label="Menu"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-ink bg-[radial-gradient(ellipse_at_30%_20%,rgb(var(--graphite)),rgb(var(--ink))_70%)] text-paper"
          >
            <div aria-hidden="true" className="grain pointer-events-none fixed inset-0" />
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.05 }}
              className="relative mx-auto flex min-h-full max-w-[1440px] flex-col px-6 pb-8 pt-7 sm:px-12 sm:pt-11 xl:px-[84px]"
            >
              <div className="flex h-[68px] items-center gap-5 sm:h-20">
                <a href="#top" onClick={close} aria-label="Ahmed Magdy, home">
                  <Wordmark className="text-[24px] sm:text-[32px]" />
                </a>
                <span aria-hidden="true" className="h-6 w-px bg-paper/25" />
                <span className="font-fellsc text-[13px] tracking-[0.3em] text-smoke sm:text-[15px]">Paused</span>
              </div>

              <div className="mt-6 grid flex-1 gap-x-12 gap-y-9 sm:mt-7 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[400px_minmax(0,1fr)_330px]">
                {/* Chapters. */}
                <section aria-label="Chapters" className="lg:col-start-1 lg:row-start-1">
                  <p className={`${label} mb-3 ml-3.5`}>Chapters</p>
                  <ol className="m-0 flex list-none flex-col p-0" onKeyDown={onChapterKey}>
                    {CHAPTER_IDS.map((cid, i) => {
                      const c = CHAPTERS[cid];
                      const on = i === picked;
                      return (
                        <li key={cid} className="flex">
                          <a
                            ref={(el) => {
                              links.current[i] = el;
                            }}
                            href={`#${cid}`}
                            onClick={travelOnClick(cid, close)}
                            onMouseEnter={() => setPicked(i)}
                            onFocus={() => setPicked(i)}
                            aria-current={on ? "true" : undefined}
                            className={`relative flex items-baseline gap-4 px-3.5 py-1 font-fellsc leading-[1.2] transition-colors duration-200 focus-visible:outline-none ${
                              on ? "text-ink" : "text-paper/80 hover:text-paper"
                            }`}
                          >
                            <Brush
                              variant={i}
                              className={`absolute -inset-x-2.5 inset-y-0 h-full w-[calc(100%+20px)] text-paper transition-[clip-path] duration-300 ease-out ${
                                on ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]"
                              }`}
                            />
                            <span className={`relative w-10 text-[12px] tracking-[0.1em] sm:text-[14px] ${on ? "text-ink" : "text-smoke"}`}>
                              {roman(c.index)}
                            </span>
                            <span className="relative text-[clamp(24px,2.4vw,34px)] tracking-[0.06em]">{c.title}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </section>

                {/* The picked chapter's fast-travel card. */}
                <section aria-live="polite" className="hidden lg:col-start-1 lg:row-start-2 lg:block xl:col-start-2 xl:row-start-1 xl:pt-12">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.18 }}
                      className="flex max-w-[420px] flex-col gap-3.5"
                    >
                      <p className={label}>Chapter {roman(chapter.index)} · fast travel to</p>
                      <p className="m-0 font-western text-[clamp(44px,4vw,58px)] leading-none text-frost">{town?.name}</p>
                      <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[24px] text-paper/80">
                        {chapterAr(chapter.index, chapter.labelAr)}
                      </p>
                      <Ornament className="my-1 max-w-[380px] text-paper/45" />
                      <p className="m-0 font-fell text-[21px] italic leading-[1.45] text-paper/85">{withBee3a(town?.blurb ?? "")}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-6">
                        <button
                          type="button"
                          onClick={() => {
                            close();
                            travelTo(id);
                          }}
                          className="flex items-center gap-2.5 font-fellsc text-[15px] tracking-[0.12em] hover:text-frost"
                        >
                          <KeyCap>
                            <Arrow dir="enter" />
                          </KeyCap>
                          Travel
                        </button>
                        <button
                          type="button"
                          onClick={use(onMap)}
                          className="flex items-center gap-2.5 font-fellsc text-[15px] tracking-[0.12em] hover:text-frost"
                        >
                          <KeyCap>M</KeyCap>
                          Open the map
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </section>

                {/* Modes, grouped. Rows on wide screens, tiles on phones. */}
                <section aria-label="Modes" className="lg:col-start-2 lg:row-span-2 lg:row-start-1 xl:col-start-3 xl:row-span-1">
                  <p className={label}>Modes</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 lg:mt-0 lg:block">
                    {groups.map((g) => (
                      <div key={g.name} className="contents lg:mt-3 lg:block">
                        <p className="m-0 mb-0.5 hidden font-fellsc text-[12px] tracking-[0.24em] text-smoke lg:block">{g.name}</p>
                        <ul className="m-0 contents list-none p-0 lg:flex lg:flex-col">
                          {g.modes.map((m) => (
                            <li key={m.name}>
                              <button
                                type="button"
                                onClick={use(m.run)}
                                aria-pressed={m.pressed}
                                className="group flex h-full w-full flex-col items-center gap-1.5 rounded-[10px] border border-paper/15 px-1 py-3 text-center transition-colors hover:border-frost lg:grid lg:grid-cols-[30px_minmax(0,1fr)_auto] lg:items-center lg:gap-3 lg:rounded-none lg:border-0 lg:border-b lg:border-paper/10 lg:px-0 lg:py-[5px] lg:text-left"
                              >
                                <Icon name={m.icon} size={22} className={`transition-colors group-hover:text-frost ${m.pressed ? "text-frost" : ""}`} />
                                <span className="flex min-w-0 flex-col gap-0.5">
                                  <span className="flex flex-wrap items-baseline justify-center gap-x-2.5 font-fellsc text-[12px] leading-tight tracking-[0.08em] transition-colors group-hover:text-frost sm:text-[13px] lg:justify-start lg:text-[17px]">
                                    {m.name}
                                    {m.state && <span className="text-[10px] tracking-[0.1em] text-frost lg:text-[12px]">{m.state}</span>}
                                  </span>
                                  <span className="hidden text-[11px] text-smoke lg:block">{m.desc}</span>
                                </span>
                                <KeyCap className="hidden lg:inline-flex">{m.keyName}</KeyCap>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Resume, links, the motto and how to close. */}
              <div className="mt-8 flex flex-col gap-5 border-t border-paper/15 pt-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  <a
                    href={config.cvUrl}
                    download
                    data-cv
                    className="torn flex h-12 items-center whitespace-nowrap bg-frost px-6 font-fellsc text-[17px] tracking-[0.12em] text-ink transition-transform hover:scale-105"
                  >
                    Resume <Arrow dir="down" className="ml-2" />
                  </a>
                  {[
                    ["GitHub", config.socials.github],
                    ["LinkedIn", config.socials.linkedin],
                    ["YouTube", config.youtube.url],
                  ].map(([name, href]) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-fellsc text-[15px] tracking-[0.1em] hover:text-frost"
                    >
                      {name} <Arrow dir="up-right" />
                    </a>
                  ))}
                  <a href={`mailto:${config.html.email}`} className="flex items-center gap-1.5 font-fellsc text-[15px] tracking-[0.1em] hover:text-frost">
                    Email <Arrow dir="up-right" />
                  </a>
                </div>
                <div className="flex items-center justify-between gap-7">
                  <p lang="ar" dir="rtl" className="m-0 font-arabic text-[24px] text-frost sm:text-[26px]">
                    {config.motto.ar}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="hidden items-center gap-2.5 font-fellsc text-[15px] tracking-[0.12em] hover:text-frost sm:flex"
                  >
                    <KeyCap>Esc</KeyCap>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMenu;
