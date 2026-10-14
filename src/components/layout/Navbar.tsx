import { navLinks } from "../../constants";
import { config } from "../../constants/config";
import { toggleTheme, useTheme } from "../../utils/theme";
import { travelOnClick } from "../../utils/travel";
import Icon from "../atoms/Icon";
import Brush from "../atoms/Brush";
import Wordmark from "../atoms/Wordmark";
import Arrow from "../atoms/Arrow";

// Sits at the top of the hero. The links read like RDR2's menu: hovering one
// sweeps a white brush stroke behind it. On small screens they collapse into
// the Menu button, which opens the same full-screen menu as the floating one.
// Dark (Ambarino) or light (Wanted); L does the same.
const ThemeButton = () => {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode (L)`}
      title={`${next === "light" ? "Light" : "Dark"} mode · L`}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:border-frost hover:text-frost"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={20} />
    </button>
  );
};

const Navbar = ({ onMenu, ready }: { onMenu: () => void; ready: boolean }) => (
  <header className="relative z-10 flex items-center justify-between gap-5 px-5 py-4 sm:px-12 sm:py-6">
    <a href="#top" aria-label="Ahmed Magdy, home">
      <Wordmark typing ready={ready} className="text-[27px] sm:text-[32px]" />
    </a>

    <nav aria-label="Primary" className="hidden items-center gap-2 font-fellsc text-[17px] tracking-[0.12em] md:flex">
      {navLinks.map((link, i) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onClick={travelOnClick(link.id)}
          className="group relative px-2.5 py-2.5 text-paper lg:px-3.5 transition-colors duration-200 hover:text-ink focus-visible:text-ink focus-visible:outline-none"
        >
          <Brush
            variant={i}
            className="absolute -inset-x-2 inset-y-0 h-full w-[calc(100%+16px)] text-paper transition-[clip-path] duration-300 ease-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]"
          />
          <span className="relative">{link.title}</span>
        </a>
      ))}
      <span className="ml-2">
        <ThemeButton />
      </span>
      <a
        href={config.cvUrl}
        download
        data-cv
        className="torn ml-3 flex h-12 items-center whitespace-nowrap bg-frost px-5 text-ink transition-transform hover:scale-105 lg:px-6"
      >
        Resume <Arrow dir="down" className="ml-1.5" />
      </a>
    </nav>

    <span className="flex items-center gap-3 md:hidden">
      <ThemeButton />
      <button type="button" onClick={onMenu} className="torn flex h-11 items-center bg-frost px-5 font-fellsc text-[16px] tracking-[0.12em] text-ink">
        Menu
      </button>
    </span>
  </header>
);

export default Navbar;
