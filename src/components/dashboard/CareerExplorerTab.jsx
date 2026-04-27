function CareerExplorerTab({
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
          <p className="eyebrow">Career Explorer</p>
          <h2>Turn interests and strengths into realistic paths</h2>
          <p className="muted-text">
            This stage gives the app a structured career-discovery layer instead of leaving future direction vague.
          </p>
        </div>
      </div>

      <form className="planner-form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="section-heading">
            <h3>Career discovery input</h3>
            <p>Describe what energizes you, what you are good at, and what constraints feel real right now.</p>
          </div>

          <div className="two-column">
            <label>
              Interests that keep pulling you back
              <textarea
                name="interests"
                value={draft.interests}
                onChange={onChange}
                placeholder="Design, helping people, coding, business, organizing, writing..."
              />
            </label>
            <label>
              Strengths you already notice
              <textarea
                name="strengths"
                value={draft.strengths}
                onChange={onChange}
                placeholder="Communication, patience, visuals, analysis, empathy, consistency..."
              />
            </label>
          </div>

          <div className="two-column">
            <label>
              Preferred work environment
              <select name="environment" value={draft.environment} onChange={onChange}>
                <option value="flexible">Flexible mix</option>
                <option value="remote">Mostly remote</option>
                <option value="team">Team-based</option>
                <option value="independent">Independent</option>
                <option value="structured">Highly structured</option>
              </select>
            </label>
            <label>
              Main constraint right now
              <select name="constraint" value={draft.constraint} onChange={onChange}>
                <option value="clarity">Need clarity first</option>
                <option value="money">Need income soon</option>
                <option value="confidence">Low confidence</option>
                <option value="time">Very limited time</option>
                <option value="skills">Need to build skills</option>
              </select>
            </label>
          </div>

          <label>
            What kind of future do you want this work to support?
            <textarea
              name="future"
              value={draft.future}
              onChange={onChange}
              placeholder="Stable income, creative freedom, helping people, flexible life, growth..."
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving career map..." : "Build career directions"}
          </button>
        </div>
      </form>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Saved career maps</h3>
            <p className="muted-text">Each one stores candidate paths plus the reasoning behind them.</p>
          </div>
          <p className="feedback-badge">{savedItems.length} maps</p>
        </div>
        {savedItems.length === 0 ? (
          <p className="muted-text">Your first career exploration will appear here.</p>
        ) : (
          <div className="goal-list">
            {savedItems.slice(0, 8).map((item) => (
              <article key={item.id} className="goal-card">
                <strong>{item.title}</strong>
                <p className="goal-meta">{item.summary}</p>
                <div className="goal-milestones">
                  {(item.suggestions || []).map((suggestion) => (
                    <span key={`${item.id}-${suggestion.title}`} className="goal-milestone-chip">
                      {suggestion.title}
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

export default CareerExplorerTab;
