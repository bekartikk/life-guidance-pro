function PersonalizationTab({ insights, profile, plans, checkins, behavioralInsights }) {
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
        <div className="summary-stat">
          <span className="stat-label">Life state</span>
          <span className="stat-value">{behavioralInsights.lifeState.label}</span>
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
              <h3>Behavioral profile</h3>
              <p className="muted-text">How the AI is adapting its coaching style and predictions.</p>
            </div>
          </div>
          <div className="goal-list">
            <article className="goal-card">
              <strong>Current life state</strong>
              <span className="goal-meta">{behavioralInsights.lifeState.label}</span>
              <p>{behavioralInsights.lifeState.summary}</p>
            </article>
            <article className="goal-card">
              <strong>Coaching mode</strong>
              <span className="goal-meta">{behavioralInsights.personalityMode.active}</span>
              <p>{behavioralInsights.personalityMode.reason}</p>
            </article>
            <article className="goal-card">
              <strong>Burnout risk</strong>
              <span className="goal-meta">{behavioralInsights.burnoutRisk.score}% · {behavioralInsights.burnoutRisk.label}</span>
              <p>{behavioralInsights.burnoutRisk.summary}</p>
            </article>
          </div>
        </section>
      </div>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>AI memory engine</h3>
              <p className="muted-text">Long-term patterns the system is starting to remember about you.</p>
            </div>
          </div>
          <div className="goal-list">
            {behavioralInsights.memoryCards.map((item) => (
              <article className="goal-card" key={item.label}>
                <strong>{item.label}</strong>
                <span className="goal-meta">{item.value}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Profile signals in use</h3>
              <p className="muted-text">These fields are still shaping future recommendations underneath the behavioral layer.</p>
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

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Neglected life-area detection</h3>
              <p className="muted-text">The AI should notice what is quietly going missing before it hurts the bigger system.</p>
            </div>
          </div>
          <div className="goal-list">
            {behavioralInsights.neglectedAreas.length === 0 ? (
              <article className="goal-card">
                <strong>No major neglected area detected</strong>
                <p>Your recent data does not show one severe blind spot. Keep checking in so the model stays honest.</p>
              </article>
            ) : (
              behavioralInsights.neglectedAreas.map((item) => (
                <article className="goal-card" key={item.area}>
                  <strong>{item.area}</strong>
                  <p>{item.reason}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Long-term projection</h3>
              <p className="muted-text">Early future reads that help the user understand where the current system is heading.</p>
            </div>
          </div>
          <div className="goal-list">
            {behavioralInsights.futureProjection.map((item) => (
              <article key={item} className="goal-card">
                <strong>Projected outcome</strong>
                <p>{item}</p>
              </article>
            ))}
            <article className="goal-card">
              <strong>Micro-wins the AI respects</strong>
              <p>{behavioralInsights.microWins[0] || "The system will start highlighting small wins as more daily evidence appears."}</p>
            </article>
          </div>
        </section>
      </div>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Privacy and trust</h3>
            <p className="muted-text">Behavioral memory should remain private, editable, and always under user control.</p>
          </div>
        </div>
        <div className="goal-list">
          <article className="goal-card">
            <strong>Private memory only</strong>
            <p>Your emotional memory, routines, and behavioral trends stay inside your workspace and are meant only to improve guidance quality.</p>
          </article>
          <article className="goal-card">
            <strong>Adaptive, not punitive</strong>
            <p>The system is designed to reduce shame-based productivity pressure by simplifying routines when life becomes heavy.</p>
          </article>
        </div>
      </section>
    </section>
  );
}

export default PersonalizationTab;
