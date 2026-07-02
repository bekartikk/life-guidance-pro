export function buildGuidanceSystemPrompt({
  personality,
  adaptiveState,
  memorySummary,
}) {
  return [
    "You are the adaptive AI engine for Life Guidance Pro.",
    "You help users build routines, direction, recovery, and sustainable growth.",
    "You are supportive and realistic. You do not diagnose mental health conditions, claim certainty, or present yourself as medical, legal, or crisis care.",
    "If a user mentions self-harm, abuse, or immediate danger, tell them clearly to contact local emergency services or a trusted person right now.",
    `Active AI personality: ${personality.label}. Style: ${personality.style}. Description: ${personality.description}`,
    `Adaptive state: burnout risk ${adaptiveState.burnoutRiskScore}/100, task intensity ${adaptiveState.taskIntensity}, recovery mode ${adaptiveState.recoveryMode ? "on" : "off"}, momentum ${adaptiveState.momentumScore}/100.`,
    `Memory summary headline: ${memorySummary.headline || "Adaptive guidance"}.`,
    memorySummary.constraints?.length
      ? `Current constraints to respect: ${memorySummary.constraints.join(", ")}.`
      : "Current constraints are still being learned, so prioritize realism and simplicity.",
    memorySummary.reinforcement?.length
      ? `Small wins to reinforce: ${memorySummary.reinforcement.join(" | ")}.`
      : "Reinforce small wins and visible progress.",
    "Use concise language and structured outputs only.",
    "Build plans that scale intensity according to stress, energy, and recovery needs.",
    "Prefer minimum viable routines over idealized routines when overwhelm is present.",
    "Explain why the plan changes when stress, momentum, or burnout risk shifts.",
    "Keep the guidance motivational but practical, never cheesy or vague.",
  ].join("\n");
}

export function buildGuidanceUserPrompt({
  profile,
  adaptiveState,
  memory,
  recommendations,
  adjustmentRequest = "",
  previousPlan = "",
  contextPack = {},
  conversationSummary = "",
}) {
  const compactProfile = {
    primaryGoal: contextPack.primaryGoal,
    energyStress: contextPack.energyStress,
    recentCompletedActions: contextPack.recentCompletedActions,
    activePlan: contextPack.activePlan,
    relevantMemories: contextPack.relevantMemories,
    conversationSummary,
  };

  return [
    "Create an adaptive guidance plan from the following structured user context.",
    "",
    "Compact context pack:",
    JSON.stringify(compactProfile, null, 2),
    "",
    "User profile:",
    JSON.stringify(profile, null, 2),
    "",
    "Adaptive state:",
    JSON.stringify(adaptiveState, null, 2),
    "",
    "Long-term memory snapshot:",
    JSON.stringify(memory, null, 2),
    "",
    "Recommendation engine output:",
    JSON.stringify(recommendations, null, 2),
    adjustmentRequest ? `\nAdjustment request:\n${adjustmentRequest}\n` : "\nThis is a new plan request.\n",
    previousPlan ? `Previous plan to revise:\n${previousPlan}\n` : "",
    "Return only structured JSON matching the provided schema.",
  ].join("\n");
}

export function buildFollowupSystemPrompt({ personality, adaptiveState }) {
  return [
    "You are refining an existing Life Guidance Pro plan.",
    "Respect the existing direction unless the user clearly wants a bigger change.",
    "Be concise, adaptive, and realistic.",
    `Use the ${personality.label} personality with ${personality.style} tone.`,
    `Current adaptive state: burnout risk ${adaptiveState.burnoutRiskScore}/100, task intensity ${adaptiveState.taskIntensity}, recovery mode ${adaptiveState.recoveryMode ? "on" : "off"}.`,
    "Return only structured JSON matching the schema.",
  ].join("\n");
}

export function buildFollowupUserPrompt({
  profile,
  adaptiveState,
  memory,
  currentPlan,
  followUpPrompt,
  contextPack = {},
  conversationSummary = "",
}) {
  return [
    "Refine the user's current plan according to the follow-up request.",
    "",
    "Compact context pack:",
    JSON.stringify({
      primaryGoal: contextPack.primaryGoal,
      energyStress: contextPack.energyStress,
      recentCompletedActions: contextPack.recentCompletedActions,
      activePlan: contextPack.activePlan,
      relevantMemories: contextPack.relevantMemories,
      conversationSummary,
    }, null, 2),
    "",
    "Profile:",
    JSON.stringify(profile, null, 2),
    "",
    "Adaptive state:",
    JSON.stringify(adaptiveState, null, 2),
    "",
    "Memory snapshot:",
    JSON.stringify(memory, null, 2),
    "",
    "Current plan text:",
    currentPlan,
    "",
    "Follow-up request:",
    followUpPrompt,
    "",
    "Return only structured JSON matching the provided schema.",
  ].join("\n");
}
