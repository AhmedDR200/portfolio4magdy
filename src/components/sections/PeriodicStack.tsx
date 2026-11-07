import { useEffect, useMemo, useState } from "react";

import { projects, services, skillGroups } from "../../constants";
import { toolSymbol } from "../../constants/elements";
import { styles } from "../../constants/styles";
import ElementTile from "../atoms/ElementTile";
import SectionHeader from "../atoms/SectionHeader";
import { SKILL_HIGHLIGHT_EVENT } from "../layout/SkillWheel";

const total = skillGroups.reduce((n, group) => n + group.items.length, 0);

type Tool = { name: string; symbol: string; n: number; group: number; daily: boolean };

// Every tool in the stack, numbered along the table like atomic numbers.
const TOOLS: Tool[] = (() => {
  let n = 0;
  return skillGroups.flatMap((g, group) =>
    g.items.map((name) => ({ name, symbol: toolSymbol(name), n: ++n, group, daily: g.daily.includes(name) }))
  );
})();

/** Where a tool shows up on this site: the services and case studies whose stack lists it. */
const appearsIn = (tool: string): string => {
  const same = (s: string) => s.toLowerCase() === tool.toLowerCase();
  const where = [
    ...services.filter((s) => s.stack.some(same)).map((s) => s.title),
    ...projects.filter((p) => p.caseStudy?.stack.some(same)).map((p) => p.name),
  ];
  return where.length ? where.slice(0, 3).join(" · ") : "Shipped to production";
};

const tileText = "font-archivo font-extrabold leading-none tracking-[-0.03em]";

type TileProps = { tool: Tool; hot: boolean; onHot: () => void };

const StackTile = ({ tool, hot, onHot }: TileProps) => (
  <li className="flex">
    <button
      type="button"
      onMouseEnter={onHot}
      onFocus={onHot}
      onClick={onHot}
      aria-label={`${tool.name}, ${skillGroups[tool.group].title}${tool.daily ? ", used every day" : ""}`}
      data-hot={hot}
      className={`relative flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center border-[2.5px] pb-[9px] font-archivo transition-[box-shadow,border-color,background-color,color] duration-150 sm:h-[92px] sm:w-[92px] sm:pb-3 ${
        hot
          ? "border-crystal bg-ink text-crystal shadow-[0_0_0_4px_rgb(var(--crystal)/0.16)]"
          : tool.daily
            ? "border-frost bg-frost text-ink"
            : "border-dim/70 bg-ink text-paper"
      }`}
    >
      <span
        className={`absolute left-1.5 top-1 text-[8px] font-bold leading-none sm:left-[7px] sm:top-[5px] sm:text-[10px] ${
          hot ? "text-crystal" : tool.daily ? "text-ink" : "text-smoke"
        }`}
      >
        {tool.n}
      </span>
      <span className={`${tileText} text-[27px] sm:text-[38px]`}>{tool.symbol}</span>
      <span
        className={`absolute inset-x-[3px] bottom-[5px] hidden text-center text-[9.5px] font-semibold leading-[1.05] sm:block ${
          hot ? "text-crystal" : tool.daily ? "text-ink" : "text-mist"
        }`}
      >
        {tool.name}
      </span>
    </button>
  </li>
);

// The stack as a periodic table: one row per group, one tile per tool. Solid
// green tiles are what I use every day; outlined ones have shipped to
// production. Hover, focus or tap a tile for its card; picking a group on the
// hold-Tab selector lights its row for a moment.
const PeriodicStack = () => {
  const [lit, setLit] = useState<number | null>(null);
  const [active, setActive] = useState<Tool>(() => TOOLS.find((t) => t.name === "MongoDB") ?? TOOLS[0]);

  useEffect(() => {
    let timer = 0;
    const onHighlight = (e: Event) => {
      setLit((e as CustomEvent<number>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setLit(null), 2600);
    };
    window.addEventListener(SKILL_HIGHLIGHT_EVENT, onHighlight);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(SKILL_HIGHLIGHT_EVENT, onHighlight);
    };
  }, []);

  const where = useMemo(() => appearsIn(active.name), [active.name]);
  const group = skillGroups[active.group];
  let offset = 0;

  return (
    <section id="skills" aria-label="Skills" className="py-20 sm:py-28">
      <div className={styles.container}>
        <div className="flex flex-col items-center gap-6">
          <SectionHeader index="03" label="Skills" labelAr="مهاراتي" title="The Stack" />
          <ul aria-label="Legend" className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0 text-[12px] text-mist">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="block h-5 w-5 border-[2.5px] border-dim/70" />
              shipped to production
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="block h-5 w-5 bg-frost" />
              used every day
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="block h-5 w-5 border-[2.5px] border-crystal" />
              under the cursor
            </li>
          </ul>
        </div>

        {/* The card for the picked tile, and how to open the selector. */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div aria-live="polite" className="flex flex-col gap-4 border border-paper/15 bg-graphite p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <ElementTile symbol={active.symbol} number={active.n} size={112} tone="crystal" className="!bg-transparent !text-crystal" />
            <div className="flex min-w-0 flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.14em] text-smoke">HOVER OR TAP A TILE</span>
              <span className="font-display text-[clamp(28px,4vw,38px)] uppercase leading-none">{active.name}</span>
              <span className={`font-mono text-[12px] tracking-[0.06em] ${active.daily ? "text-frost" : "text-smoke"}`}>
                {group.title.toUpperCase()} · {active.daily ? "USED EVERY DAY" : "SHIPPED TO PRODUCTION"}
              </span>
              <div className="flex flex-col gap-0.5 border-t border-paper/15 pt-2.5">
                <span className="font-mono text-[11px] tracking-[0.1em] text-smoke">APPEARS IN</span>
                <span className="text-[14px] leading-[1.5]">{where}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border border-paper/15 p-5 [@media(pointer:coarse)]:hidden">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em]">Hold Tab</span>
              <kbd className="inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-[4px] border-[1.5px] border-smoke bg-graphite px-2 font-mono text-[13px] font-bold shadow-[0_3px_0_rgb(var(--dim)/0.5)]">
                Tab
              </kbd>
            </div>
            <p className="m-0 text-[13px] leading-[1.55] text-mist">The table opens as a selector. Move over a group, let go, and the page scrolls here and lights its row.</p>
            <ol aria-hidden="true" className="m-0 flex list-none flex-col gap-[5px] p-0">
              {skillGroups.map((g, i) => (
                <li key={g.title} className="flex h-[14px] items-center gap-2">
                  <span className={`w-[92px] whitespace-nowrap font-mono text-[9px] ${i === active.group ? "text-frost" : "text-smoke"}`}>{g.title}</span>
                  <span className="flex flex-1 gap-0.5">
                    {g.items.map((item) => (
                      <span
                        key={item}
                        className={`h-3 w-3 border ${g.daily.includes(item) ? "bg-frost" : ""} ${i === active.group ? "border-frost" : "border-dim/70"}`}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ol className="m-0 mt-8 flex list-none flex-col gap-2 p-0 sm:mt-10">
          {skillGroups.map((g, gi) => {
            const row = TOOLS.slice(offset, offset + g.items.length);
            offset += g.items.length;
            return (
              <li
                key={g.title}
                data-lit={lit === gi}
                className="grid items-center gap-x-2 gap-y-3 border-b border-paper/10 px-2 py-3 transition-colors duration-300 data-[lit=true]:bg-frost/10 data-[lit=true]:shadow-[inset_3px_0_0_rgb(var(--frost))] sm:py-3 lg:grid-cols-[158px_minmax(0,1fr)] lg:px-3"
              >
                <div className="flex flex-col gap-[3px] lg:pr-3">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-frost">{String(gi + 1).padStart(2, "0")}</span>
                  <h3 className="m-0 font-archivo text-[15px] font-extrabold uppercase leading-[1.1] tracking-[0.04em]">{g.title}</h3>
                  <span lang="ar" dir="rtl" className="text-left font-arabic text-[15px] text-smoke">
                    {g.titleAr}
                  </span>
                </div>
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 sm:gap-2">
                  {row.map((tool) => (
                    <StackTile key={tool.name} tool={tool} hot={active.name === tool.name} onHot={() => setActive(tool)} />
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        <p className="m-0 mt-6 flex flex-wrap items-baseline justify-between gap-3 text-[12px] text-dim">
          <span>
            {total} tools across {skillGroups.length} groups
          </span>
          <span lang="ar" className="font-arabic text-[20px] text-smoke">
            والباقي بيتعلّم لما يلزم.
          </span>
        </p>
      </div>
    </section>
  );
};

export default PeriodicStack;
