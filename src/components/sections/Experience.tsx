import { motion } from "framer-motion";

import { experiences } from "../../constants";
import { styles } from "../../constants/styles";
import { fadeUp } from "../../utils/motion";
import RevealText from "../atoms/RevealText";
import { Eyebrow } from "../atoms/SectionHeader";

// A volt spine down the middle with a glowing dot on the current role.
const Experience = () => (
  <section id="experience" className="relative overflow-hidden py-24 sm:py-32">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[22%] h-[600px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(212,255,58,0.09),rgba(212,255,58,0))]"
    />
    <div className={`${styles.container} relative max-w-[1200px]`}>
      <Eyebrow index="05" label="Experience" labelAr="مشواري" center />
      <h2
        aria-label="My career & experience"
        className="m-0 mt-4 text-center font-display text-[clamp(60px,8.4vw,124px)] font-normal uppercase leading-[0.95]"
      >
        <RevealText as="span" text="My career" className="block" />
        <RevealText as="span" text="& experience" className="block text-volt" />
      </h2>

      <ol className="relative m-0 mt-20 flex list-none flex-col gap-16 p-0 sm:mt-24 sm:gap-[72px]">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[7px] top-[-40px] w-[3px] bg-[linear-gradient(to_top,rgba(212,255,58,0)_0%,rgba(212,255,58,0.6)_35%,#D4FF3A_80%,rgba(212,255,58,0.3)_100%)] md:left-1/2 md:-translate-x-1/2"
        />
        <span
          aria-hidden="true"
          className="absolute left-[3px] top-[18px] h-3 w-3 rounded-full bg-volt shadow-[0_0_5px_2px_#E9FF9A,0_0_18px_8px_rgba(212,255,58,0.6),0_0_90px_22px_rgba(212,255,58,0.35)] md:left-1/2 md:-translate-x-1/2"
        />
        {experiences.map((job, i) => (
          <motion.li
            key={job.companyName}
            variants={fadeUp(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col gap-5 pl-10 md:flex-row md:justify-between md:gap-6 md:pl-0"
          >
            <div className="flex justify-between gap-6 md:w-[42%]">
              <div>
                <h3 className="m-0 font-display text-[30px] font-normal uppercase leading-none sm:text-[38px]">
                  {job.title}
                </h3>
                {job.companyUrl ? (
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-block text-[15px] uppercase tracking-[0.06em] text-volt hover:underline"
                  >
                    {job.companyName} ↗
                  </a>
                ) : (
                  <p className="m-0 mt-2.5 text-[15px] uppercase tracking-[0.06em] text-volt">{job.companyName}</p>
                )}
                <p className="m-0 mt-1 text-[12px] uppercase tracking-[0.1em] text-smoke">{job.date}</p>
              </div>
              <p
                className={`m-0 font-display text-[48px] uppercase leading-[0.9] sm:text-[64px] ${i === 0 ? "text-volt" : ""}`}
              >
                {job.marker}
              </p>
            </div>
            <p className="m-0 text-[15px] leading-[1.75] text-smoke md:w-[42%]">{job.summary}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

export default Experience;
