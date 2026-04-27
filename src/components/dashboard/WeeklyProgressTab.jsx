import { useMemo } from "react";
import { getDateKey, getWeekEnd, getWeekKey, getWeekStart } from "../../services/rewards";

const WEEKLY_BADGE_DETAILS = {
  "weekly-finisher": { name: "Weekly Finisher", description: "You reached a full week of positive days." },
  "strong-week": { name: "Strong Week", description: "Your weekly score crossed the strong-week threshold." },
  "perfect-week": { name: "Perfect Week", description: "Every recorded day landed as fully completed." },
  "consistency-keeper": { name: "Consistency Keeper", description: "You held a 14-day streak." },
  "momentum-master": { name: "Momentum Master", description: "You pushed all the way to a 30-day streak." },
};

const MILESTONE_DETAILS = {
  "first-week-complete": { name: "First Week Complete", description: "You finished your first full reward week." },
  "2-weeks-complete": { name: "Two Weeks Complete", description: "You stacked two reward weeks together." },
  "month-consistent": { name: "Month Consistent", description: "You built four weekly wins into a monthly pattern." },
  "one-month-complete": { name: "One Month Complete", description: "A full month of momentum is now on the board." },
  "resilience-champion": { name: "Resilience Champion", description: "You kept returning and turning resets into progress." },
  "100-points": { name: "100 Points", description: "Your first big momentum checkpoint." },
  "500-points": { name: "500 Points", description: "A serious amount of follow-through." },
};

function summarizeWeekFromCheckins(checkins) {
  const totals = { completed: 0, partial: 0, difficult: 0, missed: 0 };
  checkins.forEach((checkin) => {
    if (checkin.status && totals[checkin.status] !== undefined) {
      totals[checkin.status] += 1;
    }
  });

  const positiveDays = totals.completed + totals.partial + totals.difficult;
  const checkedInDays = positiveDays + totals.missed;
  const completionRate = Math.round(((totals.completed + totals.partial * 0.65 + totals.difficult * 0.4) / 7) * 100);
  const pointsEarned = totals.completed * 10 + totals.partial * 6 + totals.difficult * 5;

  return {
    weekKey: getWeekKey(checkins[0]?.date || new Date()),
    weekStart: getDateKey(getWeekStart(checkins[0]?.date || new Date())),
    weekEnd: getDateKey(getWeekEnd(checkins[0]?.date || new Date())),
    ...totals,
    positiveDays,
    checkedInDays,
    completionRate,
    consistencyRate: Math.round((positiveDays / 7) * 100),
    pointsEarned,
  };
}

function formatRange(startKey, endKey) {
  const start = new Date(startKey);
  const end = new Date(endKey);
  const startLabel = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(start);
  const endLabel = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(end);
  return `${startLabel} - ${endLabel}`;
}

function getWeeklyTargetMessage(week) {
  if (!week) return "Your first weekly reward starts after the first positive day.";
  if (week.positiveDays >= 7) return "Full week locked in. Keep the rhythm steady and protect it.";
  if (week.positiveDays >= 5) {
    const remaining = 7 - week.positiveDays;
    return `${remaining} more positive day${remaining === 1 ? "" : "s"} to close a full reward week.`;
  }
  const remaining = 5 - week.positiveDays;
  return `${remaining} more positive day${remaining === 1 ? "" : "s"} to earn the weekly consistency bonus.`;
}

function buildDerivedWeeklyStats(checkins) {
  const grouped = checkins.reduce((accumulator, item) => {
    const weekKey = getWeekKey(item.date);
    if (!accumulator[weekKey]) accumulator[weekKey] = [];
    accumulator[weekKey].push(item);
    return accumulator;
  }, {});

  return Object.values(grouped)
    .map((items) => summarizeWeekFromCheckins(items))
    .sort((left, right) => right.weekStart.localeCompare(left.weekStart));
}

function WeeklyProgressTab({ checkins, progress, rewards, onExportWeeklySummary, onShareWeeklySummary }) {
  const currentWeekKey = getWeekKey();

  const weeklyHistory = useMemo(() => {
    if (Array.isArray(progress.weeklyStats) && progress.weeklyStats.length > 0) {
      return [...progress.weeklyStats].sort((left, right) => right.weekStart.localeCompare(left.weekStart));
    }
    return buildDerivedWeeklyStats(checkins);
  }, [checkins, progress.weeklyStats]);

  const currentWeek = weeklyHistory.find((item) => item.weekKey === currentWeekKey) || null;

  const weeklyBadges = useMemo(() => {
    const seen = new Set();
    return rewards.filter((reward) => {
      if (reward.type !== "badge-unlocked" || !WEEKLY_BADGE_DETAILS[reward.badge] || seen.has(reward.badge)) {
        return false;
      }
      seen.add(reward.badge);
      return true;
    });
  }, [rewards]);

  const milestoneItems = progress.milestones
    .filter((milestone) => MILESTONE_DETAILS[milestone])
    .map((milestone) => ({ id: milestone, ...MILESTONE_DETAILS[milestone] }));

  return (
    <section className="weekly-progress-panel in-workspace">
      <div className="progress-header">
        <div>
          <p className="eyebrow">Weekly Progress</p>
          <h2>Turn streaks into real weekly wins</h2>
          <p className="muted-text">This page keeps the weekly reward system visible so progress feels structured, not accidental.</p>
        </div>
        <div className="action-row">
          <button type="button" className="secondary-button" onClick={() => onExportWeeklySummary?.(currentWeek)}>
            Export weekly summary
          </button>
          <button type="button" className="secondary-button" onClick={() => onShareWeeklySummary?.(currentWeek)}>
            Share weekly snapshot
          </button>
        </div>
      </div>

      <div className="section-card current-week">
        <div className="section-card-header">
          <div>
            <h3>Current reward week</h3>
            <p className="muted-text">{formatRange(getDateKey(getWeekStart(new Date())), getDateKey(getWeekEnd(new Date())))}</p>
          </div>
          <p className="feedback-badge">{getWeeklyTargetMessage(currentWeek)}</p>
        </div>

        <div className="week-overview">
          <div className="week-stat">
            <span className="stat-label">Positive days</span>
            <span className="stat-value">{currentWeek?.positiveDays || 0}/7</span>
          </div>
          <div className="week-stat">
            <span className="stat-label">Weekly score</span>
            <span className="stat-value">{currentWeek?.completionRate || 0}%</span>
            <div className="completion-bar">
              <span className="completion-fill" style={{ width: `${currentWeek?.completionRate || 0}%` }} />
            </div>
          </div>
          <div className="week-stat">
            <span className="stat-label">Recorded days</span>
            <span className="stat-value">{currentWeek?.checkedInDays || 0}/7</span>
          </div>
          <div className="week-stat">
            <span className="stat-label">Points earned</span>
            <span className="stat-value">{currentWeek?.pointsEarned || 0}</span>
          </div>
        </div>

        <div className="weekly-target-grid">
          <div className="target-card">
            <span className="stat-label">Weekly bonus</span>
            <strong>{Math.min(currentWeek?.positiveDays || 0, 5)}/5 positive days</strong>
            <span className="target-state">Unlocks the good-week reward.</span>
          </div>
          <div className="target-card">
            <span className="stat-label">Full reward week</span>
            <strong>{Math.min(currentWeek?.positiveDays || 0, 7)}/7 positive days</strong>
            <span className="target-state">Triggers weekly completion progress.</span>
          </div>
          <div className="target-card">
            <span className="stat-label">Perfect week</span>
            <strong>{Math.min(currentWeek?.completed || 0, 7)}/7 completed days</strong>
            <span className="target-state">Locks in the cleanest weekly badge.</span>
          </div>
        </div>
      </div>

      <div className="section-card weekly-history">
        <div className="section-card-header">
          <div>
            <h3>Weekly history</h3>
            <p className="muted-text">A cleaner read on how your weeks are stacking over time.</p>
          </div>
        </div>
        {weeklyHistory.length === 0 ? (
          <p className="muted-text">Your weekly history appears after you start checking in.</p>
        ) : (
          <div className="weeks-list">
            {weeklyHistory.slice(0, 8).map((week) => (
              <article key={week.weekKey} className="week-card">
                <div className="week-header">
                  <strong>{formatRange(week.weekStart, week.weekEnd)}</strong>
                  <span className="week-completion">{week.completionRate}% score</span>
                </div>
                <div className="week-breakdown">
                  <span className="breakdown-item completed"><strong>{week.completed}</strong> completed</span>
                  <span className="breakdown-item partial"><strong>{week.partial}</strong> partial</span>
                  <span className="breakdown-item difficult"><strong>{week.difficult}</strong> difficult</span>
                  <span className="breakdown-item missed"><strong>{week.missed}</strong> missed</span>
                </div>
                <div className="week-footer">
                  <span>{week.positiveDays}/7 positive days</span>
                  <span>{week.pointsEarned} points</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="split-progress-grid">
        <div className="section-card weekly-badges">
          <h3>Weekly badges</h3>
          {weeklyBadges.length === 0 ? (
            <p className="muted-text">Weekly badges unlock as your check-ins start holding their shape.</p>
          ) : (
            <div className="badges-grid">
              {weeklyBadges.map((badge) => {
                const details = WEEKLY_BADGE_DETAILS[badge.badge];
                return (
                  <article key={badge.badge} className="weekly-badge-item">
                    <div className="badge-info">
                      <strong>{details.name}</strong>
                      <p>{details.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="section-card milestones-section">
          <h3>Milestones</h3>
          {milestoneItems.length === 0 ? (
            <p className="muted-text">Milestones appear once your weekly rhythm starts compounding.</p>
          ) : (
            <div className="milestones-list">
              {milestoneItems.map((milestone) => (
                <article key={milestone.id} className="milestone-item">
                  <div className="milestone-content">
                    <strong>{milestone.name}</strong>
                    <p>{milestone.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section-card overall-stats">
        <h3>Overall reward picture</h3>
        <div className="overall-grid">
          <div className="overall-stat">
            <span className="stat-name">Weekly wins</span>
            <span className="stat-num">{progress.weeklyCompletions}</span>
          </div>
          <div className="overall-stat">
            <span className="stat-name">Best week</span>
            <span className="stat-num">{progress.bestWeekCompletion || 0}%</span>
          </div>
          <div className="overall-stat">
            <span className="stat-name">Monthly wins</span>
            <span className="stat-num">{progress.monthlyCompletions}</span>
          </div>
          <div className="overall-stat">
            <span className="stat-name">Active streak</span>
            <span className="stat-num">{progress.activeStreak}</span>
          </div>
          <div className="overall-stat">
            <span className="stat-name">Longest streak</span>
            <span className="stat-num">{progress.longestStreak}</span>
          </div>
          <div className="overall-stat">
            <span className="stat-name">Momentum points</span>
            <span className="stat-num">{progress.momentumPoints}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeeklyProgressTab;
