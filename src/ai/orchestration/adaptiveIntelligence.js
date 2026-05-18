import { buildEditableMemoryProfile, buildMemoryExplanation } from "../memory/memoryService";
import { pineconeAdapter } from "../memory/providers/pineconeAdapter";
import { upstashAdapter } from "../cache/upstashAdapter";
import { AI_RUNTIME_CONFIG } from "./runtimeConfig";

function inferWorkspaceMode({ behavioralInsights, profile, currentPlan }) {
  const focus = String(currentPlan?.profileSnapshot?.roadmapFocus || profile?.careerInterest || "").toLowerCase();

  if (behavioralInsights.burnoutRisk?.score >= 72 || behavioralInsights.lifeState?.label === "Recovery mode") {
    return {
      id: "recovery",
      label: "Recovery",
      tone: "warning",
      summary: "Lower the pressure, keep the plan smaller, and rebuild steadiness before intensity.",
      recommendedTab: "daily",
    };
  }

  if (focus.includes("career")) {
    return {
      id: "career",
      label: "Career",
      tone: "info",
      summary: "Treat routines as support for direction, skill-building, and real opportunity paths.",
      recommendedTab: "career",
    };
  }

  if (behavioralInsights.metrics?.completionRatio >= 0.62 && behavioralInsights.metrics?.avgMotivation >= 3.5) {
    return {
      id: "growth",
      label: "Growth",
      tone: "success",
      summary: "Momentum is stable enough to add challenge carefully and keep expanding your system.",
      recommendedTab: "missions",
    };
  }

  return {
    id: "focus",
    label: "Focus",
    tone: "info",
    summary: "Protect one meaningful next step and reduce switching cost around it.",
    recommendedTab: "planner",
  };
}

function buildWorkspaceModes(activeMode) {
  const modes = [
    {
      id: "focus",
      label: "Focus",
      summary: "Protect attention and keep the next step obvious.",
    },
    {
      id: "recovery",
      label: "Recovery",
      summary: "Lower intensity and preserve emotional steadiness.",
    },
    {
      id: "growth",
      label: "Growth",
      summary: "Expand challenge only when consistency is stable.",
    },
    {
      id: "career",
      label: "Career",
      summary: "Turn routines into direction, skills, and opportunity.",
    },
  ];

  return modes.map((mode) => ({ ...mode, active: mode.id === activeMode.id }));
}

function buildInsightFeed({ behavioralInsights, workspaceMode, memoryExplanation, profile }) {
  const feed = [];

  feed.push({
    id: "mode",
    title: `${workspaceMode.label} workspace active`,
    kind: workspaceMode.tone,
    detail: workspaceMode.summary,
  });

  feed.push({
    id: "coach",
    title: `${behavioralInsights.personalityMode.active} is guiding the next layer`,
    kind: "coach",
    detail: behavioralInsights.personalityMode.reason,
  });

  behavioralInsights.adaptiveRecommendations.slice(0, 2).forEach((item, index) => {
    feed.push({
      id: `adapt-${index}`,
      title: "Adaptive recommendation",
      kind: "action",
      detail: item,
    });
  });

  if (behavioralInsights.neglectedAreas[0]) {
    feed.push({
      id: "neglected",
      title: `${behavioralInsights.neglectedAreas[0].area} needs attention`,
      kind: "warning",
      detail: behavioralInsights.neglectedAreas[0].reason,
    });
  }

  if (behavioralInsights.futureProjection[0]) {
    feed.push({
      id: "projection",
      title: "Roadmap projection",
      kind: "projection",
      detail: behavioralInsights.futureProjection[0],
    });
  }

  feed.push({
    id: "memory",
    title: memoryExplanation.title,
    kind: "memory",
    detail: memoryExplanation.points[0],
  });

  if (profile?.longTermVision) {
    feed.push({
      id: "vision",
      title: "Long-term identity signal",
      kind: "identity",
      detail: profile.longTermVision,
    });
  }

  return feed.slice(0, 6);
}

function buildRoadmapIntelligence({ currentPlan, behavioralInsights, workspaceMode }) {
  return {
    activeMode: workspaceMode.label,
    burnoutGuardrail: behavioralInsights.burnoutRisk.summary,
    nextShift: behavioralInsights.adaptiveRecommendations[0] || workspaceMode.summary,
    roadmapFocus: currentPlan?.profileSnapshot?.roadmapFocus || "balanced",
  };
}

export function buildAdaptiveIntelligence({
  userId,
  profile,
  plans,
  goals,
  habits,
  checkins,
  progress,
  hobbyPlans,
  currentPlan,
  behavioralInsights,
}) {
  const memoryProfile = buildEditableMemoryProfile({
    userId,
    profile,
    checkins,
    goals,
    habits,
    behavioralInsights,
  });
  const memoryExplanation = buildMemoryExplanation(memoryProfile);
  const workspaceMode = inferWorkspaceMode({ behavioralInsights, profile, currentPlan });
  const workspaceModes = buildWorkspaceModes(workspaceMode);
  const insightFeed = buildInsightFeed({
    behavioralInsights,
    workspaceMode,
    memoryExplanation,
    profile,
  });

  return {
    workspaceMode,
    workspaceModes,
    memoryProfile,
    memoryExplanation,
    insightFeed,
    roadmapIntelligence: buildRoadmapIntelligence({
      currentPlan,
      behavioralInsights,
      workspaceMode,
    }),
    orchestration: {
      cache: {
        provider: upstashAdapter.provider,
        status: upstashAdapter.status,
        ttlMs: AI_RUNTIME_CONFIG.insightsTtlMs,
      },
      vectorMemory: {
        provider: pineconeAdapter.provider,
        status: pineconeAdapter.status,
      },
      rateLimits: {
        windowMs: AI_RUNTIME_CONFIG.requestWindowMs,
        maxRequests: AI_RUNTIME_CONFIG.maxRequestsPerWindow,
      },
      activity: {
        plans: plans.length,
        goals: goals.length,
        habits: habits.length,
        checkins: checkins.length,
        momentumPoints: progress.momentumPoints || 0,
        hobbyPaths: hobbyPlans.length,
      },
    },
  };
}
