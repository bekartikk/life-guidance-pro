import { useMemo } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "../ui/index.js";
import { GridLayout, PanelLayout, SectionHeader } from "../layout/index.js";
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
      <SectionHeader
        eyebrow="Weekly Progress"
        title="Turn streaks into real weekly wins"
        description="This page keeps the weekly reward system visible so progress feels structured, not accidental."
        className="progress-header"
        actions={(
          <div className="action-row">
            <Button type="button" className="secondary-button" variant="secondary" onClick={() => onExportWeeklySummary?.(currentWeek)}>
              Export weekly summary
            </Button>
            <Button type="button" className="secondary-button" variant="secondary" onClick={() => onShareWeeklySummary?.(currentWeek)}>
              Share weekly snapshot
            </Button>
          </div>
        )}
      />

      <Card className="section-card current-week" tone="elevated">
        <CardHeader className="section-card-header">
          <SectionHeader
            title="Current reward week"
            description={formatRange(getDateKey(getWeekStart(new Date())), getDateKey(getWeekEnd(new Date())))}
            actions={<Badge className="feedback-badge" tone="info">{getWeeklyTargetMessage(currentWeek)}</Badge>}
          />
        </CardHeader>

        <CardContent className="grid gap-6">
          <GridLayout className="week-overview">
            <Card className="week-stat" tone="soft"><CardContent><span className="stat-label">Positive days</span><span className="stat-value">{currentWeek?.positiveDays || 0}/7</span></CardContent></Card>
            <Card className="week-stat" tone="soft"><CardContent><span className="stat-label">Weekly score</span><span className="stat-value">{currentWeek?.completionRate || 0}%</span><div className="completion-bar"><span className="completion-fill" style={{ width: `${currentWeek?.completionRate || 0}%` }} /></div></CardContent></Card>
            <Card className="week-stat" tone="soft"><CardContent><span className="stat-label">Recorded days</span><span className="stat-value">{currentWeek?.checkedInDays || 0}/7</span></CardContent></Card>
            <Card className="week-stat" tone="soft"><CardContent><span className="stat-label">Points earned</span><span className="stat-value">{currentWeek?.pointsEarned || 0}</span></CardContent></Card>
          </GridLayout>

          <GridLayout className="weekly-target-grid">
            <Card className="target-card" tone="soft"><CardContent><span className="stat-label">Weekly bonus</span><strong>{Math.min(currentWeek?.positiveDays || 0, 5)}/5 positive days</strong><span className="target-state">Unlocks the good-week reward.</span></CardContent></Card>
            <Card className="target-card" tone="soft"><CardContent><span className="stat-label">Full reward week</span><strong>{Math.min(currentWeek?.positiveDays || 0, 7)}/7 positive days</strong><span className="target-state">Triggers weekly completion progress.</span></CardContent></Card>
            <Card className="target-card" tone="soft"><CardContent><span className="stat-label">Perfect week</span><strong>{Math.min(currentWeek?.completed || 0, 7)}/7 completed days</strong><span className="target-state">Locks in the cleanest weekly badge.</span></CardContent></Card>
          </GridLayout>
        </CardContent>
      </Card>

      <Card className="section-card weekly-history" tone="soft">
        <CardHeader className="section-card-header">
          <SectionHeader title="Weekly history" description="A cleaner read on how your weeks are stacking over time." />
        </CardHeader>
        <CardContent>
          {weeklyHistory.length === 0 ? (
            <p className="muted-text">Your weekly history appears after you start checking in.</p>
          ) : (
            <div className="weeks-list">
              {weeklyHistory.slice(0, 8).map((week) => (
                <Card key={week.weekKey} className="week-card" tone="soft">
                  <CardContent>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card weekly-badges" tone="soft">
          <CardHeader><CardTitle>Weekly badges</CardTitle></CardHeader>
          <CardContent>
            {weeklyBadges.length === 0 ? (
              <p className="muted-text">Weekly badges unlock as your check-ins start holding their shape.</p>
            ) : (
              <div className="badges-grid">
                {weeklyBadges.map((badge) => {
                  const details = WEEKLY_BADGE_DETAILS[badge.badge];
                  return (
                    <Card key={badge.badge} className="weekly-badge-item" tone="soft">
                      <CardContent>
                        <div className="badge-info">
                          <strong>{details.name}</strong>
                          <p>{details.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="section-card milestones-section" tone="soft">
          <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
          <CardContent>
            {milestoneItems.length === 0 ? (
              <p className="muted-text">Milestones appear once your weekly rhythm starts compounding.</p>
            ) : (
              <div className="milestones-list">
                {milestoneItems.map((milestone) => (
                  <Card key={milestone.id} className="milestone-item" tone="soft">
                    <CardContent>
                      <div className="milestone-content">
                        <strong>{milestone.name}</strong>
                        <p>{milestone.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PanelLayout>

      <Card className="section-card overall-stats" tone="soft">
        <CardHeader><CardTitle>Overall reward picture</CardTitle></CardHeader>
        <CardContent>
          <GridLayout className="overall-grid">
            <Card className="overall-stat" tone="soft"><CardContent><span className="stat-name">Weekly wins</span><span className="stat-num">{progress.weeklyCompletions}</span></CardContent></Card>
            <Card className="overall-stat" tone="soft"><CardContent><span className="stat-name">Best week</span><span className="stat-num">{progress.bestWeekCompletion || 0}%</span></CardContent></Card>
            <Card className="overall-stat" tone="soft"><CardContent><span className="stat-name">Monthly wins</span><span className="stat-num">{progress.monthlyCompletions}</span></CardContent></Card>
            <Card className="overall-stat" tone="soft"><CardContent><span className="stat-name">Active streak</span><span className="stat-num">{progress.activeStreak}</span></CardContent></Card>
            <Card className="overall-stat" tone="soft"><CardContent><span className="stat-name">Longest streak</span><span className="stat-num">{progress.longestStreak}</span></CardContent></Card>
            <Card className="overall-stat" tone="soft"><CardContent><span className="stat-name">Momentum points</span><span className="stat-num">{progress.momentumPoints}</span></CardContent></Card>
          </GridLayout>
        </CardContent>
      </Card>
    </section>
  );
}

export default WeeklyProgressTab;
