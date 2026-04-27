const STATUS_OPTIONS = [
  { value: "planned", label: "Planned" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

const CATEGORY_OPTIONS = [
  { value: "life", label: "Life balance" },
  { value: "career", label: "Career" },
  { value: "study", label: "Study" },
  { value: "health", label: "Health" },
  { value: "relationships", label: "Relationships" },
  { value: "creative", label: "Creative" },
];

function formatStatus(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function GoalTab({
  goalDraft,
  goals,
  isSavingGoal,
  onChange,
  onSubmit,
  onDelete,
  onStatusChange,
}) {
  const activeGoals = goals.filter((goal) => goal.status !== "completed");
  const completedGoals = goals.filter((goal) => goal.status === "completed");

  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Goal System</p>
          <h2>Turn direction into something trackable</h2>
          <p className="muted-text">
            Save the outcomes you care about, break them into milestones, and keep
            them visible while the planner builds your routine.
          </p>
        </div>
      </div>

      <form className="planner-form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="section-heading">
            <h3>Add a goal</h3>
            <p>
              Start with one meaningful outcome. You can keep it simple now and
              layer milestones as we grow the system.
            </p>
          </div>

          <label>
            Goal title
            <input
              name="title"
              value={goalDraft.title}
              onChange={onChange}
              placeholder="Example: Build a calmer morning routine"
              required
            />
          </label>

          <div className="two-column">
            <label>
              Category
              <select name="category" value={goalDraft.category} onChange={onChange}>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Target date
              <input
                type="date"
                name="targetDate"
                value={goalDraft.targetDate}
                onChange={onChange}
              />
            </label>
          </div>

          <label>
            Why this matters
            <textarea
              name="reason"
              value={goalDraft.reason}
              onChange={onChange}
              placeholder="What changes if this goal starts moving forward?"
            />
          </label>

          <label>
            Milestones
            <textarea
              name="milestonesText"
              value={goalDraft.milestonesText}
              onChange={onChange}
              placeholder="Write one milestone per line"
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSavingGoal}>
            {isSavingGoal ? "Saving goal..." : "Save goal"}
          </button>
        </div>
      </form>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Active goals</h3>
              <p className="muted-text">
                These are the goals that should steer your routine and weekly review.
              </p>
            </div>
            <p className="feedback-badge">{activeGoals.length} active</p>
          </div>

          {activeGoals.length === 0 ? (
            <p className="muted-text">
              Add your first goal and we’ll use it as the anchor for future phases.
            </p>
          ) : (
            <div className="goal-list">
              {activeGoals.map((goal) => (
                <article key={goal.id} className="goal-card">
                  <div className="goal-card-header">
                    <div>
                      <strong>{goal.title}</strong>
                      <span className="goal-meta">
                        {formatStatus(goal.category)}
                        {goal.targetDate ? ` · ${goal.targetDate}` : ""}
                      </span>
                    </div>
                    <select
                      value={goal.status}
                      onChange={(event) => onStatusChange(goal, event.target.value)}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {goal.reason ? <p>{goal.reason}</p> : null}

                  {goal.milestones?.length ? (
                    <div className="goal-milestones">
                      {goal.milestones.map((milestone, index) => (
                        <span key={`${goal.id}-${index}`} className="goal-milestone-chip">
                          {milestone}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="danger-link"
                    onClick={() => onDelete(goal.id)}
                  >
                    Delete goal
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Completed goals</h3>
              <p className="muted-text">
                Finished goals will become useful inputs for future weekly and monthly reviews.
              </p>
            </div>
            <p className="feedback-badge">{completedGoals.length} completed</p>
          </div>

          {completedGoals.length === 0 ? (
            <p className="muted-text">
              Completed goals will show up here once you start closing loops.
            </p>
          ) : (
            <div className="goal-list">
              {completedGoals.map((goal) => (
                <article key={goal.id} className="goal-card completed">
                  <div className="goal-card-header">
                    <div>
                      <strong>{goal.title}</strong>
                      <span className="goal-meta">
                        {formatStatus(goal.category)}
                        {goal.completedAt ? ` · completed ${goal.completedAt}` : ""}
                      </span>
                    </div>
                  </div>
                  {goal.reason ? <p>{goal.reason}</p> : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default GoalTab;
