export function buildAdaptiveRecommendations({
  adaptiveState = {},
  aiContext = {},
  profile = {},
}) {
  const recommendations = [];
  const neglectedAreas = aiContext.memory?.neglectedAreas || aiContext.behavioralSignals?.neglectedAreas || [];
  const topReasons = aiContext.memory?.topReasons || aiContext.behavioralSignals?.topReasons || [];

  if (adaptiveState.recoveryMode) {
    recommendations.push({
      type: "recovery",
      title: "Enter recovery mode for this cycle",
      detail: "Lower the number of hard commitments and protect recovery before asking motivation to carry everything.",
      why: "Stress and energy signals suggest the current plan should preserve trust and steadiness first.",
    });
  }

  if (adaptiveState.taskIntensity === "high") {
    recommendations.push({
      type: "growth",
      title: "Use current momentum carefully",
      detail: "Add one stretch task only if the routine still has an easy fallback version for rough days.",
      why: "Momentum is strong enough to grow, but sustainable challenge beats emotional overreach.",
    });
  }

  if (neglectedAreas.length) {
    const primaryNeglect = neglectedAreas[0];
    recommendations.push({
      type: "balance",
      title: `Protect ${primaryNeglect.area}`,
      detail: primaryNeglect.reason,
      why: "The AI should actively rebalance neglected areas instead of treating them as optional.",
    });
  }

  if (topReasons.length) {
    recommendations.push({
      type: "pattern",
      title: `Adapt around ${topReasons[0].label}`,
      detail: `This keeps showing up in recent check-ins, so the plan should anticipate it instead of reacting after a crash.`,
      why: "Repeated friction points are exactly what the adaptive engine should learn from.",
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      type: "stability",
      title: "Keep one anchor visible",
      detail: "Protect one clear task, one recovery action, and one future-facing action each day.",
      why: "The system still benefits most from clarity, repetition, and a gentle learning loop.",
    });
  }

  return {
    recommendations: recommendations.slice(0, 4),
    roadmapIntelligence: {
      dominantMode: adaptiveState.recoveryMode ? "Recovery" : adaptiveState.taskIntensity === "high" ? "Growth" : "Focus",
      nextShift: adaptiveState.recoveryMode
        ? "Simplify expectations until energy returns."
        : String(profile.roadmapFocus || "").toLowerCase().includes("career")
          ? "Turn effort into career proof."
          : "Protect consistency before adding complexity.",
    },
  };
}
