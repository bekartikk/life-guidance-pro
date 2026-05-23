import { memo } from "react";

function formatPercent(value) {
  return `${Math.round(Number(value) || 0)}%`;
}

function toDisplayText(value, fallback = "Unavailable") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const flattened = value
      .map((item) => toDisplayText(item, ""))
      .filter(Boolean)
      .join(", ");
    return flattened || fallback;
  }
  if (typeof value === "object") {
    return (
      value.label ||
      value.title ||
      value.name ||
      value.summary ||
      value.detail ||
      fallback
    );
  }
  return fallback;
}

function formatDateLabel(value) {
  if (!value) return "Latest";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Latest";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function MiniBehaviorChart({ label, tone, points }) {
  const safePoints = Array.isArray(points) ? points.slice(-7) : [];

  return (
    <article className="adaptive-mini-chart">
      <div className="adaptive-mini-chart__head">
        <strong>{label}</strong>
        <span>{safePoints.length ? formatPercent(safePoints[safePoints.length - 1].value) : "No data"}</span>
      </div>
      <div className="adaptive-mini-chart__bars" aria-hidden="true">
        {safePoints.length === 0 ? (
          <div className="adaptive-mini-chart__empty">Waiting for mirrored history</div>
        ) : (
          safePoints.map((point) => (
            <div className="adaptive-mini-chart__column" key={`${label}-${point.label}-${point.date || "now"}`}>
              <span
                className={`adaptive-mini-chart__bar adaptive-mini-chart__bar--${tone}`}
                style={{ height: `${Math.max(8, Number(point.value) || 0)}%` }}
              />
              <small>{point.label}</small>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function AdaptiveHistorySurface({ adaptiveInsights, activeAiMeta, behavioralInsights }) {
  const safeInsights = adaptiveInsights && typeof adaptiveInsights === "object" ? adaptiveInsights : {};
  const safeBehavioralInsights = behavioralInsights && typeof behavioralInsights === "object" ? behavioralInsights : {};
  const feedItems = Array.isArray(safeInsights.feed) ? safeInsights.feed : [];
  const recommendationHistory = Array.isArray(safeInsights.recommendationHistory) ? safeInsights.recommendationHistory : [];
  const weeklySummaries = Array.isArray(safeInsights.weeklySummaries) ? safeInsights.weeklySummaries : [];
  const semanticMemories = Array.isArray(safeInsights.semanticMemories) ? safeInsights.semanticMemories : [];
  const semanticSummary =
    safeInsights.semanticSummary && typeof safeInsights.semanticSummary === "object"
      ? safeInsights.semanticSummary
      : { headline: "No semantic memories yet", bullets: [] };
  const sourceLabel = safeInsights.enabled ? "Supabase mirror" : "Local fallback";

  const firstRecommendation = recommendationHistory[0] || activeAiMeta?.recommendations?.[0];
  const planChangeExplanation = firstRecommendation
    ? {
        title: toDisplayText(firstRecommendation.title, "The plan shifted for a reason"),
        detail:
          toDisplayText(firstRecommendation.why, "") ||
          toDisplayText(firstRecommendation.detail, "") ||
          toDisplayText(safeBehavioralInsights?.burnoutRisk?.summary, "Recent signals changed the adaptive guidance."),
      }
    : {
        title: "Plan changes stay grounded in your recent signals",
        detail: toDisplayText(safeBehavioralInsights?.burnoutRisk?.summary, "Recent signals changed the adaptive guidance."),
      };

  return (
    <section className="saas-panel adaptive-history-surface">
      <div className="adaptive-history-surface__head">
        <div>
          <p className="dashboard-eyebrow">Adaptive AI history</p>
          <h3>Mirrored behavior and recommendation history</h3>
        </div>
        <span className="hero-header-chip">{sourceLabel}</span>
      </div>

      <article className="adaptive-history-surface__reason">
        <strong>{planChangeExplanation.title}</strong>
        <p>{planChangeExplanation.detail}</p>
      </article>

      <div className="adaptive-history-surface__feed">
        {feedItems.slice(0, 4).map((item) => (
          <article className="adaptive-history-surface__feed-item" key={item.id || `${item.kind || "feed"}-${item.title || "item"}`}>
            <strong>{toDisplayText(item.title, "Adaptive insight")}</strong>
            <span>{toDisplayText(item.kind, "signal")}</span>
            <p>{toDisplayText(item.detail, "Stored adaptive insight.")}</p>
          </article>
        ))}
      </div>

      <div className="adaptive-history-surface__charts">
        <MiniBehaviorChart label="Burnout trend" tone="danger" points={adaptiveInsights.burnoutHistory || []} />
        <MiniBehaviorChart label="Momentum history" tone="success" points={adaptiveInsights.momentumHistory || []} />
        <MiniBehaviorChart label="Cognitive load" tone="warning" points={adaptiveInsights.cognitiveLoadHistory || []} />
      </div>

      <div className="adaptive-history-surface__summary-grid">
        {weeklySummaries.slice(-3).map((item) => (
          <article className="adaptive-history-surface__summary-card" key={`${toDisplayText(item.label, "week")}-${toDisplayText(item.workspaceMode, "focus")}`}>
            <span>{toDisplayText(item.label, "This week")}</span>
            <strong>{toDisplayText(item.workspaceMode, "focus")}</strong>
            <p>
              Burnout {formatPercent(item.burnoutRisk)} · Momentum {formatPercent(item.momentum)} · Load{" "}
              {formatPercent(item.cognitiveLoad)}
            </p>
          </article>
        ))}
      </div>

      <div className="adaptive-history-surface__semantic">
        <div className="adaptive-history-surface__subhead">
          <strong>Semantic memory retrieval</strong>
          <span>{semanticMemories.length ? `${semanticMemories.length} ranked memories` : "Waiting for vectors"}</span>
        </div>
        <article className="adaptive-history-surface__reason">
          <strong>{toDisplayText(semanticSummary.headline, "No semantic memories yet")}</strong>
          {semanticSummary.bullets?.length ? (
            <ul className="result-rich-list">
              {semanticSummary.bullets.map((item, index) => (
                <li key={`${toDisplayText(item, "memory-bullet")}-${index}`}>{toDisplayText(item, "Adaptive memory summary")}</li>
              ))}
            </ul>
          ) : (
            <p className="muted-text">Once embeddings are enabled, this surface will pull the most relevant prior recovery, focus, and burnout memories.</p>
          )}
        </article>
        {semanticMemories.length > 0 ? (
          <div className="adaptive-history-surface__feed">
            {semanticMemories.slice(0, 3).map((memory) => (
              <article className="adaptive-history-surface__feed-item" key={memory.id || toDisplayText(memory.summary, "memory")}>
                <strong>{toDisplayText(memory.summary, "Adaptive memory snapshot")}</strong>
                <span>{formatPercent(memory.score * 100)} match</span>
                <p>{toDisplayText(memory.evidence?.[0], "Retrieved from similar historical adaptive memory.")}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <div className="adaptive-history-surface__recommendations">
        <div className="adaptive-history-surface__subhead">
          <strong>Recommendation history</strong>
          <span>{adaptiveInsights.realtimeReady ? "Realtime-ready" : "Read-only mirror"}</span>
        </div>
        {recommendationHistory.length === 0 ? (
          <p className="muted-text">Adaptive recommendation history will appear here once mirrored reads are available.</p>
        ) : (
          recommendationHistory.slice(0, 4).map((item) => (
            <article className="adaptive-history-surface__recommendation" key={item.id || `${toDisplayText(item.title, "recommendation")}-${toDisplayText(item.createdAt, "now")}`}>
              <div>
                <strong>{toDisplayText(item.title, "Adaptive recommendation")}</strong>
                <span>{formatDateLabel(item.createdAt)}</span>
              </div>
              <p>{toDisplayText(item.detail, "Stored adaptive recommendation.")}</p>
              <small>{toDisplayText(item.why, "Stored from adaptive recommendation history.")}</small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default memo(AdaptiveHistorySurface);
