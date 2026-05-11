import { useMemo, useState } from "react";
import {
  HiOutlineArrowDownTray,
  HiOutlineClipboardDocument,
  HiOutlineShare,
  HiOutlineSparkles,
} from "react-icons/hi2";

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

function getSectionSentence(section) {
  const body = String(section?.body || "").replace(/\s+/g, " ").trim();
  if (!body) return "This part of the plan will fill in once the AI returns more detail.";
  const sentence = body.match(/.*?[.!?](\s|$)/)?.[0]?.trim();
  return sentence || body;
}

function getSectionPreview(section) {
  const sentence = getSectionSentence(section);
  const words = sentence.split(/\s+/);
  if (words.length <= 18) return sentence;
  return `${words.slice(0, 18).join(" ")}...`;
}

function pickSection(sections, matcher, fallbackIndex) {
  return (
    sections.find((section) => matcher(section.heading.toLowerCase(), String(section.body || "").toLowerCase())) ||
    sections[fallbackIndex] ||
    sections[0] ||
    null
  );
}

function renderSectionBody(body) {
  const lines = String(body || "").split("\n").map((line) => line.trimEnd());
  const blocks = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      blocks.push({ type: "list", items: bulletBuffer });
      bulletBuffer = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets();
      return;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      bulletBuffer.push(trimmed.replace(/^[-*•]\s+/, ""));
      return;
    }

    flushBullets();
    if (/^(today|this week|next week|note|warning|remember)\s*:/i.test(trimmed)) {
      blocks.push({ type: "callout", text: trimmed });
      return;
    }

    blocks.push({ type: "paragraph", text: trimmed });
  });

  flushBullets();

  return blocks.map((block, index) => {
    if (block.type === "list") {
      return (
        <ul className="result-rich-list" key={`list-${index}`}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "callout") {
      return (
        <blockquote className="result-rich-callout" key={`callout-${index}`}>
          {block.text}
        </blockquote>
      );
    }

    return (
      <p className="result-rich-paragraph" key={`paragraph-${index}`}>
        {block.text}
      </p>
    );
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
  behavioralInsights,
  formatDate,
  onAdjustChange,
  onAdjust,
  onCheckin,
  onCheckinFieldChange,
  onCheckinNoteChange,
  onRegenerate,
  onRate,
}) {
  const sections = useMemo(() => splitPlanSections(currentPlan?.result), [currentPlan?.result]);
  const [expandedState, setExpandedState] = useState(() => ({
    planId: null,
    headings: new Set(),
  }));
  const [actionMessage, setActionMessage] = useState("");

  const summaryCards = useMemo(() => {
    const keyShift = pickSection(sections, (heading) => heading.includes("assessment") || heading.includes("state") || heading.includes("shift"), 0);
    const todayFocus = pickSection(sections, (heading, body) => heading.includes("routine") || heading.includes("today") || body.includes("today"), 1);
    const nextWeek = pickSection(sections, (heading, body) => heading.includes("7") || heading.includes("week") || body.includes("next 7"), 2);
    const longerHorizon = pickSection(
      sections,
      (heading, body) => heading.includes("30") || heading.includes("roadmap") || heading.includes("month") || body.includes("longer"),
      sections.length - 1,
    );

    return [
      { label: "Key shifts", section: keyShift },
      { label: "Today's focus", section: todayFocus },
      { label: "Next 7 days", section: nextWeek },
      { label: "Longer horizon", section: longerHorizon },
    ].filter((item) => item.section);
  }, [sections]);

  if (!currentPlan) {
    return null;
  }

  const activeExpandedSections =
    expandedState.planId === currentPlan.id
      ? expandedState.headings
      : new Set(sections[0]?.heading ? [sections[0].heading] : []);

  function toggleSection(heading) {
    setExpandedState((current) => {
      const baseHeadings =
        current.planId === currentPlan.id
          ? current.headings
          : new Set(sections[0]?.heading ? [sections[0].heading] : []);
      const next = new Set(baseHeadings);
      if (next.has(heading)) {
        next.delete(heading);
      } else {
        next.add(heading);
      }
      return {
        planId: currentPlan.id,
        headings: next,
      };
    });
  }

  async function handleCopyPlan() {
    try {
      await navigator.clipboard.writeText(currentPlan.result || "");
      setActionMessage("Plan copied to clipboard.");
    } catch {
      setActionMessage("Could not copy the plan on this device.");
    }
  }

  async function handleSharePlan() {
    const sharePayload = {
      title: currentPlan.title,
      text: currentPlan.result,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        setActionMessage("Plan shared.");
        return;
      }
      await navigator.clipboard.writeText(`${currentPlan.title}\n\n${currentPlan.result}`);
      setActionMessage("Share is not available here, so the plan was copied instead.");
    } catch {
      setActionMessage("Share was cancelled.");
    }
  }

  function handleExportPlan() {
    const blob = new Blob([currentPlan.result || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentPlan.title || "life-guidance-plan"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setActionMessage("Plan export started.");
  }

  return (
    <section className="result-panel" id="result-panel">
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

      <div className="result-toolbar">
        <div className="result-toolbar__title">
          <span><HiOutlineSparkles className="h-4 w-4" /> AI roadmap</span>
          <p>Use the quick actions to save, share, or revisit this plan without losing momentum.</p>
        </div>
        <div className="result-toolbar__actions">
          <button className="secondary-button" type="button" onClick={handleCopyPlan}><HiOutlineClipboardDocument className="h-4 w-4" /> Copy</button>
          <button className="secondary-button" type="button" onClick={handleSharePlan}><HiOutlineShare className="h-4 w-4" /> Share</button>
          <button className="secondary-button" type="button" onClick={handleExportPlan}><HiOutlineArrowDownTray className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {actionMessage ? <p className="feedback-badge">{actionMessage}</p> : null}

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

      {summaryCards.length > 0 && (
        <div className="result-summary-grid">
          {summaryCards.map((item) => (
            <article className="result-summary-card" key={`${item.label}-${item.section.heading}`}>
              <span>{item.label}</span>
              <strong>{item.section.heading.replace(/^\d+\.\s*/, "")}</strong>
              <p>{getSectionPreview(item.section)}</p>
            </article>
          ))}
        </div>
      )}

      <div className="checkin-panel">
        <div>
          <h3>Today's check-in</h3>
          <p>Reward effort, not perfection. Give the AI enough emotional context to adapt tomorrow realistically.</p>
        </div>
        <div className="result-summary-grid result-summary-grid--compact">
          {behavioralInsights.summaryCards.slice(0, 2).map((item) => (
            <article className="result-summary-card" key={`checkin-${item.label}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
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
        <div className="two-column">
          <label>
            Stress
            <select name="stress" value={checkinFields.stress} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Light</option>
              <option value="2">2 - Manageable</option>
              <option value="3">3 - Present</option>
              <option value="4">4 - Heavy</option>
              <option value="5">5 - Overloaded</option>
            </select>
          </label>
          <label>
            Motivation
            <select name="motivation" value={checkinFields.motivation} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Flat</option>
              <option value="2">2 - Fragile</option>
              <option value="3">3 - Mixed</option>
              <option value="4">4 - Ready</option>
              <option value="5">5 - Strong</option>
            </select>
          </label>
        </div>
        <div className="two-column">
          <label>
            Sleep quality
            <select name="sleepQuality" value={checkinFields.sleepQuality} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Broken</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Okay</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Restored</option>
            </select>
          </label>
          <label>
            Happiness
            <select name="happiness" value={checkinFields.happiness} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Very low</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Steady</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - High</option>
            </select>
          </label>
        </div>
        <div className="two-column">
          <label>
            Productivity
            <select name="productivity" value={checkinFields.productivity} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="1">1 - Stalled</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Some progress</option>
              <option value="4">4 - Strong</option>
              <option value="5">5 - Excellent</option>
            </select>
          </label>
          <label>
            Emotional state
            <select name="emotionalState" value={checkinFields.emotionalState} onChange={onCheckinFieldChange}>
              <option value="">Choose</option>
              <option value="calm">Calm</option>
              <option value="uncertain">Uncertain</option>
              <option value="drained">Drained</option>
              <option value="hopeful">Hopeful</option>
              <option value="anxious">Anxious</option>
            </select>
          </label>
        </div>
        <div className="two-column">
          <label>
            Pressure right now
            <input
              name="pressureLevel"
              value={checkinFields.pressureLevel}
              onChange={onCheckinFieldChange}
              placeholder="Exams, deadlines, finances, family..."
            />
          </label>
          <label>
            Personal issue
            <input
              name="personalIssue"
              value={checkinFields.personalIssue}
              onChange={onCheckinFieldChange}
              placeholder="Optional context the AI should respect"
            />
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
        <label>
          Micro-win worth remembering
          <input
            name="wins"
            value={checkinFields.wins}
            onChange={onCheckinFieldChange}
            placeholder="A small win, recovery choice, or proof that you still showed up"
          />
        </label>
        <label>
          Reflection for the AI memory
          <textarea
            name="reflection"
            value={checkinFields.reflection}
            onChange={onCheckinFieldChange}
            placeholder="What pattern should the AI remember about today?"
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
          <p>Open only the sections you need right now so the roadmap feels calmer to scan.</p>
        </div>
        <div className="result-outline-chips">
          {sections.map((section) => (
            <button
              key={section.heading}
              type="button"
              onClick={() => toggleSection(section.heading)}
              className={`badge-chip result-toggle-chip ${activeExpandedSections.has(section.heading) ? "is-open" : ""}`}
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
              aria-expanded={activeExpandedSections.has(section.heading)}
            >
              <div className="result-section-heading">
                <h3>{section.heading}</h3>
                <p>{getSectionPreview(section)}</p>
              </div>
              <span>{activeExpandedSections.has(section.heading) ? "Hide" : "Open"}</span>
            </button>
            {activeExpandedSections.has(section.heading) ? (
              <div className="result-section-body">
                {renderSectionBody(section.body)}
              </div>
            ) : null}
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
