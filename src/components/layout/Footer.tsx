import { motion } from "framer-motion";

import { useSettings } from "../../context/Settings";

const Footer = () => {
  const { reduceMotion } = useSettings();
  const currentYear = new Date().getFullYear();

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.6 },
        transition: { duration: 0.7, ease: "easeOut" as const },
      };

  return (
    <footer className="bg-primary w-full px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-10 h-px w-24 bg-gradient-to-r from-transparent via-[#00FF88]/60 to-transparent" />

        <motion.p
          dir="rtl"
          lang="ar"
          className="font-majara text-[40px] font-bold leading-tight text-[#00FF88] sm:text-[64px] lg:text-[80px]"
          {...fade}
        >
          عَدِّي حُدودَك.
        </motion.p>

        <p className="text-secondary mt-8 text-[13px] sm:text-sm">
          © {currentYear} Ahmed Magdy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
