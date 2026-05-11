import { useMemo } from "react";
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

function DailyProgressTab({ checkins, progress, rewards, behavioralInsights }) {
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
      <div className="progress-header">
        <div>
          <p className="eyebrow">Daily Progress</p>
          <h2>See the shape of your week</h2>
          <p className="muted-text">Track the current week, spot friction early, and keep your momentum visible.</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-stat">
          <span className="stat-label">Today's Status</span>
          <span className="status-badge" style={{ backgroundColor: STATUS_META[todayCheckin?.status]?.color || "#8fa298" }}>
            {todayCheckin ? STATUS_META[todayCheckin.status].label : "Waiting for check-in"}
          </span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">This Week</span>
          <span className="stat-value">{weekSummary.positiveDays}/7</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Weekly Score</span>
          <span className="stat-value">{weekSummary.completionRate}%</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Points This Week</span>
          <span className="stat-value">{weekSummary.pointsEarned}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Life state</span>
          <span className="stat-value">{behavioralInsights.lifeState.label}</span>
        </div>
      </div>

      <div className="split-progress-grid">
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Adaptive AI read</h3>
              <p className="muted-text">A short interpretation of what your recent days are teaching the system.</p>
            </div>
          </div>
          <div className="goal-list">
            {behavioralInsights.summaryCards.map((item) => (
              <article key={item.label} className="goal-card">
                <strong>{item.label}</strong>
                <span className="goal-meta">{item.value}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Burnout prevention</h3>
              <p className="muted-text">The system should intervene before pressure becomes collapse.</p>
            </div>
          </div>
          <div className="goal-list">
            <article className="goal-card">
              <strong>Burnout risk</strong>
              <span className="goal-meta">{behavioralInsights.burnoutRisk.score}% · {behavioralInsights.burnoutRisk.label}</span>
              <p>{behavioralInsights.burnoutRisk.summary}</p>
            </article>
            {behavioralInsights.adaptiveRecommendations.map((item) => (
              <article key={item} className="goal-card">
                <strong>Recommended adjustment</strong>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card weekly-calendar">
        <div className="section-card-header">
          <div>
            <h3>Current week</h3>
            <p className="muted-text">{weekRangeLabel}</p>
          </div>
          <p className="feedback-badge">{weekSummary.checkedInDays}/7 days recorded</p>
        </div>
        <div className="calendar-grid">
          {weekDays.map((day) => {
            const meta = day.status ? STATUS_META[day.status] : null;
            return (
              <div key={day.dateKey} className={`calendar-day ${day.isToday ? "today" : ""} ${day.status ? "has-checkin" : ""}`}>
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
              </div>
            );
          })}
        </div>
      </div>

      <div className="split-progress-grid">
        <div className="section-card daily-stats">
          <h3>Rhythm snapshot</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-name">Active streak</span>
              <span className="stat-num">{progress.activeStreak}</span>
            </div>
            <div className="stat-card">
              <span className="stat-name">Longest streak</span>
              <span className="stat-num">{progress.longestStreak}</span>
            </div>
            <div className="stat-card">
              <span className="stat-name">Completed days</span>
              <span className="stat-num">{weekSummary.completed}</span>
            </div>
            <div className="stat-card">
              <span className="stat-name">Comeback wins</span>
              <span className="stat-num">{progress.comebackWins}</span>
            </div>
          </div>
        </div>

        <div className="section-card activity-section">
          <h3>Recent check-ins</h3>
          {recentCheckins.length === 0 ? (
            <p className="muted-text">Your daily check-ins will show up here after you start marking your days.</p>
          ) : (
            <div className="activity-list">
              {recentCheckins.map((checkin) => {
                const meta = STATUS_META[checkin.status];
                return (
                  <article key={checkin.date} className="activity-card">
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
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="split-progress-grid">
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Neglected life areas</h3>
              <p className="muted-text">The AI uses these signals to rebalance routines before things start quietly slipping.</p>
            </div>
          </div>
          <div className="goal-list">
            {behavioralInsights.neglectedAreas.length === 0 ? (
              <article className="goal-card">
                <strong>No major blind spot detected</strong>
                <p>Your current signals look reasonably balanced. Keep logging honestly so this stays trustworthy.</p>
              </article>
            ) : (
              behavioralInsights.neglectedAreas.map((item) => (
                <article key={item.area} className="goal-card">
                  <strong>{item.area}</strong>
                  <p>{item.reason}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Reflection journal</h3>
              <p className="muted-text">A calmer read of what you have been feeling, not just what you completed.</p>
            </div>
          </div>
          <div className="goal-list">
            <article className="goal-card">
              <strong>{behavioralInsights.journal.headline}</strong>
              <p>{behavioralInsights.journal.prompt}</p>
            </article>
            {behavioralInsights.journal.entries.map((entry) => (
              <article key={entry} className="goal-card">
                <strong>Journal echo</strong>
                <p>{entry}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card rewards-section">
        <div className="section-card-header">
          <div>
            <h3>Recent reward activity</h3>
            <p className="muted-text">A quick look at the wins your routine has already unlocked.</p>
          </div>
        </div>
        {recentRewards.length === 0 ? (
          <p className="muted-text">Your point rewards and badges will appear here after plans, check-ins, and feedback.</p>
        ) : (
          <div className="activity-list reward-activity-list">
            {recentRewards.map((reward, index) => (
              <article key={`${reward.type}-${reward.createdAt || reward.date}-${index}`} className="activity-card reward-activity-card">
                <div className="activity-meta">
                  <strong>{buildRewardTitle(reward)}</strong>
                  <span>{reward.points ? `+${reward.points} points` : reward.type.replace(/-/g, " ")}</span>
                </div>
                <p>{reward.date || "Saved just now"}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DailyProgressTab;
