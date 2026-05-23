function clip(value, max = 600) {
  return String(value || "").trim().slice(0, max);
}

function compactCheckins(checkins = []) {
  return checkins.slice(0, 7).map((item) => ({
    date: clip(item.date || item.dateKey, 40),
    status: clip(item.status, 40),
    mood: clip(item.mood, 12),
    energy: clip(item.energy, 12),
    focus: clip(item.focus, 12),
    stress: clip(item.stress, 12),
    reflection: clip(item.reflection || item.note, 180),
    difficultyReason: clip(item.difficultyReason, 120),
  }));
}

export function buildLongTermMemory({
  userEmail = "",
  profile = {},
  aiContext = {},
  adaptiveState = {},
  personality = {},
}) {
  const memoryProfile = aiContext.memory || {};
  const profileContext = profile.profileContext || {};

  return {
    userKey: clip(userEmail || "anonymous", 120),
    lifeDirection: {
      mainGoal: clip(profileContext.mainGoal || profile.goals, 400),
      role: clip(profileContext.role || profile.role, 80),
      interests: clip(profileContext.interests || profile.hobbies, 320),
      roadmapFocus: clip(profile.roadmapFocus, 80),
      longTermVision: clip(profileContext.longTermVision, 320),
    },
    behaviorPatterns: {
      personalityMode: clip(personality.label, 80),
      taskIntensity: clip(adaptiveState.taskIntensity, 40),
      burnoutRiskScore: adaptiveState.burnoutRiskScore,
      momentumScore: adaptiveState.momentumScore,
      lifeState: clip(aiContext.behavioralSignals?.lifeState?.label, 80),
      topReasons: (memoryProfile.topReasons || aiContext.behavioralSignals?.topReasons || []).slice(0, 3),
      neglectedAreas: (memoryProfile.neglectedAreas || aiContext.behavioralSignals?.neglectedAreas || []).slice(0, 3),
    },
    emotionalSignals: {
      avgMood: aiContext.behavioralSignals?.avgMood || adaptiveState.avgMood,
      avgEnergy: aiContext.behavioralSignals?.avgEnergy || adaptiveState.avgEnergy,
      avgStress: aiContext.behavioralSignals?.avgStress || adaptiveState.avgStress,
      avgFocus: aiContext.behavioralSignals?.avgFocus || adaptiveState.avgFocus,
      avgSleep: aiContext.behavioralSignals?.avgSleep || adaptiveState.avgSleep,
    },
    microWins: (memoryProfile.microWins || aiContext.behavioralSignals?.microWins || []).slice(0, 4),
    recentCheckins: compactCheckins(aiContext.recentCheckins),
    editable: true,
    deletable: true,
    backend: {
      current: "firestore-via-client-context",
      future: "supabase-or-vector-store",
    },
  };
}

export function buildMemorySummary(memory) {
  return {
    headline: memory.behaviorPatterns.lifeState || "Adaptive guidance",
    constraints: [
      memory.behaviorPatterns.topReasons[0]?.label,
      memory.behaviorPatterns.neglectedAreas[0]?.area,
      memory.behaviorPatterns.taskIntensity,
    ].filter(Boolean),
    reinforcement: memory.microWins.slice(0, 2),
  };
}
