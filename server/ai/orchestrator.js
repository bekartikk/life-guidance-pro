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
import { logBackendException, logBackendWarning } from "../observability.js";

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
  const safePlan = plan && typeof plan === "object" ? plan : {};
  const lines = [
    "1. Quick understanding",
    safePlan.summary?.quickUnderstanding || "A safe guidance plan is ready.",
    "",
    "2. Motivational note",
    safePlan.summary?.motivationalNote || "Take one realistic next step today.",
    "",
    "3. Main plan summary",
    safePlan.summary?.mainPlanSummary || "Focus on one meaningful action and one recovery action.",
    "",
    "4. Complete routine plan",
  ];

  (safePlan.routinePlan || []).forEach((phase, index) => {
    lines.push(
      `${index + 1}. ${phase?.phase || "Routine step"} - ${phase?.focus || "Keep momentum"} (${phase?.intensity || "medium"})`,
      ...(phase?.blocks || []).flatMap((block, blockIndex) => [
        `   ${blockIndex + 1}. ${block?.label || "Action"}: ${block?.detail || "Choose a manageable next step."}`,
        `      Fallback: ${block?.fallback || "Use a smaller version of the action."}`,
      ]),
      "",
    );
  });

  lines.push(
    "5. Problem-solving suggestions",
    ...(safePlan.insights || []).map((item, index) => `${index + 1}. ${item?.title || "Keep it simple"}: ${item?.detail || "Focus on one manageable action."} Why: ${item?.why || "Small steps protect consistency."}`),
    "",
    "6. Future scopes from hobbies and likes",
    ...(safePlan.roadmap || []).map((item, index) => `${index + 1}. ${item?.phase || "Next phase"}: ${item?.goal || "Build a sustainable routine."}`),
    "",
    "7. Career or study roadmap",
    ...(safePlan.roadmap || []).flatMap((item, index) => [
      `${index + 1}. ${item?.phase || "Next phase"} milestones:`,
      ...(item?.milestones || []).map((milestone) => `   - ${milestone}`),
      `   Recovery guard: ${item?.recoveryGuard || "Reduce intensity when energy is low."}`,
    ]),
    "",
    "8. Activities for lonely or low-energy moments",
    ...(safePlan.recovery?.lonelyMoments || []).map((item, index) => `${index + 1}. ${item}`),
    "",
    "9. Difficulty rescue plan",
    ...(safePlan.recovery?.difficultDayPlan || []).map((item, index) => `${index + 1}. ${item}`),
    "",
    "10. How to customize if this becomes difficult",
    ...(safePlan.customization || []).map((item, index) => `${index + 1}. ${item}`),
    "",
    "11. Three actions for today",
    ...(safePlan.quickActions || []).map((item, index) => `${index + 1}. ${item?.title || "Next action"} - ${item?.detail || "Take one manageable step."}`),
    "",
    "12. Question for your next adjustment",
    safePlan.nextQuestion || "What would make the next step feel easier?",
    "",
    "13. Privacy and safety reminder",
    safePlan.privacyNote || "This is supportive planning, not emergency care.",
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
    insights: Array.isArray(recommendations.recommendations) && recommendations.recommendations.length >= 3
      ? recommendations.recommendations
      : [
        { title: "Keep the plan small", detail: "Choose one manageable action at a time.", why: "Small steps are easier to repeat." },
        { title: "Protect recovery", detail: "Make room for rest before pressure builds.", why: "Recovery supports consistent progress." },
        { title: "Review honestly", detail: "Notice what helped and what created friction.", why: "Honest feedback improves the next plan." },
      ],
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

function buildSafeFallbackFollowup() {
  return {
    summary: "Your follow-up request was received, but the AI response could not be formatted safely. Keep the current plan and use one small adjustment today.",
    changes: [
      { title: "Keep the next step small", detail: "Choose one part of the current plan that feels realistic for today." },
      { title: "Protect recovery", detail: "Lower the workload if stress or energy makes the current plan feel too heavy." },
    ],
    nextSteps: [
      "Complete one minimum version of your next planned action.",
      "Send another follow-up with the part that felt difficult or unclear.",
    ],
    supportNote: "This is a temporary safe fallback while the AI response is unavailable.",
  };
}

function isStructuredParseFallback(payload) {
  return Boolean(payload?.parseError && payload?.provider);
}

function valueOrDefault(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function numberOrDefault(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function listOrDefault(value, fallback, minimum, maximum, normalizeItem) {
  const source = Array.isArray(value) && value.length >= minimum ? value : fallback;
  return source.slice(0, maximum).map((item, index) => normalizeItem(item, fallback[index] || fallback[0]));
}

function normalizeGuidancePlan(payload, fallbackPlan, requestContext) {
  const source = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  const needsDefaults = isStructuredParseFallback(source)
    || !source.summary?.quickUnderstanding
    || !source.summary?.motivationalNote
    || !source.summary?.mainPlanSummary
    || !source.adaptiveState?.personality
    || !source.dailyFocus?.title
    || !Array.isArray(source.quickActions) || source.quickActions.length < 3
    || !Array.isArray(source.routinePlan) || source.routinePlan.length < 3
    || !Array.isArray(source.roadmap) || source.roadmap.length < 2
    || !Array.isArray(source.insights) || source.insights.length < 3
    || !Array.isArray(source.recovery?.lonelyMoments) || source.recovery.lonelyMoments.length < 2
    || !Array.isArray(source.recovery?.difficultDayPlan) || source.recovery.difficultDayPlan.length < 3
    || !Array.isArray(source.customization) || source.customization.length < 3
    || !source.nextQuestion || !source.privacyNote;

  if (needsDefaults) {
    logBackendWarning("Gemini guidance response was incomplete; missing sections were replaced with safe defaults.", {
      ...requestContext,
      provider: "gemini",
      details: { missingSections: Object.keys(fallbackPlan).filter((key) => source[key] == null) },
    });
  }

  const summary = objectOrEmpty(source.summary);
  const adaptiveState = objectOrEmpty(source.adaptiveState);
  const dailyFocus = objectOrEmpty(source.dailyFocus);
  const recovery = objectOrEmpty(source.recovery);
  return {
    summary: {
      quickUnderstanding: valueOrDefault(summary.quickUnderstanding, fallbackPlan.summary.quickUnderstanding),
      motivationalNote: valueOrDefault(summary.motivationalNote, fallbackPlan.summary.motivationalNote),
      mainPlanSummary: valueOrDefault(summary.mainPlanSummary, fallbackPlan.summary.mainPlanSummary),
    },
    adaptiveState: {
      personality: valueOrDefault(adaptiveState.personality, fallbackPlan.adaptiveState.personality),
      burnoutRisk: numberOrDefault(adaptiveState.burnoutRisk, fallbackPlan.adaptiveState.burnoutRisk),
      taskIntensity: ["low", "medium", "high"].includes(adaptiveState.taskIntensity) ? adaptiveState.taskIntensity : fallbackPlan.adaptiveState.taskIntensity,
      recoveryMode: typeof adaptiveState.recoveryMode === "boolean" ? adaptiveState.recoveryMode : fallbackPlan.adaptiveState.recoveryMode,
      momentumScore: numberOrDefault(adaptiveState.momentumScore, fallbackPlan.adaptiveState.momentumScore),
    },
    dailyFocus: {
      title: valueOrDefault(dailyFocus.title, fallbackPlan.dailyFocus.title),
      whyItMatters: valueOrDefault(dailyFocus.whyItMatters, fallbackPlan.dailyFocus.whyItMatters),
      todayTarget: valueOrDefault(dailyFocus.todayTarget, fallbackPlan.dailyFocus.todayTarget),
    },
    quickActions: listOrDefault(source.quickActions, fallbackPlan.quickActions, 3, 3, (item, fallback) => {
      const entry = objectOrEmpty(item);
      return { title: valueOrDefault(entry.title, fallback.title), detail: valueOrDefault(entry.detail, fallback.detail) };
    }),
    routinePlan: listOrDefault(source.routinePlan, fallbackPlan.routinePlan, 3, 6, (phase, fallback) => {
      const entry = objectOrEmpty(phase);
      return {
        phase: valueOrDefault(entry.phase, fallback.phase),
        focus: valueOrDefault(entry.focus, fallback.focus),
        intensity: ["low", "medium", "high"].includes(entry.intensity) ? entry.intensity : fallback.intensity,
        blocks: listOrDefault(entry.blocks, fallback.blocks, 2, 6, (block, blockFallback) => {
          const blockEntry = objectOrEmpty(block);
          return {
            label: valueOrDefault(blockEntry.label, blockFallback.label),
            detail: valueOrDefault(blockEntry.detail, blockFallback.detail),
            fallback: valueOrDefault(blockEntry.fallback, blockFallback.fallback),
          };
        }),
      };
    }),
    roadmap: listOrDefault(source.roadmap, fallbackPlan.roadmap, 2, 5, (item, fallback) => {
      const entry = objectOrEmpty(item);
      return {
        phase: valueOrDefault(entry.phase, fallback.phase),
        goal: valueOrDefault(entry.goal, fallback.goal),
        milestones: listOrDefault(entry.milestones, fallback.milestones, 2, 5, (milestone, milestoneFallback) => valueOrDefault(milestone, milestoneFallback)),
        recoveryGuard: valueOrDefault(entry.recoveryGuard, fallback.recoveryGuard),
      };
    }),
    insights: listOrDefault(source.insights, fallbackPlan.insights, 3, 5, (item, fallback) => {
      const entry = objectOrEmpty(item);
      return {
        title: valueOrDefault(entry.title, fallback.title),
        detail: valueOrDefault(entry.detail, fallback.detail),
        why: valueOrDefault(entry.why, fallback.why),
      };
    }),
    recovery: {
      lonelyMoments: listOrDefault(recovery.lonelyMoments, fallbackPlan.recovery.lonelyMoments, 2, 5, (item, fallback) => valueOrDefault(item, fallback)),
      difficultDayPlan: listOrDefault(recovery.difficultDayPlan, fallbackPlan.recovery.difficultDayPlan, 3, 6, (item, fallback) => valueOrDefault(item, fallback)),
    },
    customization: listOrDefault(source.customization, fallbackPlan.customization, 3, 5, (item, fallback) => valueOrDefault(item, fallback)),
    nextQuestion: valueOrDefault(source.nextQuestion, fallbackPlan.nextQuestion),
    privacyNote: valueOrDefault(source.privacyNote, fallbackPlan.privacyNote),
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
      requestContext: input.requestContext,
    });

    const fallbackPlan = buildSafeFallbackPlan({
      adaptiveState: intelligence.adaptiveState,
      personality: intelligence.personality,
      recommendations: intelligence.recommendations,
      memory: intelligence.memory,
    });
    const structuredPlan = normalizeGuidancePlan(payload, fallbackPlan, input.requestContext);

    if (isStructuredParseFallback(payload)) {
      return {
        plan: renderPlanText(structuredPlan),
        structuredPlan,
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
          parseError: payload.parseError,
          rawResponse: payload.rawResponse,
        },
      };
    }

    const result = {
      plan: renderPlanText(structuredPlan),
      structuredPlan,
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
      requestContext: input.requestContext,
    });

    if (isStructuredParseFallback(payload)) {
      const fallbackReply = buildSafeFallbackFollowup();
      return {
        reply: renderFollowupText(fallbackReply),
        structuredReply: fallbackReply,
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
          parseError: payload.parseError,
          rawResponse: payload.rawResponse,
        },
      };
    }

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
