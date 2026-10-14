import { motion } from "framer-motion";

import { mePhoto } from "../../assets";
import { config } from "../../constants/config";
import { styles } from "../../constants/styles";
import { fadeUp } from "../../utils/motion";
import { travelOnClick } from "../../utils/travel";
import { CupSketch, RackSketch, TelegraphSketch, Underline } from "../atoms/Sketches";

// About as two pages of a journal, like the one Arthur keeps in RDR2: the date
// in Cairo, the statement and bio written in, the Arabic in Ruqaa, a note in
// the margin, and on the facing page the photo taped in beside pencil
// sketches. On phones the pages stack.

const HIGHLIGHT = "unsexy infra";
const PAGE = "relative flex flex-col bg-[#E7ECE6] text-[#262B29]";

const cairoDate = () => {
  const now = new Date();
  const month = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "Africa/Cairo" }).format(now);
  const day = Number(new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "Africa/Cairo" }).format(now));
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${month} ${day}${suffix}`;
};

// The statement, with its key phrase underlined in pencil.
const Statement = () => {
  const [before, after] = config.about.statement.split(HIGHLIGHT);
  return (
    <h2 className="m-0 mt-2 font-fell text-[clamp(26px,2.6vw,34px)] font-normal italic leading-[1.22]">
      {before}
      <span className="relative whitespace-nowrap">
        {HIGHLIGHT}
        <Underline className="absolute -bottom-1.5 -left-1 h-2.5 w-[calc(100%+8px)]" />
      </span>
      {after}
    </h2>
  );
};

const About = () => (
  <section id="about" className="py-24 sm:py-32">
    <div className={styles.container}>
      <motion.div
        variants={fadeUp(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative rounded-[18px] bg-graphite p-3 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9)] sm:p-[18px]"
      >
        {/* The stitched cover. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-xl border-[1.5px] border-dashed border-paper/20" />

        <div className="relative grid shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] lg:grid-cols-2">
          {/* Left page. */}
          <div className={`${PAGE} gap-5 bg-[linear-gradient(90deg,#E7ECE6_82%,#D3DAD3)] px-6 pb-8 pt-8 sm:px-12 sm:pb-10 sm:pt-12`}>
            <span aria-hidden="true" className="paper-grain absolute inset-0" />
            <div className="relative flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-fellsc text-[14px] tracking-[0.12em] text-[#6A746F]">Chapter I · About</span>
              <span className="font-fell text-[17px] italic">Cairo, {cairoDate()}</span>
            </div>
            <div className="relative">
              <Statement />
            </div>
            <p lang="ar" dir="rtl" className="relative m-0 text-left font-ruqaa text-[26px] leading-[1.5] sm:text-[30px]">
              {config.about.statementAr}
            </p>
            <p className="relative m-0 font-fell text-[17px] leading-[1.6] sm:text-[18px]">{config.about.body}</p>
            <span className="relative -rotate-[7deg] self-end font-fell text-[19px] italic text-[#3B4A6B] sm:mr-6">+ shipping Bee3a</span>
            <div className="relative mt-auto flex items-end justify-between pt-6">
              <a
                href="#experience"
                onClick={travelOnClick("experience")}
                className="border-b-[1.5px] border-current pb-0.5 font-fell text-[22px] italic transition-colors hover:text-[#3B4A6B]"
              >
                Turn the page → Chapter V
              </a>
              <span aria-hidden="true" className="font-fell text-[16px] text-[#6A746F]">
                1
              </span>
            </div>
          </div>

          {/* The spine. */}
          <span aria-hidden="true" className="hidden bg-[linear-gradient(#A9B3AC,#C2CAC3,#A9B3AC)] lg:absolute lg:inset-y-0 lg:left-1/2 lg:block lg:w-0.5" />

          {/* Right page: the photo taped in, and sketches. */}
          <div className={`${PAGE} gap-6 border-t border-[#C2CAC3] bg-[linear-gradient(270deg,#E7ECE6_82%,#D3DAD3)] px-6 pb-8 pt-10 sm:px-12 sm:pb-10 lg:border-t-0`}>
            <span aria-hidden="true" className="paper-grain absolute inset-0" />
            <div className="relative flex flex-wrap items-start gap-8">
              <figure className="relative m-0 h-[212px] w-[176px] shrink-0 -rotate-3 bg-[#F4F7F3] p-1.5 shadow-[0_14px_22px_-12px_rgba(0,0,0,0.5)]">
                <div className="relative h-full w-full overflow-hidden">
                  <img src={mePhoto} alt="Ahmed Magdy" className="h-full w-full object-cover object-[51%_30%] brightness-[1.12] contrast-[1.35] grayscale" />
                  <span aria-hidden="true" className="halftone absolute inset-0" />
                </div>
                <span aria-hidden="true" className="torn absolute -left-7 -top-2.5 h-[26px] w-[86px] -rotate-[24deg] bg-[rgba(214,226,220,0.62)]" />
                <span aria-hidden="true" className="torn absolute -right-7 -top-2 h-[26px] w-[86px] rotate-[22deg] bg-[rgba(214,226,220,0.62)]" />
              </figure>
              <figure className="m-0 flex flex-col items-center gap-1">
                <RackSketch className="h-[190px] w-[136px]" />
                <figcaption className="font-fell text-[15px] italic">The servers: kept warm, kept fast.</figcaption>
              </figure>
            </div>
            <figure className="relative m-0 flex flex-col gap-1">
              <TelegraphSketch className="h-auto w-full max-w-[360px]" />
              <figcaption className="font-fell text-[15px] italic">Real-time: WebSockets are only telegraph lines with better manners.</figcaption>
              <span lang="ar" dir="rtl" className="text-left font-ruqaa text-[20px]">
                الريل تايم = تلغراف بس أسرع
              </span>
            </figure>
            <div className="relative mt-auto flex items-end justify-between">
              <figure className="m-0 flex items-end gap-3.5">
                <CupSketch className="h-[100px] w-[96px]" />
                <figcaption className="mb-2.5 flex flex-col">
                  <span className="font-fell text-[16px] italic">Fuel.</span>
                  <span lang="ar" className="font-ruqaa text-[20px]">
                    الوقود
                  </span>
                </figcaption>
              </figure>
              <span aria-hidden="true" className="font-fell text-[16px] text-[#6A746F]">
                2
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
