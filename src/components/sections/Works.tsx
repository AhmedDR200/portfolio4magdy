import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { projects } from "../../constants";
import { styles } from "../../constants/styles";
import { TProject } from "../../types";
import { noteCaseStudy } from "../../utils/achievements";
import { changeHonor } from "../../utils/honor";
import { EASE_OUT_EXPO } from "../../utils/motion";
import SectionHeader from "../atoms/SectionHeader";
import { Bee3aCard } from "./FeaturedProducts";

const linkLabel = (url: string) => {
  if (url.includes("apps.apple.com")) return "Open in App Store";
  if (url.includes("play.google.com")) return "Open in Google Play";
  return "Visit website";
};

const CaseStudyModal = ({
  project,
  onClose,
}: {
  project: TProject | null;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [project, onClose]);

  return createPortal(
    <AnimatePresence>
      {project?.caseStudy && (
        <motion.div
          key="case-study"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            data-lenis-prevent
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] border border-paper/10 bg-graphite p-6 sm:rounded-[28px] sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-volt text-[20px] text-ink"
            >
              ×
            </button>

            <div className="flex items-center gap-4 pr-12">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2.5">
                <img src={project.image} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <h3
                  id="case-study-title"
                  className="m-0 font-display text-[clamp(30px,4vw,44px)] font-normal uppercase leading-none"
                >
                  {project.name}
                </h3>
                <p className="m-0 mt-1.5 text-[13px] uppercase tracking-[0.08em] text-smoke">
                  {project.caseStudy.role} · {project.caseStudy.timeline}
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.caseStudy.impact.map((m) => (
                <div key={m.label} className="rounded-2xl bg-ink px-4 py-4">
                  <div className="font-display text-[34px] leading-none text-volt">{m.value}</div>
                  <div className="mt-1.5 text-[12px] leading-tight text-smoke">{m.label}</div>
                </div>
              ))}
            </div>

            <h4 className="m-0 mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-volt">
              The problem
            </h4>
            <p className="m-0 mt-2 text-[15px] leading-[1.75] text-mist">{project.caseStudy.problem}</p>

            <h4 className="m-0 mt-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-volt">
              What I did
            </h4>
            <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
              {project.caseStudy.approach.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] leading-[1.65] text-mist">
                  <span aria-hidden="true" className="text-volt">
                    →
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <h4 className="m-0 mt-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-volt">
              Stack
            </h4>
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0 text-[12px]">
              {project.caseStudy.stack.map((s) => (
                <li key={s} className="rounded-full border border-paper/20 px-3 py-1.5">
                  {s}
                </li>
              ))}
            </ul>

            <a
              href={project.sourceCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 flex h-[52px] w-fit items-center rounded-full bg-volt px-6 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink"
            >
              {linkLabel(project.sourceCodeLink)} ↗
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Big rows; on desktop a volt card with the project's logo follows the
// pointer over the list.
const ProjectList = ({ onOpenCase }: { onOpenCase: (p: TProject) => void }) => {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [shown, setShown] = useState(0); // last hovered, kept while the card fades out
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28 });
  const springY = useSpring(y, { stiffness: 260, damping: 28 });

  const onMove = (e: React.PointerEvent) => {
    if (!listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - 170);
    y.set(e.clientY - rect.top - 125);
  };

  const preview = projects[shown];

  return (
    <ul
      ref={listRef}
      data-xray="projects"
      onPointerMove={onMove}
      className="relative m-0 mt-16 list-none border-b border-paper/15 p-0"
    >
      {projects.map((project, i) => {
        const dimmed = hovered !== null && hovered !== i;
        const rowClass = `group flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-paper/15 py-6 text-left transition-colors sm:py-[30px] ${
          dimmed ? "text-dim" : "text-paper"
        }`;
        const content = (
          <>
            <motion.span
              animate={{ x: hovered === i && !reduce ? 18 : 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="font-display text-[clamp(36px,6vw,92px)] uppercase leading-none"
            >
              {project.name}
            </motion.span>
            <span
              className={`text-[12px] uppercase tracking-[0.12em] ${hovered === i ? "text-volt" : ""}`}
            >
              {project.category}
              {project.caseStudy ? " · Case study" : " ↗"}
            </span>
          </>
        );
        const handlers = {
          onPointerEnter: (e: React.PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            setHovered(i);
            setShown(i);
          },
          onPointerLeave: () => setHovered(null),
        };
        return (
          <li key={project.name}>
            {project.caseStudy ? (
              <button type="button" onClick={() => onOpenCase(project)} className={rowClass} {...handlers}>
                {content}
              </button>
            ) : (
              <a
                href={project.sourceCodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClass}
                {...handlers}
              >
                {content}
              </a>
            )}
          </li>
        );
      })}

      {!reduce && (
        <motion.li
          aria-hidden="true"
          style={{ x: springX, y: springY }}
          className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
        >
          <motion.div
            initial={false}
            animate={{ scale: hovered !== null ? 1 : 0, rotate: hovered !== null ? 3 : -4 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="flex h-[250px] w-[340px] flex-col gap-3.5 rounded-2xl bg-volt p-6 shadow-[0_30px_80px_-24px_rgba(212,255,58,0.45)]"
          >
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[10px] bg-white p-7">
              <img src={preview.image} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            {preview.metric && (
              <p className="m-0 flex justify-between text-[12px] font-semibold uppercase tracking-[0.1em] text-ink">
                <span>{preview.metric.value}</span>
                <span>{preview.metric.label}</span>
              </p>
            )}
          </motion.div>
        </motion.li>
      )}
    </ul>
  );
};

const Works = () => {
  const [activeProject, setActiveProject] = useState<TProject | null>(null);
  const closeCaseStudy = useCallback(() => setActiveProject(null), []);
  const openCaseStudy = useCallback((project: TProject) => {
    setActiveProject(project);
    noteCaseStudy(project.name);
    changeHonor(1, "case-study");
  }, []);

  return (
    <section id="work" className="py-20 sm:py-28">
      <div className={styles.container}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader index="04" label="Selected work" labelAr="أعمالي" title="Selected work" />
          <p className="m-0 text-[12px] uppercase tracking-[0.14em] text-smoke">Client · Focus</p>
        </div>

        <Bee3aCard />
        <ProjectList onOpenCase={openCaseStudy} />
      </div>

      <CaseStudyModal project={activeProject} onClose={closeCaseStudy} />
    </section>
  );
};

export default Works;
