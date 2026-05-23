function compactCheckin(item = {}) {
  return {
    date: item.date || item.dateKey || "",
    status: item.status || "",
    mood: item.mood || "",
    energy: item.energy || "",
    focus: item.focus || "",
    stress: item.stress || "",
    sleepQuality: item.sleepQuality || "",
    productivity: item.productivity || "",
    reflection: item.reflection || item.note || "",
    difficultyReason: item.difficultyReason || "",
  };
}

export function buildAiRequestContext({
  behavioralInsights,
  adaptiveWorkspace,
  progress,
  checkins,
}) {
  return {
    progress: {
      momentumPoints: progress?.momentumPoints || 0,
      activeStreak: progress?.activeStreak || 0,
      comebackWins: progress?.comebackWins || 0,
    },
    behavioralSignals: {
      avgMood: behavioralInsights?.avgMood || 0,
      avgEnergy: behavioralInsights?.avgEnergy || 0,
      avgFocus: behavioralInsights?.avgFocus || 0,
      avgStress: behavioralInsights?.avgStress || 0,
      avgSleep: behavioralInsights?.avgSleep || 0,
      burnoutRiskScore: behavioralInsights?.burnoutRiskScore || 0,
      lifeState: behavioralInsights?.lifeState || null,
      personalityMode: behavioralInsights?.personalityMode || null,
      topReasons: behavioralInsights?.topReasons || [],
      neglectedAreas: behavioralInsights?.neglectedAreas || [],
      microWins: behavioralInsights?.microWins || [],
      futureProjection: behavioralInsights?.futureProjection || [],
    },
    memory: {
      summary: adaptiveWorkspace?.memoryExplanation || null,
      profile: adaptiveWorkspace?.memoryProfile || null,
      topReasons: behavioralInsights?.topReasons || [],
      neglectedAreas: behavioralInsights?.neglectedAreas || [],
      microWins: behavioralInsights?.microWins || [],
    },
    workspace: {
      mode: adaptiveWorkspace?.workspaceMode || "focus",
      roadmapIntelligence: adaptiveWorkspace?.roadmapIntelligence || null,
      activeInsights: (adaptiveWorkspace?.insightFeed || []).slice(0, 4),
    },
    recentCheckins: (checkins || []).slice(0, 7).map(compactCheckin),
  };
}
