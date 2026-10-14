// A small sessionStorage cache for data read from public APIs, so a visitor
// makes at most one call per key in `maxAgeMs`. Storage can be blocked, in
// which case everything is simply fetched again.
export const readCache = <T>(key: string, maxAgeMs: number): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, value } = JSON.parse(raw) as { at: number; value: T };
    return Date.now() - at < maxAgeMs ? value ?? null : null;
  } catch {
    return null;
  }
};

export const writeCache = <T>(key: string, value: T) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), value }));
  } catch {
    // Ignored: see above.
  }
};
