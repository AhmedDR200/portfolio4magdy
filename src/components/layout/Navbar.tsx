import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Cake, Code2, Moon, Sparkles, Sun, User, Zap, ZapOff } from "lucide-react";

import { styles } from "../../constants/styles";
import { navLinks } from "../../constants";
import { logo, menu, close } from "../../assets";
import { config } from "../../constants/config";
import { useSettings } from "../../context/Settings";

const SettingsControls = ({ size = "md" }: { size?: "md" | "lg" }) => {
  const { theme, reduceMotion, toggleTheme, toggleReduceMotion } =
    useSettings();
  const dim = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const icon = size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
        className={`bg-tertiary flex ${dim} items-center justify-center rounded-full border border-white/10 text-white transition-all hover:scale-105 hover:border-[#00FF88]/50`}
      >
        {theme === "dark" ? (
          <Sun className={`${icon} text-[#FFB700]`} />
        ) : (
          <Moon className={`${icon} text-[#00CC66]`} />
        )}
      </button>
      <button
        type="button"
        onClick={toggleReduceMotion}
        aria-pressed={reduceMotion}
        aria-label={
          reduceMotion ? "Enable animations" : "Reduce motion & animations"
        }
        title={reduceMotion ? "Animations off" : "Reduce motion"}
        className={`bg-tertiary flex ${dim} items-center justify-center rounded-full border transition-all hover:scale-105 ${
          reduceMotion
            ? "border-[#00FF88]/50 text-[#00FF88]"
            : "border-white/10 text-white hover:border-[#00FF88]/50"
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

const TAGLINES: { text: string; Icon: React.FC<{ className?: string }> }[] = [
  { text: "Software Engineer", Icon: Code2 },
  { text: "A is for Ahmed", Icon: User },
  { text: "M is for Magdy", Icon: User },
  { text: "4 is for a very special birthday", Icon: Cake },
  { text: "AM4 = my whole brand", Icon: Sparkles },
];

const CV_PATH = "/Ahmed_Magdy_CV.pdf";

const Navbar = () => {
  const [active, setActive] = useState<string | null>();
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setActive("");
      }
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
  }, []);

  useEffect(() => {
    document.body.style.overflow = toggle ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [toggle]);

  return (
    <>
    <nav
      className={`${
        styles.paddingX
      } fixed top-0 z-20 flex w-full items-center py-5 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-primary/70 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[#00FF88]"
      />

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <img
            src={logo}
            alt="logo"
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
          <p className="flex cursor-pointer items-center text-[18px] font-bold text-white">
            {config.html.fullName}
            <span className="hidden items-center sm:inline-flex">
              &nbsp;|&nbsp;
              <AnimatePresence mode="wait">
                <motion.span
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-secondary inline-flex items-center gap-1.5 font-medium"
                >
                  {(() => {
                    const { Icon } = TAGLINES[taglineIndex];
                    return <Icon className="h-4 w-4" />;
                  })()}
                  {TAGLINES[taglineIndex].text}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <ul className="flex list-none flex-row gap-8">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`relative cursor-pointer text-[18px] font-medium transition-colors hover:text-white ${
                  active === nav.id ? "text-white" : "text-secondary"
                }`}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
                {active === nav.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-[#00FF88]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </li>
            ))}
          </ul>

          <SettingsControls />

          <a
            href={CV_PATH}
            download
            className="rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 px-4 py-2 text-[14px] font-semibold text-white transition-all hover:scale-105 hover:border-[#00FF88] hover:bg-[#00FF88]/20"
          >
            Download CV
          </a>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:hidden">
          <a
            href={CV_PATH}
            download
            className="rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 px-3 py-1.5 text-[13px] font-semibold text-white"
          >
            CV
          </a>
          <button
            type="button"
            aria-label={toggle ? "Close menu" : "Open menu"}
            onClick={() => setToggle((t) => !t)}
            className="bg-tertiary/60 relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 backdrop-blur"
          >
            <img
              src={toggle ? close : menu}
              alt=""
              className="h-[22px] w-[22px] object-contain"
            />
          </button>
        </div>
      </div>
    </nav>

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
                  className="flex items-center justify-center rounded-full border border-[#00FF88]/50 bg-[#00FF88]/15 px-5 py-3 text-[15px] font-bold text-white"
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
