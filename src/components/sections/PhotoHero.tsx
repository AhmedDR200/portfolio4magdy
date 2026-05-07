import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { mePhoto } from "../../assets";

const PhotoHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={mePhoto}
          alt="Ahmed Magdy"
          className="h-full w-full object-cover contrast-110 grayscale"
          style={{ objectPosition: "50% 18%" }}
        />
        <div className="from-primary via-primary/40 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="from-primary/60 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-20 sm:px-10 sm:pb-24 lg:pb-28">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-[56px] font-black leading-[0.9] tracking-tight text-white drop-shadow-2xl sm:text-[80px] lg:text-[120px] xl:text-[140px]"
          >
            Ahmed
            <br />
            Magdy<span className="text-[#00FF88]">_</span>
          </motion.h1>

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
