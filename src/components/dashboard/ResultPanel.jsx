import { useEffect, useState } from "react";

function formatLabel(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildWeeklyLabel(progress) {
  const summary = progress.lastWeekSummary;
  if (!summary) return "Start your first check-in";
  return `${summary.positiveDays || 0}/7 positive days`;
}

function splitPlanSections(text) {
  const source = String(text || "").trim();
  if (!source) return [];

  const matches = [...source.matchAll(/(^|\n)(\d+\.\s+[^\n]+)\n/g)];
  if (matches.length === 0) {
    return [{ heading: "Full plan", body: source }];
  }

  return matches.map((match, index) => {
    const heading = match[2].trim();
    const start = match.index + match[1].length + heading.length + 1;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    return {
      heading,
      body: source.slice(start, end).trim(),
    };
  });
}

function ResultPanel({
  currentPlan,
  currentPlanFeedback,
  adjustmentRequest,
  checkinNote,
  checkinFields,
  isAdjusting,
  isSubmittingCheckin,
  progress,
  recentRewards,
  todayCheckin,
  formatDate,
  onAdjustChange,
  onAdjust,
  onCheckin,
  onCheckinFieldChange,
  onCheckinNoteChange,
  onRegenerate,
  onRate,
}) {
  if (!currentPlan) {
    return null;
  }

  const sections = splitPlanSections(currentPlan.result);
  const [expandedSections, setExpandedSections] = useState(() => new Set());

  useEffect(() => {
    const initialOpen = sections[0]?.heading ? new Set([sections[0].heading]) : new Set();
    setExpandedSections(initialOpen);
  }, [currentPlan?.id]);

  function toggleSection(heading) {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(heading)) {
        next.delete(heading);
      } else {
        next.add(heading);
      }
      return next;
    });
  }

  return (
    <section className="result-panel">
      <div className="result-header">
        <div>
          <p className="eyebrow">Latest result</p>
          <h2>{currentPlan.title}</h2>
          <p className="result-meta">Saved {formatDate(currentPlan.createdAt)}</p>
        </div>
        <div className="result-actions">
          <button className="secondary-button" type="button" onClick={onRegenerate}>Regenerate</button>
          <button className="secondary-button" type="button" onClick={onRate}>Rate this plan</button>
        </div>
      </div>

      <div className="reward-summary">
        <div>
          <span>Momentum Points</span>
          <strong>{progress.momentumPoints}</strong>
        </div>
        <div>
          <span>Active Streak</span>
          <strong>{progress.activeStreak} days</strong>
        </div>
        <div>
          <span>This Week</span>
          <strong>{buildWeeklyLabel(progress)}</strong>
        </div>
        <div>
          <span>Latest Badge</span>
          <strong>{progress.latestBadge ? formatLabel(progress.latestBadge) : "Not yet"}</strong>
        </div>
      </div>

      <div className="checkin-panel">
        <div>
          <h3>Today's check-in</h3>
          <p>Reward effort, not perfection. Mark how today went for your current plan.</p>
        </div>
        <div className="checkin-actions">
          <button type="button" onClick={() => onCheckin("completed")} disabled={isSubmittingCheckin}>Completed</button>
          <button type="button" onClick={() => onCheckin("partial")} disabled={isSubmittingCheckin}>Partial</button>
          <button type="button" onClick={() => onCheckin("difficult")} disabled={isSubmittingCheckin}>Difficult but tried</button>
          <button type="button" onClick={() => onCheckin("missed")} disabled={isSubmittingCheckin}>Missed</button>
        </div>
        <div className="two-column">
          <label>
            Mood
            <select name="mood" value={checkinFields.mood} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Very low</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Okay</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Strong</option>
            </select>
          </label>
          <label>
            Energy
            <select name="energy" value={checkinFields.energy} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Empty</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - High</option>
            </select>
          </label>
        </div>
        <div className="two-column">
          <label>
            Focus
            <select name="focus" value={checkinFields.focus} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Scattered</option>
              <option value="2">2 - Weak</option>
              <option value="3">3 - Mixed</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Deep</option>
            </select>
          </label>
          <label>
            Loneliness
            <select name="loneliness" value={checkinFields.loneliness} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Grounded</option>
              <option value="2">2 - Mild</option>
              <option value="3">3 - Present</option>
              <option value="4">4 - Heavy</option>
              <option value="5">5 - Intense</option>
            </select>
          </label>
        </div>
        <label>
          What made today difficult?
          <input
            name="difficultyReason"
            value={checkinFields.difficultyReason}
            onChange={onCheckinFieldChange}
            placeholder="Time pressure, low energy, loneliness, unclear plan..."
          />
        </label>
        <textarea value={checkinNote} onChange={onCheckinNoteChange} placeholder="Optional note about what helped, what got in the way, or what you want to remember." />
        {todayCheckin && <p className="feedback-badge">Today's status: {formatLabel(todayCheckin.status)}</p>}
      </div>

      <div className="reward-events">
        <div>
          <h3>Recent wins</h3>
          <p>Small progress counts. These rewards build momentum over time.</p>
        </div>
        {recentRewards.length === 0 ? (
          <p className="muted-text">Your latest rewards will appear here after a check-in, plan, or feedback action.</p>
        ) : (
          <div className="reward-event-list">
            {recentRewards.map((reward) => (
              <article className="reward-event-card" key={reward.id}>
                <strong>{formatLabel(reward.badge || reward.milestone || reward.reason)}</strong>
                <span>{reward.points ? `+${reward.points} points` : "Unlocked"}</span>
                <span>{formatDate(reward.createdAt)}</span>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="result-outline">
        <div>
          <h3>Plan outline</h3>
          <p>Open only the sections you need right now so the plan feels calmer to scan.</p>
        </div>
        <div className="result-outline-chips">
          {sections.map((section) => (
            <button
              key={section.heading}
              type="button"
              onClick={() => toggleSection(section.heading)}
              className={`badge-chip result-toggle-chip ${expandedSections.has(section.heading) ? "is-open" : ""}`}
            >
              {section.heading}
            </button>
          ))}
        </div>
      </div>

      <div className="result-sections">
        {sections.map((section) => (
          <article
            className="result-section-card"
            key={section.heading}
            id={section.heading.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}
          >
            <button
              type="button"
              className="result-section-toggle"
              onClick={() => toggleSection(section.heading)}
              aria-expanded={expandedSections.has(section.heading)}
            >
              <h3>{section.heading}</h3>
              <span>{expandedSections.has(section.heading) ? "Hide" : "Open"}</span>
            </button>
            {expandedSections.has(section.heading) ? <div className="result-section-body">{section.body}</div> : null}
          </article>
        ))}
      </div>

      <div className="adjust-panel">
        <h3>Need changes?</h3>
        <p>If this routine feels hard, write what is difficult. The planner can make it easier, more career-focused, calmer, or more realistic.</p>
        <textarea value={adjustmentRequest} onChange={onAdjustChange} placeholder="Example: I cannot wake up at 6 AM. Start my day at 8:30 AM and give me a softer evening routine." />
        <button className="secondary-button" type="button" onClick={onAdjust} disabled={isAdjusting}>{isAdjusting ? "Adjusting your plan..." : "Adjust this plan"}</button>
        {currentPlanFeedback && <p className="feedback-badge">You already rated this plan {currentPlanFeedback.rating}/5.</p>}
      </div>
    </section>
  );
}

export default ResultPanel;
