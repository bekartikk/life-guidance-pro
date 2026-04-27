const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "stretch", label: "Stretch" },
];

function HabitTab({
  habitDraft,
  habits,
  isSavingHabit,
  onChange,
  onSubmit,
  onDelete,
  onToggle,
}) {
  const activeHabits = habits.filter((habit) => habit.archived !== true);

  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Habit Tracker</p>
          <h2>Build repeatable daily wins</h2>
          <p className="muted-text">
            Keep habits small enough to survive low-energy days, but clear enough to
            build confidence over time.
          </p>
        </div>
      </div>

      <form className="planner-form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="section-heading">
            <h3>Add a habit</h3>
            <p>Give each habit a smaller fallback version so hard days still count.</p>
          </div>

          <label>
            Habit title
            <input
              name="title"
              value={habitDraft.title}
              onChange={onChange}
              placeholder="Example: 20 minutes of focused study"
              required
            />
          </label>

          <div className="two-column">
            <label>
              Difficulty
              <select name="difficulty" value={habitDraft.difficulty} onChange={onChange}>
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Habit anchor
              <input
                name="anchor"
                value={habitDraft.anchor}
                onChange={onChange}
                placeholder="After breakfast, after class, before sleep..."
              />
            </label>
          </div>

          <div className="two-column">
            <label>
              Standard version
              <textarea
                name="standardVersion"
                value={habitDraft.standardVersion}
                onChange={onChange}
                placeholder="What does the full habit look like?"
              />
            </label>
            <label>
              Low-energy version
              <textarea
                name="minimumVersion"
                value={habitDraft.minimumVersion}
                onChange={onChange}
                placeholder="What is the smallest version you can still do?"
              />
            </label>
          </div>

          <button className="primary-button" type="submit" disabled={isSavingHabit}>
            {isSavingHabit ? "Saving habit..." : "Save habit"}
          </button>
        </div>
      </form>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Current habits</h3>
            <p className="muted-text">
              These habits can later feed the daily tracker, charts, and weekly review.
            </p>
          </div>
          <p className="feedback-badge">{activeHabits.length} active habits</p>
        </div>

        {activeHabits.length === 0 ? (
          <p className="muted-text">Add your first habit to start building a steady baseline.</p>
        ) : (
          <div className="goal-list">
            {activeHabits.map((habit) => (
              <article key={habit.id} className="goal-card">
                <div className="goal-card-header">
                  <div>
                    <strong>{habit.title}</strong>
                    <span className="goal-meta">
                      {habit.difficulty} difficulty
                      {habit.anchor ? ` · ${habit.anchor}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => onToggle(habit)}
                  >
                    {habit.isTodayComplete ? "Marked today" : "Mark today"}
                  </button>
                </div>

                {habit.standardVersion ? (
                  <p><strong>Standard:</strong> {habit.standardVersion}</p>
                ) : null}
                {habit.minimumVersion ? (
                  <p><strong>Low-energy:</strong> {habit.minimumVersion}</p>
                ) : null}

                <div className="goal-milestones">
                  <span className="goal-milestone-chip">Current streak: {habit.currentStreak || 0}</span>
                  <span className="goal-milestone-chip">Best streak: {habit.bestStreak || 0}</span>
                </div>

                <button
                  type="button"
                  className="danger-link"
                  onClick={() => onDelete(habit.id)}
                >
                  Delete habit
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default HabitTab;
