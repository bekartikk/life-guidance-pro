function clip(value, max = 220) {
  return String(value || "").trim().slice(0, max);
}

export function buildRetrievalQueryText({ profile = {}, aiContext = {}, previousPlan = "", followUpPrompt = "" }) {
  const profileContext = profile.profileContext || {};
  const behavioralSignals = aiContext.behavioralSignals || {};

  return [
    clip(profileContext.mainGoal || profile.goals, 220),
    clip(profileContext.interests || profile.hobbies, 180),
    clip(profile.currentRoutine, 180),
    clip(profile.personalChallenges, 180),
    clip(followUpPrompt || previousPlan, 320),
    clip(behavioralSignals.lifeState?.label, 80),
    clip(behavioralSignals.topReasons?.[0]?.label, 80),
    clip(behavioralSignals.neglectedAreas?.[0]?.area, 80),
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildAdaptiveRetrievalSignals(aiContext = {}) {
  const signals = aiContext.behavioralSignals || {};
  return {
    burnoutRiskScore: Number(signals.burnoutRiskScore || 0),
    avgEnergy: Number(signals.avgEnergy || 0),
    avgStress: Number(signals.avgStress || 0),
    avgFocus: Number(signals.avgFocus || 0),
    avgMood: Number(signals.avgMood || 0),
    avgSleep: Number(signals.avgSleep || 0),
    lifeState: clip(signals.lifeState?.label, 80),
  };
}

export function buildSemanticMemorySummary(memories = []) {
  if (!memories.length) {
    return {
      headline: "No mirrored semantic memories yet",
      bullets: [],
    };
  }

  return {
    headline: memories[0].summary || "Relevant memory retrieved",
    bullets: memories
      .slice(0, 3)
      .flatMap((memory) => memory.evidence || [])
      .filter(Boolean)
      .slice(0, 5),
  };
}
