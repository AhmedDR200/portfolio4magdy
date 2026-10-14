import { mePhoto } from "../../assets";
import { config } from "../../constants/config";
import { styles } from "../../constants/styles";
import Icon from "../atoms/Icon";
import Magnetic from "../atoms/Magnetic";
import HatTip from "./HatTip";
import RevealText from "../atoms/RevealText";
import { Eyebrow } from "../atoms/SectionHeader";

const pill =
  "flex h-14 items-center gap-3 rounded-full border border-paper/30 px-6 transition-colors hover:border-volt hover:text-volt";

const Contact = () => (
  <section id="contact" className="pb-20 pt-24 sm:pb-28 sm:pt-40">
    <div className={styles.container}>
      <Eyebrow index="08" label="Contact" labelAr="كلّمني" />
      <div className="mt-6 flex flex-wrap items-center gap-7">
        <img
          src={mePhoto}
          alt=""
          className="h-20 w-20 rounded-full border-[3px] border-volt object-cover grayscale sm:h-[104px] sm:w-[104px]"
          style={{ objectPosition: "51% 28%" }}
        />
        <RevealText
          as="h2"
          text="Let's build something that scales"
          suffix={<span className="text-volt">.</span>}
          className="m-0 max-w-[12ch] font-display text-[clamp(64px,10.4vw,168px)] font-normal uppercase leading-[0.9]"
        />
      </div>
      <p lang="ar" dir="rtl" className="m-0 mt-5 text-left font-arabic text-[32px] text-mist sm:text-[42px]">
        يلا نبني حاجة تكبر معاك.
      </p>

      <div className="relative mt-24 border-t border-paper/15 sm:mt-20">
        <div className="absolute right-[8%] top-0 -translate-y-1/2">
          <Magnetic>
            <a
              href={`mailto:${config.html.email}`}
              className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-volt text-center font-display text-[24px] uppercase leading-none text-ink sm:h-[188px] sm:w-[188px] sm:text-[28px]"
            >
              Get in
              <br />
              touch
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="mt-28 flex flex-wrap gap-3 text-[14px] sm:mt-32">
        <a href={`mailto:${config.html.email}`} className={pill}>
          <Icon name="letter" />
          {config.html.email}
        </a>
        <a
          href={config.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${pill} uppercase tracking-[0.08em]`}
        >
          <Icon name="briefcase" />
          LinkedIn ↗
        </a>
        <a
          href={config.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`${pill} uppercase tracking-[0.08em]`}
        >
          <Icon name="branch" />
          GitHub ↗
        </a>
        <a
          href={config.youtube.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${pill} uppercase tracking-[0.08em]`}
        >
          <Icon name="reel" />
          YouTube ↗
        </a>
      </div>
      <HatTip />
    </div>
  </section>
);

export default Contact;
