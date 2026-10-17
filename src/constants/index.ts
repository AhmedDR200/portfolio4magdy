import type {
  TExperience,
  TImpactStat,
  TNavLink,
  TPrinciple,
  TProject,
  TService,
  TSkillGroup,
} from "../types";

import {
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
  { id: "work", title: "Work" },
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "contact", title: "Contact" },
];

export const heroRoles = ["Systems Designer", "API Architect", "Real-time Engineer"];

export const stackTicker = [
  "Node.js",
  "NestJS",
  "Python",
  "FastAPI",
  "Redis",
  "RabbitMQ",
  "Docker",
  "Kubernetes",
  "AWS",
  "WebSockets",
];

export const impactStats: TImpactStat[] = [
  {
    icon: "crowd",
    value: "15K+",
    label: "Users served by AI-powered features I built",
    labelAr: "١٥ ألف مستخدم",
  },
  {
    icon: "bell",
    value: "50%",
    label: "Faster responses from a push notification server",
    labelAr: "إشعارات أسرع",
  },
  {
    icon: "stopwatch",
    value: "30%",
    label: "Faster APIs through caching and query optimization",
    labelAr: "واجهات برمجة أسرع",
  },
  {
    icon: "loop",
    value: "150+",
    label: "Automation workflows running every month",
    labelAr: "أتمتة كل شهر",
  },
];

export const services: TService[] = [
  {
    icon: "gear",
    title: "Backend APIs & services",
    poster: "Backend APIs",
    description:
      "REST and internal APIs in Node.js, NestJS, Express and FastAPI — designed for clear contracts, caching and safe change.",
    details: [
      "Improved API performance by 30% through query optimization and caching.",
      "Fixed 30+ critical bugs, reducing transaction errors by 40%.",
      "Maintained internal APIs and service-to-service communication.",
    ],
    stack: ["Node.js", "NestJS", "Express", "FastAPI", "MySQL", "MongoDB", "Redis"],
  },
  {
    icon: "divider",
    title: "System design & microservices",
    poster: "System Design",
    stamp: "In demand",
    description:
      "Service boundaries, queues and contracts across microservice platforms — RabbitMQ, Redis, Docker and Kubernetes.",
    details: [
      "Split an investment platform into services for portfolios, strategies and analytics.",
      "Moved slow work onto queues so the API never waits on it.",
      "Containerized services and ran them on Kubernetes with RabbitMQ.",
    ],
    stack: ["RabbitMQ", "Redis", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    icon: "bolt",
    title: "Real-time systems",
    poster: "Real-Time Systems",
    description:
      "WebSockets, pub/sub and push notifications that arrive fast and reliably — like the Appgain Notify Server.",
    details: [
      "Made the Appgain Notify Server 50% faster.",
      "Built real-time auth, payments and virtual gifts for the Toki social app.",
      "Shipped an AWS S3 uploader SDK with retries and progress tracking.",
    ],
    stack: ["WebSockets", "Socket.io", "Redis pub/sub", "AWS S3", "Prometheus"],
  },
];

// The Skills section, grouped the way a request travels. "daily" is what's
// used every day; everything else has shipped to production at least once.
export const skillGroups: TSkillGroup[] = [
  {
    title: "Languages",
    titleAr: "لغات",
    items: ["TypeScript", "JavaScript", "Python", "C#"],
    daily: ["TypeScript", "JavaScript"],
  },
  {
    title: "Backend",
    titleAr: "باك إند",
    items: ["Node.js", "NestJS", "Express", "FastAPI", "Bun", "Flask", "Django"],
    daily: ["Node.js", "NestJS", "Express"],
  },
  {
    title: "Data",
    titleAr: "داتا",
    items: ["MongoDB", "MySQL", "Redis", "PostgreSQL", "Prisma", "TypeORM", "Mongoose", "Sequelize"],
    daily: ["MongoDB", "MySQL", "Redis"],
  },
  {
    title: "Real-time",
    titleAr: "ريل تايم",
    items: ["WebSockets", "Socket.io", "RabbitMQ", "Redis pub/sub", "Pusher"],
    daily: ["WebSockets", "Socket.io"],
  },
  {
    title: "Cloud & DevOps",
    titleAr: "سحابة",
    items: ["Docker", "Kubernetes", "AWS", "Cloudflare Workers", "GitHub Actions", "Linux", "Prometheus"],
    daily: ["Docker"],
  },
  {
    title: "AI & automation",
    titleAr: "ذكاء اصطناعي",
    items: ["GPT", "Gemini", "Workers AI", "Zapier"],
    daily: [],
  },
  {
    title: "Tools",
    titleAr: "أدوات",
    items: ["Git", "Postman", "Swagger", "GraphQL", "Bash"],
    daily: ["Git"],
  },
  {
    title: "Beyond backend",
    titleAr: "برّه الباك إند",
    items: ["React", "PWA", "Remotion"],
    daily: [],
  },
];

export const principles: TPrinciple[] = [
  { ar: "خلّيها تشتغل، وبعدين خلّيها أسرع.", en: "Make it work, then make it fast." },
  {
    ar: "اشتغل في صمت، وخلّي السيرفر يتكلّم.",
    en: "Work quietly; let the server do the talking.",
  },
  { ar: "مفيش مشكلة ملهاش حل.", en: "Every problem has a fix." },
  { ar: "عَدِّي حُدودَك.", en: "Go beyond your limits." },
];

export const experiences: TExperience[] = [
  {
    title: "Backend Engineer",
    companyName: "Madkhol Capital",
    companyUrl: "https://madkhol.com",
    date: "May 2025 – Present",
    marker: "Now",
    paidIn: "APIs 30% faster",
    summary:
      "Backend services for an investment and robo-advisory platform built on microservices: portfolio management, strategies and analytics. APIs 30% faster; transaction errors down 40%.",
    points: [
      "Built and maintained backend services for an investment & robo-advisory platform using a microservices architecture.",
      "Implemented portfolio management, investment strategies, and financial analytics features.",
      "Improved API performance by 30% through query optimization and caching.",
      "Fixed 30+ critical bugs, reducing transaction errors by 40%.",
      "Maintained internal APIs and service-to-service communication across the platform.",
    ],
  },
  {
    title: "Backend Engineer",
    companyName: "BasicsEngage",
    companyUrl: "https://www.basicsengage.com",
    date: "Oct 2024 – May 2025",
    marker: "2024",
    paidIn: "15k+ users",
    summary:
      "GPT-3.5 Turbo email generation for 15k+ users, Zapier integrations powering 150+ automations a month, and the APIs behind those AI and automation features.",
    points: [
      "Integrated GPT-3.5 Turbo for AI-powered email generation, serving 15k+ users.",
      "Built Zapier integrations supporting 150+ monthly automation workflows.",
      "Designed backend APIs powering AI-driven and automation features.",
    ],
  },
  {
    title: "Backend Engineer",
    companyName: "Appgain.io",
    companyUrl: "https://appgain.io",
    date: "Jul 2023 – Oct 2024",
    marker: "2023",
    paidIn: "50% faster",
    summary:
      "Made the Notify Server 50% faster; built auth, payments and real-time features for the Toki social app, an AWS S3 uploader SDK, and the Peak and Marraksh SaaS backends.",
    points: [
      "Optimized the Appgain Notify Server, achieving 50% faster response times.",
      "Developed backend features for the Toki social app: auth, payments, virtual gifts, and real-time communication via WebSockets.",
      "Built an AWS Uploader WebSDK for secure S3 uploads with retries and progress tracking.",
      "Implemented backend systems for Peak (pharma e-commerce SaaS): auth, orders, invoices, and analytics.",
      "Designed secure authentication for the Marraksh e-commerce SaaS.",
    ],
  },
];

export const projects: TProject[] = [
  {
    name: "Madkhol — Investment App",
    category: "Fintech · iOS",
    description:
      "iOS investment & robo-advisory app. Built backend microservices for portfolio management, investment strategies, and financial analytics. Improved API performance by 30% and reduced transaction errors by 40%.",
    tags: ["nestjs", "microservices", "ios"],
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
    category: "AI · Automation",
    description:
      "AI-powered email automation platform integrating GPT-3.5 Turbo for 15k+ users and Zapier workflows supporting 150+ monthly automations across customer tools.",
    tags: ["openai", "zapier", "nodejs"],
    image: basicsengage,
    sourceCodeLink: "https://www.basicsengage.com",
    metric: { value: "15k+", label: "users on AI email gen" },
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
        { value: "15k+", label: "users served" },
        { value: "150+", label: "monthly automations" },
        { value: "Async", label: "AI pipeline, no API blocking" },
      ],
    },
  },
  {
    name: "Appgain Notify Server",
    category: "Real-time · Messaging",
    description:
      "Push notification & messaging server powering customer engagement across Appgain apps. Optimized for 50% faster response times and reliable real-time delivery.",
    tags: ["nodejs", "websockets", "redis"],
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
    name: "Peak Pharma",
    category: "B2B SaaS · Android",
    description:
      "Pharma e-commerce SaaS for B2B ordering. Built backend systems for auth, orders, invoices, and analytics — production-ready Android app.",
    tags: ["express", "mongodb", "saas"],
    image: peakpharma,
    sourceCodeLink: "https://play.google.com/store/apps/details?id=com.appgain.peakPharma",
    metric: { value: "B2B", label: "orders, invoices & analytics" },
  },
  {
    name: "ConnectGain",
    category: "Engagement · Android",
    description:
      "Customer engagement Android app on Google Play. Backend services for authentication, user data, and notification flows powered by the Appgain stack.",
    tags: ["express", "mongodb", "android"],
    image: connectgain,
    sourceCodeLink: "https://play.google.com/store/apps/details?id=com.appgain.connectgain",
    metric: { value: "Real-time", label: "notification flows" },
  },
  {
    name: "iKhair (Quantatil)",
    category: "Messaging · Android",
    description:
      "Mobile app powered by Appgain backend infrastructure. Authentication, real-time messaging, and notification delivery for end users.",
    tags: ["nodejs", "websockets", "android"],
    image: ikhair,
    sourceCodeLink: "https://play.google.com/store/apps/details?id=com.quantatil.ikhar",
    metric: { value: "Real-time", label: "messaging & auth" },
  },
  {
    name: "Alzhafra Admin",
    category: "Admin · Android",
    description:
      "Admin Android app for the Alzhafra platform. Backend services for admin auth, content management, and analytics dashboards.",
    tags: ["express", "mongodb", "admin"],
    image: alzhafraAdmin,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.alzhafra_admin_app",
    metric: { value: "Admin", label: "content & analytics" },
  },
  {
    name: "Zhafra Attendees",
    category: "Events · Android",
    description:
      "Android app for event attendees on the Zhafra platform. Backend services for attendee auth, check-in flows, and event data.",
    tags: ["express", "mongodb", "events"],
    image: zhafraAttendees,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.zhafra_attendees_app",
    metric: { value: "Event", label: "check-in & attendee data" },
  },
  {
    name: "Marrakesh Consumer",
    category: "E-commerce · Android",
    description:
      "Consumer-facing Marraksh e-commerce SaaS app. Designed secure authentication and customer flows on the Appgain backend.",
    tags: ["express", "auth", "ecommerce"],
    image: marrakesh,
    sourceCodeLink:
      "https://play.google.com/store/apps/details?id=com.appgain.marrakeshconsumer",
    metric: { value: "Secure", label: "auth & checkout flows" },
  },
];

// The satchel (press I): what I carry. Kit is the hardware, drawn in
// atoms/KitArt; Tools are the apps, with their marks in atoms/AppLogo.
export const satchelKit = [
  { id: "tuf", name: "ASUS TUF A15", sub: "Gaming laptop · 15.6-inch", note: "The heavy one: a numpad, see-through WASD keys and fans big enough for the whole stack in Docker.", uses: ["Docker", "Heavy builds", "Windows"] },
  { id: "mac", name: "MacBook Air M2", sub: "13-inch · Apple M2", note: "The light one: no fan, all-day battery, and the machine that sends iOS builds to TestFlight.", uses: ["iOS builds", "On the move", "macOS"] },
  { id: "sam", name: "Samsung 32\"", sub: "Main monitor · 32-inch", note: "The big screen: code on the left, logs and the terminal on the right.", uses: ["Code", "Logs"] },
  { id: "msi", name: "MSI 25\"", sub: "Second monitor · 25-inch", note: "The side screen: Slack, Jira and the docs, always open.", uses: ["Slack", "Jira", "Docs"] },
  { id: "kb", name: "Mechanical keyboard", sub: "Wireless · 75% with a knob", note: "Every line of code goes through it. The knob does the volume.", uses: ["Typing", "Volume knob"] },
  { id: "mouse", name: "Wireless mouse", sub: "Two side buttons", note: "Back and forward through the docs without a reach.", uses: ["Navigation"] },
  { id: "honor", name: "Honor Magic 6 Pro", sub: "Android phone", note: "Where the Android apps get tested, on a real device.", uses: ["Android testing"] },
  { id: "iphone", name: "iPhone 17 Pro Max", sub: "iOS phone", note: "Where TestFlight builds land first.", uses: ["iOS testing", "TestFlight"] },
] as const;

export const satchelTools = [
  { id: "cursor", name: "Cursor", sub: "AI code editor", note: "Where the code gets written.", uses: ["Editor"] },
  { id: "claude", name: "Claude", sub: "AI assistant", note: "Pair programmer, reviewer and second opinion.", uses: ["Pairing", "Reviews"] },
  { id: "jira", name: "Jira", sub: "Tickets and sprints", note: "What's next, and what's blocked.", uses: ["Planning"] },
  { id: "slack", name: "Slack", sub: "Team chat", note: "Where the team talks.", uses: ["Team"] },
  { id: "dbeaver", name: "DBeaver", sub: "Database client", note: "MySQL and PostgreSQL in one window.", uses: ["SQL"] },
  { id: "spotify", name: "Spotify", sub: "Music", note: "The soundtrack to every deploy.", uses: ["Focus"] },
  { id: "terminal", name: "Terminal", sub: "The shell", note: "git, docker, ssh: the rest happens here.", uses: ["git", "docker", "ssh"] },
  { id: "docker", name: "Docker", sub: "Containers", note: "Every service runs in one, locally and in production.", uses: ["Containers"] },
  { id: "mongodb", name: "MongoDB Compass", sub: "MongoDB client", note: "Browsing collections and checking queries.", uses: ["MongoDB"] },
  { id: "chrome", name: "Chrome", sub: "Browser and DevTools", note: "The network tab is where APIs get debugged.", uses: ["DevTools"] },
  { id: "testflight", name: "TestFlight", sub: "iOS beta builds", note: "Shipping test builds to the iPhone before the App Store.", uses: ["iOS"] },
] as const;

// Each chapter is a town on the map (the game's town names, as a nod for
// fans); the map and the menu's fast-travel card both use them.
export type TTown = { id: string; name: string; section: string; ar: string; blurb: string };

export const towns: TTown[] = [
  { id: "about", name: "Valentine", section: "(01) About", ar: "عني", blurb: "Where it starts: who I am and what I build." },
  { id: "services", name: "Strawberry", section: "(02) What I do", ar: "بعمل إيه", blurb: "Three trades: APIs, system design and real-time." },
  { id: "skills", name: "Rhodes", section: "(03) Skills", ar: "مهاراتي", blurb: "The stack: 43 tools, the daily ones marked." },
  { id: "work", name: "Saint Denis", section: "(04) Selected work", ar: "أعمالي", blurb: "The big city: Bee3a and nine projects, case studies inside." },
  { id: "experience", name: "Blackwater", section: "(05) Experience", ar: "مشواري", blurb: "The trail so far, job by job." },
  { id: "principles", name: "Annesburg", section: "(06) How I work", ar: "بشتغل إزاي", blurb: "House rules, in Arabic." },
  { id: "channel", name: "Van Horn", section: "(07) The channel", ar: "على يوتيوب", blurb: "٢٠٠ تمام, with live numbers from YouTube." },
  { id: "contact", name: "Armadillo", section: "(08) Contact", ar: "كلّمني", blurb: "End of the line: say hello." },
];
