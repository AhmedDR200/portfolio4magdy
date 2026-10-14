import { useSyncExternalStore } from "react";

export type ApiCall = { url: string; result: number | "cache" | "error"; ms: number };

// A record of the live API calls this page makes, shown in X-ray mode.
let calls: ApiCall[] = [];
const listeners = new Set<() => void>();

export const logApiCall = (call: ApiCall) => {
  calls = [...calls, call].slice(-8);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useApiCalls = () => useSyncExternalStore(subscribe, () => calls);

/** fetch() that also records its URL, status and duration. */
export const loggedFetch = async (url: string, init?: RequestInit) => {
  const start = performance.now();
  try {
    const res = await fetch(url, init);
    logApiCall({ url, result: res.status, ms: Math.round(performance.now() - start) });
    return res;
  } catch (err) {
    if (!init?.signal?.aborted) logApiCall({ url, result: "error", ms: Math.round(performance.now() - start) });
    throw err;
  }
};
