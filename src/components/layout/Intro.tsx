import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { greetings } from "../../constants";
import { EASE_OUT_CUBIC, markIntroSeen } from "../../utils/motion";

const WORD_MS = 170; // 120 ms on screen + a 50 ms fade
const LAST_WORD_MS = 300;
const LIFT_S = 0.9;

type Props = {
  /** Called when the curtain starts lifting, so the hero can rise with it. */
  onReveal: () => void;
  /** Called once the curtain is fully off screen. */
  onDone: () => void;
};

// First-visit loader: greetings flash on a volt curtain, ending on أهلاً, then
// the curtain lifts away with a curved bottom edge.
const Intro = ({ onReveal, onDone }: Props) => {
  const [index, setIndex] = useState(0);
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    markIntroSeen();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (lifting) return;
    const isLast = index === greetings.length - 1;
    const id = window.setTimeout(
      () => {
        if (isLast) {
          setLifting(true);
          onReveal();
        } else {
          setIndex((i) => i + 1);
        }
      },
      isLast ? LAST_WORD_MS : WORD_MS
    );
    return () => window.clearTimeout(id);
  }, [index, lifting, onReveal]);

  const word = greetings[index];
  const wordFont =
    word.lang === "ar"
      ? "font-arabic text-[1.15em]"
      : word.lang === "ja"
        ? "font-sans font-extrabold text-[0.7em]"
        : "";

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-volt text-ink"
      initial={false}
      animate={{ y: lifting ? "-128%" : "0%" }}
      transition={{ duration: LIFT_S, ease: EASE_OUT_CUBIC }}
      onAnimationComplete={() => {
        if (lifting) onDone();
      }}
    >
      {/* The bottom edge sags into a curve mid-lift, then flattens. */}
      <motion.span
        className="absolute left-[-15%] top-[calc(100%-2px)] h-[33vh] w-[130%] origin-top rounded-b-[50%] bg-volt"
        initial={{ scaleY: 0.35 }}
        animate={lifting ? { scaleY: [0.35, 1, 0.15] } : { scaleY: 0.35 }}
        transition={{ duration: LIFT_S, times: [0, 0.45, 1], ease: "easeOut" }}
      />
      <motion.p
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: lifting ? 0 : 1 }}
        transition={{ duration: lifting ? 0.15 : 0.11 }}
        className="absolute inset-0 m-0 flex items-center justify-center gap-5 font-display text-[clamp(56px,9vw,120px)] uppercase leading-none sm:gap-7"
      >
        <span className="h-3 w-3 rounded-full bg-ink sm:h-[18px] sm:w-[18px]" />
        <span lang={word.lang} className={wordFont}>
          {word.text}
        </span>
      </motion.p>
    </motion.div>
  );
};

export default Intro;
