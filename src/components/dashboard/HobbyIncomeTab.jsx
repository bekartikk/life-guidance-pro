function HobbyIncomeTab({
  draft,
  savedItems,
  isSaving,
  onChange,
  onSubmit,
}) {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Hobby To Income</p>
          <h2>Map hobbies to small real-world earning paths</h2>
          <p className="muted-text">
            This is not about pressure. It is about exploring safe, beginner-friendly ways a hobby could become useful work or side income.
          </p>
        </div>
      </div>

      <form className="planner-form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="section-heading">
            <h3>Choose a hobby to explore</h3>
            <p>We will turn one interest into realistic experiments, skill steps, and starter opportunities.</p>
          </div>

          <div className="two-column">
            <label>
              Main hobby or interest
              <input
                name="hobby"
                value={draft.hobby}
                onChange={onChange}
                placeholder="Sketching, editing, music, coding, writing..."
              />
            </label>
            <label>
              Current level
              <select name="level" value={draft.level} onChange={onChange}>
                <option value="beginner">Beginner</option>
                <option value="early">Early intermediate</option>
                <option value="growing">Growing confidence</option>
                <option value="strong">Strong foundation</option>
              </select>
            </label>
          </div>

          <div className="two-column">
            <label>
              Time available each week
              <select name="timePerWeek" value={draft.timePerWeek} onChange={onChange}>
                <option value="2-4 hours">2-4 hours</option>
                <option value="5-7 hours">5-7 hours</option>
                <option value="8-12 hours">8-12 hours</option>
                <option value="12+ hours">12+ hours</option>
              </select>
            </label>
            <label>
              Earning style you prefer
              <select name="incomeStyle" value={draft.incomeStyle} onChange={onChange}>
                <option value="freelance">Freelance projects</option>
                <option value="content">Content and audience</option>
                <option value="products">Digital products</option>
                <option value="teaching">Teaching or coaching</option>
                <option value="explore">Still exploring</option>
              </select>
            </label>
          </div>

          <label>
            What do you want this hobby path to give you?
            <textarea
              name="goal"
              value={draft.goal}
              onChange={onChange}
              placeholder="Confidence, extra income, a portfolio, clearer direction, meaningful work..."
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving hobby path..." : "Build hobby path"}
          </button>
        </div>
      </form>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Saved hobby paths</h3>
            <p className="muted-text">Each saved path holds a few experiments you can try without overcommitting.</p>
          </div>
          <p className="feedback-badge">{savedItems.length} paths</p>
        </div>
        {savedItems.length === 0 ? (
          <p className="muted-text">Your first hobby path will appear here.</p>
        ) : (
          <div className="goal-list">
            {savedItems.slice(0, 8).map((item) => (
              <article key={item.id} className="goal-card">
                <strong>{item.title}</strong>
                <p className="goal-meta">{item.summary}</p>
                <div className="goal-milestones">
                  {(item.experiments || []).map((experiment, index) => (
                    <span key={`${item.id}-${index}`} className="goal-milestone-chip">
                      {experiment}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default HobbyIncomeTab;
