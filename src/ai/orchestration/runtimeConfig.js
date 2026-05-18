export const AI_RUNTIME_CONFIG = {
  memoryTtlMs: 1000 * 60 * 10,
  insightsTtlMs: 1000 * 60 * 5,
  requestWindowMs: 1000 * 60,
  maxRequestsPerWindow: 8,
  vectorProvider: "pinecone-later",
  cacheProvider: "upstash-later",
};
