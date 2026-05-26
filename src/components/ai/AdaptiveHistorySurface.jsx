import { memo } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "../ui/index.js";
import { GridLayout, PanelLayout, SectionHeader } from "../layout/index.js";

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

function buildTimelineEntries(feedItems, weeklySummaries, recommendationHistory) {
  const timeline = [];

  weeklySummaries.slice(-2).forEach((item, index) => {
    timeline.push({
      id: `week-${item.label || index}`,
      label: toDisplayText(item.label, "This week"),
      title: `${toDisplayText(item.workspaceMode, "Adaptive mode")} week`,
      detail: `Momentum ${formatPercent(item.momentum)} while cognitive load held at ${formatPercent(item.cognitiveLoad)}.`,
    });
  });

  feedItems.slice(0, 2).forEach((item, index) => {
    timeline.push({
      id: item.id || `feed-${index}`,
      label: toDisplayText(item.kind, "Signal"),
      title: toDisplayText(item.title, "Adaptive insight"),
      detail: toDisplayText(item.detail, "The adaptive layer stored this shift as part of your continuity."),
    });
  });

  recommendationHistory.slice(0, 2).forEach((item, index) => {
    timeline.push({
      id: item.id || `recommendation-${index}`,
      label: formatDateLabel(item.createdAt),
      title: toDisplayText(item.title, "Adaptive recommendation"),
      detail: toDisplayText(item.why, toDisplayText(item.detail, "This recommendation was saved for future continuity.")),
    });
  });

  return timeline.slice(0, 5);
}

function buildEvolutionSummary(weeklySummaries, behavioralInsights) {
  const latest = weeklySummaries[weeklySummaries.length - 1];
  const previous = weeklySummaries[weeklySummaries.length - 2];
  if (!latest) {
    return toDisplayText(
      behavioralInsights?.burnoutRisk?.summary,
      "As more check-ins accumulate, the AI will start showing whether your pressure is easing or building.",
    );
  }

  if (!previous) {
    return `The latest week settled into ${toDisplayText(latest.workspaceMode, "adaptive guidance")} with ${formatPercent(latest.momentum)} momentum and ${formatPercent(latest.burnoutRisk)} burnout risk.`;
  }

  const momentumDirection = latest.momentum >= previous.momentum ? "improved" : "softened";
  const loadDirection = latest.cognitiveLoad <= previous.cognitiveLoad ? "eased" : "intensified";

  return `Compared with the prior week, momentum ${momentumDirection} while cognitive load ${loadDirection}. The AI is using that continuity to keep recommendations grounded.`;
}

function MiniBehaviorChart({ label, tone, points }) {
  const safePoints = Array.isArray(points) ? points.slice(-7) : [];

  return (
    <Card className="adaptive-mini-chart" tone="soft">
      <CardHeader className="adaptive-mini-chart__head">
        <CardTitle>{label}</CardTitle>
        <Badge tone="info">{safePoints.length ? formatPercent(safePoints[safePoints.length - 1].value) : "No data"}</Badge>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
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
  const continuityTimeline = buildTimelineEntries(feedItems, weeklySummaries, recommendationHistory);
  const evolutionSummary = buildEvolutionSummary(weeklySummaries, safeBehavioralInsights);
  const futureProjection = Array.isArray(safeBehavioralInsights?.futureProjection)
    ? safeBehavioralInsights.futureProjection.slice(0, 2)
    : [];

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
    <Card className="saas-panel adaptive-history-surface" tone="elevated">
      <CardHeader className="adaptive-history-surface__head">
        <SectionHeader
          eyebrow="Adaptive AI history"
          title="Mirrored behavior and recommendation history"
          actions={<Badge className="hero-header-chip" tone="info">{sourceLabel}</Badge>}
        />
      </CardHeader>

      <CardContent className="grid gap-6">
        <Card className="adaptive-history-surface__reason" tone="soft">
          <CardContent>
            <strong>{planChangeExplanation.title}</strong>
            <p>{planChangeExplanation.detail}</p>
          </CardContent>
        </Card>

        <PanelLayout className="adaptive-history-surface__semantic">
          <Card className="adaptive-history-surface__semantic-panel" tone="soft">
            <CardHeader className="adaptive-history-surface__subhead">
              <CardTitle>Why the AI remembered this</CardTitle>
              <Badge tone="info">{semanticMemories.length ? "Memory-aware" : "Still learning"}</Badge>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Card className="adaptive-history-surface__reason" tone="soft">
                <CardContent>
                  <strong>{toDisplayText(semanticSummary.headline, "The AI has not built a stable memory explanation yet")}</strong>
                  {semanticSummary.bullets?.length ? (
                    <ul className="result-rich-list">
                      {semanticSummary.bullets.map((item, index) => (
                        <li key={`${toDisplayText(item, "memory-bullet")}-${index}`}>{toDisplayText(item, "Adaptive memory summary")}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-text">The memory layer will become more specific once enough repeated recovery, focus, and stress patterns have been retrieved.</p>
                  )}
                </CardContent>
              </Card>

              {semanticMemories.length > 0 ? (
                <GridLayout className="adaptive-history-surface__feed">
                  {semanticMemories.slice(0, 3).map((memory) => (
                    <Card className="adaptive-history-surface__feed-item" key={memory.id || toDisplayText(memory.summary, "memory")} tone="soft">
                      <CardContent>
                        <strong>{toDisplayText(memory.summary, "Adaptive memory snapshot")}</strong>
                        <Badge tone="info">{formatPercent(memory.score * 100)} relevance</Badge>
                        <p>{toDisplayText(memory.evidence?.[0], "This memory surfaced because it closely matched your recent pattern.")}</p>
                        <small>{toDisplayText(memory.evidence?.[1], "The AI uses this as continuity, not as a fixed label.")}</small>
                      </CardContent>
                    </Card>
                  ))}
                </GridLayout>
              ) : null}
            </CardContent>
          </Card>

          <Card className="adaptive-history-surface__recommendations" tone="soft">
            <CardHeader className="adaptive-history-surface__subhead">
              <CardTitle>Recommendation reasoning</CardTitle>
              <Badge tone="info">{recommendationHistory.length ? `${recommendationHistory.length} saved suggestions` : "Awaiting mirrored history"}</Badge>
            </CardHeader>
            <CardContent>
              {recommendationHistory.length === 0 ? (
                <p className="muted-text">Once the mirror has more saved recommendations, this area will explain which signals pushed each suggestion forward.</p>
              ) : (
                recommendationHistory.slice(0, 4).map((item) => (
                  <Card className="adaptive-history-surface__recommendation" key={item.id || `${toDisplayText(item.title, "recommendation")}-${toDisplayText(item.createdAt, "now")}`} tone="soft">
                    <CardContent>
                      <div>
                        <strong>{toDisplayText(item.title, "Adaptive recommendation")}</strong>
                        <span>{formatDateLabel(item.createdAt)}</span>
                      </div>
                      <p>{toDisplayText(item.why, toDisplayText(item.detail, "Stored adaptive recommendation."))}</p>
                      <small>{toDisplayText(item.type, "adaptive")} guidance carried forward for future continuity.</small>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </PanelLayout>

        <GridLayout className="adaptive-history-surface__feed">
          {feedItems.slice(0, 4).map((item) => (
            <Card className="adaptive-history-surface__feed-item" key={item.id || `${item.kind || "feed"}-${item.title || "item"}`} tone="soft">
              <CardContent>
                <strong>{toDisplayText(item.title, "Adaptive insight")}</strong>
                <Badge tone="info">{toDisplayText(item.kind, "signal")}</Badge>
                <p>{toDisplayText(item.detail, "Stored adaptive insight.")}</p>
              </CardContent>
            </Card>
          ))}
        </GridLayout>

        <GridLayout className="adaptive-history-surface__charts">
          <MiniBehaviorChart label="Burnout trend" tone="danger" points={safeInsights.burnoutHistory || []} />
          <MiniBehaviorChart label="Momentum history" tone="success" points={safeInsights.momentumHistory || []} />
          <MiniBehaviorChart label="Cognitive load" tone="warning" points={safeInsights.cognitiveLoadHistory || []} />
        </GridLayout>

        <GridLayout className="adaptive-history-surface__summary-grid">
          {weeklySummaries.slice(-3).map((item) => (
            <Card className="adaptive-history-surface__summary-card" key={`${toDisplayText(item.label, "week")}-${toDisplayText(item.workspaceMode, "focus")}`} tone="soft">
              <CardContent>
                <span>{toDisplayText(item.label, "This week")}</span>
                <strong>{toDisplayText(item.workspaceMode, "focus")}</strong>
                <p>
                  Burnout {formatPercent(item.burnoutRisk)} · Momentum {formatPercent(item.momentum)} · Load{" "}
                  {formatPercent(item.cognitiveLoad)}
                </p>
              </CardContent>
            </Card>
          ))}
        </GridLayout>

        <PanelLayout className="adaptive-history-surface__semantic">
          <Card className="adaptive-history-surface__semantic-panel" tone="soft">
            <CardHeader className="adaptive-history-surface__subhead">
              <CardTitle>Adaptive continuity</CardTitle>
              <Badge tone="info">{continuityTimeline.length ? `${continuityTimeline.length} continuity points` : "Continuity warming up"}</Badge>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Card className="adaptive-history-surface__reason" tone="soft">
                <CardContent>
                  <strong>Behavioral evolution summary</strong>
                  <p>{evolutionSummary}</p>
                </CardContent>
              </Card>
              {continuityTimeline.length > 0 ? (
                <div className="adaptive-history-surface__timeline">
                  {continuityTimeline.map((item) => (
                    <Card className="adaptive-history-surface__timeline-item" key={item.id} tone="soft">
                      <CardContent>
                        <span>{item.label}</span>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="muted-text">Timeline continuity will become clearer once mirrored history has more than one or two adaptive checkpoints.</p>
              )}
            </CardContent>
          </Card>

          <Card className="adaptive-history-surface__recommendations" tone="soft">
            <CardHeader className="adaptive-history-surface__subhead">
              <CardTitle>Future projection</CardTitle>
              <Badge tone="info">{safeInsights.realtimeReady ? "Realtime-ready" : "Read-only mirror"}</Badge>
            </CardHeader>
            <CardContent>
              {futureProjection.length === 0 ? (
                <p className="muted-text">Longer-range projections will stay cautious until the system has enough repeated behavior to trust the direction.</p>
              ) : (
                futureProjection.map((item, index) => (
                  <Card className="adaptive-history-surface__recommendation" key={`${toDisplayText(item, "projection")}-${index}`} tone="soft">
                    <CardContent>
                      <div>
                        <strong>Projected direction</strong>
                        <span>{index === 0 ? "Closest read" : "Longer-range read"}</span>
                      </div>
                      <p>{toDisplayText(item, "The adaptive layer is still forming a future projection.")}</p>
                      <small>This stays tentative and updates as more repeated patterns prove themselves.</small>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </PanelLayout>
      </CardContent>
    </Card>
  );
}

export default memo(AdaptiveHistorySurface);
