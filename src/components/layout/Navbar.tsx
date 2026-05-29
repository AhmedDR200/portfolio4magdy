import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Moon, Sun, Zap, ZapOff } from "lucide-react";

import { navLinks } from "../../constants";
import { logo, menu, close } from "../../assets";
import { config } from "../../constants/config";
import { useSettings } from "../../context/Settings";

const SettingsControls = ({ size = "md" }: { size?: "md" | "lg" }) => {
  const { theme, reduceMotion, toggleTheme, toggleReduceMotion } =
    useSettings();
  const dim = size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const icon = size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]";

  return (
    <div className="bg-tertiary/60 flex items-center gap-1 rounded-full border border-white/10 p-1 backdrop-blur">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
        className={`flex ${dim} items-center justify-center rounded-full text-white transition-colors hover:bg-white/10`}
      >
        {theme === "dark" ? (
          <Sun className={`${icon} text-[#FFB700]`} />
        ) : (
          <Moon className={`${icon} text-[#00CC66]`} />
        )}
      </button>
      <span className="h-5 w-px bg-white/10" aria-hidden="true" />
      <button
        type="button"
        onClick={toggleReduceMotion}
        aria-pressed={reduceMotion}
        aria-label={
          reduceMotion ? "Enable animations" : "Reduce motion & animations"
        }
        title={reduceMotion ? "Animations off" : "Reduce motion"}
        className={`flex ${dim} items-center justify-center rounded-full transition-colors ${
          reduceMotion
            ? "bg-[#00FF88]/15 text-[#00FF88]"
            : "text-white hover:bg-white/10"
        }`}
      >
        {reduceMotion ? (
          <ZapOff className={icon} />
        ) : (
          <Zap className={icon} />
        )}
      </button>
    </div>
  );
};

// Terminal-prompt roles, cycled in the brand cluster. Kebab/lowercase to fit
// the `ahmed@magdy:~$` shell vibe.
const ROLES = [
  "software-engineer",
  "backend-engineer",
  "systems-designer",
  "api-architect",
];

const CV_PATH = "/Ahmed_Magdy_CV.pdf";

const Navbar = () => {
  const { reduceMotion } = useSettings();
  const [active, setActive] = useState<string | null>();
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const lastScrollY = useRef(0);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    // No infinite cycling under reduce-motion: pin to the first role.
    if (reduceMotion) {
      setRoleIndex(0);
      return;
    }
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setActive("");
      }

      // Auto-hide on scroll down / reveal on scroll up. Disabled entirely when
      // reduce-motion is on, while the mobile drawer is open, or near the top.
      if (reduceMotion || toggle || scrollTop <= 120) {
        setHidden(false);
      } else if (scrollTop > lastScrollY.current) {
        setHidden(true);
      } else if (scrollTop < lastScrollY.current) {
        setHidden(false);
      }
      lastScrollY.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    const navbarHighlighter = () => {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((current) => {
        const sectionId = current.getAttribute("id");
        // @ts-ignore
        const sectionHeight = current.offsetHeight;
        const sectionTop =
          current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (sectionTop < 0 && sectionTop + sectionHeight > 0) {
          setActive(sectionId);
        }
      });
    };

    window.addEventListener("scroll", navbarHighlighter);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", navbarHighlighter);
    };
  }, [reduceMotion, toggle]);

  useEffect(() => {
    document.body.style.overflow = toggle ? "hidden" : "";
    if (toggle) setHidden(false);
    return () => {
      document.body.style.overflow = "";
    };
  }, [toggle]);

  useEffect(() => {
    if (reduceMotion) setHidden(false);
  }, [reduceMotion]);

  return (
    <>
    <motion.nav
      initial={false}
      animate={{ y: hidden ? -130 : 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 380, damping: 32 }
      }
      className="fixed inset-x-0 top-3 z-20 flex justify-center px-4 sm:top-4 sm:px-6"
    >
      <div
        className={`relative flex w-full max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled
            ? "border-white/10 bg-primary/70 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] ring-1 ring-[#00FF88]/10 backdrop-blur-md"
            : "border-transparent bg-primary/30 backdrop-blur-sm"
        }`}
      >
        {/* Scroll progress, tucked along the bottom edge inside the pill */}
        <div className="pointer-events-none absolute inset-x-4 bottom-1 h-[2px] overflow-hidden rounded-full sm:inset-x-5">
          <motion.div
            style={{ scaleX: progress }}
            className="h-full w-full origin-left rounded-full bg-[#00FF88]"
          />
        </div>

        <Link
          to="/"
          className="group flex items-center gap-2"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <span
            className={`relative flex items-center justify-center rounded-xl ring-1 ring-transparent transition duration-300 group-hover:shadow-[0_0_16px_rgba(0,255,136,0.5)] group-hover:ring-[#00FF88]/40 ${
              reduceMotion ? "" : "group-hover:scale-105"
            }`}
          >
            <img
              src={logo}
              alt="logo"
              className="h-10 w-10 object-contain transition duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] sm:h-11 sm:w-11"
            />
          </span>
          <p className="flex cursor-pointer items-center text-[18px] font-bold text-white">
            <span
              dir="rtl"
              lang="ar"
              className="font-majara inline-flex items-center text-[22px] leading-none text-white sm:text-[26px]"
            >
              مجدي
            </span>
            <span className="ml-3 hidden items-center font-mono text-[14px] font-normal lg:inline-flex">
              <span aria-hidden="true" className="mr-3 h-4 w-px bg-white/10" />
              <span className="text-[#00FF88]">ahmed@magdy</span>
              <span className="text-secondary">:~$</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  className="ml-1.5 text-white"
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
              <span
                aria-hidden="true"
                className="nav-cursor ml-1 inline-block h-4 w-2 translate-y-[2px] bg-[#00FF88]"
              />
            </span>
          </p>
        </Link>

        <div className="hidden items-center gap-4 sm:flex lg:gap-6">
          <ul className="flex list-none flex-row items-center gap-1">
            {navLinks.map((nav) => (
              <li key={nav.id} className="relative">
                <a
                  href={`#${nav.id}`}
                  className={`relative z-10 block cursor-pointer rounded-full px-4 py-2 text-[16px] font-medium transition-colors hover:text-white ${
                    active === nav.id ? "text-white" : "text-secondary"
                  }`}
                >
                  {nav.title}
                </a>
                {active === nav.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-0 rounded-full bg-[#00FF88]/15 ring-1 ring-[#00FF88]/25"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 30 }
                    }
                  />
                )}
              </li>
            ))}
          </ul>

          <span className="h-6 w-px bg-white/10" aria-hidden="true" />

          <div className="flex items-center gap-3">
            <SettingsControls />

            <a
              href={CV_PATH}
              download
              className="shine rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 px-4 py-2 text-[14px] font-semibold text-white transition-all hover:scale-105 hover:border-[#00FF88] hover:bg-[#00FF88]/20"
            >
              Download CV
            </a>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:hidden">
          <a
            href={CV_PATH}
            download
            className="shine rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 px-3 py-1.5 text-[13px] font-semibold text-white"
          >
            CV
          </a>
          <button
            type="button"
            aria-label={toggle ? "Close menu" : "Open menu"}
            onClick={() => setToggle((t) => !t)}
            className="bg-tertiary/60 relative z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 backdrop-blur"
          >
            <img
              src={toggle ? close : menu}
              alt=""
              className="h-[20px] w-[20px] object-contain"
            />
          </button>
        </div>
      </div>
    </motion.nav>

      <AnimatePresence>
        {toggle && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setToggle(false)}
              className="bg-primary/70 fixed inset-0 z-40 backdrop-blur-sm sm:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="bg-primary fixed inset-y-0 right-0 z-50 flex w-[78%] max-w-[340px] flex-col justify-between overflow-y-auto border-l border-white/10 px-6 pb-8 pt-24 shadow-2xl sm:hidden"
            >
              <ul className="flex flex-col gap-2">
                {navLinks.map((nav) => (
                  <li key={nav.id}>
                    <a
                      href={`#${nav.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setToggle(false);
                        setTimeout(() => {
                          document
                            .getElementById(nav.id)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 350);
                      }}
                      className={`flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-[18px] font-semibold transition-colors ${
                        active === nav.id
                          ? "bg-tertiary border-[#00FF88]/40 text-white"
                          : "text-secondary hover:bg-tertiary/60 hover:text-white"
                      }`}
                    >
                      <span>{nav.title}</span>
                      <span
                        className={`text-[18px] ${
                          active === nav.id
                            ? "text-[#00FF88]"
                            : "text-secondary"
                        }`}
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-center gap-3">
                  <SettingsControls size="lg" />
                </div>

                <a
                  href={CV_PATH}
                  download
                  onClick={() => setToggle(false)}
                  className="shine flex items-center justify-center rounded-full border border-[#00FF88]/50 bg-[#00FF88]/15 px-5 py-3 text-[15px] font-bold text-white"
                >
                  ⬇ Download CV
                </a>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://github.com/AhmedDR200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="bg-tertiary flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.087-.744.084-.729.084-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.335-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.912 1.23 3.222 0 4.605-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.895-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/am412002/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="bg-tertiary flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={`mailto:${config.html.email}`}
                    aria-label="Email"
                    className="bg-tertiary flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white"
                  >
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
                  </a>
                </div>

                <p className="text-secondary text-center text-[12px]">
                  © {new Date().getFullYear()} Ahmed Magdy
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
