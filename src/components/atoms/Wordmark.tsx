import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { HONOR_MAX, useHonor } from "../../utils/honor";
import Icon from "./Icon";

const WORD = Array.from("مجدي");
const START_DELAY_MS = 450;
const TYPE_MS = 120;

type Props = {
  /** Sets the size: the › and cursor scale with the font size, the Arabic is 1.25× it. */
  className?: string;
  /** Type the word out, one letter at a time, once `ready` is true, and again on hover. */
  typing?: boolean;
  ready?: boolean;
};

// The logo: a terminal prompt, مجدي, and a blinking cursor (› مجدي▁).
// The › and the cursor are drawn rather than typed, so the cursor's height
// always matches the ›'s stroke, and the cursor sits on the letters' baseline.
const Wordmark = ({ className = "", typing = false, ready = true }: Props) => {
  const reduce = useReducedMotion();
  const sheriff = useHonor() >= HONOR_MAX;
  const animate = typing && !reduce;
  const [count, setCount] = useState(animate ? 0 : WORD.length);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!animate || !ready) return;
    const id = window.setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [animate, ready]);

  useEffect(() => {
    if (!started || count >= WORD.length) return;
    const id = window.setTimeout(() => setCount((n) => n + 1), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [started, count]);

  const done = count >= WORD.length;
  const retype = () => {
    if (started && done) setCount(0);
  };

  return (
    <span className={`inline-flex items-center gap-[0.16em] leading-none ${className}`} onMouseEnter={retype}>
      <svg
        viewBox="0 0 60 100"
        aria-hidden="true"
        className="h-[0.75em] w-[0.45em] shrink-0 overflow-visible text-volt"
      >
        <polyline points="8,10 50,50 8,90" fill="none" stroke="currentColor" strokeWidth={16} />
      </svg>
      <span lang="ar" dir="rtl" className="pb-[0.12em] font-arabic text-[1.25em] leading-none">
        {/* A zero-width space keeps the line height while nothing is typed yet. */}
        {count ? WORD.slice(0, count).join("") : "​"}
      </span>
      <span
        aria-hidden="true"
        className={`mb-[0.44em] h-[0.12em] w-[0.42em] shrink-0 self-end bg-volt ${done ? "animate-blink" : ""}`}
      />
      {sheriff && (
        <span title="Sheriff: full honor" className="ml-[0.08em] text-volt">
          <Icon name="star" size={18} />
        </span>
      )}
    </span>
  );
};

export default Wordmark;
