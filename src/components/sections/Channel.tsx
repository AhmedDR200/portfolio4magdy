import { tamamAvatar } from "../../assets";
import { config } from "../../constants/config";
import { styles } from "../../constants/styles";
import Chip from "../atoms/Chip";
import SectionHeader from "../atoms/SectionHeader";
import ChannelStats from "./ChannelStats";
import Arrow from "../atoms/Arrow";

// The channel's own level colors, from its banner.
const levels = [
  { ar: "جونيور", color: "#1E7A46" },
  { ar: "ميد", color: "#2A3C9E" },
  { ar: "سينيور", color: "#6C3A98" },
];

const label = "m-0 text-[11px] uppercase tracking-[0.14em] text-smoke";

// The ٢٠٠ تمام YouTube channel, laid out like a channel page: its real banner
// and stamp, what it covers, and live numbers from YouTube. The channel's own
// colors and font (Reem Kufi) stay inside this card, and its banner art is the
// same in both themes; the card itself follows the theme. No single episode is named.
const Channel = () => (
  <section id="channel" aria-label="YouTube channel" className="py-20 sm:py-28">
    <div className={styles.container}>
      <SectionHeader index="07" label="On YouTube" labelAr="على يوتيوب" title="The Channel" />

      <article className="relative mt-12 overflow-hidden rounded-[28px] border border-paper/15 bg-graphite">
        {/* The channel banner's two worlds, drawn: the code at night, a green
            seam, and the street on paper. The banner's own words are below. */}
        <div aria-hidden="true" className="relative grid h-[130px] grid-cols-2 sm:h-[210px]">
          <div className="bg-[#0F1D2B] [background-image:linear-gradient(rgba(207,227,247,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(207,227,247,0.07)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="bg-[#E6EEE8] [background-image:repeating-linear-gradient(to_bottom,transparent_0_35px,rgba(21,33,28,0.07)_35px_36px)]" />
          <div className="absolute inset-y-0 left-[calc(50%-3px)] w-1.5 bg-[#4BD08A] shadow-[0_0_34px_6px_rgba(75,208,138,0.45)]" />
          <span className="absolute right-[calc(50%+20px)] top-4 text-[11px] text-[#8FA9BF] sm:top-6 sm:text-[13px]">
            GET /backend → <span className="text-[#4BD08A]">200 OK</span>
          </span>
        </div>
        <img
          src={tamamAvatar}
          alt="٢٠٠ تمام logo: a blue HTTP stamp"
          width={148}
          height={148}
          className="absolute left-5 top-[82px] h-24 w-24 rounded-full border-[5px] border-graphite sm:left-10 sm:top-[136px] sm:h-[148px] sm:w-[148px] sm:border-[6px]"
        />

        <div className="flex flex-col gap-5 px-5 pt-14 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pl-[216px] sm:pr-10 sm:pt-[18px]">
          <div className="flex flex-col gap-2">
            <h3 lang="ar" className="m-0 font-kufi text-[34px] font-bold leading-[1.1] sm:text-[40px]">
              ٢٠٠ تمام
            </h3>
            <p className="m-0 text-[13px] text-smoke">{config.youtube.handle} · Egyptian Arabic · Made with Remotion</p>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:pt-1.5">
            <a
              href={`${config.youtube.url}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[50px] items-center gap-2.5 rounded-full bg-frost px-6 text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-105"
            >
              Subscribe
              <span lang="ar" className="font-arabic text-[18px] font-normal normal-case tracking-normal">
                اشترك
              </span>
            </a>
            <a
              href={config.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[50px] items-center rounded-full border border-paper/25 px-[22px] text-[13px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-frost hover:text-frost"
            >
              Watch on YouTube <Arrow dir="up-right" className="ml-1" />
            </a>
          </div>
        </div>

        <div className="grid gap-7 px-5 pb-8 pt-7 sm:px-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-3">
            <p className={label}>About the channel</p>
            <p lang="ar" dir="rtl" className="m-0 text-left font-kufi text-[28px] font-bold leading-[1.2] sm:text-[34px]">
              الباك إند من الشارع
            </p>
            <p lang="ar" dir="rtl" className="m-0 text-left font-bee3a text-[16px] text-mist sm:text-[17px]">
              من الجونيور للسينيور، بأمثلة من الحياة اللي حواليك
            </p>
            <p className="m-0 mt-1 max-w-[620px] text-[13px] leading-[1.75] text-smoke">
              Backend engineering explained in Egyptian Arabic. Everyday street scenes turn into the systems behind them, animated in code with Remotion.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:border-l lg:border-paper/10 lg:pl-7">
            <p className={label}>For every level</p>
            <ul dir="rtl" lang="ar" className="m-0 flex list-none justify-end gap-2 p-0">
              {levels.map((level) => (
                <li
                  key={level.ar}
                  className="flex h-10 items-center rounded-full border-[3px] bg-[#E6EEE8] px-[18px] font-kufi text-[18px] font-bold"
                  style={{ borderColor: level.color, color: level.color }}
                >
                  {level.ar}
                </li>
              ))}
            </ul>
            <p className={`${label} mt-3`}>Made with</p>
            <ul aria-label="Made with" className="m-0 flex list-none flex-wrap gap-2 p-0 text-[12px]">
              <Chip>Remotion</Chip>
              <Chip>Motion graphics</Chip>
              <Chip>Egyptian Arabic</Chip>
            </ul>
          </div>
        </div>

        <ChannelStats />
      </article>
    </div>
  </section>
);

export default Channel;
