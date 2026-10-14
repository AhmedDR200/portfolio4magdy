import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { config } from "../../constants/config";
import Icon from "../atoms/Icon";
import { logApiCall, loggedFetch } from "../../utils/apiLog";
import { readCache, writeCache } from "../../utils/sessionCache";
import ContributionGraph from "./ContributionGraph";

type Commit = { message: string; repo: string; url: string; date: string };
type PushEvent = { type: string; created_at: string; repo: { name: string }; payload: { head?: string } };

const CACHE_KEY = "status-last-commit";
const CACHE_MS = 10 * 60 * 1000;

// GitHub's public events no longer carry commit messages, so this finds the
// latest push and then reads its head commit. Unauthenticated calls are
// limited to 60 an hour per visitor, hence the cache.
const eventsUrl = (user: string) => `https://api.github.com/users/${user}/events/public?per_page=50`;

const fetchLastCommit = async (user: string, signal: AbortSignal): Promise<Commit | null> => {
  const res = await loggedFetch(eventsUrl(user), { signal });
  if (!res.ok) return null;
  const push = ((await res.json()) as PushEvent[])
    .filter((e) => e.type === "PushEvent" && e.payload.head)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  if (!push) return null;

  const commitRes = await loggedFetch(`https://api.github.com/repos/${push.repo.name}/commits/${push.payload.head}`, { signal });
  if (!commitRes.ok) return null;
  const commit = (await commitRes.json()) as { html_url: string; commit: { message: string } };
  return {
    message: commit.commit.message.split("\n")[0],
    repo: push.repo.name.split("/")[1],
    url: commit.html_url,
    date: push.created_at,
  };
};

/** undefined while loading, null if GitHub couldn't be reached. */
const useLastCommit = (enabled: boolean) => {
  const [commit, setCommit] = useState<Commit | null | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const cached = readCache<Commit>(CACHE_KEY, CACHE_MS);
    if (cached) {
      logApiCall({ url: eventsUrl(config.status.githubUser), result: "cache", ms: 0 });
      setCommit(cached);
      return;
    }
    const controller = new AbortController();
    fetchLastCommit(config.status.githubUser, controller.signal)
      .then((result) => {
        if (result) writeCache(CACHE_KEY, result);
        setCommit(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setCommit(null);
      });
    return () => controller.abort();
  }, [enabled]);

  return commit;
};

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

const timeAgo = (iso: string) => {
  const seconds = (Date.parse(iso) - Date.now()) / 1000;
  const unit = UNITS.find(([, size]) => Math.abs(seconds) >= size);
  return unit ? relativeTime.format(Math.round(seconds / unit[1]), unit[0]) : "just now";
};

const pad = (n: number) => String(n).padStart(2, "0");

const formatUptime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86_400);
  return `${Math.floor(days / 365)}y ${days % 365}d ${pad(Math.floor((s % 86_400) / 3_600))}:${pad(Math.floor((s % 3_600) / 60))}:${pad(s % 60)}`;
};

const Uptime = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <>{formatUptime(now - Date.parse(config.status.upSince))}</>;
};

const sinceLabel = new Date(config.status.upSince).toLocaleDateString("en", { month: "short", year: "numeric" });

const label = "text-[12px] uppercase tracking-[0.14em] text-smoke";
// Phones: label and status share the first line, the value goes below.
const row =
  "grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1.5 py-4 sm:grid-cols-[170px_minmax(0,1fr)_auto] sm:items-center";
const value = "col-span-2 row-start-2 m-0 min-w-0 text-[15px] sm:col-span-1 sm:row-start-auto";
const status =
  "col-start-2 row-start-1 m-0 text-right text-[12px] uppercase tracking-[0.12em] sm:col-start-auto sm:row-start-auto";

// A status page for the person: last commit (live from GitHub), what's on
// the desk now, an uptime counter since joining GitHub, and the contribution graph.
const StatusPanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const commit = useLastCommit(inView);

  return (
    <div ref={ref} data-xray="status" className="rounded-[28px] border border-paper/15 bg-graphite/50 px-5 pb-2 pt-6 sm:px-8 sm:pt-7">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-paper/15 pb-5">
        <p className="m-0 flex items-center gap-3 font-display text-[26px] uppercase leading-none sm:text-[32px]">
          <span aria-hidden="true" className="animate-pulse-volt h-3 w-3 shrink-0 rounded-full bg-volt" />
          All systems operational
        </p>
        <p lang="ar" dir="rtl" className="m-0 font-arabic text-[24px] leading-none text-volt">
          كله تمام
        </p>
      </div>

      <dl className="m-0 divide-y divide-paper/10">
        <div className={row}>
          <dt className={`${label} flex items-center gap-2`}>
            <Icon name="branch" size={14} />
            Last commit
          </dt>
          <dd className={`${value} truncate`}>
            {commit ? (
              <a href={commit.url} target="_blank" rel="noopener noreferrer" className="hover:text-volt">
                {commit.message}
                <span className="text-smoke"> · {commit.repo}</span>
              </a>
            ) : commit === null ? (
              <a href={config.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-volt">
                See it on GitHub ↗
              </a>
            ) : (
              <span className="text-smoke">
                <span className="text-volt">›</span> fetching
                <span aria-hidden="true" className="animate-blink ml-1 inline-block h-[3px] w-2.5 bg-volt" />
              </span>
            )}
          </dd>
          <dd className={`${status} text-volt`}>{commit ? timeAgo(commit.date) : "—"}</dd>
        </div>

        <div className={row}>
          <dt className={`${label} flex items-center gap-2`}>
            <Icon name="hammer" size={14} />
            Now
          </dt>
          <dd className={value}>{config.status.now}</dd>
          <dd className={`${status} flex items-center justify-end gap-2 text-volt`}>
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-volt" />
            Shipping
          </dd>
        </div>

        <div className={row}>
          <dt className={`${label} flex items-center gap-2`}>
            <Icon name="hourglass" size={14} />
            Uptime
          </dt>
          <dd className={`${value} tabular-nums`}>
            <Uptime />
          </dd>
          <dd className={`${status} text-smoke`}>Since {sinceLabel}</dd>
        </div>
      </dl>

      <ContributionGraph enabled={inView} />
    </div>
  );
};

export default StatusPanel;
