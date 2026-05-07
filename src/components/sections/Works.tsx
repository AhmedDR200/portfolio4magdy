import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

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

const ProjectCard: React.FC<{ index: number } & TProject> = ({
  index,
  name,
  description,
  tags,
  image,
  sourceCodeLink,
}) => {
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
        <div className="bg-tertiary flex h-[480px] w-full flex-col rounded-2xl p-5">
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
          <div className="mt-5 flex-1">
            <h3 className="line-clamp-2 min-h-[58px] text-[20px] font-bold text-white sm:text-[22px]">
              {name}
            </h3>
            <p className="text-secondary mt-2 line-clamp-4 text-[14px] leading-[22px]">
              {description}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[13px] ${tag.color}`}>
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
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
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "work");
