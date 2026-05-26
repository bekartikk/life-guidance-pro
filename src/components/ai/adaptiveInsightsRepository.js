const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const insightCache = new Map();
const CACHE_TTL_MS = 60_000;

function getCacheKey(userId) {
  return `adaptive-insights:${userId}`;
}

export async function fetchAdaptiveInsights({ userId, signal }) {
  if (!userId) {
    return null;
  }

  const cacheKey = getCacheKey(userId);
  const cached = insightCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  const response = await fetch(
    `${API_BASE}/api/adaptive-insights?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
      signal,
    },
  );

  if (!response.ok) {
    throw new Error("Adaptive insights request failed.");
  }

  const payload = await response.json();
  insightCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  });

  return payload;
}

export function primeAdaptiveInsightsCache(userId, payload) {
  if (!userId || !payload) return;
  insightCache.set(getCacheKey(userId), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  });
}
