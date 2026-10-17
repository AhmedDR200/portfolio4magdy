import Ornament from "./Ornament";
import RevealText from "./RevealText";

// Sections are chapters, numbered like RDR2's.
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const ORDINAL_AR = ["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];
export const roman = (index: string) => ROMAN[Number(index)] ?? index;
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
export const ChapterCard = ({ index, title, labelAr }: { index: string; title: string; labelAr: string }) => (
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

type EyebrowProps = {
  index: string;
  label: string;
  labelAr: string;
  center?: boolean;
};

// "Chapter I · About · عني" in old-print small caps, over a section's own heading.
export const Eyebrow = ({ index, label, labelAr, center }: EyebrowProps) => (
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

type Props = Omit<EyebrowProps, "center"> & { title: string };

// A chapter card, like the game's: an ornament, "CHAPTER IV", the title in old
// print, the chapter in Arabic, and the ornament again.
const SectionHeader = ({ title, index, labelAr }: Props) => (
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

export default SectionHeader;
