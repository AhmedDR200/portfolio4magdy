import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { mePhoto } from "../../assets";
import { heroRoles } from "../../constants";
import { config } from "../../constants/config";
import { EASE_OUT_CUBIC } from "../../utils/motion";
import NameMarquee from "../atoms/NameMarquee";
import CairoClock from "../atoms/CairoClock";
import SpinBadge from "../atoms/SpinBadge";
import Navbar from "../layout/Navbar";

type Props = {
  /** The intro is about to play: start lowered and scaled down behind it. */
  startHidden: boolean;
  /** The intro's curtain is lifting: rise into place with it. */
  revealed: boolean;
  onMenu: () => void;
};

const Hero = ({ startHidden, revealed, onMenu }: Props) => {
  const reduce = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setRoleIndex((i) => (i + 1) % heroRoles.length),
      2800
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <motion.section
      id="top"
      aria-label="Intro"
      className="relative flex min-h-[max(680px,100svh)] flex-col justify-between overflow-hidden bg-[#2A2A28]"
      style={{ transformOrigin: "50% 100%" }}
      initial={startHidden ? { y: 160, scale: 0.88 } : false}
      animate={revealed ? { y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.9, ease: EASE_OUT_CUBIC }}
    >
      <img
        src={mePhoto}
        alt="Portrait of Ahmed Magdy"
        className="absolute inset-0 h-full w-full object-cover object-[50%_12%] brightness-[0.78] contrast-125 grayscale sm:object-[50%_28%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0)_22%,rgba(10,10,10,0)_52%,rgba(10,10,10,0.95)_100%)]"
      />

      <Navbar onMenu={onMenu} ready={revealed} />
      {/* Narrower screens get the Cairo clock under the navbar. */}
      <div className="relative z-10 -mt-1 px-5 sm:px-12 xl:hidden">
        <CairoClock />
      </div>

      {/* On phones this sits just above the name, below the face. */}
      <div className="relative mb-4 mt-auto flex flex-col gap-5 pr-5 sm:my-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-8 sm:pr-12">
        <a
          href={config.currentRole.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-5 rounded-r-full bg-volt py-3.5 pl-5 pr-7 text-ink sm:py-4 sm:pl-12"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-[12px]">
              Now
            </span>
            <span className="font-display text-[20px] uppercase leading-[1.1] sm:text-[26px]">
              {config.currentRole.title}
            </span>
          </span>
          <span aria-hidden="true" className="animate-pulse-ink h-3 w-3 rounded-full bg-ink" />
        </a>

        <div className="pl-5 sm:pl-0 sm:text-right">
          <p className="m-0 font-display text-[38px] uppercase leading-none sm:text-[clamp(40px,3.9vw,56px)]">
            Backend Engineer
          </p>
          <p className="relative m-0 h-[1.05em] overflow-hidden font-display text-[38px] uppercase leading-none text-volt sm:text-[clamp(40px,3.9vw,56px)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={roleIndex}
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease: EASE_OUT_CUBIC }}
              >
                &amp; {heroRoles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="m-0 mt-2 text-left font-arabic text-[26px] leading-[1.2] sm:text-right sm:text-[34px]"
          >
            مهندس باك إند
          </p>
          {/* In the flow under the role, so it can never cover the text. */}
          <SpinBadge className="relative ml-auto mt-6 hidden xl:flex" />
        </div>
      </div>

      <NameMarquee className="relative pb-3 font-display text-[clamp(120px,17.4vw,250px)] uppercase leading-none text-volt sm:pb-4" />
    </motion.section>
  );
};

export default Hero;
