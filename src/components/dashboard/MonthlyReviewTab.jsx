function MonthlyReviewTab({
  monthlyReviewDraft,
  monthlyReviews,
  goals,
  isSavingMonthlyReview,
  onChange,
  onSubmit,
}) {
  const completedGoals = goals.filter((goal) => goal.status === "completed").slice(0, 6);

  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Monthly Review</p>
          <h2>Zoom out and see the bigger pattern</h2>
          <p className="muted-text">
            Monthly reviews help the app notice long-term momentum, burnout, and what kind of routines actually last.
          </p>
        </div>
      </div>

      <form className="planner-form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="section-heading">
            <h3>Review the month</h3>
            <p>Capture the strongest trends now. Later we can turn this into AI-generated monthly resets.</p>
          </div>

          <label>
            Biggest win
            <textarea
              name="biggestWin"
              value={monthlyReviewDraft.biggestWin}
              onChange={onChange}
              placeholder="What changed for the better this month?"
            />
          </label>

          <div className="two-column">
            <label>
              Strongest area
              <textarea
                name="strongestArea"
                value={monthlyReviewDraft.strongestArea}
                onChange={onChange}
                placeholder="What part of life felt strongest?"
              />
            </label>
            <label>
              Weakest area
              <textarea
                name="weakestArea"
                value={monthlyReviewDraft.weakestArea}
                onChange={onChange}
                placeholder="Where did you feel off-track or drained?"
              />
            </label>
          </div>

          <div className="two-column">
            <label>
              Trend you noticed
              <textarea
                name="trend"
                value={monthlyReviewDraft.trend}
                onChange={onChange}
                placeholder="Any repeated pattern in energy, focus, sleep, loneliness, or motivation?"
              />
            </label>
            <label>
              Next-month reset
              <textarea
                name="resetPlan"
                value={monthlyReviewDraft.resetPlan}
                onChange={onChange}
                placeholder="What should next month start with?"
              />
            </label>
          </div>

          <button className="primary-button" type="submit" disabled={isSavingMonthlyReview}>
            {isSavingMonthlyReview ? "Saving monthly review..." : "Save monthly review"}
          </button>
        </div>
      </form>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Completed goals this season</h3>
              <p className="muted-text">A quick reminder of what already moved forward.</p>
            </div>
          </div>
          {completedGoals.length === 0 ? (
            <p className="muted-text">Completed goals will start to stack here as your monthly review becomes richer.</p>
          ) : (
            <div className="goal-list">
              {completedGoals.map((goal) => (
                <article key={goal.id} className="goal-card completed">
                  <strong>{goal.title}</strong>
                  <span className="goal-meta">{goal.category}</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Saved monthly reviews</h3>
              <p className="muted-text">These become your long-range memory for future planning.</p>
            </div>
            <p className="feedback-badge">{monthlyReviews.length} saved</p>
          </div>
          {monthlyReviews.length === 0 ? (
            <p className="muted-text">Your monthly reviews will appear here once you save the first one.</p>
          ) : (
            <div className="goal-list">
              {monthlyReviews.slice(0, 6).map((review) => (
                <article key={review.id} className="goal-card">
                  <strong>{review.monthLabel || "Monthly review"}</strong>
                  <p><strong>Win:</strong> {review.biggestWin || "—"}</p>
                  <p><strong>Reset:</strong> {review.resetPlan || "—"}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default MonthlyReviewTab;
