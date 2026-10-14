import { bee3aLockup } from "../../assets";
import Chip from "../atoms/Chip";
import Bee3aDemo from "./Bee3aDemo";

const bee3aSystems = [
  { ar: "الكاشير", en: "Till / POS" },
  { ar: "الحجوزات", en: "Bookings" },
  { ar: "الطلب أونلاين", en: "Online orders" },
];

export const Bee3aCard = () => (
  <article
    aria-label="Founder project: Bee3a"
    className="mt-11 grid items-center gap-10 rounded-[28px] border-2 border-volt bg-graphite p-5 sm:p-8 lg:grid-cols-2"
  >
    <div className="relative h-[640px] overflow-hidden rounded-[20px] bg-[#17130F] sm:h-[530px]">
      <img src={bee3aLockup} alt="Bee3a بيعة logo" className="absolute left-6 top-6 h-[46px] w-auto" />
      <Bee3aDemo />
      <span
        aria-hidden="true"
        lang="ar"
        className="absolute bottom-10 left-6 hidden -rotate-6 rounded-xl sm:block bg-volt px-[18px] py-2.5 font-arabic text-[32px] leading-[1.1] text-ink shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        ودّع الكشكول!
      </span>
    </div>

    <div className="flex flex-col gap-4">
      <p className="m-0 flex w-fit items-center gap-2.5 rounded-full bg-volt px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
        <span aria-hidden="true" className="animate-pulse-ink h-2 w-2 rounded-full bg-ink" />
        Founder · Live ·
        <span lang="ar" className="font-arabic text-[17px] font-normal normal-case tracking-normal">
          شغّال دلوقتي
        </span>
      </p>
      <h3 className="m-0 flex flex-wrap items-baseline gap-5 font-normal">
        <span lang="ar" dir="rtl" className="font-arabic text-[clamp(72px,7vw,100px)] leading-none text-volt">
          بيعة
        </span>
        <span className="font-display text-[clamp(48px,4.6vw,66px)] uppercase leading-none">Bee3a</span>
      </h3>
      <p className="m-0 font-display text-[clamp(24px,2.1vw,30px)] uppercase leading-[1.05]">
        Bookings and sales for your shop, in one place.
      </p>
      <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[30px] leading-[1.3] sm:text-[34px]">
        زي زمان بس أشطر.
      </p>
      <p className="m-0 text-[15px] leading-[1.75] text-mist">
        A SaaS for salons, clinics, training centers, shops and supermarkets. Three systems in one app —
        the till, bookings and online ordering — plus an admin console and AI tools. Founded, designed and
        built end to end.
      </p>
      <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0">
        {bee3aSystems.map((s) => (
          <li key={s.en} className="flex flex-col gap-0.5 rounded-[14px] border border-paper/10 bg-ink px-3.5 py-3">
            <span lang="ar" dir="rtl" className="text-left font-arabic text-[20px] sm:text-[24px]">
              {s.ar}
            </span>
            <span className="text-[11px] uppercase tracking-[0.1em] text-smoke">{s.en}</span>
          </li>
        ))}
      </ul>
      <ul aria-label="Stack" className="m-0 flex list-none flex-wrap gap-2 p-0 text-[12px]">
        {["React", "Express", "MongoDB", "Cloudflare Workers", "Workers AI", "PWA"].map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </ul>
      <a
        href="https://bee3a.site"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex h-[54px] w-fit items-center rounded-full bg-volt px-6 text-[14px] font-bold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-105"
      >
        Visit bee3a.site ↗
      </a>
    </div>
  </article>
);
