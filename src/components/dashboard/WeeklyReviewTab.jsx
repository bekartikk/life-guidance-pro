function WeeklyReviewTab({
  reviewDraft,
  reviews,
  goals,
  isSavingReview,
  onChange,
  onSubmit,
}) {
  const activeGoals = goals.filter((goal) => goal.status !== "completed").slice(0, 5);

  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Weekly Review</p>
          <h2>Close the week with clarity</h2>
          <p className="muted-text">
            This is where the app starts learning what actually worked in real life,
            not just what looked good in the plan.
          </p>
        </div>
      </div>

      <form className="planner-form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="section-heading">
            <h3>Review this week</h3>
            <p>Reflect in plain words now. Later phases can turn this into AI-powered weekly resets.</p>
          </div>

          <label>
            What worked
            <textarea
              name="worked"
              value={reviewDraft.worked}
              onChange={onChange}
              placeholder="What actually helped this week?"
            />
          </label>

          <label>
            What felt difficult
            <textarea
              name="heavy"
              value={reviewDraft.heavy}
              onChange={onChange}
              placeholder="Where did the plan feel too hard, too vague, or too heavy?"
            />
          </label>

          <div className="two-column">
            <label>
              Mood lift
              <textarea
                name="moodLift"
                value={reviewDraft.moodLift}
                onChange={onChange}
                placeholder="What improved your mood or made the week easier?"
              />
            </label>
            <label>
              Next-week adjustment
              <textarea
                name="nextStep"
                value={reviewDraft.nextStep}
                onChange={onChange}
                placeholder="What should change next week?"
              />
            </label>
          </div>

          <button className="primary-button" type="submit" disabled={isSavingReview}>
            {isSavingReview ? "Saving review..." : "Save weekly review"}
          </button>
        </div>
      </form>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Goals to carry forward</h3>
              <p className="muted-text">
                Active goals stay visible here so weekly reviews stay connected to real priorities.
              </p>
            </div>
          </div>
          {activeGoals.length === 0 ? (
            <p className="muted-text">Your active goals will appear here as anchors for each review.</p>
          ) : (
            <div className="goal-list">
              {activeGoals.map((goal) => (
                <article key={goal.id} className="goal-card">
                  <strong>{goal.title}</strong>
                  <span className="goal-meta">{goal.category}</span>
                  {goal.milestones?.length ? (
                    <div className="goal-milestones">
                      {goal.milestones.slice(0, 4).map((milestone, index) => (
                        <span key={`${goal.id}-${index}`} className="goal-milestone-chip">
                          {milestone}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Saved reviews</h3>
              <p className="muted-text">Your last reviews become the memory for smarter weekly planning later.</p>
            </div>
            <p className="feedback-badge">{reviews.length} reviews</p>
          </div>
          {reviews.length === 0 ? (
            <p className="muted-text">Save your first weekly review to begin building weekly continuity.</p>
          ) : (
            <div className="goal-list">
              {reviews.slice(0, 6).map((review) => (
                <article key={review.id} className="goal-card">
                  <span className="goal-meta">{review.weekLabel || "Saved review"}</span>
                  <p><strong>Worked:</strong> {review.worked || "—"}</p>
                  <p><strong>Heavy:</strong> {review.heavy || "—"}</p>
                  <p><strong>Next step:</strong> {review.nextStep || "—"}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default WeeklyReviewTab;
