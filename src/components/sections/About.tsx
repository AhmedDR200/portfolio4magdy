import { config } from "../../constants/config";
import { styles } from "../../constants/styles";
import Magnetic from "../atoms/Magnetic";
import RevealText from "../atoms/RevealText";
import { Eyebrow } from "../atoms/SectionHeader";

const About = () => (
  <section id="about" className="py-24 sm:py-36">
    <div
      className={`${styles.container} grid gap-10 lg:grid-cols-2 lg:gap-24`}
    >
      <div className="flex flex-col gap-5">
        <Eyebrow index="01" label="About" labelAr="عني" />
        <RevealText
          as="h2"
          text={config.about.statement}
          highlight="unsexy infra"
          className="m-0 font-display text-[clamp(40px,4.6vw,68px)] font-normal uppercase leading-[1.02]"
        />
        <p
          lang="ar"
          dir="rtl"
          className="m-0 text-left font-arabic text-[28px] leading-[1.4] text-mist sm:text-[36px]"
        >
          {config.about.statementAr}
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:pt-10">
        <p className="m-0 max-w-[60ch] text-[16px] leading-[1.85] text-smoke">
          {config.about.body}
        </p>
        <Magnetic>
          <a
            href="#experience"
            className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-volt font-display text-[22px] uppercase text-ink sm:h-[176px] sm:w-[176px] sm:text-[26px]"
          >
            About me
          </a>
        </Magnetic>
      </div>
    </div>
  </section>
);

export default About;
