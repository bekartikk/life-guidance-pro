function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, safeNumber(value)));
}

export function normalizeDistance(distance) {
  return clamp(1 - safeNumber(distance, 1), 0, 1);
}

export function scoreMemoryCandidate(candidate = {}, querySignals = {}) {
  const vectorScore = normalizeDistance(candidate.similarity_distance);
  const recencyMs = Date.now() - new Date(candidate.created_at || 0).getTime();
  const recencyScore = Number.isFinite(recencyMs) && recencyMs >= 0
    ? clamp(1 - (recencyMs / (1000 * 60 * 60 * 24 * 30)), 0.15, 1)
    : 0.35;

  const memoryJson = candidate.memory_json || {};
  const behavior = memoryJson.behaviorPatterns || {};
  const emotionalSignals = memoryJson.emotionalSignals || {};

  const burnoutMatch = 1 - clamp(
    Math.abs(safeNumber(behavior.burnoutRiskScore, 0) - safeNumber(querySignals.burnoutRiskScore, 0)) / 100,
    0,
    1,
  );
  const energyMatch = 1 - clamp(
    Math.abs(safeNumber(emotionalSignals.avgEnergy, 0) - safeNumber(querySignals.avgEnergy, 0)) / 5,
    0,
    1,
  );
  const stressMatch = 1 - clamp(
    Math.abs(safeNumber(emotionalSignals.avgStress, 0) - safeNumber(querySignals.avgStress, 0)) / 5,
    0,
    1,
  );

  const totalScore = clamp(
    (vectorScore * 0.56) +
      (recencyScore * 0.18) +
      (burnoutMatch * 0.14) +
      (energyMatch * 0.06) +
      (stressMatch * 0.06),
    0,
    1,
  );

  return {
    vectorScore,
    recencyScore,
    burnoutMatch,
    energyMatch,
    stressMatch,
    totalScore,
  };
}
