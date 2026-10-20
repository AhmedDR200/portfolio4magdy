import { useEffect, useState } from "react";

import { logApiCall, loggedFetch } from "../../utils/apiLog";
import { readCache, writeCache } from "../../utils/sessionCache";

type Stats = { followers: number; likes: number; videos: number | null; views: number | null; at: number };

const ENDPOINT = "/api/tiktok";
const POLL_MS = 30_000;
const STATS_KEY = "tiktok-stats";

// Live numbers for the TikTok account, from api/tiktok.ts (TikTok has no
// public API a browser can call). Refreshed every 30 s while they're on
// screen and the tab is open; if the function fails, nothing is shown.
export const useTikTokStats = (active: boolean) => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!active) return;
    let controller: AbortController | undefined;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      controller?.abort();
      controller = new AbortController();
      loggedFetch(ENDPOINT, { signal: controller.signal })
        .then((res) => (res.ok ? (res.json() as Promise<Stats>) : null))
        .then((result) => {
          if (typeof result?.followers !== "number") return;
          writeCache(STATS_KEY, result);
          setStats(result);
        })
        .catch(() => undefined);
    };

    const cached = readCache<Stats>(STATS_KEY, POLL_MS);
    if (cached) {
      logApiCall({ url: ENDPOINT, result: "cache", ms: 0 });
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
