import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";

import { config } from "../../constants/config";
import { logApiCall, loggedFetch } from "../../utils/apiLog";
import { readCache, writeCache } from "../../utils/sessionCache";

type Stats = { subscribers: number | null; videos: number; views: number; at: number };

type ChannelRes = {
  items?: {
    statistics: { subscriberCount?: string; hiddenSubscriberCount?: boolean; videoCount: string; viewCount: string };
    contentDetails: { relatedPlaylists: { uploads: string } };
  }[];
};
type PlaylistRes = { items?: { contentDetails: { videoId: string } }[] };
type VideosRes = { items?: { statistics: { viewCount?: string } }[] };

const API = "https://www.googleapis.com/youtube/v3";
const POLL_MS = 30_000;
const STATS_KEY = "channel-stats-v2";
const IDS_KEY = "channel-video-ids";

// Live numbers for ٢٠٠ تمام from the YouTube Data API, refreshed every 30 s
// while they're on screen and the tab is open. The key is a browser key
// restricted to this site's domains (VITE_YOUTUBE_API_KEY); without one, or
// if the API fails, nothing is shown. A refresh costs 2 quota units (3 after
// an upload) out of 10,000 a day.
async function get<T>(path: string, params: Record<string, string>, signal: AbortSignal): Promise<T | null> {
  const query = new URLSearchParams({ ...params, key: config.youtube.apiKey });
  const res = await loggedFetch(`${API}/${path}?${query}`, { signal });
  return res.ok ? ((await res.json()) as T) : null;
}

const fetchStats = async (signal: AbortSignal): Promise<Stats | null> => {
  const channel = (
    await get<ChannelRes>("channels", { part: "statistics,contentDetails", forHandle: config.youtube.handle }, signal)
  )?.items?.[0];
  if (!channel) return null;
  const s = channel.statistics;
  const videos = Number(s.videoCount);

  // The upload list only changes when a video goes up, so it's re-read then.
  let ids = readCache<string[]>(IDS_KEY, Infinity);
  if (!ids || ids.length !== Math.min(videos, 50)) {
    const list = await get<PlaylistRes>(
      "playlistItems",
      { part: "contentDetails", maxResults: "50", playlistId: channel.contentDetails.relatedPlaylists.uploads },
      signal
    );
    ids = list?.items?.map((item) => item.contentDetails.videoId) ?? [];
    writeCache(IDS_KEY, ids);
  }

  // The channel's own view count lags by hours; each video's count is current.
  let views = Number(s.viewCount);
  if (ids.length) {
    const res = await get<VideosRes>("videos", { part: "statistics", id: ids.join(",") }, signal);
    const sum = res?.items?.reduce((total, v) => total + Number(v.statistics.viewCount ?? 0), 0);
    if (sum !== undefined) views = Math.max(sum, views);
  }

  return {
    subscribers: s.hiddenSubscriberCount || s.subscriberCount === undefined ? null : Number(s.subscriberCount),
    videos,
    views,
    at: Date.now(),
  };
};

const useLiveStats = (active: boolean) => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!active || !config.youtube.apiKey) return;
    let controller: AbortController | undefined;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      controller?.abort();
      controller = new AbortController();
      fetchStats(controller.signal)
        .then((result) => {
          if (!result) return;
          writeCache(STATS_KEY, result);
          setStats(result);
        })
        .catch(() => undefined);
    };

    // Coming back within a poll interval reuses the last numbers.
    const cached = readCache<Stats>(STATS_KEY, POLL_MS);
    if (cached) {
      logApiCall({ url: `${API}/channels`, result: "cache", ms: 0 });
      setStats(cached);
    } else {
      refresh();
    }
    const id = window.setInterval(refresh, POLL_MS);
    return () => {
      window.clearInterval(id);
      controller?.abort();
    };
  }, [active]);

  return stats;
};

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const label = "m-0 text-[11px] uppercase tracking-[0.14em] text-smoke";

/** Counts up to its value, and to each new one, with a "+n" when it grows. */
const LiveNumber = ({ value }: { value: number }) => {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  const [gain, setGain] = useState<{ n: number; key: number } | null>(null);
  const previous = useRef<number | null>(null);

  useEffect(() => {
    const first = previous.current === null;
    const from = previous.current ?? 0;
    previous.current = value;
    if (!first && value > from) setGain({ n: value - from, key: Date.now() });
    if (reduce || from === value) {
      setShown(value);
      return;
    }
    const controls = animate(from, value, {
      duration: first ? 1.4 : 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduce]);

  useEffect(() => {
    if (!gain) return;
    const id = window.setTimeout(() => setGain(null), 2400);
    return () => window.clearTimeout(id);
  }, [gain]);

  return (
    <span className="relative">
      {compact.format(shown)}
      <AnimatePresence>
        {gain && (
          <motion.span
            key={gain.key}
            aria-hidden="true"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: -6 }}
            exit={{ opacity: 0, y: -18 }}
            className="absolute -top-2 left-full ml-1.5 rounded-full bg-frost px-1.5 py-0.5 font-mono text-[11px] leading-none text-ink"
          >
            +{compact.format(gain.n)}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

const Updated = ({ at }: { at: number }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const seconds = Math.max(0, Math.round((now - at) / 1000));
  return <>{seconds < 5 ? "just now" : `${seconds}s ago`}</>;
};

const ChannelStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Polls only while the stats are (nearly) on screen.
  const inView = useInView(ref, { margin: "200px" });
  const stats = useLiveStats(inView);

  const items = stats
    ? [
        ...(stats.subscribers !== null ? [{ label: "Subscribers", value: stats.subscribers }] : []),
        { label: stats.videos === 1 ? "Video" : "Videos", value: stats.videos },
        { label: "Views", value: stats.views },
      ]
    : [];
  const next = stats?.subscribers != null ? stats.subscribers + 1 : null;

  return (
    <div ref={ref} data-xray="channel-stats">
      {stats && (
        <dl className="m-0 flex flex-wrap border-t border-paper/15">
          {items.map((item) => (
            <div
              key={item.label}
              className="relative flex min-w-0 flex-1 flex-col-reverse gap-2.5 border-l border-paper/15 px-5 py-6 first:border-l-0 sm:px-8 sm:py-7"
            >
              <dt className={label}>{item.label}</dt>
              <dd className="m-0 font-display text-[52px] leading-[0.9] text-frost sm:text-[80px] lg:text-[96px]">
                <LiveNumber value={item.value} />
              </dd>
            </div>
          ))}
          <div className="flex basis-full flex-col justify-center gap-2 border-t border-paper/15 px-5 py-5 sm:px-8 lg:basis-0 lg:flex-[1.15] lg:border-l lg:border-t-0">
            <p className="m-0 flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-frost">
              <span aria-hidden="true" className="animate-pulse-frost h-2 w-2 rounded-full bg-frost" />
              Live from YouTube
            </p>
            <p className={label}>
              Updated <Updated at={stats.at} /> · every 30 s
            </p>
            {next !== null && (
              <a
                href={`${config.youtube.url}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit flex-wrap items-baseline gap-x-2.5 text-[12px] uppercase tracking-[0.1em] hover:text-frost"
              >
                Be subscriber #{next.toLocaleString("en")} ↗
                <span lang="ar" dir="rtl" className="font-arabic text-[17px] normal-case tracking-normal text-frost">
                  خليك رقم {next.toLocaleString("ar-EG")}
                </span>
              </a>
            )}
          </div>
        </dl>
      )}
    </div>
  );
};

export default ChannelStats;
