import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { EASE_IN_OUT } from "../../utils/motion";

const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.025 } },
};

const letter: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: EASE_IN_OUT },
  },
};

type Props = {
  text: string;
  as?: keyof typeof tags;
  className?: string;
  /** A phrase inside `text` to set in frost. */
  highlight?: string;
  /** Rendered after the text, e.g. the frost full stop. */
  suffix?: React.ReactNode;
};

// Latin headings blur in letter by letter as they scroll into view.
// Words never break mid-word; screen readers get the plain text.
const RevealText = ({ text, as = "h2", className, highlight, suffix }: Props) => {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const highlightWords = highlight ? highlight.split(" ") : [];
  const highlightStart = highlight
    ? words.findIndex((_, i) =>
        highlightWords.every((w, j) => words[i + j] === w)
      )
    : -1;
  const isHighlighted = (i: number) =>
    highlightStart >= 0 &&
    i >= highlightStart &&
    i < highlightStart + highlightWords.length;

  const Tag = tags[as] as typeof motion.h2;

  return (
    <Tag
      className={className}
      aria-label={text}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={container}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            aria-hidden="true"
            className={`inline-block whitespace-nowrap ${isHighlighted(i) ? "text-frost" : ""}`}
          >
            {Array.from(word).map((char, j) => (
              <motion.span key={j} variants={letter} className="inline-block">
                {char}
              </motion.span>
            ))}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
    </Tag>
  );
};

export default RevealText;
