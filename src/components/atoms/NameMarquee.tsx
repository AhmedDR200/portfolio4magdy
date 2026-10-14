import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const LOOP_MS = 26000; // one full loop at rest

const NameCopy = ({ hidden }: { hidden?: boolean }) => (
  <span
    aria-hidden={hidden || undefined}
    className="inline-flex items-center gap-[0.22em] pr-[0.22em]"
  >
    Ahmed Magdy
    <span aria-hidden="true" className="text-[0.4em]">
      ✦
    </span>
    <span lang="ar" dir="rtl" className="font-arabic text-[0.8em]">
      أحمد مجدي
    </span>
    <span aria-hidden="true" className="text-[0.4em]">
      ✦
    </span>
  </span>
);

// The hero's giant name. It drifts left; scrolling up flips it right, and
// scroll speed gives it a short boost that decays.
const NameMarquee = ({ className = "" }: { className?: string }) => {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (reduce || !track) return;

    let x = 0;
    let direction = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (dy > 1) direction = -1;
      else if (dy < -1) direction = 1;
      boost = Math.min(6, boost + Math.abs(dy) * 0.35);
      lastY = y;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const half = track.scrollWidth / 2;
      if (half > 0) {
        x += direction * (half / LOOP_MS) * (1 + boost) * dt;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      boost *= Math.pow(0.985, dt / 16);
      if (boost < 0.01) boost = 0;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  return (
    <div data-xray="name-marquee" className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={trackRef} className="inline-flex will-change-transform">
        <h1 className="m-0 inline-flex font-normal">
          <NameCopy />
        </h1>
        <NameCopy hidden />
      </div>
    </div>
  );
};

export default NameMarquee;
