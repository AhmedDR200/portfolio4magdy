import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, FileText, TrendingUp, X } from "lucide-react";

import { SectionWrapper } from "../../hoc";
import { projects } from "../../constants";
import { fadeIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { TProject } from "../../types";

const linkMeta = (url: string): { icon: string; label: string } => {
  if (url.includes("apps.apple.com")) {
    return {
      icon: "https://cdn.simpleicons.org/appstore/white",
      label: "Open in App Store",
    };
  }
  if (url.includes("play.google.com")) {
    return {
      icon: "https://cdn.simpleicons.org/googleplay/white",
      label: "Open in Google Play",
    };
  }
  if (url.includes("github.com")) {
    return {
      icon: "https://cdn.simpleicons.org/github/white",
      label: "View on GitHub",
    };
  }
  return {
    icon: "https://cdn.simpleicons.org/googlechrome/white",
    label: "Visit website",
  };
};

const ProjectCard: React.FC<
  { index: number; onOpenCase: (p: TProject) => void } & TProject
> = (project) => {
  const {
    index,
    name,
    description,
    tags,
    image,
    sourceCodeLink,
    metric,
    caseStudy,
    onOpenCase,
  } = project;

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="w-full sm:w-[320px]"
    >
      <Tilt
        glareEnable
        tiltEnable
        tiltMaxAngleX={30}
        tiltMaxAngleY={30}
        glareColor="#00FF88"
        style={{ width: "100%" }}
      >
        <div className="bg-tertiary flex h-[520px] w-full flex-col rounded-2xl p-5">
          <div className="relative h-[200px] w-full shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white p-8">
              <img
                src={image}
                alt={name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="card-img_hover absolute inset-0 m-3 flex justify-end">
              {(() => {
                const { icon, label } = linkMeta(sourceCodeLink);
                return (
                  <button
                    type="button"
                    onClick={() => window.open(sourceCodeLink, "_blank")}
                    aria-label={label}
                    title={label}
                    className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                  >
                    <img
                      src={icon}
                      alt=""
                      className="h-1/2 w-1/2 object-contain"
                    />
                  </button>
                );
              })()}
            </div>
          </div>

          {metric && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 px-3 py-2">
              <TrendingUp className="h-4 w-4 shrink-0 text-[#00FF88]" />
              <span className="text-[16px] font-extrabold text-[#00FF88]">
                {metric.value}
              </span>
              <span className="text-secondary text-[12px] leading-tight">
                {metric.label}
              </span>
            </div>
          )}

          <div className="mt-3 flex-1">
            <h3 className="line-clamp-2 text-[20px] font-bold text-white sm:text-[22px]">
              {name}
            </h3>
            <p className="text-secondary mt-2 line-clamp-3 text-[14px] leading-[22px]">
              {description}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[13px] ${tag.color}`}>
                #{tag.name}
              </p>
            ))}
          </div>

          {caseStudy && (
            <button
              type="button"
              onClick={() => onOpenCase(project)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black-100 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:border-[#00FF88]/50 hover:text-[#00FF88]"
            >
              <FileText className="h-4 w-4" />
              View case study
            </button>
          )}
        </div>
      </Tilt>
    </motion.div>
  );
};

const CaseStudyModal: React.FC<{
  project: TProject | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && project.caseStudy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-tertiary relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 p-6 sm:rounded-3xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="bg-black-100 absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-[#00FF88]/50 hover:text-[#00FF88]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2">
                <img
                  src={project.image}
                  alt={project.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-[22px] font-bold text-white sm:text-[26px]">
                  {project.name}
                </h3>
                <p className="text-secondary text-[13px]">
                  {project.caseStudy.role} · {project.caseStudy.timeline}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.caseStudy.impact.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-[#00FF88]/25 bg-[#00FF88]/10 px-3 py-3 text-center"
                >
                  <div className="text-[20px] font-extrabold text-[#00FF88] sm:text-[24px]">
                    {m.value}
                  </div>
                  <div className="text-secondary mt-1 text-[11px] leading-tight">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <h4 className="text-secondary text-[12px] font-semibold uppercase tracking-wider">
                The problem
              </h4>
              <p className="mt-2 text-[15px] leading-[26px] text-white">
                {project.caseStudy.problem}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-secondary text-[12px] font-semibold uppercase tracking-wider">
                What I did
              </h4>
              <ul className="mt-3 flex flex-col gap-2">
                {project.caseStudy.approach.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-[14px] leading-[24px] text-white"
                  >
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#00FF88]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-secondary text-[12px] font-semibold uppercase tracking-wider">
                Stack
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.caseStudy.stack.map((s) => (
                  <span
                    key={s}
                    className="bg-black-100 rounded-full border border-white/10 px-3 py-1 text-[12px] font-medium text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={project.sourceCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:scale-105 hover:border-[#00FF88]"
            >
              {linkMeta(project.sourceCodeLink).label}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Works = () => {
  const [activeProject, setActiveProject] = useState<TProject | null>(null);

  return (
    <>
      <Header useMotion={true} {...config.sections.works} />

      <div className="flex w-full">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="text-secondary mt-3 max-w-3xl text-[17px] leading-[30px]"
        >
          {config.sections.works.content}
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            onOpenCase={setActiveProject}
            {...project}
          />
        ))}
      </div>

      <CaseStudyModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
};

export default SectionWrapper(Works, "work");
