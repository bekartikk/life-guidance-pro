import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { generateAdaptiveFollowup, generateAdaptivePlan } from "./ai/orchestrator.js";
import { loadAdaptiveInsights } from "./db/services/loadAdaptiveInsights.js";
import { persistAdaptiveFollowupArtifacts, persistAdaptivePlanArtifacts } from "./db/services/persistAdaptiveArtifacts.js";

dotenv.config({ path: new URL(".env", import.meta.url) });

const app = express();
const PORT = process.env.PORT || 5000;
const activeProvider =
  (process.env.AI_PROVIDER || (process.env.OPENAI_API_KEY ? "openai" : process.env.GEMINI_API_KEY ? "gemini" : "none"))
    .toLowerCase()
    .trim();
const activeModel =
  activeProvider === "openai"
    ? process.env.OPENAI_MODEL || "gpt-5-mini"
    : process.env.GEMINI_MODEL || "gemini-2.5-flash";

const allowedOrigins = String(process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "48kb" }));

const urgentSupportKeywords = [
  "self harm",
  "suicide",
  "kill myself",
  "end my life",
  "abuse",
  "unsafe at home",
  "violence",
  "panic attack",
  "i want to disappear",
];

function clip(value, max = 1200) {
  return String(value || "").slice(0, max);
}

function sanitizeArray(values, maxItems = 6) {
  return Array.isArray(values)
    ? values.slice(0, maxItems).map((item) => {
        if (typeof item === "string") {
          return clip(item, 240);
        }
        if (item && typeof item === "object") {
          return Object.fromEntries(
            Object.entries(item).slice(0, 8).map(([key, value]) => [key, clip(value, 240)]),
          );
        }
        return item;
      })
    : [];
}

function cleanProfile(profile = {}) {
  return {
    wakeTime: clip(profile.wakeTime, 80),
    sleepTime: clip(profile.sleepTime, 80),
    currentRoutine: clip(profile.currentRoutine, 1200),
    workOrStudy: clip(profile.workOrStudy, 1200),
    personalChallenges: clip(profile.personalChallenges, 1200),
    futureConfusion: clip(profile.futureConfusion, 1200),
    goals: clip(profile.goals, 1200),
    hobbies: clip(profile.hobbies, 800),
    happinessSources: clip(profile.happinessSources, 800),
    lonelyMoments: clip(profile.lonelyMoments, 800),
    knownObstacles: clip(profile.knownObstacles, 1000),
    skillsToBuild: clip(profile.skillsToBuild, 1000),
    planDuration: clip(profile.planDuration || "1-week", 40),
    roadmapFocus: clip(profile.roadmapFocus || "balanced", 60),
    professionalHelp: clip(profile.professionalHelp || "roadmap", 60),
    flexibilityLevel: clip(profile.flexibilityLevel || "flexible", 60),
    energyLevel: clip(profile.energyLevel || "medium", 40),
    preferredTone: clip(profile.preferredTone || "gentle", 40),
    aiPersonality: clip(profile.aiPersonality || "", 60),
    profileContext: {
      fullName: clip(profile.profileContext?.fullName, 80),
      ageGroup: clip(profile.profileContext?.ageGroup, 40),
      role: clip(profile.profileContext?.role, 60),
      mainGoal: clip(profile.profileContext?.mainGoal, 800),
      interests: clip(profile.profileContext?.interests, 800),
      preferredRoutineStyle: clip(profile.profileContext?.preferredRoutineStyle, 60),
      careerInterest: clip(profile.profileContext?.careerInterest, 800),
      noteToPlanner: clip(profile.profileContext?.noteToPlanner, 1000),
      longTermVision: clip(profile.profileContext?.longTermVision, 1000),
      stressLevel: clip(profile.profileContext?.stressLevel || profile.stressLevel || "", 40),
    },
  };
}

function cleanAiContext(context = {}) {
  return {
    progress: {
      momentumPoints: Number(context.progress?.momentumPoints || 0),
      activeStreak: Number(context.progress?.activeStreak || 0),
      comebackWins: Number(context.progress?.comebackWins || 0),
    },
    behavioralSignals: {
      avgMood: Number(context.behavioralSignals?.avgMood || 0),
      avgEnergy: Number(context.behavioralSignals?.avgEnergy || 0),
      avgFocus: Number(context.behavioralSignals?.avgFocus || 0),
      avgStress: Number(context.behavioralSignals?.avgStress || 0),
      avgSleep: Number(context.behavioralSignals?.avgSleep || 0),
      burnoutRiskScore: Number(context.behavioralSignals?.burnoutRiskScore || 0),
      lifeState: context.behavioralSignals?.lifeState || null,
      personalityMode: context.behavioralSignals?.personalityMode || null,
      topReasons: sanitizeArray(context.behavioralSignals?.topReasons, 4),
      neglectedAreas: sanitizeArray(context.behavioralSignals?.neglectedAreas, 4),
      microWins: sanitizeArray(context.behavioralSignals?.microWins, 4),
      futureProjection: sanitizeArray(context.behavioralSignals?.futureProjection, 4),
    },
    memory: {
      summary: context.memory?.summary || null,
      profile: context.memory?.profile || null,
      topReasons: sanitizeArray(context.memory?.topReasons, 4),
      neglectedAreas: sanitizeArray(context.memory?.neglectedAreas, 4),
      microWins: sanitizeArray(context.memory?.microWins, 4),
    },
    workspace: {
      mode: clip(context.workspace?.mode, 40),
      roadmapIntelligence: context.workspace?.roadmapIntelligence || null,
      activeInsights: sanitizeArray(context.workspace?.activeInsights, 4),
    },
    recentCheckins: sanitizeArray(context.recentCheckins, 7),
  };
}

function hasRequiredProfile(profile) {
  return ["currentRoutine", "workOrStudy", "personalChallenges", "futureConfusion", "goals", "hobbies", "happinessSources"].every((field) => profile[field]?.trim());
}

function containsUrgentSupportLanguage(...values) {
  const joined = values.join(" ").toLowerCase();
  return urgentSupportKeywords.some((keyword) => joined.includes(keyword));
}

function appendSafetySupport(text) {
  return `${text}\n\nUrgent support note: If you feel in immediate danger, at risk of self-harm, or unsafe with someone around you, pause the planner and contact local emergency services or a trusted person right now.`;
}

app.get("/", (req, res) => {
  res.json({ status: "Life Guidance API is running" });
});

app.get("/healthz", (req, res) => {
  res.json({ ok: true, provider: activeProvider, model: activeModel });
});

app.get("/api/adaptive-insights", async (req, res) => {
  try {
    const userId = clip(req.query.userId, 160);
    const payload = await loadAdaptiveInsights({ userId });
    return res.json(payload);
  } catch (error) {
    return res.status(error.status || 500).json({
      enabled: false,
      source: "firebase-primary",
      reason: error.message || "Adaptive insights could not be loaded right now.",
      feed: [],
      burnoutHistory: [],
      momentumHistory: [],
      cognitiveLoadHistory: [],
      recommendationHistory: [],
      weeklySummaries: [],
    });
  }
});

app.post("/api/guidance", async (req, res) => {
  const profile = cleanProfile(req.body.profile);
  const adjustmentRequest = clip(req.body.adjustmentRequest, 1600);
  const previousPlan = clip(req.body.previousPlan, 9000);
  const aiContext = cleanAiContext(req.body.aiContext);
  const userEmail = clip(req.body.userEmail, 160);
  const userId = clip(req.body.userId, 160);
  const needsUrgentSupport = containsUrgentSupportLanguage(
    JSON.stringify(profile),
    adjustmentRequest,
    previousPlan,
  );

  if (!hasRequiredProfile(profile)) {
    return res.status(400).json({ message: "Please complete all required profile fields." });
  }

  try {
    const startedAt = Date.now();
    const result = await generateAdaptivePlan({
      userEmail,
      userId,
      profile,
      aiContext,
      adjustmentRequest,
      previousPlan,
    });
    const responseText = needsUrgentSupport ? appendSafetySupport(result.plan) : result.plan;

    void persistAdaptivePlanArtifacts({
      userEmail,
      userId,
      profile,
      aiContext,
      aiMeta: result.aiMeta,
      planId: req.body.planId || null,
      prompt: adjustmentRequest || JSON.stringify(profile),
      responseText,
      structuredPayload: result.structuredPlan,
      cacheHit: Boolean(result.cached),
      latencyMs: Date.now() - startedAt,
    });

    return res.json({
      plan: responseText,
      aiMeta: result.aiMeta,
      structuredPlan: result.structuredPlan,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.publicMessage || error.message || "Server error while creating your plan. Please try again.",
    });
  }
});

app.post("/api/followup", async (req, res) => {
  const profile = cleanProfile(req.body.profile);
  const currentPlan = clip(req.body.currentPlan, 12000);
  const followUpPrompt = clip(req.body.followUpPrompt, 1600);
  const aiContext = cleanAiContext(req.body.aiContext);
  const userEmail = clip(req.body.userEmail, 160);
  const userId = clip(req.body.userId, 160);
  const needsUrgentSupport = containsUrgentSupportLanguage(
    JSON.stringify(profile),
    currentPlan,
    followUpPrompt,
  );

  if (!currentPlan.trim()) {
    return res.status(400).json({ message: "A current plan is required for follow-up guidance." });
  }

  if (!followUpPrompt.trim()) {
    return res.status(400).json({ message: "Write a follow-up request before sending it." });
  }

  try {
    const startedAt = Date.now();
    const result = await generateAdaptiveFollowup({
      userEmail,
      userId,
      profile,
      aiContext,
      currentPlan,
      followUpPrompt,
    });
    const responseText = needsUrgentSupport ? appendSafetySupport(result.reply) : result.reply;

    void persistAdaptiveFollowupArtifacts({
      userEmail,
      userId,
      profile,
      aiContext,
      aiMeta: result.aiMeta,
      planId: req.body.planId || null,
      prompt: followUpPrompt,
      responseText,
      structuredPayload: result.structuredReply,
      cacheHit: false,
      latencyMs: Date.now() - startedAt,
    });

    return res.json({
      reply: responseText,
      aiMeta: result.aiMeta,
      structuredReply: result.structuredReply,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.publicMessage || error.message || "Server error while creating follow-up guidance. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Life Guidance API running on port ${PORT} with ${activeProvider}:${activeModel}`);
});
