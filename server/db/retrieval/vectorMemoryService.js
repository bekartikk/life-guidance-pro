import { createCacheKey, getCachedValue, setCachedValue } from "../../ai/cache/runtimeCache.js";
import { isSupabaseMirrorReady, dbRuntimeConfig } from "../config.js";
import { getAdaptiveRepository } from "../repositories/index.js";
import { buildEmbeddingVector } from "../embeddings/openaiEmbeddingProvider.js";
import {
  buildAdaptiveRetrievalSignals,
  buildRetrievalQueryText,
  buildSemanticMemorySummary,
} from "./adaptiveContextBuilder.js";

const VECTOR_CACHE_TTL_MS = 120_000;

export async function retrieveSemanticAdaptiveMemories({
  userEmail = "",
  userId = "",
  profile = {},
  aiContext = {},
  previousPlan = "",
  followUpPrompt = "",
}) {
  if (!isSupabaseMirrorReady() || !dbRuntimeConfig.enableEmbeddings) {
    return {
      enabled: false,
      source: "firebase-primary",
      memories: [],
      summary: buildSemanticMemorySummary([]),
    };
  }

  const queryText = buildRetrievalQueryText({
    profile,
    aiContext,
    previousPlan,
    followUpPrompt,
  });

  if (!queryText.trim()) {
    return {
      enabled: false,
      source: "supabase-no-query",
      memories: [],
      summary: buildSemanticMemorySummary([]),
    };
  }

  const cacheKey = createCacheKey("semantic-memory", {
    userKey: userId || userEmail || "anonymous",
    queryText,
  });
  const cached = getCachedValue(cacheKey);
  if (cached) return cached;

  const embeddingVector = await buildEmbeddingVector(queryText);
  if (!embeddingVector) {
    return {
      enabled: false,
      source: "embedding-unavailable",
      memories: [],
      summary: buildSemanticMemorySummary([]),
    };
  }

  const repository = getAdaptiveRepository();
  const result = await repository.getRelevantMemories({
    externalUserId: userId || userEmail,
    embeddingVector,
    querySignals: buildAdaptiveRetrievalSignals(aiContext),
  });

  const payload = {
    enabled: Boolean(result.ok),
    source: result.provider || "supabase",
    memories: result.data?.memories || [],
    summary: buildSemanticMemorySummary(result.data?.memories || []),
  };

  setCachedValue(cacheKey, payload, VECTOR_CACHE_TTL_MS);
  return payload;
}
