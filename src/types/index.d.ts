import type { IconName } from "../components/atoms/Icon";

export type TNavLink = {
  id: string;
  title: string;
};

export type TMetric = {
  value: string;
  label: string;
};

export type TExperience = {
  title: string;
  companyName: string;
  companyUrl?: string;
  date: string;
  /** Big label on the timeline: "Now" for the current role, else the start year. */
  marker: string;
  summary: string;
  points: string[];
};

export type TCaseStudy = {
  role: string;
  timeline: string;
  problem: string;
  approach: string[];
  stack: string[];
  impact: TMetric[];
};

export type TProject = {
  name: string;
  /** Short "Client · Focus" label shown on the work list. */
  category: string;
  description: string;
  tags: string[];
  image: string;
  sourceCodeLink: string;
  metric?: TMetric;
  caseStudy?: TCaseStudy;
};

export type TImpactStat = {
  icon: IconName;
  value: string;
  label: string;
  labelAr: string;
};

export type TService = {
  icon: IconName;
  title: string;
  description: string;
  details: string[];
  stack: string[];
};

export type TSkillGroup = {
  title: string;
  titleAr: string;
  items: string[];
  /** The ones used every day; shown in volt. */
  daily: string[];
};

export type TPrinciple = {
  ar: string;
  en: string;
};
