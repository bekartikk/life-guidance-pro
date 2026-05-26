import { useMemo } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "../ui/index.js";
import { GridLayout, PanelLayout, SectionHeader } from "../layout/index.js";
import { getDateKey, getWeekEnd, getWeekKey, getWeekStart } from "../../services/rewards";

const STATUS_META = {
  completed: { label: "Completed", short: "Done", color: "#2d6f5b", marker: "C" },
  partial: { label: "Partial", short: "Partial", color: "#7d6b4f", marker: "P" },
  difficult: { label: "Difficult but tried", short: "Tried", color: "#a8693f", marker: "D" },
  missed: { label: "Missed", short: "Missed", color: "#8d1f1f", marker: "M" },
};

function formatDayLabel(date) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
}

function formatDayDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function summarizeWeek(days) {
  const totals = { completed: 0, partial: 0, difficult: 0, missed: 0 };
  days.forEach((day) => {
    if (day.status) totals[day.status] += 1;
  });

  const positiveDays = totals.completed + totals.partial + totals.difficult;
  const checkedInDays = positiveDays + totals.missed;
  const completionRate = Math.round(((totals.completed + totals.partial * 0.65 + totals.difficult * 0.4) / 7) * 100);
  const pointsEarned = totals.completed * 10 + totals.partial * 6 + totals.difficult * 5;

  return { ...totals, positiveDays, checkedInDays, completionRate, pointsEarned };
}

function buildRewardTitle(reward) {
  if (reward.badge) {
    return reward.badge.replace(/-/g, " ");
  }
  if (reward.milestone) {
    return reward.milestone.replace(/-/g, " ");
  }
  return String(reward.reason || "progress").replace(/-/g, " ");
}

function DailyProgressTab({ checkins, progress, rewards, behavioralInsights, adaptiveWorkspace }) {
  const today = getDateKey();
  const currentWeekKey = getWeekKey();

  const checkinMap = useMemo(() => new Map(checkins.map((item) => [item.date, item])), [checkins]);

  const weekDays = useMemo(() => {
    const start = getWeekStart(new Date());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const dateKey = getDateKey(date);
      const checkin = checkinMap.get(dateKey);

      return {
        dateKey,
        label: formatDayLabel(date),
        displayDate: formatDayDate(date),
        status: checkin?.status || null,
        note: checkin?.note || "",
        mood: checkin?.mood || "",
        energy: checkin?.energy || "",
        focus: checkin?.focus || "",
        loneliness: checkin?.loneliness || "",
        difficultyReason: checkin?.difficultyReason || "",
        isToday: dateKey === today,
      };
    });
  }, [checkinMap, today]);

  const weekSummary = useMemo(() => {
    if (progress.lastWeekSummary?.weekKey === currentWeekKey) {
      return progress.lastWeekSummary;
    }
    return summarizeWeek(weekDays);
  }, [currentWeekKey, progress.lastWeekSummary, weekDays]);

  const todayCheckin = checkins.find((item) => item.date === today) || null;
  const recentCheckins = useMemo(() => checkins.slice(0, 6), [checkins]);
  const recentRewards = useMemo(() => rewards.slice(0, 6), [rewards]);
  const weekRangeLabel = `${formatDayDate(getWeekStart(new Date()))} - ${formatDayDate(getWeekEnd(new Date()))}`;

  return (
    <section className="daily-progress-panel in-workspace">
      <SectionHeader
        eyebrow="Daily Progress"
        title="See the shape of your week"
        description="Track the current week, spot friction early, and keep your momentum visible."
        className="progress-header"
      />

      <GridLayout className="summary-card">
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Today's Status</span><Badge className="status-badge" style={{ backgroundColor: STATUS_META[todayCheckin?.status]?.color || "#8fa298" }}>{todayCheckin ? STATUS_META[todayCheckin.status].label : "Waiting for check-in"}</Badge></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">This Week</span><span className="stat-value">{weekSummary.positiveDays}/7</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Weekly Score</span><span className="stat-value">{weekSummary.completionRate}%</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Points This Week</span><span className="stat-value">{weekSummary.pointsEarned}</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Life state</span><span className="stat-value">{behavioralInsights.lifeState.label}</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Workspace mode</span><span className="stat-value">{adaptiveWorkspace.workspaceMode.label}</span></CardContent></Card>
      </GridLayout>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Adaptive AI read" description="A short interpretation of what your recent days are teaching the system." />
          </CardHeader>
          <CardContent className="goal-list">
            {behavioralInsights.summaryCards.map((item) => (
              <Card key={item.label} className="goal-card" tone="soft">
                <CardContent>
                  <strong>{item.label}</strong>
                  <span className="goal-meta">{item.value}</span>
                  <p>{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Burnout prevention" description="The system should intervene before pressure becomes collapse." />
          </CardHeader>
          <CardContent className="goal-list">
            <Card className="goal-card" tone="soft">
              <CardContent>
                <strong>Burnout risk</strong>
                <span className="goal-meta">{behavioralInsights.burnoutRisk.score}% · {behavioralInsights.burnoutRisk.label}</span>
                <p>{behavioralInsights.burnoutRisk.summary}</p>
              </CardContent>
            </Card>
            {behavioralInsights.adaptiveRecommendations.map((item) => (
              <Card key={item} className="goal-card" tone="soft">
                <CardContent>
                  <strong>Recommended adjustment</strong>
                  <p>{item}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </PanelLayout>

      <Card className="section-card" tone="soft">
        <CardHeader className="section-card-header">
          <SectionHeader title="Adaptive insight feed" description="A quieter stream of what the system is learning from your recent days." />
        </CardHeader>
        <CardContent className="goal-list">
          {adaptiveWorkspace.insightFeed.slice(0, 4).map((item) => (
            <Card key={item.id} className="goal-card" tone="soft">
              <CardContent>
                <strong>{item.title}</strong>
                <span className="goal-meta">{item.kind}</span>
                <p>{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="section-card weekly-calendar" tone="elevated">
        <CardHeader className="section-card-header">
          <SectionHeader
            title="Current week"
            description={weekRangeLabel}
            actions={<Badge className="feedback-badge" tone="info">{weekSummary.checkedInDays}/7 days recorded</Badge>}
          />
        </CardHeader>
        <CardContent className="calendar-grid">
          {weekDays.map((day) => {
            const meta = day.status ? STATUS_META[day.status] : null;
            return (
              <Card key={day.dateKey} className={`calendar-day ${day.isToday ? "today" : ""} ${day.status ? "has-checkin" : ""}`} tone="soft">
                <CardContent>
                  <div className="day-header">
                    <span className="day-name">{day.label}</span>
                    <span className="day-date">{day.displayDate}</span>
                  </div>
                  <div className="day-content">
                    {meta ? (
                      <>
                        <span className="status-icon" style={{ color: meta.color }}>{meta.marker}</span>
                        <span className="status-text">{meta.short}</span>
                        {day.mood || day.energy || day.focus || day.loneliness ? (
                          <span className="goal-meta">
                            {day.mood ? `Mood ${day.mood}` : ""}
                            {day.energy ? ` · Energy ${day.energy}` : ""}
                          </span>
                        ) : null}
                        {day.note ? <p className="day-note">{day.note}</p> : null}
                      </>
                    ) : (
                      <span className="no-checkin">No check-in yet</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card daily-stats" tone="soft">
          <CardHeader><CardTitle>Rhythm snapshot</CardTitle></CardHeader>
          <CardContent>
            <GridLayout className="stats-grid">
              <Card className="stat-card" tone="soft"><CardContent><span className="stat-name">Active streak</span><span className="stat-num">{progress.activeStreak}</span></CardContent></Card>
              <Card className="stat-card" tone="soft"><CardContent><span className="stat-name">Longest streak</span><span className="stat-num">{progress.longestStreak}</span></CardContent></Card>
              <Card className="stat-card" tone="soft"><CardContent><span className="stat-name">Completed days</span><span className="stat-num">{weekSummary.completed}</span></CardContent></Card>
              <Card className="stat-card" tone="soft"><CardContent><span className="stat-name">Comeback wins</span><span className="stat-num">{progress.comebackWins}</span></CardContent></Card>
            </GridLayout>
          </CardContent>
        </Card>

        <Card className="section-card activity-section" tone="soft">
          <CardHeader><CardTitle>Recent check-ins</CardTitle></CardHeader>
          <CardContent>
            {recentCheckins.length === 0 ? (
              <p className="muted-text">Your daily check-ins will show up here after you start marking your days.</p>
            ) : (
              <div className="activity-list">
                {recentCheckins.map((checkin) => {
                  const meta = STATUS_META[checkin.status];
                  return (
                    <Card key={checkin.date} className="activity-card" tone="soft">
                      <CardContent>
                        <div className="activity-meta">
                          <strong>{formatDayDate(checkin.date)}</strong>
                          <span style={{ color: meta.color }}>{meta.label}</span>
                        </div>
                        {(checkin.mood || checkin.energy || checkin.focus || checkin.loneliness) ? (
                          <span className="goal-meta">
                            {checkin.mood ? `Mood ${checkin.mood}` : ""}
                            {checkin.energy ? ` · Energy ${checkin.energy}` : ""}
                            {checkin.focus ? ` · Focus ${checkin.focus}` : ""}
                            {checkin.loneliness ? ` · Loneliness ${checkin.loneliness}` : ""}
                          </span>
                        ) : null}
                        {(checkin.stress || checkin.motivation || checkin.sleepQuality || checkin.happiness) ? (
                          <span className="goal-meta">
                            {checkin.stress ? `Stress ${checkin.stress}` : ""}
                            {checkin.motivation ? ` · Motivation ${checkin.motivation}` : ""}
                            {checkin.sleepQuality ? ` · Sleep ${checkin.sleepQuality}` : ""}
                            {checkin.happiness ? ` · Happiness ${checkin.happiness}` : ""}
                          </span>
                        ) : null}
                        {checkin.difficultyReason ? <span className="goal-meta">Difficult because: {checkin.difficultyReason}</span> : null}
                        {checkin.wins ? <span className="goal-meta">Micro-win: {checkin.wins}</span> : null}
                        <p>{checkin.note || "No note saved for this day."}</p>
                        {checkin.reflection ? <p className="day-note">{checkin.reflection}</p> : null}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </PanelLayout>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Neglected life areas" description="The AI uses these signals to rebalance routines before things start quietly slipping." />
          </CardHeader>
          <CardContent className="goal-list">
            {behavioralInsights.neglectedAreas.length === 0 ? (
              <Card className="goal-card" tone="soft">
                <CardContent>
                  <strong>No major blind spot detected</strong>
                  <p>Your current signals look reasonably balanced. Keep logging honestly so this stays trustworthy.</p>
                </CardContent>
              </Card>
            ) : (
              behavioralInsights.neglectedAreas.map((item) => (
                <Card key={item.area} className="goal-card" tone="soft">
                  <CardContent>
                    <strong>{item.area}</strong>
                    <p>{item.reason}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Reflection journal" description="A calmer read of what you have been feeling, not just what you completed." />
          </CardHeader>
          <CardContent className="goal-list">
            <Card className="goal-card" tone="soft">
              <CardContent>
                <strong>{behavioralInsights.journal.headline}</strong>
                <p>{behavioralInsights.journal.prompt}</p>
              </CardContent>
            </Card>
            {behavioralInsights.journal.entries.map((entry) => (
              <Card key={entry} className="goal-card" tone="soft">
                <CardContent>
                  <strong>Journal echo</strong>
                  <p>{entry}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </PanelLayout>

      <Card className="section-card rewards-section" tone="soft">
        <CardHeader className="section-card-header">
          <SectionHeader title="Recent reward activity" description="A quick look at the wins your routine has already unlocked." />
        </CardHeader>
        <CardContent>
          {recentRewards.length === 0 ? (
            <p className="muted-text">Your point rewards and badges will appear here after plans, check-ins, and feedback.</p>
          ) : (
            <div className="activity-list reward-activity-list">
              {recentRewards.map((reward, index) => (
                <Card key={`${reward.type}-${reward.createdAt || reward.date}-${index}`} className="activity-card reward-activity-card" tone="soft">
                  <CardContent>
                    <div className="activity-meta">
                      <strong>{buildRewardTitle(reward)}</strong>
                      <span>{reward.points ? `+${reward.points} points` : reward.type.replace(/-/g, " ")}</span>
                    </div>
                    <p>{reward.date || "Saved just now"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default DailyProgressTab;
