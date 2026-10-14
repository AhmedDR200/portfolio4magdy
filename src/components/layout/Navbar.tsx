import { navLinks } from "../../constants";
import { config } from "../../constants/config";
import CairoClock from "../atoms/CairoClock";
import Wordmark from "../atoms/Wordmark";

// Sits at the top of the hero. On small screens the links collapse into the
// Menu button, which opens the same full-screen menu as the floating button.
const Navbar = ({ onMenu, ready }: { onMenu: () => void; ready: boolean }) => (
  <header className="relative z-10 flex items-center justify-between gap-5 px-5 py-4 sm:px-12 sm:py-6">
    {/* On wide screens the Cairo clock sits in the middle of the bar. */}
    <CairoClock arabic={false} className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:inline-flex" />
    <a href="#top" aria-label="Ahmed Magdy, home">
      <Wordmark typing ready={ready} className="text-[27px] sm:text-[32px]" />
    </a>

    <nav
      aria-label="Primary"
      className="hidden items-center gap-1 text-[13px] uppercase tracking-[0.12em] md:flex"
    >
      {navLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="px-3.5 py-3 transition-colors hover:text-volt"
        >
          {link.title}
        </a>
      ))}
      <a
        href={config.cvUrl}
        download
        data-cv
        className="ml-2 flex h-11 items-center rounded-full bg-volt px-5 font-semibold text-ink transition-transform hover:scale-105"
      >
        Resume ↓
      </a>
    </nav>

    <button
      type="button"
      onClick={onMenu}
      className="flex h-11 items-center rounded-full bg-volt px-[18px] text-[13px] font-semibold uppercase tracking-[0.1em] text-ink md:hidden"
    >
      Menu
    </button>
  </header>
);

export default Navbar;
