function toText(value, fallback = "") {
  if (value == null) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => toText(item, "")).filter(Boolean).join(" | ");
  }
  if (typeof value === "object") {
    return Object.values(value).map((item) => toText(item, "")).filter(Boolean).join(" | ");
  }
  return fallback;
}

function pickPrimaryGoal(profile = {}) {
  const contextGoal = toText(profile?.profileContext?.mainGoal, "");
  const profileGoals = toText(profile?.goals, "");
  const explicitGoal = contextGoal || profileGoals || "Help me create a stable plan";
  return explicitGoal.slice(0, 220);
}

function pickEnergyStress(aiContext = {}) {
  const behavioralSignals = aiContext?.behavioralSignals || {};
  const energy = behavioralSignals.avgEnergy ?? "n/a";
  const stress = behavioralSignals.avgStress ?? "n/a";
  return `energy ${energy}/5, stress ${stress}/5`;
}

function pickRecentCompletedActions(aiContext = {}) {
  const microWins = [
    ...(aiContext?.memory?.microWins || []),
    ...(aiContext?.behavioralSignals?.microWins || []),
  ];
  const recentCheckins = aiContext?.recentCheckins || [];
  const reflections = recentCheckins
    .map((item) => toText(item?.reflection || item?.difficultyReason || item?.status, ""))
    .filter(Boolean);

  const combined = [...microWins, ...reflections]
    .map((item) => toText(item, ""))
    .filter(Boolean)
    .slice(0, 3);

  return combined.length ? combined.join(" • ") : "No recent completed actions recorded yet";
}

function pickActivePlan({ currentPlan, previousPlan, adjustmentRequest, followUpPrompt }) {
  const currentPlanText = toText(currentPlan, "");
  const previousPlanText = toText(previousPlan, "");
  const adjustmentText = toText(adjustmentRequest || followUpPrompt, "");

  if (currentPlanText) return currentPlanText.slice(0, 320);
  if (previousPlanText) return previousPlanText.slice(0, 320);
  if (adjustmentText) return `Adjustment intent: ${adjustmentText.slice(0, 220)}`;
  return "No active plan yet";
}

function pickRelevantMemories({ memory = {}, aiContext = {}, semanticMemory = {} }) {
  const memorySources = [
    ...(memory?.behaviorPatterns?.topReasons || []),
    ...(memory?.behaviorPatterns?.neglectedAreas || []),
    ...(aiContext?.memory?.topReasons || []),
    ...(aiContext?.memory?.neglectedAreas || []),
    ...(semanticMemory?.memories || []),
  ];

  const relevant = memorySources
    .map((item) => {
      if (typeof item === "string") return item;
      if (item?.label) return item.label;
      if (item?.area) return item.area;
      if (item?.reason) return item.reason;
      if (item?.content) return item.content;
      return "";
    })
    .filter(Boolean)
    .slice(0, 2);

  return relevant.length ? relevant.join(" | ") : "No strong memory signals yet";
}

function normalizeContextSummary(summary) {
  return toText(summary, "").slice(0, 280);
}

export function summarizeConversationTurn({
  previousSummary = "",
  turnType = "guidance",
  adjustmentRequest = "",
  followUpPrompt = "",
}) {
  const turnText = [
    turnType === "followup" ? "follow-up" : "guidance",
    toText(adjustmentRequest, ""),
    toText(followUpPrompt, ""),
  ]
    .filter(Boolean)
    .join(" ");

  const base = previousSummary ? `${previousSummary} ` : "";
  return `${base}Latest ${turnType === "followup" ? "follow-up" : "guidance"} turn: ${turnText || "continue refining the plan"}`.slice(0, 320);
}

export function buildCompactContextPack(input = {}) {
  return {
    primaryGoal: pickPrimaryGoal(input.profile),
    energyStress: pickEnergyStress(input.aiContext),
    recentCompletedActions: pickRecentCompletedActions(input.aiContext),
    activePlan: pickActivePlan(input),
    relevantMemories: pickRelevantMemories(input),
    conversationSummary: normalizeContextSummary(input.conversationSummary),
    intent: input.adjustmentRequest || input.followUpPrompt || "new plan",
  };
}
