export const noopAdaptiveRepository = {
  async persistMemorySnapshot() {
    return { ok: false, provider: "noop" };
  },
  async persistBehaviorSnapshot() {
    return { ok: false, provider: "noop" };
  },
  async persistRecommendations() {
    return { ok: false, provider: "noop" };
  },
  async persistConversation() {
    return { ok: false, provider: "noop" };
  },
  async persistUsageEvent() {
    return { ok: false, provider: "noop" };
  },
  async getInsightsSnapshot() {
    return {
      ok: false,
      provider: "noop",
      data: {
        behaviorHistory: [],
        recommendationHistory: [],
        memoryHistory: [],
      },
    };
  },
  async getRelevantMemories() {
    return {
      ok: false,
      provider: "noop",
      data: { memories: [] },
    };
  },
};
