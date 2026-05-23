function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function compactCheckins(checkins = []) {
  return checkins
    .slice(0, 10)
    .map((item) => ({
      mood: toNumber(item.mood, 0),
      energy: toNumber(item.energy, 0),
      focus: toNumber(item.focus, 0),
      stress: toNumber(item.stress, 0),
      sleepQuality: toNumber(item.sleepQuality, 0),
      productivity: toNumber(item.productivity, 0),
      status: String(item.status || ""),
      difficultyReason: String(item.difficultyReason || item.reflection || ""),
    }));
}

function buildDailyFocus(profile = {}, adaptiveState = {}) {
  const focus = String(profile.roadmapFocus || "").toLowerCase();

  if (adaptiveState.recoveryMode) {
    return "Protect recovery first, then complete one meaningful low-friction task.";
  }
  if (focus.includes("career")) {
    return "Choose one career-building action that leaves visible proof behind today.";
  }
  if (focus.includes("study")) {
    return "Protect one distraction-light study block and one small review loop.";
  }
  if (focus.includes("hobbies")) {
    return "Turn one hobby session into an asset, sample, or repeatable skill rep.";
  }
  return "Reduce scattered effort and protect the one task most likely to calm tomorrow down.";
}

export function buildAdaptiveState({
  profile = {},
  aiContext = {},
}) {
  const recentCheckins = compactCheckins(aiContext.recentCheckins || []);
  const avgStress = average(recentCheckins.map((item) => item.stress).filter(Boolean)) || toNumber(aiContext.behavioralSignals?.avgStress, 3);
  const avgEnergy = average(recentCheckins.map((item) => item.energy).filter(Boolean)) || toNumber(aiContext.behavioralSignals?.avgEnergy, 3);
  const avgSleep = average(recentCheckins.map((item) => item.sleepQuality).filter(Boolean)) || toNumber(aiContext.behavioralSignals?.avgSleep, 3);
  const avgFocus = average(recentCheckins.map((item) => item.focus).filter(Boolean)) || toNumber(aiContext.behavioralSignals?.avgFocus, 3);
  const avgMood = average(recentCheckins.map((item) => item.mood).filter(Boolean)) || toNumber(aiContext.behavioralSignals?.avgMood, 3);

  const suppliedBurnoutRisk = toNumber(aiContext.behavioralSignals?.burnoutRiskScore, 0);
  const burnoutRiskScore = suppliedBurnoutRisk || Math.max(
    18,
    Math.min(
      95,
      Math.round((avgStress * 15) + ((6 - avgEnergy) * 9) + ((6 - avgSleep) * 8) + ((6 - avgFocus) * 6)),
    ),
  );

  const momentumScore = Math.max(
    8,
    Math.min(
      100,
      Math.round(
        toNumber(aiContext.progress?.momentumPoints, 0) / 6 +
        toNumber(aiContext.progress?.activeStreak, 0) * 5 +
        avgFocus * 6 +
        avgMood * 5 -
        avgStress * 4,
      ),
    ),
  );

  const recoveryMode = burnoutRiskScore >= 72 || avgStress >= 3.8 || avgEnergy <= 2.4 || avgSleep <= 2.4;
  const taskIntensity = recoveryMode
    ? "low"
    : momentumScore >= 72 && avgStress <= 3.1
      ? "high"
      : "medium";

  const workloadAdjustment = recoveryMode
    ? "shorten tasks, add recovery blocks, and reduce expectations"
    : taskIntensity === "high"
      ? "increase challenge carefully while protecting recovery anchors"
      : "keep medium intensity with clear finish lines and fallback versions";

  return {
    burnoutRiskScore,
    momentumScore,
    recoveryMode,
    taskIntensity,
    avgStress,
    avgEnergy,
    avgSleep,
    avgFocus,
    avgMood,
    dailyFocus: buildDailyFocus(profile, { recoveryMode }),
    workloadAdjustment,
  };
}
