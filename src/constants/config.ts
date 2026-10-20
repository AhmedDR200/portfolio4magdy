export const config = {
  html: {
    title: "Ahmed Magdy — Software Engineer",
    fullName: "Ahmed Magdy",
    email: "alshwwhy212@gmail.com",
  },
  // The CV is written on Overleaf. .github/workflows/sync-cv.yml copies the
  // compiled PDF onto the "cv" GitHub release every 3 hours, so this link
  // always downloads the latest version.
  cvUrl:
    "https://github.com/AhmedDR200/portfolio4magdy/releases/download/cv/Ahmed_Magdy_CV.pdf",
  socials: {
    github: "https://github.com/AhmedDR200",
    linkedin: "https://www.linkedin.com/in/am412002/",
  },
  youtube: {
    url: "https://www.youtube.com/@200tamam",
    handle: "@200tamam",
    // A YouTube Data API browser key, restricted to this site's domains. It
    // comes from .env.local (VITE_YOUTUBE_API_KEY); without it the live
    // channel stats are simply hidden.
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY ?? "",
  },
  tiktok: {
    url: "https://www.tiktok.com/@200tamam",
    handle: "@200tamam",
  },
  currentRole: {
    title: "Backend Engineer @ Madkhol",
    titleAr: "حالياً في مدخول",
    url: "https://madkhol.com",
  },
  about: {
    statement:
      "Crafting scalable systems and real-time services — building the unsexy infra that makes products fast.",
    statementAr: "ببني البنية التحتية اللي بتخلّي المنتجات أسرع.",
    body: "Software engineer with a track record of designing, building and shipping scalable, high-performance systems — from architecture design to deployment and maintenance. Right now I'm building investment and robo-advisory backends at Madkhol Capital.",
  },
  // The footer's status panel. The last commit is read live from GitHub.
  status: {
    githubUser: "AhmedDR200",
    now: "Backend @ Madkhol · shipping Bee3a",
    // The uptime counter starts on the day this GitHub account was created.
    upSince: "2021-11-14T13:57:35Z",
  },
  motto: {
    ar: "عَدِّي حُدودَك.",
    en: "Go beyond your limits.",
  },
};
