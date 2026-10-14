import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { satchelKit, satchelTools } from "../../constants";
import AppLogo from "../atoms/AppLogo";
import Brush from "../atoms/Brush";
import KeyCap from "../atoms/KeyCap";
import { KIT_ART } from "../atoms/KitArt";
import Ornament from "../atoms/Ornament";

// Inside the satchel: two pouches like RDR2's, Kit (the hardware, drawn) and
// Tools (the apps). Q and E switch pouch, the arrows move through the slots,
// and the panel shows the picked item. Loaded only when the satchel opens.

type Item = { id: string; name: string; sub: string; note: string; uses: readonly string[] };
const POUCHES = [
  { en: "Kit", ar: "العدّة", items: satchelKit as readonly Item[] },
  { en: "Tools", ar: "البرامج", items: satchelTools as readonly Item[] },
];
const COLUMNS = 4;

const Art = ({ pouch, id, className = "" }: { pouch: number; id: string; className?: string }) => {
  if (pouch === 0) {
    const Drawing = KIT_ART[id as keyof typeof KIT_ART];
    return <Drawing className={className} />;
  }
  return <AppLogo id={id as Parameters<typeof AppLogo>[0]["id"]} className={className} />;
};

const Leather = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-graphite bg-[radial-gradient(ellipse_at_50%_35%,rgb(var(--paper)/0.06),transparent_70%),repeating-linear-gradient(115deg,rgba(0,0,0,0.05)_0_2px,transparent_2px_6px)] ${className}`}
  >
    <span aria-hidden="true" className="pointer-events-none absolute inset-1.5 rounded-lg border-[1.2px] border-dashed border-paper/15" />
    {children}
  </div>
);

const SatchelPanel = ({ onClose }: { onClose: () => void }) => {
  const [pouch, setPouch] = useState(0);
  const [picked, setPicked] = useState(0);
  const detail = useRef<HTMLDivElement>(null);
  const items = POUCHES[pouch].items;
  const item = items[Math.min(picked, items.length - 1)];

  const switchTo = (next: number) => {
    setPouch((next + POUCHES.length) % POUCHES.length);
    setPicked(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      const move = { arrowleft: -1, arrowright: 1, arrowup: -COLUMNS, arrowdown: COLUMNS }[key];
      if (move !== undefined) {
        e.preventDefault();
        setPicked((p) => Math.max(0, Math.min(items.length - 1, p + move)));
      } else if (key === "q") switchTo(pouch - 1);
      else if (key === "e") switchTo(pouch + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pick = (i: number) => {
    setPicked(i);
    // On narrow screens the panel is under the grid: bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) detail.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1328px] flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-12">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="m-0 flex items-baseline gap-4 font-normal">
            <span className="font-fellsc text-[34px] tracking-[0.18em] sm:text-[44px]">Satchel</span>
            <span lang="ar" className="font-ruqaa text-[26px] text-smoke sm:text-[30px]">
              الشنطة
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center gap-2.5 rounded-full border border-paper/25 px-4 font-fellsc text-[14px] tracking-[0.12em] hover:border-frost hover:text-frost lg:hidden"
          >
            Close
          </button>
        </div>

        <div role="tablist" aria-label="Pouches" className="flex flex-wrap items-center gap-2">
          <KeyCap className="hidden sm:inline-flex">Q</KeyCap>
          {POUCHES.map((p, i) => {
            const on = i === pouch;
            return (
              <button
                key={p.en}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => switchTo(i)}
                className={`relative px-4 py-2 font-fellsc text-[19px] tracking-[0.12em] transition-colors ${on ? "text-ink" : "text-paper/75 hover:text-paper"}`}
              >
                {on && <Brush variant={i + 1} className="absolute -inset-x-2 inset-y-0 h-full w-[calc(100%+16px)] text-paper" />}
                <span className="relative flex items-baseline gap-2.5">
                  {p.en}
                  <span lang="ar" className="font-ruqaa text-[19px] tracking-normal">
                    {p.ar}
                  </span>
                  <span className="font-mono text-[11px] tracking-normal opacity-70">{p.items.length}</span>
                </span>
              </button>
            );
          })}
          <KeyCap className="hidden sm:inline-flex">E</KeyCap>
        </div>

        <ul role="tabpanel" aria-label={POUCHES[pouch].en} className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4 sm:gap-3.5">
          {items.map((it, i) => {
            const on = item.id === it.id;
            return (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  onMouseEnter={() => setPicked(i)}
                  aria-pressed={on}
                  aria-label={it.name}
                  className={`block w-full rounded-xl transition-shadow ${
                    on ? "shadow-[inset_0_0_0_2px_rgb(var(--frost)),0_0_22px_rgb(var(--frost)/0.35)]" : "shadow-[inset_0_0_0_1px_rgb(var(--paper)/0.14)]"
                  }`}
                >
                  <Leather className={pouch === 0 ? "h-[150px] sm:h-[168px]" : "h-[132px] sm:h-[150px]"}>
                    <span className={`absolute flex items-center justify-center ${pouch === 0 ? "inset-[18px]" : "inset-x-9 bottom-9 top-7"} ${on ? "text-frost" : "text-paper"}`}>
                      <Art pouch={pouch} id={it.id} className="h-full max-h-full w-full" />
                    </span>
                    {pouch === 1 && <span className="absolute bottom-2.5 left-3 font-fellsc text-[11px] tracking-[0.1em] text-paper/70">{it.name}</span>}
                    {pouch === 0 && <span className="absolute bottom-2 right-3 font-fellsc text-[13px] text-paper/70">×1</span>}
                  </Leather>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div ref={detail} aria-live="polite" className="scroll-mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${pouch}-${item.id}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3.5"
          >
            <Leather className="flex h-[220px] items-center justify-center p-7 text-paper sm:h-[250px]">
              <Art pouch={pouch} id={item.id} className={pouch === 0 ? "h-full w-full" : "h-[130px] w-[130px] sm:h-[150px] sm:w-[150px]"} />
            </Leather>
            <span className="font-fellsc text-[13px] tracking-[0.12em] text-smoke">{item.sub}</span>
            <h3 className="m-0 font-fell text-[34px] font-normal leading-none sm:text-[38px]">{item.name}</h3>
            <Ornament className="text-paper/50" />
            <p className="m-0 font-fell text-[19px] italic leading-[1.45] text-paper/85">{item.note}</p>
            <span className="mt-1 font-fellsc text-[12px] tracking-[0.12em] text-smoke">Used for</span>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {item.uses.map((use) => (
                <li key={use} className="border border-paper/25 px-3 py-1 text-[12px]">
                  {use}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hidden items-center justify-between lg:col-span-2 lg:flex">
        <span className="font-fellsc text-[13px] tracking-[0.12em] text-paper/60">
          {items.length} items · {POUCHES[pouch].en}
        </span>
        <span className="flex items-center gap-7 font-fellsc text-[15px] tracking-[0.12em]">
          <span className="flex items-center gap-2.5">
            <KeyCap>←→</KeyCap> Browse
          </span>
          <span className="flex items-center gap-2.5">
            <KeyCap>Q</KeyCap>
            <KeyCap>E</KeyCap> Switch pouch
          </span>
          <button type="button" onClick={onClose} className="flex items-center gap-2.5 hover:text-frost">
            <KeyCap>Esc</KeyCap> Close
          </button>
        </span>
      </div>
    </div>
  );
};

export default SatchelPanel;
