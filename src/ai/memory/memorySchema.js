export const MEMORY_CATEGORIES = [
  "routine",
  "emotion",
  "productivity",
  "burnout",
  "motivation",
  "hobby",
  "career",
  "recovery",
  "life_balance",
];

export function createMemorySnapshot({
  userId,
  checkins = [],
  profile = {},
  goals = [],
  habits = [],
  behavioralInsights = {},
}) {
  return {
    version: 1,
    userId,
    generatedAt: new Date().toISOString(),
    categories: MEMORY_CATEGORIES,
    profile: {
      mainGoal: profile.mainGoal || "",
      interests: profile.interests || "",
      workingStyle: profile.workingStyle || "",
      longTermVision: profile.longTermVision || "",
    },
    patterns: {
      lifeState: behavioralInsights.lifeState?.label || "Unknown",
      burnoutRisk: behavioralInsights.burnoutRisk?.score || 0,
      coachingMode: behavioralInsights.personalityMode?.active || "Supportive Mentor",
      topReasons: behavioralInsights.topReasons || [],
      neglectedAreas: behavioralInsights.neglectedAreas || [],
    },
    activity: {
      totalCheckins: checkins.length,
      goalsCount: goals.length,
      habitsCount: habits.length,
    },
  };
}
