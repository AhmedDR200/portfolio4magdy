import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

type Geo = { city?: string; country?: string; flag?: string };

const VisitorGreeting = () => {
  const [geo, setGeo] = useState<Geo | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://ipwho.is/", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data && data.success !== false && (data.city || data.country)) {
          setGeo({
            city: data.city,
            country: data.country,
            flag: data.flag?.emoji,
          });
        }
      })
      .catch(() => {
        /* offline / blocked / rate-limited — greeting is non-essential */
      });

    return () => controller.abort();
  }, []);

  const place = geo?.city || geo?.country;

  return (
    <AnimatePresence>
      {place && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-secondary mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium sm:text-[13px]"
        >
          <MapPin className="h-3.5 w-3.5 text-[#00FF88]" />
          Hello from {place}
          {geo?.flag ? ` ${geo.flag}` : " 👋"}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorGreeting;
