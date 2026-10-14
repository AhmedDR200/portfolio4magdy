import { navLinks } from "../../constants";
import { config } from "../../constants/config";
import { styles } from "../../constants/styles";
import Wordmark from "../atoms/Wordmark";
import Icon from "../atoms/Icon";
import { HORSE_CREDIT } from "../atoms/Horse";
import StatusPanel from "./StatusPanel";

const label = "mb-2 text-[12px] uppercase tracking-[0.14em] text-smoke";

type Props = { xray: boolean; onXray: () => void; powerCut: boolean; onPowerCut: () => void };

const Footer = ({ xray, onXray, powerCut, onPowerCut }: Props) => (
  <footer className="relative overflow-hidden border-t border-paper/15 pt-[72px]">
    <div className={`${styles.container} mb-16`}>
      <StatusPanel />
    </div>
    <div className={`${styles.container} grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}>
      <div className="flex flex-col gap-2">
        <Wordmark className="w-fit text-[37px]" />
        <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[24px] text-volt">
          {config.motto.ar}
        </p>
      </div>
      <nav aria-label="Footer" className="flex flex-col text-[14px] uppercase tracking-[0.08em]">
        <span className={label}>Menu</span>
        {navLinks.map((link) => (
          <a key={link.id} href={`#${link.id}`} className="w-fit py-1.5 hover:text-volt">
            {link.title}
          </a>
        ))}
      </nav>
      <nav aria-label="Social" className="flex flex-col text-[14px] uppercase tracking-[0.08em]">
        <span className={label}>Socials</span>
        <a href={config.socials.github} target="_blank" rel="noopener noreferrer" className="w-fit py-1.5 hover:text-volt">
          GitHub
        </a>
        <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-fit py-1.5 hover:text-volt">
          LinkedIn
        </a>
        <a href={config.youtube.url} target="_blank" rel="noopener noreferrer" className="w-fit py-1.5 hover:text-volt">
          YouTube
        </a>
        <a href={`mailto:${config.html.email}`} className="w-fit py-1.5 hover:text-volt">
          Email
        </a>
      </nav>
      <div className="flex flex-col items-start gap-3">
        <span className="text-[12px] uppercase tracking-[0.14em] text-smoke">
          © {new Date().getFullYear()} Ahmed Magdy
        </span>
        <span className="-mt-2 max-w-[240px] text-[11px] leading-snug text-dim">Horse: {HORSE_CREDIT}</span>
        <a
          href="#top"
          className="flex h-11 items-center rounded-full bg-volt px-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] text-ink"
        >
          Back to top ↑
        </a>
        <button
          type="button"
          onClick={onXray}
          aria-pressed={xray}
          className="flex h-11 items-center gap-2.5 rounded-full border border-paper/25 px-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors hover:border-volt hover:text-volt"
        >
          <Icon name="eye" size={18} />
          X-ray mode
          <kbd className="rounded border border-current px-1.5 font-mono text-[11px] leading-[1.4]">X</kbd>
        </button>
        <button
          type="button"
          onClick={onPowerCut}
          aria-pressed={powerCut}
          className="flex h-11 items-center gap-2.5 rounded-full border border-paper/25 px-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors hover:border-volt hover:text-volt"
        >
          <Icon name="bulb-off" size={18} />
          {powerCut ? "Lights on" : "Power cut"}
          <span lang="ar" className="font-arabic text-[17px] font-normal normal-case tracking-normal">
            {powerCut ? "رجّع النور" : "اقطع الكهربا"}
          </span>
          <kbd className="rounded border border-current px-1.5 font-mono text-[11px] leading-[1.4]">P</kbd>
        </button>
      </div>
    </div>
    {/* Decorative. Its glyphs reach far above its short line box, so it must not
        take clicks meant for the buttons above it. */}
    <p
      aria-hidden="true"
      className="text-fade-volt pointer-events-none m-0 mt-14 select-none whitespace-nowrap text-center font-display text-[18.5vw] uppercase leading-[0.8]"
    >
      Ahmedmagdy
    </p>
  </footer>
);

export default Footer;
