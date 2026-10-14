import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { services } from "../../constants";
import { styles } from "../../constants/styles";
import { EASE_OUT_EXPO } from "../../utils/motion";
import Medal from "../atoms/Medal";
import SectionHeader from "../atoms/SectionHeader";

// "What I do": numbered rows, one open at a time, each with its technical detail.
const Services = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" aria-label="What I do" className="py-20 sm:py-28">
      <div className={styles.container}>
        <SectionHeader index="02" label="What I do" labelAr="بعمل إيه" title="What I do" />

        <div className="mt-12 border-b border-paper/15 sm:mt-14">
          {services.map((service, i) => {
            const isOpen = open === i;
            const panelId = `service-detail-${i}`;
            return (
              <article
                key={service.title}
                className="grid grid-cols-[40px_minmax(0,1fr)_48px] items-start gap-x-4 gap-y-2 border-t border-paper/15 py-8 sm:grid-cols-[72px_minmax(0,1fr)_56px] sm:gap-x-6"
              >
                <span className="pt-3 text-[14px] font-semibold text-volt">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <Medal name={service.icon} size={56} className="hidden sm:inline-flex" />
                    <h3 className="m-0 font-display text-[clamp(32px,3.8vw,58px)] font-normal uppercase leading-none">
                      {service.title}
                    </h3>
                  </div>
                  <p className="m-0 max-w-[66ch] text-[15px] leading-[1.7] text-smoke">
                    {service.description}
                  </p>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 flex flex-col gap-3.5 rounded-[18px] bg-graphite p-6">
                          <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-volt">
                            The technical detail
                          </p>
                          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.6] text-mist">
                            {service.details.map((detail) => (
                              <li key={detail} className="flex gap-3">
                                <span aria-hidden="true" className="text-volt">
                                  →
                                </span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                          <ul aria-label="Stack" className="m-0 mt-1 flex list-none flex-wrap gap-2 p-0 text-[12px]">
                            {service.stack.map((tech) => (
                              <li key={tech} className="rounded-full border border-paper/20 px-3 py-1.5">
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  aria-label={`${isOpen ? "Hide" : "Show"} technical detail for ${service.title}`}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-[22px] leading-none transition-colors ${
                    isOpen ? "bg-volt text-ink" : "border border-paper/30 text-paper hover:border-volt"
                  }`}
                >
                  {isOpen ? "−" : "+"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
