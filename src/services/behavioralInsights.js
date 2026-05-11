function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function average(items) {
  if (!items.length) return 0;
  return items.reduce((sum, item) => sum + item, 0) / items.length;
}

function averageField(checkins, field) {
  const values = checkins.map((item) => toNumber(item?.[field])).filter((value) => value > 0);
  return average(values);
}

function countByStatus(checkins, statuses) {
  return checkins.filter((item) => statuses.includes(item.status)).length;
}

function extractTopReasons(checkins) {
  const counts = new Map();
  checkins.forEach((item) => {
    const raw = String(item.difficultyReason || item.reflection || "").toLowerCase();
    if (!raw) return;
    const normalized =
      raw.includes("sleep") ? "sleep" :
      raw.includes("stress") ? "stress" :
      raw.includes("time") ? "time pressure" :
      raw.includes("lonely") ? "loneliness" :
      raw.includes("money") || raw.includes("financ") ? "financial pressure" :
      raw.includes("family") || raw.includes("relationship") ? "relationship load" :
      raw.includes("health") || raw.includes("sick") ? "health" :
      raw.includes("overwhelm") ? "overwhelm" :
      raw.split(/[,.]/)[0].trim();
    if (!normalized) return;
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));
}

function buildNeglectedAreas(metrics, profile, goals, habits) {
  const neglected = [];

  if (metrics.avgSleep && metrics.avgSleep < 2.7) {
    neglected.push({
      area: "Sleep recovery",
      reason: "Sleep quality has been low, which usually drags energy, stress tolerance, and follow-through down with it.",
    });
  }
  if (metrics.avgHappiness && metrics.avgHappiness < 2.8) {
    neglected.push({
      area: "Joy and emotional recovery",
      reason: "Happiness signals are staying low. Your plan should protect at least one restorative activity instead of only output tasks.",
    });
  }
  if (metrics.avgStress && metrics.avgStress > 3.6) {
    neglected.push({
      area: "Stress buffering",
      reason: "Stress has been accumulating faster than recovery. Workload and pressure need a softer ceiling right now.",
    });
  }
  if (metrics.avgLoneliness && metrics.avgLoneliness > 3.3) {
    neglected.push({
      area: "Connection",
      reason: "Loneliness has been present often enough that social support should become part of the plan, not an afterthought.",
    });
  }
  if (metrics.avgFocus && metrics.avgFocus < 2.8) {
    neglected.push({
      area: "Focus protection",
      reason: "Focus quality keeps slipping, so shorter blocks and fewer competing priorities would help more than pushing harder.",
    });
  }
  if (!(profile.interests || "").trim() && habits.length === 0 && goals.length < 2) {
    neglected.push({
      area: "Direction clarity",
      reason: "The system still has thin signal around what energizes you, so the next step is clarity-building before intensity-building.",
    });
  }

  return neglected.slice(0, 4);
}

function buildMicroWins(progress, checkins, goals, habits) {
  const wins = [];
  if (progress.activeStreak > 0) {
    wins.push(`You are protecting a ${progress.activeStreak}-day streak, which means your system is still alive even on uneven days.`);
  }
  if (countByStatus(checkins.slice(0, 7), ["difficult", "partial"]) >= 2) {
    wins.push("You kept showing up on difficult days instead of disappearing completely, which is one of the strongest long-term growth signals.");
  }
  if (goals.length > 0) {
    wins.push(`You already have ${goals.length} goal${goals.length === 1 ? "" : "s"} translated into something visible, not just mental pressure.`);
  }
  if (habits.length > 0) {
    wins.push(`There are ${habits.length} habit${habits.length === 1 ? "" : "s"} in rotation, which gives the AI enough signal to simplify and protect momentum.`);
  }
  if (progress.comebackWins > 0) {
    wins.push(`You have ${progress.comebackWins} comeback win${progress.comebackWins === 1 ? "" : "s"}, which means recovery is becoming part of your discipline instead of the opposite of it.`);
  }

  return wins.slice(0, 4);
}

function inferPersonalityMode(metrics, profile) {
  const preferred = String(profile.workingStyle || profile.preferredRoutineStyle || "").toLowerCase();
  if (metrics.burnoutRiskScore >= 72) {
    return {
      active: "Recovery Guide",
      reason: "Stress, energy, and sleep signals suggest the system should coach gently and protect recovery first.",
    };
  }
  if (metrics.avgMotivation >= 3.8 && metrics.completionRatio >= 0.62) {
    return {
      active: "Discipline Coach",
      reason: "You currently have enough momentum for firmer structure and a slightly more demanding coaching voice.",
    };
  }
  if (preferred.includes("structured") || preferred.includes("deep")) {
    return {
      active: "Balanced Strategist",
      reason: "Your profile reads like someone who benefits from clarity and realism more than hype or pressure.",
    };
  }
  return {
    active: "Supportive Mentor",
    reason: "A calm, encouraging style is the safest default while the system is still learning your deeper cycles.",
  };
}

function inferLifeState(metrics, plans) {
  if (metrics.burnoutRiskScore >= 78) {
    return {
      label: "Burnout risk",
      tone: "danger",
      summary: "The system sees emotional and energy overload building. Plans should simplify, shorten, and protect recovery for a while.",
    };
  }
  if (metrics.avgStress >= 3.6 && metrics.avgEnergy <= 2.6) {
    return {
      label: "Recovery mode",
      tone: "warning",
      summary: "You are not in a growth sprint right now. Recovery, emotional steadiness, and low-friction routines matter most.",
    };
  }
  if (metrics.completionRatio >= 0.66 && metrics.avgMotivation >= 3.5) {
    return {
      label: "High momentum",
      tone: "success",
      summary: "Momentum is real right now. The AI can carefully raise challenge without tipping you into overload.",
    };
  }
  if (plans.length === 0 || metrics.avgFocus <= 2.4) {
    return {
      label: "Direction-building",
      tone: "info",
      summary: "The main need right now is clarity and structure. Smaller routines and simpler next steps will help the system learn faster.",
    };
  }
  return {
    label: "Stabilizing",
    tone: "info",
    summary: "You are in the middle zone where consistency, not intensity, will shape the next stage of growth.",
  };
}

function buildFutureProjection(metrics, goals, habits, hobbyPlans) {
  const projections = [];

  if (metrics.completionRatio >= 0.6) {
    projections.push("If this rhythm holds for the next 4-6 weeks, consistency should start feeling less effortful and more automatic.");
  } else {
    projections.push("If the routine is simplified now, the next month can become a recovery-and-rebuild phase instead of another restart cycle.");
  }

  if (habits.length > 0) {
    projections.push("Keeping even one minimum-version habit alive for 30 days will likely improve trust in your own follow-through more than adding new goals.");
  }

  if (goals.length > 0) {
    projections.push("With one visible goal anchor and weekly reviews, your direction should get sharper over the next quarter instead of staying abstract.");
  }

  if (hobbyPlans.length > 0) {
    projections.push("Your hobby-to-income path is early, but consistent skill reps could turn curiosity into portfolio evidence within a few months.");
  }

  return projections.slice(0, 4);
}

function buildAdaptiveRecommendations(metrics, topReasons) {
  const suggestions = [];

  if (metrics.burnoutRiskScore >= 70) {
    suggestions.push("Reduce workload intensity this week and protect one dedicated recovery block before adding new challenge.");
  }
  if (metrics.avgSleep && metrics.avgSleep < 3) {
    suggestions.push("Prioritize a sleep-friendly evening anchor. Better sleep is likely to unlock energy, focus, and emotional steadiness together.");
  }
  if (metrics.avgMotivation && metrics.avgMotivation < 3) {
    suggestions.push("Use smaller wins and clearer finish lines. Motivation looks more fragile than discipline right now.");
  }
  if (topReasons.some((reason) => reason.label === "time pressure")) {
    suggestions.push("Time pressure is recurring, so shorter task blocks and fewer parallel priorities should outperform ambitious schedules.");
  }
  if (!suggestions.length) {
    suggestions.push("Keep the plan adaptive: hold onto minimum versions, one meaningful stretch goal, and one recovery habit.");
  }

  return suggestions.slice(0, 4);
}

function buildMemoryCards(metrics, topReasons, profile, hobbyPlans) {
  const cards = [];

  cards.push({
    label: "Focus rhythm",
    value: metrics.avgFocus >= 3.4 ? "Sustained when sessions stay clean" : "Needs lighter, shorter blocks",
    detail: metrics.avgFocus >= 3.4
      ? "Your recent check-ins suggest clarity improves when the day has fewer competing demands."
      : "Focus has been inconsistent, so the system should reduce task switching and protect easier start ramps.",
  });

  cards.push({
    label: "Stress trigger",
    value: topReasons[0]?.label ? `Usually ${topReasons[0].label}` : "Still learning",
    detail: topReasons[0]
      ? `This showed up ${topReasons[0].count} time${topReasons[0].count === 1 ? "" : "s"} in recent check-ins.`
      : "Keep logging what made days hard so the AI can stop guessing and start adapting precisely.",
  });

  cards.push({
    label: "Motivation pattern",
    value: metrics.avgMotivation >= 3.5 ? "Responds to visible progress" : "Needs emotional safety first",
    detail: metrics.avgMotivation >= 3.5
      ? "You seem to gain energy when wins are visible and next steps are concrete."
      : "When motivation drops, pressure is probably too high. Recovery-first planning should work better.",
  });

  cards.push({
    label: "Growth lane",
    value: hobbyPlans[0]?.hobby || profile.careerInterest || "Still emerging",
    detail: hobbyPlans[0]?.goal || profile.longTermVision || "Your long-term direction becomes clearer as the AI collects more real-life evidence.",
  });

  return cards;
}

function buildJournalSummary(checkins) {
  const recentNotes = checkins
    .filter((item) => item.note || item.reflection)
    .slice(0, 4)
    .map((item) => item.note || item.reflection);

  if (!recentNotes.length) {
    return {
      headline: "Your reflection journal starts with one honest sentence.",
      prompt: "What made today easier, and what quietly drained you?",
      entries: [],
    };
  }

  return {
    headline: "Your recent reflections suggest the AI should keep adapting around real pressure, not ideal routines.",
    prompt: "Looking at the last few days, what pattern do you want the system to protect or change next?",
    entries: recentNotes,
  };
}

export function buildBehavioralInsights({
  profile = {},
  plans = [],
  goals = [],
  habits = [],
  checkins = [],
  progress = {},
  hobbyPlans = [],
}) {
  const recentCheckins = checkins.slice(0, 21);
  const hasCheckinSignal = recentCheckins.length > 0;
  const avgMood = hasCheckinSignal ? averageField(recentCheckins, "mood") : 3;
  const avgEnergy = hasCheckinSignal ? averageField(recentCheckins, "energy") : 3;
  const avgFocus = hasCheckinSignal ? averageField(recentCheckins, "focus") : 3;
  const avgLoneliness = hasCheckinSignal ? averageField(recentCheckins, "loneliness") : 2;
  const avgStress = hasCheckinSignal ? averageField(recentCheckins, "stress") : 3;
  const avgMotivation = hasCheckinSignal ? averageField(recentCheckins, "motivation") : 3;
  const avgSleep = hasCheckinSignal ? averageField(recentCheckins, "sleepQuality") : 3;
  const avgProductivity = hasCheckinSignal ? averageField(recentCheckins, "productivity") : 3;
  const avgHappiness = hasCheckinSignal ? averageField(recentCheckins, "happiness") : 3;

  const completedDays = countByStatus(recentCheckins, ["completed"]);
  const positiveDays = countByStatus(recentCheckins, ["completed", "partial", "difficult"]);
  const difficultDays = countByStatus(recentCheckins, ["difficult", "missed"]);
  const completionRatio = recentCheckins.length ? positiveDays / recentCheckins.length : 0;

  const burnoutRiskScore = hasCheckinSignal
    ? Math.max(
        12,
        Math.min(
          96,
          Math.round(
            (avgStress * 14) +
            ((6 - avgEnergy) * 8) +
            ((6 - avgSleep) * 8) +
            ((6 - avgMotivation) * 8) +
            ((6 - avgFocus) * 6) +
            (avgLoneliness * 5) +
            ((difficultDays / Math.max(recentCheckins.length || 1, 1)) * 28),
          ),
        ),
      )
    : 42;

  const metrics = {
    avgMood,
    avgEnergy,
    avgFocus,
    avgLoneliness,
    avgStress,
    avgMotivation,
    avgSleep,
    avgProductivity,
    avgHappiness,
    completionRatio,
    burnoutRiskScore,
  };

  const topReasons = extractTopReasons(recentCheckins);
  const lifeState = inferLifeState(metrics, plans);
  const personalityMode = inferPersonalityMode(metrics, profile);
  const neglectedAreas = buildNeglectedAreas(metrics, profile, goals, habits);
  const microWins = buildMicroWins(progress, recentCheckins, goals, habits);
  const futureProjection = buildFutureProjection(metrics, goals, habits, hobbyPlans);
  const adaptiveRecommendations = buildAdaptiveRecommendations(metrics, topReasons);
  const memoryCards = buildMemoryCards(metrics, topReasons, profile, hobbyPlans);
  const journal = buildJournalSummary(recentCheckins);

  return {
    lifeState,
    personalityMode,
    burnoutRisk: {
      score: burnoutRiskScore,
      label: burnoutRiskScore >= 78 ? "High" : burnoutRiskScore >= 58 ? "Watch closely" : "Managed",
      summary:
        burnoutRiskScore >= 78
          ? "The system should actively reduce pressure and insert recovery."
          : burnoutRiskScore >= 58
            ? "Some overload signals are rising. This is the time to simplify before momentum breaks."
            : "Your current load looks manageable if recovery and minimum versions stay visible.",
    },
    metrics,
    topReasons,
    neglectedAreas,
    microWins,
    futureProjection,
    adaptiveRecommendations,
    memoryCards,
    journal,
    summaryCards: [
      {
        label: "Life state",
        value: lifeState.label,
        detail: lifeState.summary,
      },
      {
        label: "Burnout risk",
        value: `${burnoutRiskScore}%`,
        detail: burnoutRiskScore >= 70 ? "Recovery-first planning recommended." : "Current workload is still adaptable.",
      },
      {
        label: "Coaching mode",
        value: personalityMode.active,
        detail: personalityMode.reason,
      },
      {
        label: "Momentum read",
        value: completedDays ? `${completedDays} strong day${completedDays === 1 ? "" : "s"}` : "Still forming",
        detail: completionRatio >= 0.6 ? "Consistency is becoming real." : "The system should favor rebuilds over pressure.",
      },
    ],
  };
}
