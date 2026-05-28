import { BrowserRouter } from "react-router-dom";
import Lenis from "lenis";

import {
  About,
  Architecture,
  Contact,
  DeploySimulator,
  Experience,
  Hero,
  PhotoHero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
import { useEffect } from "react";
import { config } from "./constants/config";
import { SettingsProvider, useSettings } from "./context/Settings";
import KonamiEasterEgg from "./components/layout/KonamiEasterEgg";

const AppContent = () => {
  const { reduceMotion } = useSettings();

  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  // Always start at the top on (re)load. Disable the browser's automatic
  // scroll restoration and drop any leftover hash so we don't jump to a
  // mid-page section. Runs before Lenis initializes so smooth scroll starts
  // from the top. In-page anchor nav still works (it sets the hash on click).
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return (
    <BrowserRouter>
      <div className="bg-primary relative z-0 overflow-x-hidden">
        <Navbar />
        <PhotoHero />
        <div className="hero-grid">
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Architecture />
        <Works />
        <DeploySimulator />
        <div className="relative z-0">
          <Contact />
          {!reduceMotion && <StarsCanvas />}
        </div>
      </div>
      <KonamiEasterEgg />
    </BrowserRouter>
  );
};

const App = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;
