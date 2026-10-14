import { useEffect, useState } from "react";

import { skillGroups } from "../../constants";
import { styles } from "../../constants/styles";
import SectionHeader from "../atoms/SectionHeader";
import KeyCap from "../atoms/KeyCap";
import { openSatchel } from "../layout/Satchel";
import { SKILL_HIGHLIGHT_EVENT } from "../layout/SkillWheel";

const total = skillGroups.reduce((n, group) => n + group.items.length, 0);

// The stack as a numbered index: one row per group, daily tools in frost.
// Hovering a row fills it with frost, like the menu links; so does picking
// its group on the skill wheel, for a moment.
const Skills = () => {
  const [lit, setLit] = useState<number | null>(null);

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

  return (
    <section id="skills" aria-label="Skills" className="py-20 sm:py-28">
      <div className={styles.container}>
        <div className="flex flex-col items-center gap-6">
          <SectionHeader index="03" label="Skills" labelAr="مهاراتي" title="The Stack" />
          <p className="m-0 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[12px] text-smoke">
            <span>
              <b className="text-frost">Highlighted</b> = daily driver
            </span>
            <span>Grey = used in production</span>
          </p>
          <button
            type="button"
            onClick={openSatchel}
            className="group flex items-center gap-3 font-fellsc text-[16px] tracking-[0.12em] text-paper transition-colors hover:text-frost"
          >
            <KeyCap>I</KeyCap>
            What I carry · open the satchel
            <span lang="ar" className="font-ruqaa text-[18px] tracking-normal text-smoke">
              الشنطة
            </span>
          </button>
        </div>

        <ol className="m-0 mt-12 list-none border-t border-paper/15 p-0">
          {skillGroups.map((group, i) => (
            <li
              key={group.title}
              data-lit={lit === i}
              className="group grid grid-cols-[44px_1fr] items-baseline gap-x-4 gap-y-2 rounded-[14px] border-b border-paper/15 px-3 py-5 transition-colors duration-200 hover:border-transparent hover:bg-frost hover:text-ink data-[lit=true]:border-transparent data-[lit=true]:bg-frost data-[lit=true]:text-ink sm:px-5 lg:min-h-[80px] lg:grid-cols-[70px_330px_1fr_90px] lg:items-center lg:gap-5 lg:py-4"
            >
              <span className="text-[13px] text-smoke group-hover:text-ink group-data-[lit=true]:text-ink">
                ({String(i + 1).padStart(2, "0")})
              </span>
              <h3 className="m-0 flex flex-wrap items-baseline gap-x-3 font-normal">
                <span className="font-display text-[30px] uppercase leading-none sm:text-[36px]">{group.title}</span>
                <span
                  lang="ar"
                  className="font-arabic text-[18px] text-smoke group-hover:text-ink group-data-[lit=true]:text-ink"
                >
                  {group.titleAr}
                </span>
              </h3>
              <ul className="col-start-2 m-0 flex list-none flex-wrap p-0 text-[15px] leading-[1.6] text-mist group-hover:text-ink group-data-[lit=true]:text-ink lg:col-start-auto">
                {group.items.map((item, j) => {
                  const daily = group.daily.includes(item);
                  return (
                    <li key={item} className="flex">
                      <span
                        className={
                          daily
                            ? "font-bold text-frost group-hover:text-ink group-data-[lit=true]:text-ink group-hover:underline group-data-[lit=true]:underline group-hover:underline-offset-4 group-data-[lit=true]:underline-offset-4"
                            : ""
                        }
                      >
                        {item}
                        {daily && <span className="sr-only"> (daily)</span>}
                      </span>
                      {/* The slash trails its item, so a wrapped line starts with a name. */}
                      {j < group.items.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="mx-1.5 text-dim group-hover:text-ink/40 group-data-[lit=true]:text-ink/40"
                        >
                          /
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <span className="hidden text-right text-[12px] text-smoke group-hover:text-ink group-data-[lit=true]:text-ink lg:block">
                {group.items.length} tools
              </span>
            </li>
          ))}
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

export default Skills;
