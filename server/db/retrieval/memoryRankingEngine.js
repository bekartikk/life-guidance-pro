import { scoreMemoryCandidate } from "./scoringUtils.js";

function clip(value, max = 240) {
  return String(value || "").trim().slice(0, max);
}

function summarizeMemory(memory = {}) {
  const behavior = memory.behaviorPatterns || {};
  const emotional = memory.emotionalSignals || {};

  return {
    lifeState: clip(behavior.lifeState, 80),
    personalityMode: clip(behavior.personalityMode, 80),
    taskIntensity: clip(behavior.taskIntensity, 40),
    burnoutRiskScore: Number(behavior.burnoutRiskScore || 0),
    momentumScore: Number(behavior.momentumScore || 0),
    topReasons: Array.isArray(behavior.topReasons) ? behavior.topReasons.slice(0, 3) : [],
    neglectedAreas: Array.isArray(behavior.neglectedAreas) ? behavior.neglectedAreas.slice(0, 3) : [],
    avgMood: Number(emotional.avgMood || 0),
    avgEnergy: Number(emotional.avgEnergy || 0),
    avgStress: Number(emotional.avgStress || 0),
    avgFocus: Number(emotional.avgFocus || 0),
    avgSleep: Number(emotional.avgSleep || 0),
    microWins: Array.isArray(memory.microWins) ? memory.microWins.slice(0, 3) : [],
    summary: clip(memory.summary || memory.headline || "", 240),
  };
}

function buildEvidence(summary) {
  const evidence = [];
  if (summary.lifeState) evidence.push(`Life state: ${summary.lifeState}`);
  if (summary.topReasons[0]?.label) evidence.push(`Recurring friction: ${summary.topReasons[0].label}`);
  if (summary.neglectedAreas[0]?.area) evidence.push(`Neglected area: ${summary.neglectedAreas[0].area}`);
  if (summary.microWins[0]) evidence.push(`Micro-win: ${summary.microWins[0]}`);
  return evidence.slice(0, 3);
}

export function rankSemanticMemories({ rows = [], querySignals = {}, limit = 4 }) {
  return rows
    .map((row) => {
      const summary = summarizeMemory(row.memory_json || {});
      const scoreBreakdown = scoreMemoryCandidate(row, querySignals);

      return {
        id: row.id,
        createdAt: row.created_at || null,
        scope: row.memory_scope || "adaptive_guidance",
        summary: row.summary || summary.summary || "Adaptive memory",
        details: summary,
        evidence: buildEvidence(summary),
        score: scoreBreakdown.totalScore,
        scoreBreakdown,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
