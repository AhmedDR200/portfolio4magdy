import type {
  TNavLink,
  TService,
  TTechnology,
  TExperience,
  TTestimonial,
  TProject,
} from "../types";

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  nodejs,
  mongodb,
  git,
  docker,
  madkhol,
  basicsengage,
  appgain,
  connectgain,
  ikhair,
  marrakesh,
  peakpharma,
  zhafraAttendees,
  alzhafraAdmin,
} from "../assets";

export const navLinks: TNavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: TService[] = [
  {
    title: "Backend Engineer",
    icon: backend,
  },
  {
    title: "System Design",
    icon: web,
  },
  {
    title: "Microservices Architect",
    icon: creator,
  },
  {
    title: "Real-time Systems",
    icon: mobile,
  },
];

const technologies: TTechnology[] = [
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Docker",
    icon: docker,
  },
  {
    name: "git",
    icon: git,
  },
];

const experiences: TExperience[] = [
  {
    title: "Backend Engineer",
    companyName: "Madkhol",
    companyUrl: "https://madkhol.com",
    icon: madkhol,
    iconBg: "#ffffff",
    date: "May 2025 - Present",
    points: [
      "Built and maintained backend services for an investment & robo-advisory platform using a microservices architecture.",
      "Implemented portfolio management, investment strategies, and financial analytics features.",
      "Improved API performance by 30% through query optimization and caching.",
      "Fixed 30+ critical bugs, reducing transaction errors by 40%.",
      "Maintained internal APIs and service-to-service communication across the platform.",
      "Stack: Node.js, NestJS, Express, Python, FastAPI, MySQL, MongoDB, Redis, Docker, Kubernetes, RabbitMQ, GitHub Actions.",
    ],
  },
  {
    title: "Backend Engineer",
    companyName: "BasicsEngage",
    companyUrl: "https://www.basicsengage.com",
    icon: basicsengage,
    iconBg: "#ffffff",
    date: "Oct 2024 - May 2025",
    points: [
      "Integrated GPT-3.5 Turbo for AI-powered email generation, serving 1000+ users.",
      "Built Zapier integrations supporting 150+ monthly automation workflows.",
      "Designed backend APIs powering AI-driven and automation features.",
      "Stack: Node.js, Express.js, MongoDB, Redis, Docker, AWS S3, AWS SES, WebSocket, OpenAI API, Zapier.",
    ],
  },
  {
    title: "Backend Engineer",
    companyName: "Appgain.io",
    companyUrl: "https://appgain.io",
    icon: appgain,
    iconBg: "#ffffff",
    date: "Jul 2023 - Oct 2024",
    points: [
      "Optimized the Appgain Notify Server, achieving 50% faster response times.",
      "Developed backend features for the Toki social app: auth, payments, virtual gifts, and real-time communication via WebSockets.",
      "Built an AWS Uploader WebSDK for secure S3 uploads with retries and progress tracking.",
      "Implemented backend systems for Peak (pharma e-commerce SaaS): auth, orders, invoices, and analytics.",
      "Designed secure authentication for the Marraksh e-commerce SaaS.",
      "Stack: JavaScript, Node.js, Express.js, Python, Flask, MongoDB, Redis, Prometheus, Docker, AWS.",
    ],
  },
];

const testimonials: TTestimonial[] = [
  {
    testimonial:
      "Ahmed shipped backend systems that made our APIs noticeably faster — the kind of engineer who fixes the root cause, not the symptom.",
    name: "Sara Lee",
    designation: "CTO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "Reliable, fast, and great at owning hard problems end-to-end. Our real-time features wouldn't ship without him.",
    name: "Chris Brown",
    designation: "Engineering Lead",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "Ahmed cut our notification server latency in half and kept production stable through a major migration.",
    name: "Lisa Wang",
    designation: "VP Engineering",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects: TProject[] = [
  {
    name: "Madkhol — Investment App",
    description:
      "iOS investment & robo-advisory app. Built backend microservices for portfolio management, investment strategies, and financial analytics. Improved API performance by 30% and reduced transaction errors by 40%.",
    tags: [
      { name: "nestjs", color: "blue-text-gradient" },
      { name: "microservices", color: "green-text-gradient" },
      { name: "ios", color: "pink-text-gradient" },
    ],
    image: madkhol,
    sourceCodeLink:
      "https://apps.apple.com/eg/app/madkhol-%D9%85%D8%AF%D8%AE%D9%88%D9%84/id6476918304",
    metric: { value: "30%", label: "faster API responses" },
    caseStudy: {
      role: "Backend Engineer",
      timeline: "May 2025 – Present",
      problem:
        "An investment & robo-advisory platform needed reliable portfolio management and financial analytics, but a growing monolith made changes risky and APIs were getting slow under load.",
      approach: [
        "Decomposed the backend into microservices for portfolios, strategies and analytics with clear service-to-service contracts.",
        "Optimized hot query paths and added Redis caching for the heaviest read endpoints.",
        "Hardened transaction flows and added regression coverage to stop recurring financial errors.",
        "Containerized services and ran them on Kubernetes with RabbitMQ for async work.",
      ],
      stack: [
        "Node.js",
        "NestJS",
        "Python",
        "FastAPI",
        "MySQL",
        "MongoDB",
        "Redis",
        "Docker",
        "Kubernetes",
        "RabbitMQ",
      ],
      impact: [
        { value: "30%", label: "faster API responses" },
        { value: "40%", label: "fewer transaction errors" },
        { value: "30+", label: "critical bugs fixed" },
      ],
    },
  },
  {
    name: "BasicsEngage Platform",
    description:
      "AI-powered email automation platform integrating GPT-3.5 Turbo for 1000+ users and Zapier workflows supporting 150+ monthly automations across customer tools.",
    tags: [
      { name: "openai", color: "blue-text-gradient" },
      { name: "zapier", color: "green-text-gradient" },
      { name: "nodejs", color: "pink-text-gradient" },
    ],
    image: basicsengage,
    sourceCodeLink: "https://www.basicsengage.com",
    metric: { value: "1000+", label: "users on AI email gen" },
    caseStudy: {
      role: "Backend Engineer",
      timeline: "Oct 2024 – May 2025",
      problem:
        "The product needed AI-assisted email generation and deep automation integrations, without blocking the API on slow third-party calls.",
      approach: [
        "Integrated GPT-3.5 Turbo behind a queue so generation runs async with retries and rate limiting.",
        "Built Zapier integrations to support a large catalog of automation workflows.",
        "Designed backend APIs that cleanly separate AI features from core CRUD.",
        "Used Redis and S3 for caching, queueing and asset storage.",
      ],
      stack: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Redis",
        "OpenAI API",
        "Zapier",
        "AWS S3",
        "WebSocket",
      ],
      impact: [
        { value: "1000+", label: "users served" },
        { value: "150+", label: "monthly automations" },
        { value: "Async", label: "AI pipeline, no API blocking" },
      ],
    },
  },
  {
    name: "Appgain Notify Server",
    description:
      "Push notification & messaging server powering customer engagement across Appgain apps. Optimized for 50% faster response times and reliable real-time delivery.",
    tags: [
      { name: "nodejs", color: "blue-text-gradient" },
      { name: "websockets", color: "green-text-gradient" },
      { name: "redis", color: "pink-text-gradient" },
    ],
    image: appgain,
    sourceCodeLink: "https://appgain.io",
    metric: { value: "50%", label: "faster notifications" },
    caseStudy: {
      role: "Backend Engineer",
      timeline: "Jul 2023 – Oct 2024",
      problem:
        "The push & messaging server powering engagement across Appgain apps was a latency bottleneck and needed to deliver real-time messages reliably at scale.",
      approach: [
        "Profiled and optimized the notify server's hot paths to halve response times.",
        "Built real-time delivery over WebSockets for the Toki social app (auth, payments, virtual gifts).",
        "Shipped an AWS Uploader WebSDK for secure S3 uploads with retries and progress tracking.",
        "Added Prometheus metrics for visibility into delivery and error rates.",
      ],
      stack: [
        "Node.js",
        "Express.js",
        "Python",
        "Flask",
        "MongoDB",
        "Redis",
        "WebSockets",
        "Prometheus",
        "AWS",
      ],
      impact: [
        { value: "50%", label: "faster response times" },
        { value: "Real-time", label: "reliable delivery" },
        { value: "Secure", label: "resumable S3 uploads" },
      ],
    },
  },
  {
    name: "ConnectGain",
    description:
      "Customer engagement Android app on Google Play. Backend services for authentication, user data, and notification flows powered by the Appgain stack.",
    tags: [
      { name: "express", color: "blue-text-gradient" },
      { name: "mongodb", color: "green-text-gradient" },
      { name: "android", color: "pink-text-gradient" },
    ],
    image: connectgain,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.connectgain",
    metric: { value: "Real-time", label: "notification flows" },
  },
  {
    name: "Peak Pharma",
    description:
      "Pharma e-commerce SaaS for B2B ordering. Built backend systems for auth, orders, invoices, and analytics — production-ready Android app.",
    tags: [
      { name: "express", color: "blue-text-gradient" },
      { name: "mongodb", color: "green-text-gradient" },
      { name: "saas", color: "pink-text-gradient" },
    ],
    image: peakpharma,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.peakPharma",
    metric: { value: "B2B", label: "orders, invoices & analytics" },
  },
  {
    name: "iKhair (Quantatil)",
    description:
      "Mobile app powered by Appgain backend infrastructure. Authentication, real-time messaging, and notification delivery for end users.",
    tags: [
      { name: "nodejs", color: "blue-text-gradient" },
      { name: "websockets", color: "green-text-gradient" },
      { name: "android", color: "pink-text-gradient" },
    ],
    image: ikhair,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.quantatil.ikhar",
    metric: { value: "Real-time", label: "messaging & auth" },
  },
  {
    name: "Alzhafra Admin",
    description:
      "Admin Android app for the Alzhafra platform. Backend services for admin auth, content management, and analytics dashboards.",
    tags: [
      { name: "express", color: "blue-text-gradient" },
      { name: "mongodb", color: "green-text-gradient" },
      { name: "admin", color: "pink-text-gradient" },
    ],
    image: alzhafraAdmin,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.alzhafra_admin_app",
    metric: { value: "Admin", label: "content & analytics" },
  },
  {
    name: "Zhafra Attendees",
    description:
      "Android app for event attendees on the Zhafra platform. Backend services for attendee auth, check-in flows, and event data.",
    tags: [
      { name: "express", color: "blue-text-gradient" },
      { name: "mongodb", color: "green-text-gradient" },
      { name: "events", color: "pink-text-gradient" },
    ],
    image: zhafraAttendees,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.zhafra_attendees_app",
    metric: { value: "Event", label: "check-in & attendee data" },
  },
  {
    name: "Marrakesh Consumer",
    description:
      "Consumer-facing Marraksh e-commerce SaaS app. Designed secure authentication and customer flows on the Appgain backend.",
    tags: [
      { name: "express", color: "blue-text-gradient" },
      { name: "auth", color: "green-text-gradient" },
      { name: "ecommerce", color: "pink-text-gradient" },
    ],
    image: marrakesh,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.marrakeshconsumer",
    metric: { value: "Secure", label: "auth & checkout flows" },
  },
];

type TSkillCategory = {
  title: string;
  items: string[];
};

const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;
const simpleIcon = (slug: string, color = "white") =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

export const skillIcons: Record<string, string> = {
  JavaScript: devicon("javascript/javascript-original.svg"),
  TypeScript: devicon("typescript/typescript-original.svg"),
  Python: devicon("python/python-original.svg"),
  "C#": devicon("csharp/csharp-original.svg"),
  "Node.js": devicon("nodejs/nodejs-original.svg"),
  "Bun.js": devicon("bun/bun-original.svg"),
  "Express.js": simpleIcon("express"),
  NestJS: devicon("nestjs/nestjs-original.svg"),
  FastAPI: devicon("fastapi/fastapi-original.svg"),
  Flask: simpleIcon("flask"),
  Django: devicon("django/django-plain.svg"),
  MongoDB: devicon("mongodb/mongodb-original.svg"),
  PostgreSQL: devicon("postgresql/postgresql-original.svg"),
  MySQL: devicon("mysql/mysql-original.svg"),
  Mongoose: devicon("mongoose/mongoose-original.svg"),
  TypeORM: simpleIcon("typeorm"),
  Prisma: simpleIcon("prisma"),
  Sequelize: devicon("sequelize/sequelize-original.svg"),
  Git: devicon("git/git-original.svg"),
  GitHub: simpleIcon("github"),
  GitLab: devicon("gitlab/gitlab-original.svg"),
  Bitbucket: devicon("bitbucket/bitbucket-original.svg"),
  Docker: devicon("docker/docker-original.svg"),
  Linux: devicon("linux/linux-original.svg"),
  Redis: devicon("redis/redis-original.svg"),
  AWS: devicon("amazonwebservices/amazonwebservices-original-wordmark.svg"),
  Bash: devicon("bash/bash-original.svg"),
  "Socket.io": simpleIcon("socketdotio"),
  Pusher: simpleIcon("pusher"),
  Postman: devicon("postman/postman-original.svg"),
  Swagger: devicon("swagger/swagger-original.svg"),
  GraphQL: devicon("graphql/graphql-plain.svg"),
};

const skillCategories: TSkillCategory[] = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "C#"],
  },
  {
    title: "Frameworks",
    items: [
      "Node.js",
      "Bun.js",
      "Express.js",
      "NestJS",
      "FastAPI",
      "Flask",
      "Django",
    ],
  },
  {
    title: "Databases & ORMs",
    items: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Mongoose",
      "TypeORM",
      "Prisma",
      "Sequelize",
    ],
  },
  {
    title: "DevOps",
    items: [
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Docker",
      "Linux",
      "Redis",
      "AWS",
      "Bash",
    ],
  },
  {
    title: "Real-time",
    items: ["Socket.io", "Pusher"],
  },
  {
    title: "Tools",
    items: ["Postman", "Swagger", "GraphQL"],
  },
];

export {
  services,
  technologies,
  experiences,
  testimonials,
  projects,
  skillCategories,
};
