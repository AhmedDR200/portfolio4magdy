import { motion } from "framer-motion";

import { impactStats } from "../../constants";
import { styles } from "../../constants/styles";
import { fadeUp } from "../../utils/motion";
import Medal from "../atoms/Medal";

const Impact = () => (
  <section id="impact" aria-label="Impact" className="py-16 sm:py-24">
    <div className={`${styles.container} grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4`}>
      {impactStats.map((stat, i) => (
        <motion.div
          key={stat.value}
          variants={fadeUp(i * 0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col gap-2.5 border-l border-paper/15 px-6 sm:px-7"
        >
          <Medal name={stat.icon} size={52} className="mb-2" />
          <p className="m-0 font-display text-[clamp(80px,8.4vw,124px)] leading-none text-volt">
            {stat.value}
          </p>
          <p className="m-0 text-[14px] leading-[1.55]">{stat.label}</p>
          <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[22px] text-smoke">
            {stat.labelAr}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Impact;
