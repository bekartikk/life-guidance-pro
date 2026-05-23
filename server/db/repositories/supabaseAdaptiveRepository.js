import { getSupabaseAdmin } from "../supabaseAdmin.js";
import { buildEmbeddingVector } from "../embeddings/openaiEmbeddingProvider.js";
import { dbRuntimeConfig } from "../config.js";
import { clearEmbeddingPending, markEmbeddingPending } from "../retrieval/embeddingQueueHelpers.js";
import { rankSemanticMemories } from "../retrieval/memoryRankingEngine.js";

function nowIso() {
  return new Date().toISOString();
}

async function insertOrIgnore(client, table, payload) {
  const { error, data } = await client.from(table).insert(payload).select();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export const supabaseAdaptiveRepository = {
  async persistMemorySnapshot({ authContext, aiMeta, memory }) {
    const client = await getSupabaseAdmin();
    if (!client) return { ok: false, provider: "supabase-not-configured" };

    const summary = memory?.behaviorPatterns?.lifeState || aiMeta?.memorySummary?.headline || "Adaptive guidance memory";
    const queueState = markEmbeddingPending({
      externalUserId: authContext.externalUserId,
      summary,
    });
    if (queueState.duplicate) {
      return { ok: true, provider: "supabase", duplicate: true };
    }
    const embeddingVector = await buildEmbeddingVector(summary);
    try {
      return await insertOrIgnore(client, "ai_memory_snapshots", {
        external_user_id: authContext.externalUserId,
        external_email: authContext.externalEmail,
        memory_scope: "adaptive_guidance",
        summary,
        memory_json: memory,
        embedding_status: embeddingVector ? "ready" : dbRuntimeConfig.enableEmbeddings ? "failed" : "pending",
        embedding_model: embeddingVector ? dbRuntimeConfig.embeddingModel : null,
        embedding_vector: embeddingVector,
        created_at: nowIso(),
      });
    } finally {
      clearEmbeddingPending({
        externalUserId: authContext.externalUserId,
        summary,
      });
    }
  },

  async persistBehaviorSnapshot({ authContext, aiContext, aiMeta }) {
    const client = await getSupabaseAdmin();
    if (!client) return { ok: false, provider: "supabase-not-configured" };

    return insertOrIgnore(client, "ai_behavior_snapshots", {
      external_user_id: authContext.externalUserId,
      external_email: authContext.externalEmail,
      workspace_mode: aiContext?.workspace?.mode || aiMeta?.roadmapIntelligence?.dominantMode || "focus",
      burnout_risk_score: aiMeta?.adaptiveState?.burnoutRisk || aiContext?.behavioralSignals?.burnoutRiskScore || 0,
      momentum_score: aiMeta?.adaptiveState?.momentumScore || aiContext?.progress?.momentumPoints || 0,
      cognitive_load_score: aiMeta?.adaptiveState?.cognitiveLoadScore || 0,
      behavior_json: aiContext,
      created_at: nowIso(),
    });
  },

  async persistRecommendations({ authContext, aiMeta }) {
    const client = await getSupabaseAdmin();
    if (!client) return { ok: false, provider: "supabase-not-configured" };
    const recommendations = Array.isArray(aiMeta?.recommendations) ? aiMeta.recommendations : [];
    if (!recommendations.length) return { ok: true, data: [] };

    const rows = recommendations.map((item, index) => ({
      external_user_id: authContext.externalUserId,
      external_email: authContext.externalEmail,
      recommendation_type: item.type || "adaptive",
      title: item.title || `Recommendation ${index + 1}`,
      detail: item.detail || "",
      why: item.why || "",
      priority: index + 1,
      recommendation_json: item,
      created_at: nowIso(),
    }));

    return insertOrIgnore(client, "ai_recommendations", rows);
  },

  async persistConversation({ authContext, kind, planId, prompt, responseText, structuredPayload, aiMeta }) {
    const client = await getSupabaseAdmin();
    if (!client) return { ok: false, provider: "supabase-not-configured" };

    const conversation = await insertOrIgnore(client, "ai_conversations", {
      external_user_id: authContext.externalUserId,
      external_email: authContext.externalEmail,
      conversation_type: kind,
      current_plan_id: planId || null,
      metadata_json: {
        provider: aiMeta?.provider || "unknown",
        model: aiMeta?.model || "unknown",
        personality: aiMeta?.personality?.label || null,
      },
      created_at: nowIso(),
      updated_at: nowIso(),
    });

    const conversationId = conversation?.data?.[0]?.id;
    if (!conversationId) return conversation;

    return insertOrIgnore(client, "ai_conversation_messages", [
      {
        conversation_id: conversationId,
        role: "user",
        content: prompt || "",
        structured_payload: null,
        created_at: nowIso(),
      },
      {
        conversation_id: conversationId,
        role: "assistant",
        content: responseText || "",
        structured_payload: structuredPayload || null,
        created_at: nowIso(),
      },
    ]);
  },

  async persistUsageEvent({ authContext, endpoint, status, aiMeta, cacheHit, latencyMs, payload }) {
    const client = await getSupabaseAdmin();
    if (!client) return { ok: false, provider: "supabase-not-configured" };

    return insertOrIgnore(client, "ai_usage_events", {
      external_user_id: authContext.externalUserId,
      external_email: authContext.externalEmail,
      endpoint,
      provider: aiMeta?.provider || "unknown",
      model: aiMeta?.model || "unknown",
      status,
      cache_hit: Boolean(cacheHit),
      latency_ms: latencyMs || null,
      payload_json: payload || {},
      created_at: nowIso(),
    });
  },

  async getInsightsSnapshot({ externalUserId, historyLimit = 28, recommendationLimit = 12 }) {
    const client = await getSupabaseAdmin();
    if (!client || !externalUserId) {
      return {
        ok: false,
        provider: "supabase-not-configured",
        data: {
          behaviorHistory: [],
          recommendationHistory: [],
          memoryHistory: [],
        },
      };
    }

    const [
      behaviorResponse,
      recommendationResponse,
      memoryResponse,
    ] = await Promise.all([
      client
        .from("ai_behavior_snapshots")
        .select("workspace_mode,burnout_risk_score,momentum_score,cognitive_load_score,created_at")
        .eq("external_user_id", externalUserId)
        .order("created_at", { ascending: false })
        .limit(historyLimit),
      client
        .from("ai_recommendations")
        .select("id,recommendation_type,title,detail,why,priority,created_at")
        .eq("external_user_id", externalUserId)
        .order("created_at", { ascending: false })
        .limit(recommendationLimit),
      client
        .from("ai_memory_snapshots")
        .select("id,summary,memory_scope,created_at")
        .eq("external_user_id", externalUserId)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const firstError =
      behaviorResponse.error ||
      recommendationResponse.error ||
      memoryResponse.error;

    if (firstError) {
      return {
        ok: false,
        provider: "supabase",
        error: firstError.message,
        data: {
          behaviorHistory: [],
          recommendationHistory: [],
          memoryHistory: [],
        },
      };
    }

    return {
      ok: true,
      provider: "supabase",
      data: {
        behaviorHistory: behaviorResponse.data || [],
        recommendationHistory: recommendationResponse.data || [],
        memoryHistory: memoryResponse.data || [],
      },
    };
  },

  async getRelevantMemories({ externalUserId, embeddingVector, querySignals, limit = 6 }) {
    const client = await getSupabaseAdmin();
    if (!client || !externalUserId || !Array.isArray(embeddingVector) || !embeddingVector.length) {
      return {
        ok: false,
        provider: "supabase-not-configured",
        data: { memories: [] },
      };
    }

    const { data, error } = await client.rpc("match_ai_memory_snapshots", {
      query_embedding: embeddingVector,
      filter_external_user_id: externalUserId,
      match_count: limit,
    });

    if (error) {
      return {
        ok: false,
        provider: "supabase",
        error: error.message,
        data: { memories: [] },
      };
    }

    return {
      ok: true,
      provider: "supabase",
      data: {
        memories: rankSemanticMemories({
          rows: data || [],
          querySignals,
          limit: Math.min(limit, 4),
        }),
      },
    };
  },
};
