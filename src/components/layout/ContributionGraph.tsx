import { useEffect, useState } from "react";

import { config } from "../../constants/config";
import { logApiCall, loggedFetch } from "../../utils/apiLog";
import { readCache, writeCache } from "../../utils/sessionCache";

type Day = { date: string; count: number; level: number };
type Calendar = { total: number; days: Day[] };

const CACHE_KEY = "status-contributions";
const CACHE_MS = 60 * 60 * 1000;

const LEVELS = ["bg-paper/[0.07]", "bg-volt/25", "bg-volt/50", "bg-volt/75", "bg-volt"];

// GitHub only serves the contribution calendar through its GraphQL API, which
// needs a token. This public API reads the same calendar from the profile
// page (react-github-calendar uses it too) and allows browser requests.
const calendarUrl = (user: string) => `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;

const fetchCalendar = async (user: string, signal: AbortSignal): Promise<Calendar | null> => {
  const res = await loggedFetch(calendarUrl(user), { signal });
  if (!res.ok) return null;
  const data = (await res.json()) as { total?: { lastYear?: number }; contributions?: Day[] };
  if (!data.contributions?.length) return null;
  return { total: data.total?.lastYear ?? 0, days: data.contributions };
};

/** undefined while loading, null if it couldn't be loaded. */
const useCalendar = (enabled: boolean) => {
  const [calendar, setCalendar] = useState<Calendar | null | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const cached = readCache<Calendar>(CACHE_KEY, CACHE_MS);
    if (cached) {
      logApiCall({ url: calendarUrl(config.status.githubUser), result: "cache", ms: 0 });
      setCalendar(cached);
      return;
    }
    const controller = new AbortController();
    fetchCalendar(config.status.githubUser, controller.signal)
      .then((result) => {
        if (result) writeCache(CACHE_KEY, result);
        setCalendar(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setCalendar(null);
      });
    return () => controller.abort();
  }, [enabled]);

  return calendar;
};

/** Sunday-first weeks, like GitHub's graph; days before the range are null. */
const toWeeks = (days: Day[]) => {
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = Array(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).fill(null);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
};

const EMPTY_WEEKS: null[][] = Array.from({ length: 53 }, () => Array(7).fill(null));

// Phones show the last 20 weeks, tablets 34, laptops the whole year.
const weekVisibility = (age: number) => (age >= 34 ? "hidden lg:flex" : age >= 20 ? "hidden sm:flex" : "flex");

const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// The GitHub contribution graph, in volt. Hidden if it can't be loaded.
const ContributionGraph = ({ enabled }: { enabled: boolean }) => {
  const calendar = useCalendar(enabled);
  if (calendar === null) return null;

  const weeks = calendar ? toWeeks(calendar.days) : EMPTY_WEEKS;
  const total = calendar?.total.toLocaleString("en");

  return (
    <div data-xray="contributions" className="border-t border-paper/10 py-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="m-0 text-[12px] uppercase tracking-[0.14em] text-smoke">Contributions</p>
        <a
          href={config.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] uppercase tracking-[0.12em] text-volt hover:underline"
        >
          {total ? `${total} in the last year ↗` : "GitHub ↗"}
        </a>
      </div>

      <div
        role="img"
        aria-label={total ? `${total} GitHub contributions in the last year` : "GitHub contributions"}
        className="flex gap-[3px] lg:gap-1"
      >
        {weeks.map((week, i) => (
          <div key={i} className={`${weekVisibility(weeks.length - 1 - i)} flex-1 flex-col gap-[3px] lg:gap-1`}>
            {week.map((day, j) => (
              <span
                key={j}
                title={day ? `${day.count} on ${dateLabel(day.date)}` : undefined}
                className={`aspect-square w-full rounded-[3px] ${day ? LEVELS[day.level] ?? LEVELS[0] : calendar ? "" : LEVELS[0]}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="mt-3 flex items-center justify-end gap-1.5 text-[11px] uppercase tracking-[0.12em] text-smoke"
      >
        Less
        {LEVELS.map((level) => (
          <span key={level} className={`h-2.5 w-2.5 rounded-[2px] ${level}`} />
        ))}
        More
      </div>
    </div>
  );
};

export default ContributionGraph;
