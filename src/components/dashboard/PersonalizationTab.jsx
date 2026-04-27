function PersonalizationTab({ insights, profile, plans, checkins }) {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Personalization Engine</p>
          <h2>Turn history into sharper future guidance</h2>
          <p className="muted-text">
            This is the first personalization layer: it reads your profile, planning history, and check-ins to spot the style that seems to fit you best.
          </p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-stat">
          <span className="stat-label">Saved plans</span>
          <span className="stat-value">{plans.length}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Check-ins used</span>
          <span className="stat-value">{checkins.length}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Preferred tone</span>
          <span className="stat-value">{insights.preferredTone}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Best current focus</span>
          <span className="stat-value">{insights.bestFocus}</span>
        </div>
      </div>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>What the app is learning</h3>
              <p className="muted-text">These are gentle heuristics, not rigid labels.</p>
            </div>
          </div>
          <div className="goal-list">
            <article className="goal-card">
              <strong>Routine style fit</strong>
              <p>{insights.routineStyle}</p>
            </article>
            <article className="goal-card">
              <strong>Low-energy fallback</strong>
              <p>{insights.lowEnergyPattern}</p>
            </article>
            <article className="goal-card">
              <strong>Recommended next planning move</strong>
              <p>{insights.nextMove}</p>
            </article>
            <article className="goal-card">
              <strong>Best check-in window so far</strong>
              <p>{insights.bestDayWindow}</p>
            </article>
          </div>
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Profile signals in use</h3>
              <p className="muted-text">These fields are already shaping future recommendations.</p>
            </div>
          </div>
          <div className="goal-list">
            <article className="goal-card">
              <strong>Main goal</strong>
              <span className="goal-meta">{profile.mainGoal || "Not saved yet"}</span>
            </article>
            <article className="goal-card">
              <strong>Interests</strong>
              <span className="goal-meta">{profile.interests || "Not saved yet"}</span>
            </article>
            <article className="goal-card">
              <strong>Working style</strong>
              <span className="goal-meta">{profile.workingStyle || "Not saved yet"}</span>
            </article>
            <article className="goal-card">
              <strong>Long-term vision</strong>
              <span className="goal-meta">{profile.longTermVision || "Not saved yet"}</span>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

export default PersonalizationTab;
