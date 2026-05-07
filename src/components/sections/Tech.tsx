import { motion } from "framer-motion";

import { SectionWrapper } from "../../hoc";
import { skillCategories, skillIcons } from "../../constants";
import { fadeIn } from "../../utils/motion";

const Tech = () => {
  return (
    <>
      <div className="flex flex-col gap-6 sm:gap-8">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={category.title}
            variants={fadeIn("up", "spring", catIndex * 0.15, 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-col gap-3"
          >
            <h3 className="text-secondary text-[14px] font-medium tracking-wider uppercase sm:text-[16px]">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {category.items.map((skill, i) => (
                <motion.span
                  key={skill}
                  variants={fadeIn(
                    "up",
                    "spring",
                    catIndex * 0.15 + i * 0.04,
                    0.5
                  )}
                  whileHover={{ scale: 1.06, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="bg-tertiary inline-flex cursor-default items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[12px] font-medium text-white shadow-sm transition-colors hover:border-white/30 sm:px-4 sm:py-2 sm:text-[14px]"
                >
                  {skillIcons[skill] && (
                    <img
                      src={skillIcons[skill]}
                      alt=""
                      loading="lazy"
                      className="h-4 w-4 object-contain sm:h-5 sm:w-5"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  )}
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
