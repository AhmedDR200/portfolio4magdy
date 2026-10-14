import { useEffect, useState } from "react";

import { logApiCall, loggedFetch } from "../../utils/apiLog";
import { readCache, writeCache } from "../../utils/sessionCache";
import Icon, { type IconName } from "./Icon";

// The time and weather in Cairo, and a guess at whether I'm around. Time comes
// from the browser in Africa/Cairo; weather from Open-Meteo (free, no key),
// refreshed every 15 minutes and shared by every clock on the page.

type Weather = { temp: number; code: number; isDay: boolean; wind: number };

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&current=temperature_2m,weather_code,is_day,wind_speed_10m&timezone=Africa%2FCairo";
const CACHE_KEY = "cairo-weather";
const CACHE_MS = 15 * 60 * 1000;

let pending: Promise<Weather | null> | null = null;
const loadWeather = (): Promise<Weather | null> => {
  const cached = readCache<Weather>(CACHE_KEY, CACHE_MS);
  if (cached) {
    logApiCall({ url: WEATHER_URL, result: "cache", ms: 0 });
    return Promise.resolve(cached);
  }
  pending ??= loggedFetch(WEATHER_URL)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const c = data?.current;
      if (!c) return null;
      const weather = { temp: Math.round(c.temperature_2m), code: c.weather_code, isDay: c.is_day === 1, wind: c.wind_speed_10m };
      writeCache(CACHE_KEY, weather);
      return weather;
    })
    .catch(() => null)
    .finally(() => {
      pending = null;
    });
  return pending;
};

// Strong wind in Cairo usually means dust: the khamaseen.
const describe = (w: Weather): { icon: IconName; label: string } => {
  if (w.wind >= 35) return { icon: "wind", label: "dusty" };
  if (w.code <= 1) return { icon: w.isDay ? "sun" : "moon", label: "clear" };
  return { icon: "cloud", label: w.code >= 51 ? "rain" : "cloudy" };
};

const cairoHour = (d: Date) => Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Cairo" }).format(d));

const partOfDay = (h: number) =>
  h >= 1 && h < 6 ? "الفجر" : h < 12 ? "الصبح" : h < 15 ? "الضهر" : h < 18 ? "العصر" : h < 20 ? "المغرب" : "بالليل";

const standing = (h: number) =>
  h < 7 ? { en: "Probably asleep", awake: false } : h < 9 ? { en: "Waking up", awake: true } : h < 18 ? { en: "At work", awake: true } : { en: "Online", awake: true };

type Props = { className?: string; /** Include the Arabic time (needs the room). */ arabic?: boolean };

const CairoClock = ({ className = "", arabic = true }: Props) => {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 20_000);
    let alive = true;
    const refresh = () => loadWeather().then((w) => alive && w && setWeather(w));
    refresh();
    const poll = window.setInterval(refresh, CACHE_MS);
    return () => {
      alive = false;
      window.clearInterval(tick);
      window.clearInterval(poll);
    };
  }, []);

  const hour = cairoHour(now);
  const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }).format(now);
  const timeAr = new Intl.DateTimeFormat("ar-EG", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Cairo" })
    .format(now)
    .replace(/\s?[صم]$/, "");
  const sky = weather ? describe(weather) : null;
  const status = standing(hour);

  return (
    <span
      className={`inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-paper/20 bg-ink/70 py-2 pl-3 pr-4 text-[12px] backdrop-blur-md ${className}`}
      title={sky && weather ? `Cairo: ${weather.temp}°C, ${sky.label}` : "Cairo"}
    >
      <Icon name={sky?.icon ?? (hour >= 6 && hour < 18 ? "sun" : "moon")} size={18} className="text-volt" />
      <span className="tracking-[0.06em]">{time}</span>
      {weather && (
        <>
          <span className="text-smoke">·</span>
          <span>{weather.temp}°C</span>
        </>
      )}
      {arabic && (
        <span lang="ar" dir="rtl" className="hidden font-arabic text-[16px] text-mist [unicode-bidi:isolate] sm:inline">
          القاهرة، {timeAr} {partOfDay(hour)}
        </span>
      )}
      <span className="flex items-center gap-1.5 border-l border-paper/15 pl-2.5 text-mist">
        <span className={`h-[7px] w-[7px] rounded-full ${status.awake ? "bg-volt" : "bg-smoke"}`} />
        {status.en}
      </span>
    </span>
  );
};

export default CairoClock;
