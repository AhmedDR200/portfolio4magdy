import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue } from "framer-motion";

import { bee3aLockup, bee3aLockupLight } from "../../assets";
import Bee3aDemo from "./Bee3aDemo";
import Bee3aNotebook from "./Bee3aNotebook";
import Arrow from "../atoms/Arrow";

// The Bee3a card tells Bee3a's own line, «ودّع الكشكول!» ("goodbye, notebook"),
// as a before and after: the paper notebook a shop runs on, and the same day in
// the app, split by a handle you can drag. The app side is the working demo.
// On wide screens the two share one frame; on phones they stack, notebook first.

const SYSTEMS = [
  { n: "01", ar: "الكاشير", en: "Till / POS", body: "Fast sales, and stock goes down by itself with every sale. Receipt on WhatsApp." },
  { n: "02", ar: "نظام الحجوزات", en: "Bookings", body: "Online booking from the shop's link, one calendar for all staff, WhatsApp reminders." },
  { n: "03", ar: "الطلب أونلاين", en: "Online orders", body: "Customers order from the shop's link; the shop confirms, prepares and hands over." },
];
const STACK = ["React", "Express", "MongoDB", "Cloudflare Workers", "Workers AI", "PWA"];

// What the app does that the notebook can't, beside the phone (wide screens).
const CALLOUTS = [
  { side: "left", top: 150, text: "Adds itself up. No more «1,000?»" },
  { side: "left", top: 300, text: "Who's confirmed, who's still waiting" },
  { side: "right", top: 150, text: "Reminders go out on WhatsApp" },
  { side: "right", top: 300, text: "Booked from the shop's own link" },
];

// How much of the frame the notebook covers, in %.
const MIN = 6;
const MAX = 94;
const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));

const SplitHandle = ({ split, stage }: { split: MotionValue<number>; stage: { current: HTMLDivElement | null } }) => {
  const [value, setValue] = useState(() => Math.round(split.get()));
  useMotionValueEvent(split, "change", (v) => setValue(Math.round(v)));

  const dragTo = (clientX: number) => {
    const rect = stage.current?.getBoundingClientRect();
    if (rect) split.set(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onKey = (e: KeyboardEvent) => {
    const to = { ArrowLeft: split.get() - 4, ArrowRight: split.get() + 4, Home: MIN, End: MAX }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    split.stop();
    split.set(clamp(to));
  };

  return (
    <div
      className="absolute inset-y-0 z-[2] hidden w-12 -translate-x-1/2 cursor-ew-resize touch-none lg:block"
      style={{ left: "var(--split)" }}
      onPointerDown={(e) => {
        split.stop();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragTo(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) dragTo(e.clientX);
      }}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-frost" />
      <span
        role="slider"
        tabIndex={0}
        aria-label="Before and after: drag to compare"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={value}
        aria-valuetext={`${value}% notebook`}
        onKeyDown={onKey}
        className="absolute left-1/2 top-1/2 flex h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-frost text-[20px] font-extrabold text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)] outline-none focus-visible:ring-4 focus-visible:ring-frost/40"
      >
        <Arrow dir="left-right" className="text-[24px]" />
      </span>
    </div>
  );
};

export const Bee3aCard = () => {
  const [playing, setPlaying] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const split = useMotionValue(MAX);
  const inView = useInView(stage, { once: true, amount: 0.4 });

  useMotionValueEvent(split, "change", (v) => stage.current?.style.setProperty("--split", `${v}%`));

  // The first time the frame is in view, the handle sweeps off the notebook to the middle.
  useEffect(() => {
    if (reduce) return split.set(50);
    if (!inView) return;
    const sweep = animate(split, 50, { duration: 1.6, delay: 0.25, ease: [0.65, 0, 0.35, 1] });
    return () => sweep.stop();
  }, [inView, reduce, split]);

  const tryDemo = useCallback(() => {
    setPlaying((p) => !p);
    // Uncover the phone for the tour.
    if (split.get() > 50) animate(split, 50, { duration: 0.6, ease: "easeOut" });
  }, [split]);

  return (
    <article aria-label="Founder project: Bee3a" className="mt-11 rounded-[28px] border border-paper/10 bg-graphite p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <p className="m-0 flex w-fit items-center gap-2.5 rounded-full bg-frost px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
            <span aria-hidden="true" className="animate-pulse-ink h-2 w-2 rounded-full bg-ink" />
            Founder · Live ·
            <span lang="ar" className="font-arabic text-[17px] font-normal normal-case tracking-normal">
              شغّال دلوقتي
            </span>
          </p>
          <p lang="ar" dir="rtl" className="m-0 mt-3 text-left font-arabic text-[clamp(60px,8vw,104px)] leading-[1.1] text-frost">
            ودّع الكشكول!
          </p>
          <h3 className="m-0 font-display text-[clamp(22px,2.2vw,30px)] font-normal uppercase leading-[1.05]">
            Bee3a · bookings and sales for your shop, in one place.
          </h3>
        </div>

        <div className="flex flex-col items-start gap-4 lg:max-w-[420px] lg:items-end lg:text-right">
          <img src={bee3aLockup} alt="Bee3a بيعة logo" className="h-10 w-auto light:hidden" />
          <img src={bee3aLockupLight} alt="Bee3a بيعة logo" className="hidden h-10 w-auto light:block" />
          <p className="m-0 text-[13px] leading-[1.7] text-mist">
            For salons, clinics, training centers, shops and supermarkets. Founded, designed and built end to end.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={tryDemo}
              aria-pressed={playing}
              className="flex h-[46px] items-center whitespace-nowrap rounded-full border border-paper/30 px-5 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-frost hover:text-frost"
            >
              {playing ? "■ Stop" : "▶ Try the demo"}
            </button>
            <a
              href="https://bee3a.site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[46px] items-center whitespace-nowrap torn bg-frost px-5 text-[13px] font-bold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-105"
            >
              Visit bee3a.site <Arrow dir="up-right" className="ml-1.5" />
            </a>
          </div>
        </div>
      </div>

      <div
        ref={stage}
        className="relative mt-8 overflow-hidden rounded-[22px] border border-paper/10 lg:h-[600px] xl:h-[560px]"
        style={{ "--split": `${MAX}%` } as CSSProperties}
      >
        {/* Before. On wide screens it lies on top and is cut off at the handle. */}
        <Bee3aNotebook className="relative h-[452px] lg:absolute lg:inset-0 lg:z-[1] lg:h-auto lg:[clip-path:inset(0_calc(100%_-_var(--split))_0_0)]" />

        {/* After: the app, with the working demo. */}
        <div className="relative flex justify-center bg-[radial-gradient(70%_60%_at_50%_55%,rgb(var(--graphite)),rgb(var(--ink))_75%)] px-4 pb-6 pt-16 lg:absolute lg:inset-0 lg:block lg:bg-[radial-gradient(40%_70%_at_75%_55%,rgb(var(--graphite)),rgb(var(--ink))_75%)] lg:p-0">
          {/* Beside the handle on wide screens; the phone sits lower until xl so it never covers this. */}
          <span className="absolute right-4 top-4 rounded-lg bg-frost px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-ink sm:right-5 sm:top-5 lg:left-[calc(var(--split)_+_24px)] lg:right-auto">
            AFTER ·{" "}
            <span lang="ar" className="font-arabic text-[14px] font-normal tracking-normal">
              بيعة
            </span>
          </span>
          {CALLOUTS.map((c) => (
            <span
              key={c.text}
              className={`absolute hidden w-[118px] flex-col gap-2 text-[11.5px] leading-[1.55] text-mist xl:flex ${
                c.side === "left" ? "left-[calc(50%+24px)]" : "right-6"
              }`}
              style={{ top: c.top }}
            >
              <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-frost shadow-[0_0_0_4px_rgba(191,224,236,0.18)]" />
              {c.text}
            </span>
          ))}
          <Bee3aDemo playing={playing} onPlayingChange={setPlaying} className="lg:absolute lg:left-3/4 lg:top-[64px] lg:-translate-x-1/2 xl:top-6" />
        </div>

        <SplitHandle split={split} stage={stage} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        <div className="flex flex-col gap-2.5 lg:pr-6">
          <p className="m-0 text-[12px] uppercase tracking-[0.14em] text-frost">Three systems, one app</p>
          <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[22px] leading-[1.35] text-mist">
            شغّل اللي محلك محتاجه: واحد أو اتنين أو التلاتة.
          </p>
          <p className="m-0 mt-auto text-[11.5px] leading-[1.7] text-smoke">
            + admin console · + 5 AI tools
            <br />
            {STACK.join(" · ")}
          </p>
        </div>
        {SYSTEMS.map((s) => (
          <div key={s.n} className="flex flex-col gap-1.5 border-paper/10 lg:border-l lg:px-6">
            <span className="font-display text-[24px] leading-none text-frost">{s.n}</span>
            <span lang="ar" dir="rtl" className="text-left font-arabic text-[28px] leading-[1.2]">
              {s.ar}
            </span>
            <span className="text-[11px] uppercase tracking-[0.12em] text-smoke">{s.en}</span>
            <span className="text-[12.5px] leading-[1.6] text-mist">{s.body}</span>
          </div>
        ))}
      </div>
    </article>
  );
};
