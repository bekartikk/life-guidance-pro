const cache = new Map();
const rateWindows = new Map();

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${key}:${stableSerialize(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function createCacheKey(namespace, payload) {
  return `${namespace}:${stableSerialize(payload)}`;
}

export function getCachedValue(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

export function setCachedValue(key, value, ttlMs) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + Math.max(1000, Number(ttlMs) || 60000),
  });
}

export function consumeRateLimit(key, { windowMs = 60000, max = 8 } = {}) {
  const now = Date.now();
  const entry = rateWindows.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    rateWindows.set(key, { windowStart: now, count: 1 });
    return { allowed: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: Math.max(0, max - entry.count) };
}
