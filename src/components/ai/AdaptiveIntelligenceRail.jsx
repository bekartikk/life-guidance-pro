import { memo, useMemo } from "react";

const EMPTY_AI_META = Object.freeze({});
const EMPTY_ADAPTIVE_STATE = Object.freeze({});
const EMPTY_RECOMMENDATIONS = Object.freeze([]);
const EMPTY_BEHAVIORAL_INSIGHTS = Object.freeze({});

function toDisplayText(value, fallback = "Unavailable") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => toDisplayText(item, ""))
      .filter(Boolean)
      .join(", ");
    return joined || fallback;
  }
  if (typeof value === "object") {
    return value.label || value.title || value.name || value.summary || value.detail || fallback;
  }
  return fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatPercent(value) {
  return `${Math.round(Number(value) || 0)}%`;
}

function buildWeeklyPattern(checkins = []) {
  const week = checkins.slice(0, 7).reverse();
  if (!week.length) {
    return [
      { label: "M", load: 42, energy: 54 },
      { label: "T", load: 38, energy: 58 },
      { label: "W", load: 48, energy: 52 },
      { label: "T", load: 51, energy: 49 },
      { label: "F", load: 44, energy: 56 },
      { label: "S", load: 35, energy: 61 },
      { label: "S", load: 31, energy: 64 },
    ];
  }

  return week.map((item, index) => {
    const label = item?.date
      ? new Intl.DateTimeFormat("en", { weekday: "narrow" }).format(new Date(item.date))
      : ["M", "T", "W", "T", "F", "S", "S"][index] || `D${index + 1}`;
    const stress = Number(item?.stress || 0);
    const productivity = Number(item?.productivity || 0);
    const energy = Number(item?.energy || 0);

    return {
      label,
      load: clamp((stress || 2) * 20 + (productivity ? 8 : 0), 12, 96),
      energy: clamp((energy || 2) * 20, 12, 96),
    };
  });
}

function buildCognitiveLoad(metrics = {}, adaptiveState = {}) {
  const stress = Number(metrics.avgStress || adaptiveState.avgStress || 3);
  const focus = Number(metrics.avgFocus || adaptiveState.avgFocus || 3);
  const sleep = Number(metrics.avgSleep || adaptiveState.avgSleep || 3);
  const loadScore = clamp(Math.round((stress * 16) + ((6 - focus) * 10) + ((6 - sleep) * 8)), 12, 96);

  return {
    loadScore,
    label: loadScore >= 72 ? "Heavy" : loadScore >= 52 ? "Manage closely" : "Steady",
    summary:
      loadScore >= 72
        ? "Your mental bandwidth looks stretched. Reduce switching costs and protect easier starts."
        : loadScore >= 52
          ? "You still have usable capacity, but competing demands are starting to tax follow-through."
          : "Cognitive load looks manageable enough for structured progress without extra pressure.",
  };
}

function AdaptiveIntelligenceRail({
  aiMeta,
  behavioralInsights,
  checkins,
}) {
  const safeMeta = aiMeta || EMPTY_AI_META;
  const safeBehavioralInsights = behavioralInsights || EMPTY_BEHAVIORAL_INSIGHTS;
  const adaptiveState = safeMeta.adaptiveState || EMPTY_ADAPTIVE_STATE;
  const recommendations = Array.isArray(safeMeta.recommendations) ? safeMeta.recommendations : EMPTY_RECOMMENDATIONS;
  const weeklyPattern = useMemo(() => buildWeeklyPattern(checkins), [checkins]);
  const cognitiveLoad = useMemo(
    () => buildCognitiveLoad(safeBehavioralInsights.metrics, adaptiveState),
    [safeBehavioralInsights.metrics, adaptiveState],
  );

  const todayFocus = safeMeta.memorySummary?.headline
    ? {
        title: safeMeta.roadmapIntelligence?.nextShift || "Protect today's direction",
        body: adaptiveState.dailyFocus || "Use one clear action and one recovery anchor so the day stays workable.",
        context: safeMeta.memorySummary.headline,
      }
    : {
        title: "Today's AI focus",
        body: adaptiveState.dailyFocus || "Keep one stabilizing action visible and lower pressure where it is leaking energy.",
        context: toDisplayText(safeBehavioralInsights?.lifeState?.label, "Adaptive guidance"),
      };

  const momentumScore = Number(adaptiveState.momentumScore || 0);
  const burnoutScore = Number(adaptiveState.burnoutRisk || safeBehavioralInsights?.burnoutRisk?.score || 0);
  const intensity = adaptiveState.taskIntensity || "medium";
  const intensityPercent = intensity === "high" ? 84 : intensity === "low" ? 38 : 62;

  const recoverySuggestions = recommendations.length
    ? recommendations.slice(0, 3)
    : (Array.isArray(safeBehavioralInsights.adaptiveRecommendations) ? safeBehavioralInsights.adaptiveRecommendations : []).slice(0, 3).map((item, index) => ({
        title: `Adaptive suggestion ${index + 1}`,
        detail: toDisplayText(item, "Adaptive suggestion"),
        why: "Derived from your recent behavioral signals.",
      }));

  const weeklySummary = weeklyPattern.length
    ? `Load was ${weeklyPattern[weeklyPattern.length - 1].load > weeklyPattern[0].load ? "building" : "easing"} through the latest week, while energy ${weeklyPattern[weeklyPattern.length - 1].energy >= weeklyPattern[0].energy ? "held up" : "fell back"} enough that the AI should keep adaptation visible.`
    : "The weekly pattern will get sharper as more check-ins come in.";

  return (
    <section className="saas-panel ai-intelligence-surface">
      <div className="ai-intelligence-surface__hero">
        <div>
          <p className="dashboard-eyebrow">Adaptive AI engine</p>
          <h3>{todayFocus.title}</h3>
          <p>{todayFocus.body}</p>
        </div>
        <div className="ai-hero-chip-stack">
          <span className="hero-header-chip">{toDisplayText(safeBehavioralInsights?.personalityMode?.active, "Balanced Strategist")}</span>
          <span className="hero-header-chip">{toDisplayText(todayFocus.context, "Adaptive guidance")}</span>
        </div>
      </div>

      <div className="ai-intelligence-grid">
        <article className="ai-signal-card">
          <p>Momentum score</p>
          <strong>{formatPercent(momentumScore)}</strong>
          <span>{momentumScore >= 70 ? "You have room for stretch work." : "Protect consistency before pushing harder."}</span>
        </article>
        <article className="ai-signal-card">
          <p>Burnout risk</p>
          <strong>{formatPercent(burnoutScore)}</strong>
          <span>{toDisplayText(safeBehavioralInsights?.burnoutRisk?.summary, "Burnout protection is based on your latest stress and recovery signals.")}</span>
        </article>
        <article className="ai-signal-card">
          <p>Adaptive intensity</p>
          <strong>{String(intensity).replace(/^\w/, (c) => c.toUpperCase())}</strong>
          <div className="ai-meter" aria-label={`Adaptive intensity ${intensity}`}>
            <span className="ai-meter__fill" style={{ width: `${intensityPercent}%` }} />
          </div>
          <span>{adaptiveState.intensityLabel || "The engine scales challenge to current recovery and momentum."}</span>
        </article>
        <article className="ai-signal-card">
          <p>Cognitive load</p>
          <strong>{cognitiveLoad.label}</strong>
          <span>{cognitiveLoad.summary}</span>
        </article>
      </div>

      <div className="ai-surface-columns">
        <section className="ai-recovery-panel">
          <div className="ai-panel-head">
            <strong>Recovery suggestions</strong>
            <span>{adaptiveState.recoveryMode ? "Recovery mode" : "Adaptive guardrails"}</span>
          </div>
          <div className="ai-recovery-list">
            {recoverySuggestions.map((item, index) => (
              <article key={`${toDisplayText(item.title || item.detail, "suggestion")}-${index}`} className="ai-recovery-item">
                <strong>{toDisplayText(item.title, `Suggestion ${index + 1}`)}</strong>
                <p>{toDisplayText(item.detail, "Adaptive guidance based on your recent signals.")}</p>
                {item.why ? <small>{toDisplayText(item.why, "")}</small> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="ai-pattern-panel">
          <div className="ai-panel-head">
            <strong>AI weekly pattern</strong>
            <span>Load vs energy</span>
          </div>
          <div className="ai-pattern-chart" aria-label="Weekly AI pattern summary">
            {weeklyPattern.map((point, index) => (
              <div key={`${point.label}-${index}`} className="ai-pattern-day">
                <div className="ai-pattern-bars">
                  <span className="ai-pattern-bar ai-pattern-bar--load" style={{ height: `${point.load}%` }} aria-hidden="true" />
                  <span className="ai-pattern-bar ai-pattern-bar--energy" style={{ height: `${point.energy}%` }} aria-hidden="true" />
                </div>
                <small>{point.label}</small>
              </div>
            ))}
          </div>
          <p className="ai-pattern-summary">{weeklySummary}</p>
        </section>
      </div>
    </section>
  );
}

export default memo(AdaptiveIntelligenceRail);
