import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import Lenis from "lenis";

import {
  About,
  Channel,
  Contact,
  Cursor,
  CvPipeline,
  Experience,
  FloatingMenu,
  Footer,
  Hero,
  HonorMeter,
  HorseWhistle,
  Impact,
  Intro,
  Journal,
  KonamiEasterEgg,
  MapOverlay,
  PowerCut,
  Principles,
  RequestTrace,
  RideAlong,
  Services,
  Skills,
  SkillWheel,
  Ticker,
  Toasts,
  Works,
  XRay,
} from "./components";
import { config } from "./constants/config";
import { setLenis } from "./utils/lenis";
import { shouldPlayIntro } from "./utils/motion";

const App = () => {
  const reduceMotion = useReducedMotion();
  const [playIntro] = useState(shouldPlayIntro);
  const [introActive, setIntroActive] = useState(playIntro);
  const [heroRevealed, setHeroRevealed] = useState(!playIntro);
  const [menuOpen, setMenuOpen] = useState(false);
  const [xray, setXray] = useState(false);
  const toggleXray = useCallback(() => setXray((v) => !v), []);
  const [powerCut, setPowerCut] = useState(false);
  const togglePowerCut = useCallback(() => setPowerCut((v) => !v), []);
  const [map, setMap] = useState(false);
  const openMap = useCallback(() => setMap(true), []);
  const [wheel, setWheel] = useState(false);
  const openWheel = useCallback(() => setWheel(true), []);
  const [journal, setJournal] = useState(false);
  const openJournal = useCallback(() => setJournal(true), []);
  const lenisRef = useRef<Lenis | null>(null);

  const revealHero = useCallback(() => setHeroRevealed(true), []);
  const finishIntro = useCallback(() => setIntroActive(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);

  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  // Always start at the top on (re)load. Disable the browser's automatic
  // scroll restoration and drop any leftover hash so we don't jump to a
  // mid-page section. In-page anchor nav still works (it sets the hash on click).
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  // Smooth scrolling starts once the intro has lifted, and never with reduced motion.
  useEffect(() => {
    if (reduceMotion || introActive) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduceMotion, introActive]);

  // Freeze the page behind the open menu.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    lenisRef.current?.stop();
    return () => {
      root.style.overflow = "";
      lenisRef.current?.start();
    };
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      {introActive && <Intro onReveal={revealHero} onDone={finishIntro} />}
      <Cursor />
      <FloatingMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        xray={xray}
        onXray={toggleXray}
        powerCut={powerCut}
        onPowerCut={togglePowerCut}
        onMap={openMap}
        onWheel={openWheel}
        onJournal={openJournal}
      />
      <RequestTrace />
      <main className="overflow-x-hidden">
        <Hero startHidden={playIntro} revealed={heroRevealed} onMenu={openMenu} />
        <About />
        <Ticker />
        <Impact />
        <Services />
        <Skills />
        <Works />
        <Experience />
        <Principles />
        <Channel />
        <Contact />
      </main>
      <Footer xray={xray} onXray={toggleXray} powerCut={powerCut} onPowerCut={togglePowerCut} />
      <KonamiEasterEgg />
      <XRay open={xray} onOpenChange={setXray} />
      <CvPipeline />
      <PowerCut on={powerCut} onChange={setPowerCut} />
      <MapOverlay open={map} onOpenChange={setMap} />
      <SkillWheel open={wheel} onOpenChange={setWheel} />
      <Journal open={journal} onOpenChange={setJournal} />
      <HonorMeter />
      <RideAlong />
      <HorseWhistle />
      <Toasts />
    </MotionConfig>
  );
};

export default App;
