import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { mePhoto } from "../../assets";
import { config } from "../../constants/config";
import VisitorGreeting from "../atoms/VisitorGreeting";

const ROLES = [
  "Backend Engineer.",
  "Systems Designer.",
  "API Architect.",
  "Real-time Engineer.",
];

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.087-.744.084-.729.084-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.335-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.912 1.23 3.222 0 4.605-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.895-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </svg>
);

const SOCIAL_LINKS: {
  href: string;
  label: string;
  Icon: React.FC;
}[] = [
  {
    href: "https://github.com/AhmedDR200",
    label: "GitHub",
    Icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/am412002/",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  {
    href: `mailto:${config.html.email}`,
    label: "Email",
    Icon: MailIcon,
  },
];

const SocialButton: React.FC<{
  href: string;
  label: string;
  Icon: React.FC;
}> = ({ href, label, Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:border-white/40 hover:bg-white/20"
  >
    <Icon />
  </a>
);

const PhotoHero = () => {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={mePhoto}
          alt="Ahmed Magdy"
          className="h-full w-full object-cover brightness-110 contrast-110 grayscale"
          style={{ objectPosition: "50% 18%" }}
        />
        {/* Theme-agnostic darkening so overlaid text stays legible in both light and dark themes */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="from-primary/60 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-24 sm:px-10 sm:pb-28 lg:pb-32">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <div className="flex flex-col">
            <VisitorGreeting />

            <motion.a
              href="https://madkhol.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/20 sm:text-[14px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Currently @ Madkhol Capital
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-[56px] font-black leading-[0.9] tracking-tight text-white drop-shadow-2xl sm:text-[80px] lg:text-[120px] xl:text-[140px]"
            >
              <span className="glitch" data-text="Ahmed">
                Ahmed
              </span>
              <br />
              <span className="glitch" data-text="Magdy">
                Magdy
              </span>
              <span className="text-[#00FF88]">_</span>
            </motion.h1>

            <div className="mt-3 flex h-[30px] items-center text-[18px] font-semibold drop-shadow-md sm:h-[40px] sm:text-[24px] lg:h-[48px] lg:text-[28px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35 }}
                  className="text-[#00FF88]"
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 flex items-center gap-3"
            >
              {SOCIAL_LINKS.map((s) => (
                <SocialButton key={s.label} {...s} />
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-[14px] leading-[24px] text-white/90 drop-shadow-md sm:max-w-[300px] sm:text-right sm:text-[15px] lg:max-w-[360px] lg:text-[16px] lg:leading-[26px]"
          >
            Hey there! I'm Ahmed, a backend engineer crafting scalable systems
            and real-time services. Building the unsexy infra that makes
            products fast.
          </motion.p>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-6 right-6 z-10 flex flex-col items-center gap-2 sm:right-10"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 sm:text-[11px]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-white/80" />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default PhotoHero;
