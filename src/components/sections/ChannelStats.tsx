import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";

import { config } from "../../constants/config";
import { logApiCall, loggedFetch } from "../../utils/apiLog";
import { readCache, writeCache } from "../../utils/sessionCache";
import Arrow from "../atoms/Arrow";
import { useTikTokStats } from "./TikTokStats";

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
  const channel = (await get<ChannelRes>("channels", { part: "statistics,contentDetails", forHandle: config.youtube.handle }, signal))?.items?.[0];
  if (!channel) return null;
  const s = channel.statistics;
  const videos = Number(s.videoCount);

  // The upload list only changes when a video goes up, so it's re-read then.
  let ids = readCache<string[]>(IDS_KEY, Infinity);
  if (!ids || ids.length !== Math.min(videos, 50)) {
    const list = await get<PlaylistRes>(
      "playlistItems",
      { part: "contentDetails", maxResults: "50", playlistId: channel.contentDetails.relatedPlaylists.uploads },
      signal,
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

const useYouTubeStats = (active: boolean) => {
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

export const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const label = "m-0 text-[11px] uppercase tracking-[0.14em] text-smoke";

/** Counts up to its value, and to each new one, with a "+n" when it grows. */
export const LiveNumber =({ value }: { value: number }) => {
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

export const Updated = ({ at }: { at: number }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const seconds = Math.max(0, Math.round((now - at) / 1000));
  return <>{seconds < 5 ? "just now" : `${seconds}s ago`}</>;
};

const cell = "font-display text-[44px] leading-[0.9] text-frost sm:text-[56px] lg:text-[72px]";
const columns = "grid grid-cols-2 gap-x-4 gap-y-5 px-5 sm:grid-cols-[150px_repeat(4,minmax(0,1fr))] sm:items-center sm:gap-x-5 sm:px-8 lg:grid-cols-[200px_repeat(4,minmax(0,1fr))]";

type Row = { name: string; handle: string; values: (number | null)[] };

// YouTube and TikTok as one ledger: a row each, the same four columns.
const ChannelStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Polls only while the stats are (nearly) on screen.
  const inView = useInView(ref, { margin: "200px" });
  const youtube = useYouTubeStats(inView);
  const tiktok = useTikTokStats(inView);

  const rows: Row[] = [
    ...(youtube ? [{ name: "YouTube", handle: config.youtube.handle, values: [youtube.subscribers, null, youtube.views, youtube.videos] }] : []),
    ...(tiktok ? [{ name: "TikTok", handle: config.tiktok.handle, values: [tiktok.followers, tiktok.likes, tiktok.views, tiktok.videos] }] : []),
  ];
  const columnLabels = ["Followers", "Likes", "Views", "Videos"];
  const at = Math.max(youtube?.at ?? 0, tiktok?.at ?? 0);
  const next = youtube?.subscribers != null ? youtube.subscribers + 1 : null;

  return (
    <div ref={ref} data-xray="channel-stats">
      {rows.length > 0 && (
        <div className="border-t border-paper/15">
          <div className={`${columns} hidden py-4 ${label} sm:grid`}>
            <p className="m-0 flex items-center gap-2 text-frost">
              <span aria-hidden="true" className="animate-pulse-frost h-2 w-2 rounded-full bg-frost" />
              Live · 30 s
            </p>
            {columnLabels.map((name) => (
              <p key={name} className="m-0">
                {name}
              </p>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row.name} className={`${columns} border-t border-paper/15 py-6 sm:py-7`}>
              <div className="col-span-2 flex items-baseline gap-3 sm:col-span-1 sm:flex-col sm:gap-2">
                <h4 className="m-0 text-[14px] font-bold uppercase tracking-[0.16em]">{row.name}</h4>
                <p className="m-0 text-[12px] text-smoke">{row.handle}</p>
              </div>
              {row.values.map((value, i) => (
                <div key={columnLabels[i]} className="flex flex-col-reverse gap-2">
                  <p className={`${label} sm:hidden`}>{columnLabels[i]}</p>
                  {value === null ? (
                    <span aria-label="Not available" className={`${cell} text-dim`}>
                      —
                    </span>
                  ) : (
                    <span className={cell}>
                      <LiveNumber value={value} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-paper/15 px-5 py-4 text-[12px] uppercase tracking-[0.1em] sm:px-8">
            <p className={label}>
              <span className="sm:hidden">Live · every 30 s · </span>Updated <Updated at={at} />
            </p>
            <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
              <a
                href={`${config.youtube.url}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-baseline gap-x-2.5 hover:text-frost"
              >
                {next !== null ? `Be subscriber #${next.toLocaleString("en")}` : "Subscribe on YouTube"} <Arrow dir="up-right" />
                {next !== null && (
                  <span lang="ar" dir="rtl" className="font-arabic text-[17px] normal-case tracking-normal text-frost">
                    خليك رقم {next.toLocaleString("ar-EG")}
                  </span>
                )}
              </a>
              <a href={config.tiktok.url} target="_blank" rel="noopener noreferrer" className="flex items-baseline gap-2.5 hover:text-frost">
                Follow on TikTok <Arrow dir="up-right" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelStats;
