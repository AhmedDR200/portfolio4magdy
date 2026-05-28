import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { experiences } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { Header } from "../atoms/Header";
import { TExperience } from "../../types";
import { config } from "../../constants/config";

const ExperienceCard: React.FC<TExperience> = (experience) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "rgb(var(--color-tertiary))",
        color: "rgb(var(--color-fg))",
        border: "1px solid rgba(0, 255, 136, 0.15)",
      }}
      contentArrowStyle={{
        borderRight: "7px solid rgb(var(--color-tertiary))",
      }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={experience.icon}
            alt={experience.companyName}
            className="h-[60%] w-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-[24px] font-bold text-white">{experience.title}</h3>
        {experience.companyUrl ? (
          <a
            href={experience.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary text-[16px] font-semibold hover:text-white hover:underline"
            style={{ margin: 0 }}
          >
            {experience.companyName} ↗
          </a>
        ) : (
          <p
            className="text-secondary text-[16px] font-semibold"
            style={{ margin: 0 }}
          >
            {experience.companyName}
          </p>
        )}
      </div>

      <ul className="ml-5 mt-5 list-disc space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 pl-1 text-[14px] tracking-wider"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <Header useMotion={true} {...config.sections.experience} />

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "experience");
