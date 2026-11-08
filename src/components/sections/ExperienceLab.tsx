import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

import { experiences } from "../../constants";
import type { TExperience } from "../../types";
import { EASE_OUT_CUBIC } from "../../utils/motion";
import Arrow from "../atoms/Arrow";
import ElementTile from "../atoms/ElementTile";

// Experience in the lab: each job is a batch in the notebook. A glass line runs
// down the page and fills green as you read; each batch's element tile lights
// when it comes into view (the companies' initials happen to be real elements),
// and its yield counts up. The current job is still cooking.

const ELEMENTS: Record<string, { symbol: string; number: number }> = {
  "Madkhol Capital": { symbol: "Md", number: 101 }, // mendelevium
  BasicsEngage: { symbol: "Be", number: 4 }, // beryllium
  "Appgain.io": { symbol: "Ag", number: 47 }, // silver
};

const since = experiences[experiences.length - 1].date.split(" – ")[0];
const pad = "px-5 sm:px-8";
// The tube runs down the middle of the tile column (56px phone, 72px desktop).
const tubeLeft = "left-[calc(20px+28px-3px)] sm:left-[calc(32px+28px-3px)] md:left-[calc(32px+36px-3px)]";

/** "APIs 30% faster" -> the number counts up, the words stay put. */
const Yield = ({ text, run }: { text: string; run: boolean }) => {
  const match = text.match(/^(\D*)(\d+)(.*)$/);
  const [before, digits, after] = match ? [match[1], match[2], match[3]] : ["", "", ""];
  const target = Number(digits) || 0;
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? target : 0);
  useEffect(() => {
    if (!run || !digits || reduce) return;
    const controls = animate(0, target, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [run, digits, target, reduce]);
  if (!digits) return <>{text}</>;
  return (
    <>
      {before}
      <span className="tabular-nums">{n}</span>
      {after}
    </>
  );
};

const Batch = ({ job, batch, live }: { job: TExperience; batch: number; live: boolean }) => {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  const el = ELEMENTS[job.companyName] ?? { symbol: job.companyName.slice(0, 2), number: batch };
  return (
    <li
      ref={ref}
      className={`group relative grid grid-cols-[56px_1fr] gap-x-4 gap-y-3 border-b border-paper/10 py-7 transition-colors duration-300 hover:bg-frost/[0.035] md:grid-cols-[72px_1fr_210px] md:gap-x-7 ${pad}`}
    >
      {/* The tile sits on the tube; it lands outlined and turns solid as the batch comes in. */}
      {/* items-start: the tile's backing must not stretch down the row and hide the tube. */}
      <div className="relative flex items-start justify-center md:pt-1">
        <motion.span
          className="relative z-[1] bg-graphite"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={seen ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.45, ease: EASE_OUT_CUBIC }}
        >
          <ElementTile
            symbol={el.symbol}
            number={el.number}
            size={56}
            tone={seen ? "solid" : "outline"}
            className="transition-[background-color,color,box-shadow] duration-500 group-hover:shadow-[0_0_28px_rgb(var(--frost)/0.45)]"
          />
          {/* One ring of light when it lights. */}
          {seen && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border-2 border-frost"
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            />
          )}
        </motion.span>
      </div>

      <motion.div
        className="flex min-w-0 flex-col gap-1.5"
        initial={{ opacity: 0, x: -16 }}
        animate={seen ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.12, ease: EASE_OUT_CUBIC }}
      >
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.14em] text-smoke">
          <span className="text-paper/60">BATCH {String(batch).padStart(2, "0")}</span>
          <span aria-hidden="true">·</span>
          <span className="uppercase">{job.date}</span>
          {live && (
            <span className="inline-flex items-center gap-1.5 border border-crystal/50 px-1.5 py-[1px] text-[10px] text-crystal">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crystal opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crystal" />
              </span>
              COOKING
            </span>
          )}
        </span>
        <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {job.companyUrl ? (
            <a
              href={job.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[28px] uppercase leading-none tracking-[0.02em] transition-colors hover:text-frost sm:text-[32px]"
            >
              {job.companyName} <Arrow dir="up-right" className="text-[0.6em]" />
            </a>
          ) : (
            <span className="font-display text-[28px] uppercase leading-none sm:text-[32px]">{job.companyName}</span>
          )}
          <span className="font-fellsc text-[14px] tracking-[0.12em] text-frost/80">{job.title}</span>
        </p>
        <p className="m-0 max-w-[62ch] font-fell text-[16px] leading-[1.6] text-paper/75">{job.summary}</p>
      </motion.div>

      {/* Yield: the number counts up; the gauge fills, and keeps cycling on the batch still cooking. */}
      <motion.div
        className="col-start-2 flex flex-col gap-2 md:col-start-3 md:items-end md:pt-1 md:text-right"
        initial={{ opacity: 0 }}
        animate={seen ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-smoke">YIELD</span>
        <span className="whitespace-nowrap font-display text-[24px] leading-none text-frost sm:text-[28px]">
          <Yield text={job.paidIn} run={seen} />
        </span>
        <span aria-hidden="true" className="relative block h-[5px] w-[150px] overflow-hidden bg-paper/10">
          <motion.span
            className="absolute inset-y-0 left-0 w-full origin-left bg-[linear-gradient(90deg,rgb(var(--frost)/0.5),rgb(var(--frost)))]"
            initial={{ scaleX: 0 }}
            animate={seen ? (live ? { scaleX: [0, 0.82, 0.68, 0.9] } : { scaleX: 1 }) : {}}
            transition={live ? { duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0.4 } : { duration: 1.4, delay: 0.4, ease: EASE_OUT_CUBIC }}
          />
        </span>
      </motion.div>
    </li>
  );
};

const ExperienceLab = () => {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  // Height, not scaleY, so the bubbles inside keep their shape.
  const fillHeight = useTransform(fill, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);
  const count = experiences.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE_OUT_CUBIC }}
      className="relative mt-14 overflow-hidden border-2 border-paper/15 bg-graphite"
    >
      <div aria-hidden="true" className="lab-grid pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden="true"
        className="tape-thin h-2.5 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_OUT_CUBIC }}
      />

      <div className={`relative flex flex-wrap items-center justify-between gap-3 border-b-2 border-frost/25 py-5 ${pad}`}>
        <h3 className="m-0 flex flex-wrap items-center gap-x-4 gap-y-1 font-normal">
          {/* Niobium: NoteBook. */}
          <ElementTile symbol="Nb" number={41} size={34} tone="outline" />
          <span className="font-fellsc text-[20px] tracking-[0.24em] sm:text-[22px]">Lab Notebook</span>
          <span lang="ar" className="font-arabic text-[22px] text-smoke">
            دفتر المعمل
          </span>
        </h3>
        <span className="hidden font-mono text-[11px] tracking-[0.18em] text-smoke sm:block">
          {count} BATCHES · DATE · ENTRY · YIELD
        </span>
      </div>

      <div className="relative">
        {/* The glass line, filling as you scroll, with bubbles rising in what's poured. */}
        <span aria-hidden="true" className={`absolute bottom-14 top-14 w-[6px] rounded-full border border-paper/20 bg-ink/40 ${tubeLeft}`}>
          <motion.span
            className="absolute inset-x-0 top-0 overflow-hidden rounded-full bg-[linear-gradient(180deg,rgb(var(--frost)/0.55),rgb(var(--frost)))] shadow-[0_0_14px_rgb(var(--frost)/0.6)]"
            style={{ height: fillHeight }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="lab-bubble" style={{ animationDelay: `${i * 0.9}s`, left: i % 2 ? "1px" : "2px" }} />
            ))}
          </motion.span>
        </span>

        <ol ref={list} className="relative m-0 list-none p-0">
          {experiences.map((job, i) => (
            <Batch key={job.companyName} job={job} batch={count - i} live={job.marker === "Now"} />
          ))}
        </ol>
      </div>

      <div className={`relative flex flex-wrap items-center justify-between gap-3 py-5 ${pad}`}>
        <span className="font-fellsc text-[15px] tracking-[0.12em] text-smoke">In the lab since {since}</span>
        <span lang="ar" dir="rtl" className="font-arabic text-[24px]">
          والتجربة لسه شغّالة
        </span>
      </div>
    </motion.div>
  );
};

export default ExperienceLab;
