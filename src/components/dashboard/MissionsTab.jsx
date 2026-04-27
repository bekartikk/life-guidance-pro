function MissionsTab({ progress, missionSummary }) {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Missions & Growth</p>
          <h2>Give the reward system a visible journey</h2>
          <p className="muted-text">
            This phase turns points and streaks into a calmer progression system with levels, daily missions, and weekly challenges.
          </p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-stat">
          <span className="stat-label">Current level</span>
          <span className="stat-value">{missionSummary.level}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Level title</span>
          <span className="stat-value">{missionSummary.levelTitle}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Next level in</span>
          <span className="stat-value">{missionSummary.pointsToNext}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Current streak</span>
          <span className="stat-value">{progress.activeStreak}</span>
        </div>
      </div>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Today&apos;s missions</h3>
              <p className="muted-text">Short wins that keep momentum visible.</p>
            </div>
          </div>
          <div className="goal-list">
            {missionSummary.dailyMissions.map((mission) => (
              <article key={mission.title} className="goal-card">
                <strong>{mission.title}</strong>
                <p>{mission.description}</p>
                <span className="goal-meta">{mission.reward}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>This week&apos;s challenges</h3>
              <p className="muted-text">A more meaningful version of gamification for the planner.</p>
            </div>
          </div>
          <div className="goal-list">
            {missionSummary.weeklyChallenges.map((challenge) => (
              <article key={challenge.title} className="goal-card">
                <strong>{challenge.title}</strong>
                <p>{challenge.description}</p>
                <span className="goal-meta">{challenge.reward}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Growth map</h3>
            <p className="muted-text">A calmer progression path than coins-and-gems style gamification.</p>
          </div>
        </div>
        <div className="goal-list">
          {missionSummary.growthMap.map((step) => (
            <article key={step.title} className={step.unlocked ? "goal-card completed" : "goal-card"}>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
              <span className="goal-meta">{step.unlocked ? "Unlocked" : `Unlocks at level ${step.level}`}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default MissionsTab;
