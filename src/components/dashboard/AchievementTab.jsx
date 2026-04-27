function formatLabel(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getLevelSummary(points) {
  const level = Math.max(1, Math.floor(points / 120) + 1);
  const nextLevelAt = level * 120;
  const titles = ["Restart", "Stabilizing", "Consistent", "Focused", "Expanding", "Self-Led", "Momentum Builder", "Guide of Self"];
  return {
    level,
    title: titles[Math.min(level - 1, titles.length - 1)],
    pointsToNext: Math.max(0, nextLevelAt - points),
  };
}

function AchievementTab({ progress, rewardEvents }) {
  const badgeEvents = rewardEvents.filter((reward) => reward.badge);
  const milestoneEvents = rewardEvents.filter((reward) => reward.milestone);
  const levelSummary = getLevelSummary(progress.momentumPoints || 0);

  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Achievement Center</p>
          <h2>See your progress as proof</h2>
          <p className="muted-text">
            This is the home for badges, milestones, and the momentum story you are building.
          </p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-stat">
          <span className="stat-label">Momentum points</span>
          <span className="stat-value">{progress.momentumPoints}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Badges earned</span>
          <span className="stat-value">{progress.badges.length}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Milestones</span>
          <span className="stat-value">{progress.milestones.length}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Best streak</span>
          <span className="stat-value">{progress.longestStreak}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{levelSummary.level}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Level title</span>
          <span className="stat-value">{levelSummary.title}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Next level in</span>
          <span className="stat-value">{levelSummary.pointsToNext}</span>
        </div>
      </div>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Badge gallery</h3>
              <p className="muted-text">The identity side of your progress.</p>
            </div>
          </div>
          {progress.badges.length === 0 ? (
            <p className="muted-text">Your first badges will appear here after a few routines and check-ins.</p>
          ) : (
            <div className="goal-list">
              {progress.badges.map((badge) => (
                <article key={badge} className="goal-card">
                  <strong>{formatLabel(badge)}</strong>
                  <span className="goal-meta">Unlocked and kept forever</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Milestone gallery</h3>
              <p className="muted-text">Bigger checkpoints that show long-term momentum.</p>
            </div>
          </div>
          {progress.milestones.length === 0 ? (
            <p className="muted-text">Milestones will appear as your weekly and monthly consistency grows.</p>
          ) : (
            <div className="goal-list">
              {progress.milestones.map((milestone) => (
                <article key={milestone} className="goal-card">
                  <strong>{formatLabel(milestone)}</strong>
                  <span className="goal-meta">Milestone unlocked</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Reward history</h3>
            <p className="muted-text">A chronological view of what your effort has unlocked.</p>
          </div>
          <p className="feedback-badge">{rewardEvents.length} events</p>
        </div>
        {rewardEvents.length === 0 ? (
          <p className="muted-text">Reward history starts populating as soon as you interact with the planner.</p>
        ) : (
          <div className="reward-event-list">
            {rewardEvents.slice(0, 16).map((reward) => (
              <article
                key={reward.id || `${reward.reason}-${reward.createdAt}`}
                className="reward-event-card"
              >
                <strong>{formatLabel(reward.badge || reward.milestone || reward.reason)}</strong>
                <span>{reward.points ? `+${reward.points} points` : "Unlocked"}</span>
                <span>{reward.date || "Saved recently"}</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="summary-card">
        <div className="summary-stat">
          <span className="stat-label">Badge events</span>
          <span className="stat-value">{badgeEvents.length}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Milestone events</span>
          <span className="stat-value">{milestoneEvents.length}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Weekly wins</span>
          <span className="stat-value">{progress.weeklyCompletions || 0}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Comeback wins</span>
          <span className="stat-value">{progress.comebackWins}</span>
        </div>
      </div>
    </section>
  );
}

export default AchievementTab;
