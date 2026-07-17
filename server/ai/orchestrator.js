import { buildAdaptiveState } from "../adaptive-engine/adaptiveEngine.js";
import { buildLongTermMemory, buildMemorySummary } from "../memory/memoryEngine.js";
import { resolveAiProvider } from "./providerRegistry.js";
import { consumeRateLimit, createCacheKey, getCachedValue, setCachedValue } from "./cache/runtimeCache.js";
import { resolveAIPersonality } from "../personality-engine/personalityEngine.js";
import { buildAdaptiveRecommendations } from "../recommendation-engine/recommendationEngine.js";
import { retrieveSemanticAdaptiveMemories } from "../db/retrieval/vectorMemoryService.js";
import {
  buildFollowupSystemPrompt,
  buildFollowupUserPrompt,
  buildGuidanceSystemPrompt,
  buildGuidanceUserPrompt,
} from "../prompts/guidancePrompts.js";
import { followupSchema, guidancePlanSchema } from "../prompts/schemas.js";
import { buildCompactContextPack, summarizeConversationTurn } from "./context/adaptiveContextEngine.js";
import { logBackendException } from "../observability.js";

const runtimeConfig = {
  cacheTtlMs: Number(process.env.AI_CACHE_TTL_MS || 120000),
  rateWindowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.AI_RATE_LIMIT_MAX || 8),
};

function buildTaskIntensityLabel(value) {
  if (value === "low") return "Recovery-first";
  if (value === "high") return "Growth stretch";
  return "Steady build";
}

function renderPlanText(plan) {
  const lines = [
    "1. Quick understanding",
    plan.summary.quickUnderstanding,
    "",
    "2. Motivational note",
    plan.summary.motivationalNote,
    "",
    "3. Main plan summary",
    plan.summary.mainPlanSummary,
    "",
    "4. Complete routine plan",
  ];

  plan.routinePlan.forEach((phase, index) => {
    lines.push(
      `${index + 1}. ${phase.phase} - ${phase.focus} (${phase.intensity})`,
      ...phase.blocks.flatMap((block, blockIndex) => [
        `   ${blockIndex + 1}. ${block.label}: ${block.detail}`,
        `      Fallback: ${block.fallback}`,
      ]),
      "",
    );
  });

  lines.push(
    "5. Problem-solving suggestions",
    ...plan.insights.map((item, index) => `${index + 1}. ${item.title}: ${item.detail} Why: ${item.why}`),
    "",
    "6. Future scopes from hobbies and likes",
    ...plan.roadmap.map((item, index) => `${index + 1}. ${item.phase}: ${item.goal}`),
    "",
    "7. Career or study roadmap",
    ...plan.roadmap.flatMap((item, index) => [
      `${index + 1}. ${item.phase} milestones:`,
      ...item.milestones.map((milestone) => `   - ${milestone}`),
      `   Recovery guard: ${item.recoveryGuard}`,
    ]),
    "",
    "8. Activities for lonely or low-energy moments",
    ...plan.recovery.lonelyMoments.map((item, index) => `${index + 1}. ${item}`),
    "",
    "9. Difficulty rescue plan",
    ...plan.recovery.difficultDayPlan.map((item, index) => `${index + 1}. ${item}`),
    "",
    "10. How to customize if this becomes difficult",
    ...plan.customization.map((item, index) => `${index + 1}. ${item}`),
    "",
    "11. Three actions for today",
    ...plan.quickActions.map((item, index) => `${index + 1}. ${item.title} - ${item.detail}`),
    "",
    "12. Question for your next adjustment",
    plan.nextQuestion,
    "",
    "13. Privacy and safety reminder",
    plan.privacyNote,
  );

  return lines.join("\n").trim();
}

function renderFollowupText(payload) {
  return [
    payload.summary,
    "",
    ...payload.changes.map((item, index) => `${index + 1}. ${item.title}: ${item.detail}`),
    "",
    "Next steps:",
    ...payload.nextSteps.map((item, index) => `${index + 1}. ${item}`),
    "",
    payload.supportNote,
  ].join("\n").trim();
}

function buildResponseMeta({
  provider,
  model,
  adaptiveState,
  personality,
  recommendations,
  memory,
  semanticMemory,
}) {
  return {
    provider,
    model,
    personality,
    adaptiveState: {
      ...adaptiveState,
      intensityLabel: buildTaskIntensityLabel(adaptiveState.taskIntensity),
    },
    memorySummary: buildMemorySummary(memory),
    semanticMemory: semanticMemory?.summary || { headline: "No semantic memories yet", bullets: [] },
    recommendations: recommendations.recommendations,
    roadmapIntelligence: recommendations.roadmapIntelligence,
    streamingReady: true,
    cacheReady: true,
  };
}

function buildSafeFallbackPlan({
  adaptiveState,
  personality,
  recommendations,
  memory,
}) {
  return {
    summary: {
      quickUnderstanding: "The AI engine is temporarily using a safe fallback plan, but it still sees the main shape of your current pressure, energy, and direction.",
      motivationalNote: "You do not need a perfect system today. One stable step with a lighter recovery-aware rhythm is enough.",
      mainPlanSummary: adaptiveState.recoveryMode
        ? "Lower pressure, protect sleep and energy, and keep one meaningful action alive."
        : "Protect one core action, one recovery block, and one future-facing action each day.",
    },
    adaptiveState: {
      personality: personality.label,
      burnoutRisk: adaptiveState.burnoutRiskScore,
      taskIntensity: adaptiveState.taskIntensity,
      recoveryMode: adaptiveState.recoveryMode,
      momentumScore: adaptiveState.momentumScore,
    },
    dailyFocus: {
      title: "Today's AI focus",
      whyItMatters: "A calmer, clearer day helps the adaptive engine learn what is actually sustainable for you.",
      todayTarget: adaptiveState.dailyFocus,
    },
    quickActions: [
      { title: "Choose one anchor task", detail: "Pick the one task that will make tomorrow calmer if it gets done." },
      { title: "Protect one recovery move", detail: "Keep one sleep, food, walk, or breathing anchor visible." },
      { title: "Leave proof of progress", detail: "Turn one effort into a visible note, sample, or completed block." },
    ],
    routinePlan: [
      {
        phase: "Morning reset",
        focus: "Reduce drift early",
        intensity: adaptiveState.taskIntensity,
        blocks: [
          { label: "Start clean", detail: "Open the day with one grounding action before distractions.", fallback: "If energy is low, do a 5-minute reset instead." },
          { label: "One focused block", detail: "Work on the single most stabilizing task first.", fallback: "Shrink the block to one tiny visible step." },
        ],
      },
      {
        phase: "Midday protection",
        focus: "Sustain energy and clarity",
        intensity: adaptiveState.taskIntensity,
        blocks: [
          { label: "Reduce overload", detail: "Keep the number of competing tasks low and visible.", fallback: "Pause and re-rank the top task only." },
          { label: "Recovery slot", detail: "Protect a short break before stress starts deciding the rest of the day.", fallback: "Take a two-minute physical reset." },
        ],
      },
      {
        phase: "Evening closure",
        focus: "Preserve trust",
        intensity: "low",
        blocks: [
          { label: "Close the loop", detail: "Write one honest sentence about what helped or drained you.", fallback: "Log only one win or one friction point." },
          { label: "Reduce tomorrow's chaos", detail: "Prepare one small thing for the next day.", fallback: "Choose tomorrow's first task only." },
        ],
      },
    ],
    roadmap: [
      {
        phase: "Stabilize",
        goal: "Protect the routine from overload and emotional drift.",
        milestones: ["Keep showing up with a minimum version.", "Make pressure visible before it becomes guilt."],
        recoveryGuard: "Do not increase challenge if sleep, stress, or energy keep slipping.",
      },
      {
        phase: "Strengthen",
        goal: "Turn the routine into repeatable proof of progress.",
        milestones: ["Choose one focus lane.", "Add one visible result each week."],
        recoveryGuard: "Keep fallback versions visible so momentum survives uneven days.",
      },
    ],
    insights: recommendations.recommendations,
    recovery: {
      lonelyMoments: [
        "Use a lighter task that still counts as showing up.",
        "Switch to a familiar hobby or grounding action instead of asking for peak focus.",
      ],
      difficultDayPlan: [
        "Cut the task list in half.",
        "Keep only one required action and one recovery action.",
        "Write what made the day hard so the next plan can adapt instead of repeating pressure.",
      ],
    },
    customization: [
      "Lower the plan intensity whenever stress rises faster than recovery.",
      "Replace ideal routines with minimum versions on heavy days.",
      "Use your next adjustment request to name what felt unrealistic, not just what was unfinished.",
    ],
    nextQuestion: "What part of this plan feels most likely to slip first if the week gets heavy?",
    privacyNote: "Your memory, emotions, and routines stay private to your workspace and are used only to improve adaptive guidance. This is supportive planning, not therapy or emergency care.",
  };
}

function buildProviderMissingError() {
  return Object.assign(new Error("No AI provider is configured on the server."), {
    status: 500,
    publicMessage: "No AI provider is configured on the server.",
  });
}

function getPublicError(error) {
  if (error.publicMessage) return error.publicMessage;
  if (error.status === 429 || error.status === 503) {
    return "The AI service is busy right now. Please try again in a moment.";
  }
  if (error.status >= 500) {
    return "The AI service had a temporary problem. Please try again shortly.";
  }
  return error.message || "The AI request could not be completed.";
}

function createEmptySemanticMemory() {
  return {
    enabled: false,
    source: "adaptive-context-unavailable",
    memories: [],
    summary: { headline: "No semantic memories yet", bullets: [] },
  };
}

async function prepareIntelligence(input) {
  const semanticMemory = input.disableSemanticMemory ? createEmptySemanticMemory() : await retrieveSemanticAdaptiveMemories({
    userEmail: input.userEmail,
    userId: input.userId,
    profile: input.profile,
    aiContext: input.aiContext,
    previousPlan: input.previousPlan,
    followUpPrompt: input.followUpPrompt,
  });
  const adaptiveState = buildAdaptiveState({
    profile: input.profile,
    aiContext: input.aiContext,
  });
  const personality = resolveAIPersonality({
    profile: input.profile,
    adaptiveState,
    behavioralSignals: input.aiContext.behavioralSignals || {},
  });
  const memory = buildLongTermMemory({
    userEmail: input.userEmail,
    profile: input.profile,
    aiContext: {
      ...input.aiContext,
      memory: {
        ...(input.aiContext.memory || {}),
        semanticSummary: semanticMemory.summary,
        retrievedMemories: semanticMemory.memories,
      },
    },
    adaptiveState,
    personality,
  });
  const recommendations = buildAdaptiveRecommendations({
    adaptiveState,
    aiContext: input.aiContext,
    profile: input.profile,
  });
  const contextPack = buildCompactContextPack({
    profile: input.profile,
    aiContext: input.aiContext,
    adjustmentRequest: input.adjustmentRequest,
    previousPlan: input.previousPlan,
    currentPlan: input.currentPlan,
    followUpPrompt: input.followUpPrompt,
    memory,
    semanticMemory,
    conversationSummary: input.conversationSummary,
  });

  return { adaptiveState, personality, memory, recommendations, semanticMemory, contextPack };
}

async function prepareIntelligenceSafely(input, provider) {
  try {
    return await prepareIntelligence(input);
  } catch (error) {
    logBackendException(error, {
      ...input.requestContext,
      provider: provider.provider,
    });
    return prepareIntelligence({ ...input, disableSemanticMemory: true });
  }
}

export async function generateAdaptivePlan(input) {
  const provider = resolveAiProvider();
  if (!provider) {
    throw buildProviderMissingError();
  }

  const rateKey = `guidance:${input.userEmail || "anonymous"}`;
  const rate = consumeRateLimit(rateKey, {
    windowMs: runtimeConfig.rateWindowMs,
    max: runtimeConfig.rateLimitMax,
  });
  if (!rate.allowed) {
    throw Object.assign(new Error("AI rate limit reached for this user."), {
      status: 429,
      publicMessage: "The AI planner is receiving too many requests right now. Please wait a moment and try again.",
    });
  }

  const intelligence = await prepareIntelligenceSafely(input, provider);
  const cacheKey = createCacheKey("guidance", {
    profile: input.profile,
    aiContext: input.aiContext,
    adjustmentRequest: input.adjustmentRequest,
    previousPlan: input.previousPlan,
    provider: provider.provider,
    model: provider.model,
  });
  const cached = getCachedValue(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  try {
    const conversationSummary = summarizeConversationTurn({
      previousSummary: input.conversationSummary,
      turnType: "guidance",
      adjustmentRequest: input.adjustmentRequest,
      followUpPrompt: input.followUpPrompt,
    });
    const contextPack = intelligence.contextPack;
    const payload = await provider.generateStructured({
      systemPrompt: buildGuidanceSystemPrompt({
        personality: intelligence.personality,
        adaptiveState: intelligence.adaptiveState,
        memorySummary: buildMemorySummary(intelligence.memory),
      }),
      userPrompt: buildGuidanceUserPrompt({
        profile: input.profile,
        adaptiveState: intelligence.adaptiveState,
        memory: intelligence.memory,
        recommendations: intelligence.recommendations,
        adjustmentRequest: input.adjustmentRequest,
        previousPlan: input.previousPlan,
        contextPack,
        conversationSummary,
      }),
      schema: guidancePlanSchema,
      temperature: 0.65,
    });

    const result = {
      plan: renderPlanText(payload),
      structuredPlan: payload,
      aiMeta: buildResponseMeta({
        provider: provider.provider,
        model: provider.model,
        adaptiveState: intelligence.adaptiveState,
        personality: intelligence.personality,
        recommendations: intelligence.recommendations,
        memory: intelligence.memory,
        semanticMemory: intelligence.semanticMemory,
      }),
    };
    setCachedValue(cacheKey, result, runtimeConfig.cacheTtlMs);
    return result;
  } catch (error) {
    logBackendException(error, {
      ...input.requestContext,
      provider: provider.provider,
    });
    const fallbackPlan = buildSafeFallbackPlan({
      adaptiveState: intelligence.adaptiveState,
      personality: intelligence.personality,
      recommendations: intelligence.recommendations,
      memory: intelligence.memory,
    });

    return {
      plan: renderPlanText(fallbackPlan),
      structuredPlan: fallbackPlan,
      aiMeta: {
        ...buildResponseMeta({
          provider: provider.provider,
          model: provider.model,
          adaptiveState: intelligence.adaptiveState,
          personality: intelligence.personality,
          recommendations: intelligence.recommendations,
          memory: intelligence.memory,
          semanticMemory: intelligence.semanticMemory,
        }),
        fallback: true,
        fallbackReason: getPublicError(error),
      },
    };
  }
}

export async function generateAdaptiveFollowup(input) {
  const provider = resolveAiProvider();
  if (!provider) {
    throw buildProviderMissingError();
  }

  const intelligence = await prepareIntelligenceSafely(input, provider);

  try {
    const conversationSummary = summarizeConversationTurn({
      previousSummary: input.conversationSummary,
      turnType: "followup",
      adjustmentRequest: input.adjustmentRequest,
      followUpPrompt: input.followUpPrompt,
    });
    const payload = await provider.generateStructured({
      systemPrompt: buildFollowupSystemPrompt({
        personality: intelligence.personality,
        adaptiveState: intelligence.adaptiveState,
      }),
      userPrompt: buildFollowupUserPrompt({
        profile: input.profile,
        adaptiveState: intelligence.adaptiveState,
        memory: intelligence.memory,
        currentPlan: input.currentPlan,
        followUpPrompt: input.followUpPrompt,
        contextPack: intelligence.contextPack,
        conversationSummary,
      }),
      schema: followupSchema,
      temperature: 0.55,
    });

    return {
      reply: renderFollowupText(payload),
      structuredReply: payload,
      aiMeta: buildResponseMeta({
        provider: provider.provider,
        model: provider.model,
        adaptiveState: intelligence.adaptiveState,
        personality: intelligence.personality,
        recommendations: intelligence.recommendations,
        memory: intelligence.memory,
        semanticMemory: intelligence.semanticMemory,
      }),
    };
  } catch (error) {
    logBackendException(error, {
      ...input.requestContext,
      provider: provider.provider,
    });
    throw Object.assign(new Error(getPublicError(error)), {
      status: error.status || 500,
    });
  }
}
