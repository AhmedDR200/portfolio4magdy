// Live TikTok numbers for the channel section (a Vercel Function).
//
//   GET /api/tiktok → { followers, likes, videos, views, at }
//
// TikTok has no public API a browser can call, so this reads the public
// profile page, the way a link preview does. It tries two ways: the mobile
// page's embedded JSON (followers, likes and videos), then the social-preview
// description (followers and likes only). Views are the sum of every video's
// play count from the embed page, which TikTok doesn't total anywhere. If TikTok blocks both, it answers 502
// and the page hides the numbers. The edge caches the answer for 30 s, so any
// number of visitors costs one request to TikTok every 30 s.
import type { IncomingMessage, ServerResponse } from "node:http";

const HANDLE = "200tamam";
const PROFILE = `https://www.tiktok.com/@${HANDLE}`;

const MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const PREVIEW = "facebookexternalhit/1.1";

type Stats = { followers: number; likes: number; videos: number | null; views: number | null };

const page = async (userAgent: string, url = PROFILE) => {
  const res = await fetch(url, {
    headers: { "User-Agent": userAgent, "Accept-Language": "en-US,en;q=0.9" },
    signal: AbortSignal.timeout(6000),
  });
  return res.ok ? res.text() : "";
};

const fromJson = (html: string): Stats | null => {
  const match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    const data = JSON.parse(match[1]) as {
      __DEFAULT_SCOPE__?: {
        "webapp.user-detail"?: { userInfo?: { stats?: { followerCount?: number; heartCount?: number; videoCount?: number } } };
      };
    };
    const s = data.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo?.stats;
    if (typeof s?.followerCount !== "number") return null;
    return { followers: s.followerCount, likes: s.heartCount ?? 0, videos: s.videoCount ?? null, views: null };
  } catch {
    return null;
  }
};

// "@handle 483 Followers, 20 Following, 854 Likes - …", with K/M/B suffixes.
const SUFFIX: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };
const count = (n: string, suffix?: string) => Math.round(parseFloat(n.replace(/,/g, "")) * (SUFFIX[suffix?.toUpperCase() ?? ""] ?? 1));

const fromPreview = (html: string): Stats | null => {
  const text = html.match(/og:description" content="([^"]*)/)?.[1] ?? "";
  const followers = text.match(/([\d.,]+)\s*([KMB])?\s*Followers/i);
  const likes = text.match(/([\d.,]+)\s*([KMB])?\s*Likes/i);
  if (!followers) return null;
  return { followers: count(followers[1], followers[2]), likes: likes ? count(likes[1], likes[2]) : 0, videos: null, views: null };
};

// The embed page lists the account's videos with their play counts. It only
// counts if it lists them all, otherwise the sum would understate.
const viewsFrom = (html: string, videos: number | null): number | null => {
  const match = html.match(/<script id="__FRONTITY_CONNECT_STATE__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    const state = JSON.parse(match[1]) as { source?: { data?: Record<string, { videoList?: { playCount?: number }[] }> } };
    const list = Object.values(state.source?.data ?? {}).find((entry) => Array.isArray(entry?.videoList))?.videoList;
    if (!list?.length || (videos !== null && list.length < videos)) return null;
    return list.reduce((total, video) => total + (video.playCount ?? 0), 0);
  } catch {
    return null;
  }
};

const read = async (): Promise<Stats | null> => {
  const stats = fromJson(await page(MOBILE).catch(() => "")) ?? fromPreview(await page(PREVIEW).catch(() => ""));
  if (!stats) return null;
  const views = viewsFrom(await page(MOBILE, `${PROFILE.replace("/@", "/embed/@")}`).catch(() => ""), stats.videos);
  return { ...stats, views };
};

const send = (res: ServerResponse, status: number, body: unknown, cache = "no-store") => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify(body));
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") return send(res, 405, { error: "GET" });
  const stats = await read();
  if (!stats) return send(res, 502, { error: "Couldn't read TikTok." });
  send(res, 200, { ...stats, at: Date.now() }, "public, s-maxage=30, stale-while-revalidate=120");
}
