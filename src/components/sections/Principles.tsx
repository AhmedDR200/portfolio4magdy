import { motion } from "framer-motion";

import { principles } from "../../constants";
import { styles } from "../../constants/styles";
import { fadeUp } from "../../utils/motion";
import SectionHeader from "../atoms/SectionHeader";

// "How I work": four Arabic sayings; the last one, the motto, is set in volt.
const Principles = () => (
  <section id="principles" aria-label="How I work" className="py-20 sm:py-28">
    <div className={styles.container}>
      <SectionHeader index="06" label="How I work" labelAr="بشتغل إزاي" title="How I work" />
      <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p, i) => {
          const motto = i === principles.length - 1;
          return (
            <motion.li
              key={p.en}
              variants={fadeUp(i * 0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className={`flex min-h-[260px] flex-col justify-between gap-7 rounded-[20px] p-7 ${
                motto ? "bg-volt text-ink" : "bg-graphite"
              }`}
            >
              <span className={`text-[13px] font-semibold ${motto ? "" : "text-volt"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-3">
                <p
                  lang="ar"
                  dir="rtl"
                  className={`m-0 font-arabic leading-[1.3] ${motto ? "text-[52px]" : "text-[36px] sm:text-[40px]"}`}
                >
                  {p.ar}
                </p>
                <p className={`m-0 text-[13px] ${motto ? "text-[#2E3A0A]" : "text-smoke"}`}>{p.en}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default Principles;
