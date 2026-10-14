// "Tip your hat": one shared counter for every visitor (a Vercel Function).
//
//   GET  /api/tip → { count, countries, latest }
//   POST /api/tip → the same, after counting this visitor's tip
//
// Storage is Upstash Redis over its REST API (no SDK). Connect Upstash to the
// Vercel project from Vercel's Storage tab; it sets KV_REST_API_URL and
// KV_REST_API_TOKEN (UPSTASH_REDIS_REST_URL / _TOKEN also work). Each visitor
// counts once a day: a salted hash of their IP is kept for 24 hours, never the
// IP itself. The country comes from Vercel's geo header.
import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = (string | number)[];

const redis = async (commands: Command[]) => {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  return ((await res.json()) as { result: unknown }[]).map((r) => r.result);
};

const header = (req: IncomingMessage, name: string) => {
  const value = req.headers[name];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

const send = (res: ServerResponse, status: number, body: unknown, cache = "no-store") => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify(body));
};

const READ: Command[] = [
  ["GET", "tips:count"],
  ["SCARD", "tips:countries"],
  ["LRANGE", "tips:latest", 0, 4],
];

const shape = ([count, countries, latest]: unknown[]) => ({
  count: Number(count ?? 0),
  countries: Number(countries ?? 0),
  latest: (latest as string[] | null) ?? [],
});

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!REDIS_URL || !TOKEN) return send(res, 503, { error: "Tip storage isn't connected yet." });

  try {
    if (req.method === "GET") {
      return send(res, 200, shape(await redis(READ)), "public, s-maxage=30, stale-while-revalidate=60");
    }
    if (req.method !== "POST") return send(res, 405, { error: "GET or POST" });

    const ip = header(req, "x-forwarded-for").split(",")[0].trim() || "unknown";
    const day = new Date().toISOString().slice(0, 10);
    const visitor = createHash("sha256").update(`${TOKEN}:${day}:${ip}`).digest("hex").slice(0, 24);
    const [fresh] = await redis([["SET", `tips:seen:${visitor}`, "1", "NX", "EX", 86_400]]);
    if (fresh !== "OK") return send(res, 200, { ...shape(await redis(READ)), already: true });

    const country = header(req, "x-vercel-ip-country").toUpperCase().slice(0, 2) || "??";
    const results = await redis([
      ["INCR", "tips:count"],
      ["SADD", "tips:countries", country],
      ["LPUSH", "tips:latest", country],
      ["LTRIM", "tips:latest", 0, 4],
      ...READ,
    ]);
    return send(res, 200, shape(results.slice(4)));
  } catch {
    return send(res, 502, { error: "Couldn't reach tip storage." });
  }
}
