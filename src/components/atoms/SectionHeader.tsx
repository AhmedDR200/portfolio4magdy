import { useSkin } from "../../utils/theme";
import ElementTile from "./ElementTile";
import Ornament from "./Ornament";
import RevealText from "./RevealText";

// Sections are chapters, numbered like RDR2's, and in the lab episodes of
// season 1, each with its own element tile.
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const ORDINAL_AR = ["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];
export const roman = (index: string) => ROMAN[Number(index)] ?? index;
/** «الحلقة الرابعة، أعمالي» */
const ORDINAL_FEM_AR = ["", "الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة"];
export const episodeAr = (index: string, labelAr: string) => `الحلقة ${ORDINAL_FEM_AR[Number(index)] ?? ""}، ${labelAr}`;

// Each episode's element tile.
export const EPISODE_SYMBOL: Record<string, string> = { "01": "Ab", "02": "Wd", "03": "Sk", "04": "Wk", "05": "Xp", "06": "Pc", "07": "Ch", "08": "Ct" };
/** «الفصل الرابع، أعمالي» */
export const chapterAr = (index: string, labelAr: string) => `الفصل ${ORDINAL_AR[Number(index)] ?? ""}، ${labelAr}`;

// Every section's chapter, by its id: for the cards shown on fast travel.
export const CHAPTERS: Record<string, { index: string; title: string; labelAr: string }> = {
  about: { index: "01", title: "About", labelAr: "عني" },
  services: { index: "02", title: "What I Do", labelAr: "بعمل إيه" },
  skills: { index: "03", title: "The Stack", labelAr: "مهاراتي" },
  work: { index: "04", title: "Selected Work", labelAr: "أعمالي" },
  experience: { index: "05", title: "Experience", labelAr: "مشواري" },
  principles: { index: "06", title: "How I Work", labelAr: "بشتغل إزاي" },
  channel: { index: "07", title: "The Channel", labelAr: "على يوتيوب" },
  contact: { index: "08", title: "Contact", labelAr: "كلّمني" },
};

// The card on its own (no reveal), for the full-screen chapter transition.
export const ChapterCard = ({ index, title, labelAr }: { index: string; title: string; labelAr: string }) => {
  if (useSkin() === "bb")
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <ElementTile symbol={EPISODE_SYMBOL[index] ?? "El"} number={index} size={132} tone="solid" />
        <p className="m-0 font-mono text-[13px] tracking-[0.24em] text-frost sm:text-[14px]">SEASON 1 · EPISODE {roman(index)}</p>
        <p className="m-0 font-display text-[clamp(52px,8vw,112px)] uppercase leading-[0.95] text-paper">{title}</p>
        <p lang="ar" dir="rtl" className="m-0 font-arabic text-[22px] text-mist sm:text-[28px]">
          {episodeAr(index, labelAr)}
        </p>
        <span aria-hidden="true" className="block h-[3px] w-40 bg-frost" />
      </div>
    );
  return (
  <div className="flex flex-col items-center gap-3 text-center">
    <Ornament className="text-paper/70" />
    <p className="m-0 font-fellsc text-[15px] tracking-[0.42em] text-smoke sm:text-[17px]">Chapter {roman(index)}</p>
    <p className="m-0 font-fell text-[clamp(56px,8vw,120px)] leading-[1.02] text-paper">{title}</p>
    <p lang="ar" dir="rtl" className="m-0 font-arabic text-[22px] text-smoke sm:text-[26px]">
      الفصل {ORDINAL_AR[Number(index)] ?? ""}، {labelAr}
    </p>
    <Ornament className="text-paper/70" />
  </div>
  );
};

type EyebrowProps = {
  index: string;
  label: string;
  labelAr: string;
  center?: boolean;
};

// "Chapter I · About · عني" in old-print small caps, over a section's own heading.
export const Eyebrow = ({ index, label, labelAr, center }: EyebrowProps) => {
  if (useSkin() === "bb")
    return (
      <p className={`m-0 flex flex-wrap items-baseline gap-x-3.5 gap-y-1 font-mono text-[13px] tracking-[0.18em] text-frost ${center ? "justify-center" : ""}`}>
        <span>
          S1 · E{Number(index)} · {label.toUpperCase()}
        </span>
        <span lang="ar" dir="rtl" className="font-arabic text-[18px] tracking-normal text-smoke">
          {labelAr}
        </span>
      </p>
    );
  return (
  <p
    className={`m-0 flex flex-wrap items-baseline gap-x-3.5 gap-y-1 font-fellsc text-[15px] tracking-[0.2em] text-smoke ${
      center ? "justify-center" : ""
    }`}
  >
    <span>
      Chapter {roman(index)} · {label}
    </span>
    <span lang="ar" dir="rtl" className="font-arabic text-[18px] tracking-normal">
      {labelAr}
    </span>
  </p>
  );
};

type Props = Omit<EyebrowProps, "center"> & { title: string };

// A chapter card, like the game's: an ornament, "CHAPTER IV", the title in old
// print, the chapter in Arabic, and the ornament again.
const SectionHeader = ({ title, index, labelAr }: Props) => {
  // The lab: an episode title card, tile on the left, big title on the right.
  if (useSkin() === "bb")
    return (
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-10 md:text-left">
        <ElementTile symbol={EPISODE_SYMBOL[index] ?? "El"} number={index} name={title} size={132} tone="solid" className="md:!h-[156px] md:!w-[156px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="m-0 font-mono text-[13px] tracking-[0.22em] text-frost sm:text-[14px]">SEASON 1 · EPISODE {roman(index)}</p>
          <RevealText as="h2" text={title} className="m-0 font-display text-[clamp(48px,8.2vw,124px)] font-normal uppercase leading-[0.95]" />
          <p lang="ar" dir="rtl" className="m-0 font-arabic text-[22px] text-mist sm:text-[28px] md:text-left">
            {episodeAr(index, labelAr)}
          </p>
          <span aria-hidden="true" className="mx-auto mt-2 block h-[3px] w-40 bg-frost md:mx-0" />
        </div>
      </div>
    );
  return (
  <div className="flex flex-col items-center gap-3 text-center">
    <Ornament className="text-paper/70" />
    <p className="m-0 font-fellsc text-[15px] tracking-[0.42em] text-smoke sm:text-[17px]">Chapter {roman(index)}</p>
    <RevealText as="h2" text={title} className="m-0 font-fell text-[clamp(52px,7.4vw,108px)] font-normal leading-[1.02]" />
    <p lang="ar" dir="rtl" className="m-0 font-arabic text-[22px] text-smoke sm:text-[24px]">
      الفصل {ORDINAL_AR[Number(index)] ?? ""}، {labelAr}
    </p>
    <Ornament className="text-paper/70" />
  </div>
  );
};

export default SectionHeader;
