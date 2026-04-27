import { useMemo, useState } from "react";

function HistoryTab({ plans, onView, onUseAnswers, onDelete, formatDate }) {
  const [query, setQuery] = useState("");
  const [focusFilter, setFocusFilter] = useState("all");

  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      const matchesQuery =
        !query.trim() ||
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.profileSnapshot?.goals?.toLowerCase().includes(query.toLowerCase()) ||
        item.profileSnapshot?.hobbies?.toLowerCase().includes(query.toLowerCase());

      const matchesFocus =
        focusFilter === "all" || item.profileSnapshot?.roadmapFocus === focusFilter;

      return matchesQuery && matchesFocus;
    });
  }, [focusFilter, plans, query]);

  return (
    <section className="history-panel in-workspace">
      <div className="history-header">
        <div>
          <p className="eyebrow">Synced history</p>
          <h2>Your saved plans</h2>
        </div>
        <span>{filteredPlans.length} plans</span>
      </div>

      <div className="two-column">
        <label>
          Search plans
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, goals, or hobbies"
          />
        </label>
        <label>
          Focus filter
          <select value={focusFilter} onChange={(event) => setFocusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="balanced">Balanced</option>
            <option value="career">Career</option>
            <option value="study">Study</option>
            <option value="motivation">Motivation</option>
            <option value="hobbies">Hobbies</option>
          </select>
        </label>
      </div>

      {filteredPlans.length === 0 ? (
        <p className="muted-text">Your generated plans will appear here after the first result.</p>
      ) : (
        <div className="history-list">
          {filteredPlans.map((item) => (
            <article className="history-card" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{formatDate(item.createdAt)}</span>
                <span>
                  {item.profileSnapshot?.planDuration?.replace("-", " ") || "plan"} -{" "}
                  {item.profileSnapshot?.roadmapFocus || "balanced"}
                </span>
              </div>
              <div className="history-actions">
                <button type="button" onClick={() => onView(item)}>View</button>
                <button type="button" onClick={() => onUseAnswers(item)}>Use answers</button>
                <button type="button" className="danger-button" onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistoryTab;
