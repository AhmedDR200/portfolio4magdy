import { motion } from "framer-motion";

import { experiences } from "../../constants";
import { styles } from "../../constants/styles";
import { fadeUp } from "../../utils/motion";
import SectionHeader from "../atoms/SectionHeader";

// Experience as the camp ledger: a torn page with ruled lines and a red double
// margin. Each job is an entry: the dates, who and what, and what it paid in.
const pad = "pl-[76px] pr-5 sm:pl-[96px] sm:pr-7";
const since = experiences[experiences.length - 1].date.split(" – ")[0];

const Experience = () => (
  <section id="experience" className="py-24 sm:py-32">
    <div className={`${styles.container} max-w-[1200px]`}>
      <SectionHeader index="05" label="Experience" labelAr="مشواري" title="Experience" />

      <motion.div
        variants={fadeUp(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="torn-3 relative mt-14 bg-graphite"
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-[54px] border-l-[1.5px] border-bandana/75 sm:left-[70px]" />
        <span aria-hidden="true" className="absolute inset-y-0 left-[59px] border-l-[1.5px] border-bandana/75 sm:left-[75px]" />

        <div className={`flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-frost/30 py-6 ${pad}`}>
          <h3 className="m-0 flex flex-wrap items-baseline gap-x-3.5 font-normal">
            <span className="font-fellsc text-[20px] tracking-[0.24em] sm:text-[22px]">Camp Ledger</span>
            <span lang="ar" className="font-ruqaa text-[24px] text-smoke">
              دفتر المعسكر
            </span>
          </h3>
          <span className="hidden font-fellsc text-[13px] tracking-[0.12em] text-smoke sm:block">Date · Entry · Paid in</span>
        </div>

        <ol className="m-0 list-none p-0">
          {experiences.map((job) => (
            <li
              key={job.companyName}
              className={`grid gap-x-6 gap-y-1.5 border-b border-frost/15 py-5 md:grid-cols-[170px_1fr_160px] md:items-baseline ${pad}`}
            >
              <span className="text-[12.5px] text-smoke">{job.date}</span>
              <div className="flex flex-col gap-1">
                <p className="m-0 flex flex-wrap items-baseline gap-x-3 font-fell text-[24px] leading-tight">
                  {job.companyUrl ? (
                    <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-frost">
                      {job.companyName} ↗
                    </a>
                  ) : (
                    job.companyName
                  )}
                  <span className="font-fellsc text-[14px] tracking-[0.1em] text-smoke">{job.title}</span>
                </p>
                <p className="m-0 font-fell text-[16px] italic leading-[1.55] text-paper/75">{job.summary}</p>
              </div>
              <span className="font-fell text-[20px] italic text-frost md:text-right">{job.paidIn}</span>
            </li>
          ))}
        </ol>

        <div className={`flex flex-wrap items-baseline justify-between gap-3 py-5 ${pad}`}>
          <span className="font-fellsc text-[15px] tracking-[0.12em] text-smoke">On the trail since {since}</span>
          <span lang="ar" dir="rtl" className="font-ruqaa text-[26px]">
            والرحلة لسه مكملة
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Experience;
