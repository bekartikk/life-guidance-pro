import { dbRuntimeConfig, isSupabaseMirrorReady } from "../config.js";
import { getAdaptiveRepository } from "../repositories/index.js";
import { retrieveSemanticAdaptiveMemories } from "../retrieval/vectorMemoryService.js";

const CACHE_TTL_MS = 60_000;
const insightCache = new Map();

function toDayLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Now";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getWeekKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "This week";
  const normalized = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = normalized.getUTCDay() || 7;
  normalized.setUTCDate(normalized.getUTCDate() - day + 1);
  return normalized.toISOString().slice(0, 10);
}

function buildBehaviorHistory(rows) {
  return [...rows]
    .reverse()
    .map((row) => ({
      date: row.created_at,
      label: toDayLabel(row.created_at),
      burnoutRisk: clampScore(row.burnout_risk_score),
      momentum: clampScore(row.momentum_score),
      cognitiveLoad: clampScore(row.cognitive_load_score),
      workspaceMode: row.workspace_mode || "focus",
    }));
}

function buildWeeklySummaries(rows) {
  const groups = new Map();

  rows.forEach((row) => {
    const key = getWeekKey(row.created_at);
    const existing = groups.get(key) || [];
    existing.push(row);
    groups.set(key, existing);
  });

  return [...groups.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .slice(-4)
    .map(([key, items]) => {
      const modes = items.reduce((accumulator, item) => {
        const mode = item.workspace_mode || "focus";
        accumulator[mode] = (accumulator[mode] || 0) + 1;
        return accumulator;
      }, {});

      const dominantMode =
        Object.entries(modes).sort((left, right) => right[1] - left[1])[0]?.[0] || "focus";

      return {
        label: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(key)),
        burnoutRisk: average(items.map((item) => clampScore(item.burnout_risk_score))),
        momentum: average(items.map((item) => clampScore(item.momentum_score))),
        cognitiveLoad: average(items.map((item) => clampScore(item.cognitive_load_score))),
        workspaceMode: dominantMode,
      };
    });
}

function buildInsightFeed({ behaviorHistory, recommendationHistory, memoryHistory }) {
  const feed = [];
  const latestBehavior = behaviorHistory[behaviorHistory.length - 1];

  if (latestBehavior) {
    feed.push({
      id: `mode-${latestBehavior.date}`,
      kind: "mode",
      title: `${latestBehavior.workspaceMode} mode is leading`,
      detail:
        latestBehavior.burnoutRisk >= 70
          ? "The latest mirrored snapshot shows pressure rising, so recovery-aware adjustments matter more."
          : "The latest mirrored snapshot shows enough stability to keep the current mode steady.",
      createdAt: latestBehavior.date,
    });
  }

  recommendationHistory.slice(0, 3).forEach((item) => {
    feed.push({
      id: item.id,
      kind: item.recommendation_type || "adaptive",
      title: item.title || "Adaptive recommendation",
      detail: item.why || item.detail || "Derived from recent mirrored behavior signals.",
      createdAt: item.created_at,
    });
  });

  memoryHistory.slice(0, 2).forEach((item) => {
    feed.push({
      id: item.id,
      kind: "memory",
      title: item.summary || "Memory snapshot stored",
      detail: `Saved under ${item.memory_scope || "adaptive guidance"} to improve future retrieval quality.`,
      createdAt: item.created_at,
    });
  });

  return feed.slice(0, 6);
}

function buildDisabledPayload(reason = "Supabase mirror is not enabled yet.") {
  return {
    enabled: false,
    source: "firebase-primary",
    reason,
    realtimeReady: dbRuntimeConfig.enableRealtimeMirror,
    feed: [],
    burnoutHistory: [],
    momentumHistory: [],
    cognitiveLoadHistory: [],
    recommendationHistory: [],
    weeklySummaries: [],
    semanticMemories: [],
    semanticSummary: { headline: "No semantic memories yet", bullets: [] },
  };
}

function getCacheKey(userId) {
  return `adaptive-insights:${userId}`;
}

export async function loadAdaptiveInsights({ userId }) {
  if (!userId) {
    return buildDisabledPayload("Missing user context for adaptive insights.");
  }

  const cacheKey = getCacheKey(userId);
  const cached = insightCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  if (!isSupabaseMirrorReady()) {
    return buildDisabledPayload();
  }

  const repository = getAdaptiveRepository();
  const snapshot = await repository.getInsightsSnapshot({ externalUserId: userId });
  if (!snapshot.ok) {
    return buildDisabledPayload(snapshot.error || "Supabase insights are not available yet.");
  }

  const behaviorHistory = buildBehaviorHistory(snapshot.data.behaviorHistory || []);
  const recommendationHistory = snapshot.data.recommendationHistory || [];
  const memoryHistory = snapshot.data.memoryHistory || [];
  const latestBehavior = behaviorHistory[behaviorHistory.length - 1] || null;
  const semanticMemory = await retrieveSemanticAdaptiveMemories({
    userId,
    aiContext: {
      behavioralSignals: {
        burnoutRiskScore: latestBehavior?.burnoutRisk || 0,
        avgEnergy: latestBehavior ? Math.max(1, Math.round(latestBehavior.momentum / 20)) : 0,
        avgStress: latestBehavior ? Math.max(1, Math.round(latestBehavior.cognitiveLoad / 20)) : 0,
        lifeState: { label: latestBehavior?.workspaceMode || "focus" },
      },
    },
    previousPlan: recommendationHistory.slice(0, 2).map((item) => item.title).join(" | "),
  });

  const payload = {
    enabled: true,
    source: snapshot.provider || "supabase",
    realtimeReady: dbRuntimeConfig.enableRealtimeMirror,
    feed: buildInsightFeed({ behaviorHistory, recommendationHistory, memoryHistory }),
    burnoutHistory: behaviorHistory.map((item) => ({
      label: item.label,
      value: item.burnoutRisk,
      date: item.date,
    })),
    momentumHistory: behaviorHistory.map((item) => ({
      label: item.label,
      value: item.momentum,
      date: item.date,
    })),
    cognitiveLoadHistory: behaviorHistory.map((item) => ({
      label: item.label,
      value: item.cognitiveLoad,
      date: item.date,
    })),
    recommendationHistory: recommendationHistory.map((item) => ({
      id: item.id,
      type: item.recommendation_type || "adaptive",
      title: item.title || "Adaptive recommendation",
      detail: item.detail || "",
      why: item.why || "",
      priority: item.priority || 0,
      createdAt: item.created_at,
    })),
    weeklySummaries: buildWeeklySummaries(snapshot.data.behaviorHistory || []),
    memoryHistory: memoryHistory.map((item) => ({
      id: item.id,
      summary: item.summary || "Adaptive memory snapshot",
      scope: item.memory_scope || "adaptive_guidance",
      createdAt: item.created_at,
    })),
    semanticMemories: semanticMemory.memories || [],
    semanticSummary: semanticMemory.summary || { headline: "No semantic memories yet", bullets: [] },
  };

  insightCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  });

  return payload;
}
