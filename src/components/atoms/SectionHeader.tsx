import RevealText from "./RevealText";

type EyebrowProps = {
  index: string;
  label: string;
  labelAr: string;
  center?: boolean;
};

export const Eyebrow = ({ index, label, labelAr, center }: EyebrowProps) => (
  <p
    className={`m-0 flex items-baseline gap-3.5 text-[12px] uppercase tracking-[0.14em] text-smoke ${
      center ? "justify-center" : ""
    }`}
  >
    <span>
      ({index}) — {label}
    </span>
    <span lang="ar" dir="rtl" className="font-arabic text-[18px] normal-case tracking-normal">
      {labelAr}
    </span>
  </p>
);

type Props = EyebrowProps & { title: string };

// "(02) — WHAT I DO · بعمل إيه" over a giant Anton heading with a volt stop.
const SectionHeader = ({ title, ...eyebrow }: Props) => (
  <div>
    <Eyebrow {...eyebrow} />
    <RevealText
      as="h2"
      text={title}
      className="mt-4 font-display text-[clamp(60px,8.8vw,132px)] font-normal uppercase leading-[0.92]"
      suffix={<span className="text-volt">.</span>}
    />
  </div>
);

export default SectionHeader;
