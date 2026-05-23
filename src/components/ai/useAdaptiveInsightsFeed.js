import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAdaptiveInsights, primeAdaptiveInsightsCache } from "./adaptiveInsightsRepository.js";
import { subscribeToAdaptiveRecommendations } from "../../data/hybrid/realtimeSubscriptions.js";

const ADAPTIVE_INSIGHTS_TIMEOUT_MS = 7000;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toShortLabel(value, index) {
  if (!value) return `D${index + 1}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `D${index + 1}`;
  return new Intl.DateTimeFormat("en", { weekday: "narrow" }).format(date);
}

function buildFallbackHistories(checkins = []) {
  const recent = checkins.slice(0, 7).reverse();
  if (!recent.length) {
    return {
      burnoutHistory: [],
      momentumHistory: [],
      cognitiveLoadHistory: [],
    };
  }

  const points = recent.map((item, index) => {
    const stress = Number(item?.stress || 0);
    const focus = Number(item?.focus || 0);
    const energy = Number(item?.energy || 0);
    const sleep = Number(item?.sleepQuality || 0);
    const productivity = Number(item?.productivity || 0);

    return {
      label: toShortLabel(item?.date, index),
      date: item?.date || null,
      burnout: clamp(Math.round((stress * 16) + ((6 - sleep) * 8)), 10, 96),
      momentum: clamp(Math.round((productivity * 16) + (energy * 6)), 10, 96),
      load: clamp(Math.round((stress * 15) + ((6 - focus) * 10)), 10, 96),
    };
  });

  return {
    burnoutHistory: points.map((item) => ({ label: item.label, value: item.burnout, date: item.date })),
    momentumHistory: points.map((item) => ({ label: item.label, value: item.momentum, date: item.date })),
    cognitiveLoadHistory: points.map((item) => ({ label: item.label, value: item.load, date: item.date })),
  };
}

function buildFallbackPayload({ activeAiMeta, adaptiveWorkspace, behavioralInsights, checkins }) {
  const histories = buildFallbackHistories(checkins);
  const fallbackRecommendations = Array.isArray(activeAiMeta?.recommendations)
    ? activeAiMeta.recommendations
    : behavioralInsights.adaptiveRecommendations.map((detail, index) => ({
        id: `local-${index}`,
        type: "adaptive",
        title: "Adaptive recommendation",
        detail,
        why: "Derived from your current local behavior signals.",
        priority: index + 1,
        createdAt: null,
      }));

  return {
    enabled: false,
    source: "local-fallback",
    realtimeReady: false,
    feed: adaptiveWorkspace.insightFeed || [],
    burnoutHistory: histories.burnoutHistory,
    momentumHistory: histories.momentumHistory,
    cognitiveLoadHistory: histories.cognitiveLoadHistory,
    recommendationHistory: fallbackRecommendations,
    weeklySummaries: [
      {
        label: "This week",
        burnoutRisk: behavioralInsights.burnoutRisk.score,
        momentum: clamp(progressiveMomentum(activeAiMeta, behavioralInsights), 0, 100),
        cognitiveLoad: clamp((behavioralInsights.metrics.avgStress || 3) * 18, 10, 96),
        workspaceMode: adaptiveWorkspace.workspaceMode.label,
      },
    ],
    semanticMemories: [],
    semanticSummary: { headline: "No semantic memories yet", bullets: [] },
  };
}

function progressiveMomentum(activeAiMeta, behavioralInsights) {
  return Number(
    activeAiMeta?.adaptiveState?.momentumScore ||
      behavioralInsights.metrics?.completionRatio * 100 ||
      0,
  );
}

function mergePayload(remotePayload, fallbackPayload) {
  const safeRemotePayload = remotePayload && typeof remotePayload === "object" ? remotePayload : null;

  if (!safeRemotePayload?.enabled) {
    return fallbackPayload;
  }

  return {
    ...fallbackPayload,
    ...safeRemotePayload,
    feed: Array.isArray(safeRemotePayload.feed) && safeRemotePayload.feed.length ? safeRemotePayload.feed : fallbackPayload.feed,
    burnoutHistory: Array.isArray(safeRemotePayload.burnoutHistory) && safeRemotePayload.burnoutHistory.length ? safeRemotePayload.burnoutHistory : fallbackPayload.burnoutHistory,
    momentumHistory: Array.isArray(safeRemotePayload.momentumHistory) && safeRemotePayload.momentumHistory.length ? safeRemotePayload.momentumHistory : fallbackPayload.momentumHistory,
    cognitiveLoadHistory: Array.isArray(safeRemotePayload.cognitiveLoadHistory) && safeRemotePayload.cognitiveLoadHistory.length
      ? safeRemotePayload.cognitiveLoadHistory
      : fallbackPayload.cognitiveLoadHistory,
    recommendationHistory: Array.isArray(safeRemotePayload.recommendationHistory) && safeRemotePayload.recommendationHistory.length
      ? safeRemotePayload.recommendationHistory
      : fallbackPayload.recommendationHistory,
    weeklySummaries: Array.isArray(safeRemotePayload.weeklySummaries) && safeRemotePayload.weeklySummaries.length ? safeRemotePayload.weeklySummaries : fallbackPayload.weeklySummaries,
    semanticMemories: Array.isArray(safeRemotePayload.semanticMemories) && safeRemotePayload.semanticMemories.length ? safeRemotePayload.semanticMemories : fallbackPayload.semanticMemories,
    semanticSummary:
      safeRemotePayload.semanticSummary && typeof safeRemotePayload.semanticSummary === "object" && safeRemotePayload.semanticSummary.headline
        ? safeRemotePayload.semanticSummary
        : fallbackPayload.semanticSummary,
  };
}

function withTimeout(promise, timeoutMs, fallbackValue = null) {
  let timeoutId = null;

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = window.setTimeout(() => resolve(fallbackValue), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  });
}

export function useAdaptiveInsightsFeed({
  userId,
  activeAiMeta,
  adaptiveWorkspace,
  behavioralInsights,
  checkins,
}) {
  const requestIdRef = useRef(0);
  const fallbackPayloadRef = useRef(null);
  const safeBehavioralInsights = useMemo(
    () =>
      behavioralInsights && typeof behavioralInsights === "object"
        ? behavioralInsights
        : {
            adaptiveRecommendations: [],
            burnoutRisk: { score: 0 },
            metrics: { avgStress: 3, completionRatio: 0 },
          },
    [behavioralInsights],
  );
  const safeAdaptiveWorkspace = useMemo(
    () =>
      adaptiveWorkspace && typeof adaptiveWorkspace === "object"
        ? adaptiveWorkspace
        : {
            insightFeed: [],
            workspaceMode: { label: "Focus" },
          },
    [adaptiveWorkspace],
  );
  const fallbackPayload = useMemo(
    () =>
      buildFallbackPayload({
        activeAiMeta,
        adaptiveWorkspace: safeAdaptiveWorkspace,
        behavioralInsights: safeBehavioralInsights,
        checkins,
      }),
    [
      activeAiMeta,
      safeAdaptiveWorkspace,
      safeBehavioralInsights,
      checkins,
    ],
  );
  useEffect(() => {
    fallbackPayloadRef.current = fallbackPayload;
  }, [fallbackPayload]);

  const [remotePayload, setRemotePayload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!userId) {
      const resetTimer = window.setTimeout(() => {
        setRemotePayload(null);
        setIsLoading(false);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const controller = new AbortController();
    let cancelled = false;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    async function load() {
      setIsLoading(true);
      try {
        const nextRemotePayload = await withTimeout(
          fetchAdaptiveInsights({
            userId,
            signal: controller.signal,
          }),
          ADAPTIVE_INSIGHTS_TIMEOUT_MS,
          null,
        );
        if (cancelled || requestId !== requestIdRef.current) return;

        if (!nextRemotePayload || typeof nextRemotePayload !== "object") {
          setRemotePayload(null);
          return;
        }

        const merged = mergePayload(nextRemotePayload, fallbackPayloadRef.current);
        primeAdaptiveInsightsCache(userId, merged);
        setRemotePayload(nextRemotePayload);
      } catch {
        if (!cancelled && requestId === requestIdRef.current) {
          setRemotePayload(null);
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [refreshTick, userId]);

  useEffect(() => {
    if (!userId) return undefined;

    let unsubscribe = () => {};
    let cancelled = false;

    async function wireRealtime() {
      unsubscribe = await subscribeToAdaptiveRecommendations({
        userId,
        onUpdate: () => {
          if (!cancelled) {
            setRefreshTick((current) => current + 1);
          }
        },
      });
    }

    void wireRealtime();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [userId]);

  const adaptiveInsights = useMemo(
    () => mergePayload(remotePayload, fallbackPayload),
    [remotePayload, fallbackPayload],
  );

  return {
    adaptiveInsights,
    isLoadingAdaptiveInsights: isLoading,
  };
}
