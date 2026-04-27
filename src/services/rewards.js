export const STATUS_POINTS = {
  completed: 10,
  partial: 6,
  difficult: 5,
  missed: 0,
};

const POSITIVE_STATUSES = ["completed", "partial", "difficult"];
const WEEKLY_STATUS_WEIGHTS = {
  completed: 1,
  partial: 0.65,
  difficult: 0.4,
  missed: 0,
};
const WEEKLY_HISTORY_LIMIT = 16;

export const defaultProgress = {
  momentumPoints: 0,
  activeStreak: 0,
  longestStreak: 0,
  comebackWins: 0,
  completedDays: 0,
  partialDays: 0,
  difficultDays: 0,
  missedDays: 0,
  weeklyCompletions: 0,
  monthlyCompletions: 0,
  goalMilestones: 0,
  badges: [],
  milestones: [],
  lastCheckInDate: null,
  lastPositiveDate: null,
  latestBadge: null,
  bestWeekCompletion: 0,
  weeklyStats: [],
  lastWeekSummary: null,
};

function parseDateInput(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value || Date.now());
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function getDateKey(date = new Date()) {
  const parsed = parseDateInput(date);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addUnique(list, value) {
  return list.includes(value) ? list : [...list, value];
}

function daysBetween(dateA, dateB) {
  if (!dateA || !dateB) return 0;
  const left = parseDateInput(dateA);
  const right = parseDateInput(dateB);
  return Math.round((left - right) / 86400000);
}

export function getWeekStart(date = new Date()) {
  const parsed = parseDateInput(date);
  const day = parsed.getDay();
  const diff = parsed.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(parsed.getFullYear(), parsed.getMonth(), diff);
}

export function getWeekEnd(date = new Date()) {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

export function getWeekKey(date = new Date()) {
  return getDateKey(getWeekStart(date));
}

function countStatus(progress, status, delta) {
  if (!status) return { ...progress };
  const next = { ...progress };

  if (status === "completed") next.completedDays = Math.max(0, next.completedDays + delta);
  if (status === "partial") next.partialDays = Math.max(0, next.partialDays + delta);
  if (status === "difficult") next.difficultDays = Math.max(0, next.difficultDays + delta);
  if (status === "missed") next.missedDays = Math.max(0, next.missedDays + delta);

  return next;
}

function awardPoints(progress, rewards, points, reason) {
  if (!points) return progress;
  const nextProgress = { ...progress, momentumPoints: progress.momentumPoints + points };
  rewards.push({ type: "points-awarded", reason, points });
  return nextProgress;
}

function unlockBadge(progress, badgeId, rewards, reason = badgeId) {
  if (progress.badges.includes(badgeId)) return progress;
  rewards.push({ type: "badge-unlocked", badge: badgeId, points: 0, reason });
  return {
    ...progress,
    badges: addUnique(progress.badges, badgeId),
    latestBadge: badgeId,
  };
}

function unlockMilestone(progress, milestoneId, rewards, points = 0) {
  if (progress.milestones.includes(milestoneId)) return progress;
  let nextProgress = {
    ...progress,
    milestones: addUnique(progress.milestones, milestoneId),
  };
  rewards.push({ type: "milestone-unlocked", milestone: milestoneId, points: 0, reason: milestoneId });
  if (points > 0) {
    nextProgress = awardPoints(nextProgress, rewards, points, milestoneId);
  }
  return nextProgress;
}

function createWeekStat(dateKey) {
  return {
    weekKey: getWeekKey(dateKey),
    weekStart: getDateKey(getWeekStart(dateKey)),
    weekEnd: getDateKey(getWeekEnd(dateKey)),
    completed: 0,
    partial: 0,
    difficult: 0,
    missed: 0,
    positiveDays: 0,
    checkedInDays: 0,
    completionRate: 0,
    consistencyRate: 0,
    pointsEarned: 0,
    rewardedGoodWeek: false,
    rewardedStrongWeek: false,
    rewardedFullWeek: false,
    rewardedPerfectWeek: false,
    updatedAt: dateKey,
  };
}

function summarizeWeekStat(stat) {
  const completed = stat.completed || 0;
  const partial = stat.partial || 0;
  const difficult = stat.difficult || 0;
  const missed = stat.missed || 0;
  const positiveDays = completed + partial + difficult;
  const checkedInDays = positiveDays + missed;
  const weightedScore =
    completed * WEEKLY_STATUS_WEIGHTS.completed +
    partial * WEEKLY_STATUS_WEIGHTS.partial +
    difficult * WEEKLY_STATUS_WEIGHTS.difficult;

  return {
    ...stat,
    positiveDays,
    checkedInDays,
    completionRate: Math.round((weightedScore / 7) * 100),
    consistencyRate: Math.round((positiveDays / 7) * 100),
    pointsEarned:
      completed * STATUS_POINTS.completed +
      partial * STATUS_POINTS.partial +
      difficult * STATUS_POINTS.difficult,
  };
}

function sortWeeklyStats(weeklyStats) {
  return [...weeklyStats]
    .sort((left, right) => right.weekStart.localeCompare(left.weekStart))
    .slice(0, WEEKLY_HISTORY_LIMIT);
}

function adjustWeekStatus(stat, status, delta) {
  if (!status) return stat;
  return {
    ...stat,
    [status]: Math.max(0, (stat[status] || 0) + delta),
  };
}

function syncCurrentWeek(progress, dateKey, previousStatus, nextStatus) {
  const weekKey = getWeekKey(dateKey);
  const existingStats = Array.isArray(progress.weeklyStats) ? progress.weeklyStats : [];
  const existingWeek = existingStats.find((item) => item.weekKey === weekKey) || createWeekStat(dateKey);

  let updatedWeek = { ...existingWeek, updatedAt: dateKey };
  updatedWeek = adjustWeekStatus(updatedWeek, previousStatus, -1);
  updatedWeek = adjustWeekStatus(updatedWeek, nextStatus, 1);
  updatedWeek = summarizeWeekStat(updatedWeek);

  const nextWeeklyStats = sortWeeklyStats(
    existingStats.some((item) => item.weekKey === weekKey)
      ? existingStats.map((item) => (item.weekKey === weekKey ? updatedWeek : item))
      : [...existingStats, updatedWeek],
  );

  return {
    ...progress,
    weeklyStats: nextWeeklyStats,
    lastWeekSummary: updatedWeek,
    bestWeekCompletion: Math.max(progress.bestWeekCompletion || 0, updatedWeek.completionRate),
  };
}

function getWeekFromProgress(progress, weekKey) {
  return (progress.weeklyStats || []).find((item) => item.weekKey === weekKey) || null;
}

function markWeekReward(progress, weekKey, rewardKey) {
  const weeklyStats = (progress.weeklyStats || []).map((item) =>
    item.weekKey === weekKey ? { ...item, [rewardKey]: true } : item,
  );
  const lastWeekSummary = progress.lastWeekSummary?.weekKey === weekKey
    ? { ...progress.lastWeekSummary, [rewardKey]: true }
    : progress.lastWeekSummary;

  return {
    ...progress,
    weeklyStats,
    lastWeekSummary,
  };
}

export function applyProgressAction(currentProgress, action) {
  let progress = { ...defaultProgress, ...currentProgress };
  const rewards = [];

  if (action.type === "plan-created") {
    const isFirstPlan = !progress.badges.includes("first-step");
    progress = awardPoints(progress, rewards, isFirstPlan ? 20 : 10, isFirstPlan ? "first-plan-created" : "plan-created");
    if (isFirstPlan) progress = unlockBadge(progress, "first-step", rewards);
    if (action.roadmapFocus === "career" && !progress.badges.includes("career-explorer")) {
      progress = awardPoints(progress, rewards, 15, "career-plan-created");
      progress = unlockBadge(progress, "career-explorer", rewards, "career-plan-created");
    }
    if (action.roadmapFocus === "hobbies" && !progress.badges.includes("future-mapper")) {
      progress = awardPoints(progress, rewards, 15, "hobbies-roadmap-created");
      progress = unlockBadge(progress, "future-mapper", rewards, "hobbies-roadmap-created");
    }
  }

  if (action.type === "plan-adjusted") {
    progress = awardPoints(progress, rewards, 8, "plan-adjusted");
    progress = unlockBadge(progress, "honest-start", rewards);
  }

  if (action.type === "profile-saved") {
    if (!progress.badges.includes("self-aware-start")) {
      progress = awardPoints(progress, rewards, 10, "profile-completed");
      progress = unlockBadge(progress, "self-aware-start", rewards);
    }
  }

  if (action.type === "feedback-submitted") {
    if (!progress.badges.includes("reflection-maker")) {
      progress = awardPoints(progress, rewards, 10, "first-feedback");
      progress = unlockBadge(progress, "reflection-maker", rewards);
    } else {
      progress = awardPoints(progress, rewards, 5, "feedback-submitted");
    }
  }

  if (action.type === "daily-checkin") {
    const previousStatus = action.previousStatus || null;
    const nextStatus = action.status;
    const previousPoints = previousStatus ? STATUS_POINTS[previousStatus] || 0 : 0;
    const nextPoints = STATUS_POINTS[nextStatus] || 0;
    const delta = nextPoints - previousPoints;
    const wasPositive = POSITIVE_STATUSES.includes(previousStatus);
    const isPositive = POSITIVE_STATUSES.includes(nextStatus);
    const sameDayUpdate = progress.lastCheckInDate === action.dateKey;

    if (previousStatus) progress = countStatus(progress, previousStatus, -1);
    progress = countStatus(progress, nextStatus, 1);

    if (delta !== 0) {
      progress = awardPoints(progress, rewards, delta, `checkin-${nextStatus}`);
    }

    if (!sameDayUpdate || (!wasPositive && isPositive) || (wasPositive && !isPositive)) {
      if (isPositive) {
        const gap = progress.lastPositiveDate ? daysBetween(action.dateKey, progress.lastPositiveDate) : 1;

        if (!sameDayUpdate && gap >= 3) {
          const comebackPoints = gap >= 7 ? 25 : 15;
          const comebackBadge = gap >= 7 ? "resilient-return" : "calm-comeback";
          progress = {
            ...progress,
            comebackWins: progress.comebackWins + 1,
          };
          progress = awardPoints(progress, rewards, comebackPoints, gap >= 7 ? "comeback-7-days" : "comeback-2-days");
          progress = unlockBadge(progress, comebackBadge, rewards);
        }

        if (!sameDayUpdate) {
          progress = {
            ...progress,
            activeStreak: gap === 1 ? progress.activeStreak + 1 : 1,
          };
        } else if (!wasPositive && isPositive) {
          progress = {
            ...progress,
            activeStreak: Math.max(progress.activeStreak, 1),
          };
        }

        progress = {
          ...progress,
          longestStreak: Math.max(progress.longestStreak, progress.activeStreak),
          lastPositiveDate: action.dateKey,
        };
      }

      if (!isPositive && sameDayUpdate && wasPositive) {
        progress = {
          ...progress,
          activeStreak: Math.max(progress.activeStreak - 1, 0),
          lastPositiveDate: progress.lastPositiveDate === action.dateKey ? null : progress.lastPositiveDate,
        };
      }

      if (!isPositive && !sameDayUpdate) {
        progress = { ...progress, activeStreak: 0 };
      }
    }

    progress = {
      ...progress,
      lastCheckInDate: action.dateKey,
    };

    progress = syncCurrentWeek(progress, action.dateKey, previousStatus, nextStatus);
    let currentWeek = getWeekFromProgress(progress, getWeekKey(action.dateKey));

    if (progress.activeStreak >= 3 && !progress.badges.includes("3-day-builder")) {
      progress = awardPoints(progress, rewards, 15, "3-day-streak");
      progress = unlockBadge(progress, "3-day-builder", rewards);
    }
    if (progress.activeStreak >= 7 && !progress.badges.includes("weekly-finisher")) {
      progress = awardPoints(progress, rewards, 30, "7-day-streak");
      progress = unlockBadge(progress, "weekly-finisher", rewards);
    }
    if (progress.activeStreak >= 14 && !progress.badges.includes("consistency-keeper")) {
      progress = awardPoints(progress, rewards, 40, "14-day-streak");
      progress = unlockBadge(progress, "consistency-keeper", rewards);
    }
    if (progress.activeStreak >= 30 && !progress.badges.includes("momentum-master")) {
      progress = awardPoints(progress, rewards, 100, "30-day-streak");
      progress = unlockBadge(progress, "momentum-master", rewards);
      progress = unlockMilestone(progress, "one-month-complete", rewards, 120);
    }

    if (currentWeek && currentWeek.positiveDays >= 5 && !currentWeek.rewardedGoodWeek) {
      progress = awardPoints(progress, rewards, 25, "good-week");
      progress = markWeekReward(progress, currentWeek.weekKey, "rewardedGoodWeek");
      currentWeek = getWeekFromProgress(progress, currentWeek.weekKey);
    }

    if (currentWeek && currentWeek.completionRate >= 85 && currentWeek.positiveDays >= 5 && !currentWeek.rewardedStrongWeek) {
      progress = markWeekReward(progress, currentWeek.weekKey, "rewardedStrongWeek");
      progress = unlockBadge(progress, "strong-week", rewards);
      currentWeek = getWeekFromProgress(progress, currentWeek.weekKey);
    }

    if (currentWeek && currentWeek.positiveDays >= 7 && !currentWeek.rewardedFullWeek) {
      progress = awardPoints(progress, rewards, 50, "full-week-complete");
      progress = {
        ...progress,
        weeklyCompletions: progress.weeklyCompletions + 1,
      };
      progress = markWeekReward(progress, currentWeek.weekKey, "rewardedFullWeek");
      progress = unlockBadge(progress, "weekly-finisher", rewards);
      progress = unlockMilestone(progress, "first-week-complete", rewards, 0);
      currentWeek = getWeekFromProgress(progress, currentWeek.weekKey);
    }

    if (currentWeek && currentWeek.completed >= 7 && !currentWeek.rewardedPerfectWeek) {
      progress = awardPoints(progress, rewards, 35, "perfect-week");
      progress = markWeekReward(progress, currentWeek.weekKey, "rewardedPerfectWeek");
      progress = unlockBadge(progress, "perfect-week", rewards);
      currentWeek = getWeekFromProgress(progress, currentWeek.weekKey);
    }

    const monthlyCompletions = Math.floor(progress.weeklyCompletions / 4);
    if (monthlyCompletions > progress.monthlyCompletions) {
      progress = {
        ...progress,
        monthlyCompletions,
      };
      progress = unlockMilestone(progress, "month-consistent", rewards, 150);
    }
  }

  if (progress.momentumPoints >= 100) progress = unlockMilestone(progress, "100-points", rewards, 0);
  if (progress.momentumPoints >= 500) progress = unlockMilestone(progress, "500-points", rewards, 0);
  if (progress.weeklyCompletions >= 2) progress = unlockMilestone(progress, "2-weeks-complete", rewards, 80);
  if (progress.comebackWins >= 3) progress = unlockMilestone(progress, "resilience-champion", rewards, 100);

  return { progress, rewards };
}
