import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { services } from "../../constants";
import { styles } from "../../constants/styles";
import { EASE_OUT_EXPO } from "../../utils/motion";
import SectionHeader from "../atoms/SectionHeader";

// "What I do" as the bounty board outside the sheriff's office: each service
// is a WANTED poster nailed to the planks, "for hire", with the best proof
// from the record and the reward: let's talk. Picking a poster pins its full
// detail (every proof line and the stack) under the board.

// The poster's woodcut, drawn here for each service's icon.
const CUTS: Record<string, ReactNode> = {
  gear: (
    <>
      <path d="M20.10 10.72 L22.54 10.92 L22.54 13.08 L20.10 13.28 L18.63 16.82 L20.22 18.69 L18.69 20.22 L16.82 18.63 L13.28 20.10 L13.08 22.54 L10.92 22.54 L10.72 20.10 L7.18 18.63 L5.31 20.22 L3.78 18.69 L5.37 16.82 L3.90 13.28 L1.46 13.08 L1.46 10.92 L3.90 10.72 L5.37 7.18 L3.78 5.31 L5.31 3.78 L7.18 5.37 L10.72 3.90 L10.92 1.46 L13.08 1.46 L13.28 3.90 L16.82 5.37 L18.69 3.78 L20.22 5.31 L18.63 7.18 Z" />
      <circle cx="12" cy="12" r="3.4" className="fill-[#ECEFEA]" />
    </>
  ),
  divider: (
    <>
      <path d="M12 5 L5 18 M12 5 L19 18 M5 18 H19 M12 5 V12 M5 18 L12 12 L19 18" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  bolt: (
    <>
      <path d="M13.5 1.5L4 14h7l-1.5 8.5L20 9.5h-7l1.8-8z" />
      <path d="M12.6 5L8.2 11.4" className="stroke-[#ECEFEA]" strokeWidth="1.2" />
    </>
  ),
};

const TILT = [-2.2, 1.4, -0.8];

const Services = () => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);
  const picked = services[open];

  return (
    <section id="services" aria-label="What I do" className="py-20 sm:py-28">
      <div className={styles.container}>
        <SectionHeader index="02" label="What I do" labelAr="بعمل إيه" title="What I Do" />

        {/* The board: dark planks, the posters nailed on. */}
        <div className="relative mt-12 overflow-hidden rounded-[10px] bg-[repeating-linear-gradient(180deg,#1B2823_0_108px,#0F1714_108px_110px,#17231E_110px_218px,#0F1714_218px_220px)] px-4 py-8 shadow-[inset_0_0_0_10px_#101A16,0_20px_40px_-20px_rgba(0,0,0,0.8)] sm:mt-14 sm:px-8 sm:py-10">
          <ul className="m-0 flex list-none flex-col items-center gap-10 p-0 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
            {services.map((service, i) => {
              const isOpen = open === i;
              return (
                <li key={service.title} className="w-full max-w-[360px] lg:flex-1">
                  <motion.button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-pressed={isOpen}
                    aria-controls="service-detail"
                    aria-label={`${service.title}: show the detail`}
                    initial={false}
                    animate={{ rotate: reduce ? 0 : isOpen ? 0 : TILT[i % TILT.length], y: isOpen ? -6 : 0 }}
                    whileHover={reduce ? undefined : { rotate: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                    className={`relative block w-full p-0 text-left ${
                      isOpen ? "drop-shadow-[0_30px_30px_rgba(0,0,0,0.75)]" : "drop-shadow-[0_22px_22px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    <span className="torn-3 relative flex flex-col items-center gap-2.5 bg-[#ECEFEA] px-6 pb-7 pt-8 text-center text-[#1A1F1C]">
                      <span aria-hidden="true" className="paper-grain absolute inset-0" />
                      <span className="font-western text-[clamp(44px,5vw,58px)] leading-[0.9]">WANTED</span>
                      <span className="font-fellsc text-[15px] tracking-[0.3em]">— For hire —</span>
                      <span className="my-1.5 flex h-[118px] w-[118px] items-center justify-center border-[2.5px] border-current">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[76px] w-[76px] fill-current">
                          {CUTS[service.icon]}
                        </svg>
                      </span>
                      <span className="font-western text-[26px] leading-[1.05]">{service.poster}</span>
                      <span className="font-fell text-[15.5px] leading-[1.45]">{service.description}</span>
                      <span className="font-fell text-[14px] italic leading-[1.4] text-[#3A423E]">Known for: {service.details[0]}</span>
                      <span aria-hidden="true" className="my-1.5 w-full border-t-[1.5px] border-current" />
                      <span className="font-fellsc text-[15px] tracking-[0.3em]">Reward</span>
                      <span className="font-western text-[30px] leading-none">Let&apos;s talk</span>
                      <span lang="ar" className="font-arabic text-[20px] leading-tight">
                        المكافأة: نتكلم
                      </span>
                      {service.stamp && (
                        <span
                          aria-hidden="true"
                          className="absolute right-4 top-[118px] rotate-[-12deg] rounded-md border-[3px] border-bandana px-3 py-0.5 font-western text-[20px] uppercase text-bandana opacity-85 mix-blend-multiply"
                        >
                          {service.stamp}
                        </span>
                      )}
                    </span>
                    {/* The nail. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-2.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#C9D1CC,#5E6A64_60%,#2B332F)] shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
                    />
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* The picked poster's full detail, pinned under the board. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            id="service-detail"
            key={picked.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="torn-2 mt-8 grid gap-6 bg-graphite p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div className="flex flex-col gap-3.5">
              <p className="m-0 font-fellsc text-[15px] tracking-[0.16em] text-frost">{picked.title} · the record</p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 font-fell text-[18px] leading-[1.5] text-paper">
                {picked.details.map((detail) => (
                  <li key={detail} className="flex gap-3">
                    <span aria-hidden="true" className="text-frost">
                      →
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            <ul aria-label="Stack" className="m-0 flex list-none flex-wrap gap-2 p-0 text-[12px] lg:max-w-[420px] lg:justify-end">
              {picked.stack.map((tech) => (
                <li key={tech} className="border border-paper/25 px-3 py-1.5">
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Services;
