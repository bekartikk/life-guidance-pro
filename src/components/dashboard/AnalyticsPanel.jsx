import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase-db";

function AnalyticsPanel({ userId }) {
  const [adjustmentPatterns, setAdjustmentPatterns] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState(null);
  const [topConfigs, setTopConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError("");
    try {
      const adjustmentsQuery = query(collection(db, "analytics", userId, "adjustment_events"));
      const adjustSnapshot = await getDocs(adjustmentsQuery);
      const patterns = {};

      adjustSnapshot.docs.forEach((snapshotItem) => {
        const data = snapshotItem.data();
        if (!patterns[data.reason]) {
          patterns[data.reason] = { count: 0, examples: [] };
        }
        patterns[data.reason].count += 1;
        if (patterns[data.reason].examples.length < 3) {
          patterns[data.reason].examples.push(data.adjustmentRequest);
        }
      });

      setAdjustmentPatterns(
        Object.entries(patterns)
          .map(([reason, data]) => ({ reason, ...data }))
          .sort((left, right) => right.count - left.count),
      );

      const metricsQuery = query(collection(db, "analytics", userId, "checkin_metrics"));
      const metricsSnapshot = await getDocs(metricsQuery);
      setEngagementMetrics(metricsSnapshot.docs.length > 0 ? metricsSnapshot.docs[0].data() : null);

      const plansQuery = query(collection(db, "analytics", userId, "plan_events"));
      const plansSnapshot = await getDocs(plansQuery);
      const configScores = {};

      plansSnapshot.docs.forEach((snapshotItem) => {
        const data = snapshotItem.data();
        const config = `${data.profile?.preferredTone || "unknown"}-${data.profile?.roadmapFocus || "unknown"}`;
        if (!configScores[config]) {
          configScores[config] = { count: 0 };
        }
        configScores[config].count += 1;
      });

      setTopConfigs(
        Object.entries(configScores)
          .map(([config, score]) => ({
            config,
            tone: config.split("-")[0],
            focus: config.split("-")[1],
            uses: score.count,
          }))
          .sort((left, right) => right.uses - left.uses)
          .slice(0, 5),
      );
    } catch (requestError) {
      setError(requestError.message || "Could not load analytics");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return undefined;

    const timer = window.setTimeout(() => {
      void loadAnalytics();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadAnalytics, userId]);

  if (isLoading) return <section className="analytics-panel">Loading analytics...</section>;

  return (
    <section className="analytics-panel in-workspace">
      <div className="analytics-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>Data-driven insights for AI improvement</h2>
        </div>
        <button type="button" className="secondary-button" onClick={loadAnalytics}>
          Refresh
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {adjustmentPatterns.length > 0 && (
        <div className="analytics-section">
          <h3>Common Adjustment Patterns</h3>
          <p className="section-hint">Users adjusted their plans for these reasons:</p>
          <div className="pattern-list">
            {adjustmentPatterns.map((pattern) => (
              <div key={pattern.reason} className="pattern-card">
                <div className="pattern-header">
                  <strong>{pattern.reason.replace(/-/g, " ")}</strong>
                  <span className="pattern-count">{pattern.count} times</span>
                </div>
                <div className="pattern-examples">
                  {pattern.examples.map((example, index) => (
                    <p key={index} className="example-text">"{example}"</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="insight-box">
            <strong>Insight:</strong> These adjustment patterns show where your prompts need improvement. If users repeatedly ask for softer plans, more clarity, or lower intensity, the guidance prompt can respond earlier.
          </div>
        </div>
      )}

      {engagementMetrics && (
        <div className="analytics-section">
          <h3>User Engagement</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Engagement Score</span>
              <span className="metric-value" style={{ color: engagementMetrics.engagementScore >= 70 ? "#2d6f5b" : "#a8693f" }}>
                {engagementMetrics.engagementScore}%
              </span>
              <span className="metric-detail">Based on check-in patterns</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Active Streak</span>
              <span className="metric-value">{engagementMetrics.activeStreak} days</span>
              <span className="metric-detail">Current consistency</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Total Check-ins</span>
              <span className="metric-value">{engagementMetrics.completedDays + engagementMetrics.partialDays + engagementMetrics.difficultDays}</span>
              <span className="metric-detail">Plan adherence</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Completion Rate</span>
              <span className="metric-value">
                {engagementMetrics.completedDays + engagementMetrics.partialDays + engagementMetrics.difficultDays > 0
                  ? Math.round((engagementMetrics.completedDays / (engagementMetrics.completedDays + engagementMetrics.partialDays + engagementMetrics.difficultDays)) * 100)
                  : 0}
                %
              </span>
              <span className="metric-detail">Fully completed days</span>
            </div>
          </div>
        </div>
      )}

      {topConfigs.length > 0 && (
        <div className="analytics-section">
          <h3>Most Used Plan Configurations</h3>
          <p className="section-hint">These tone and focus combinations are most popular:</p>
          <div className="config-list">
            {topConfigs.map((config) => (
              <div key={config.config} className="config-card">
                <div className="config-labels">
                  <span className="config-badge tone">{config.tone}</span>
                  <span className="config-badge focus">{config.focus}</span>
                </div>
                <span className="config-count">{config.uses} plans</span>
              </div>
            ))}
          </div>
          <div className="insight-box">
            <strong>Insight:</strong> These are the combinations getting the most real use, so they are the best place to focus prompt refinement and A/B tests.
          </div>
        </div>
      )}

      <div className="analytics-section">
        <h3>Recommendations for Prompt Improvement</h3>
        <div className="recommendations">
          <div className="recommendation-item">
            <span className="recommendation-icon">1</span>
            <div>
              <strong>Analyze adjustment requests</strong>
              <p>Users who adjust plans reveal where prompts fall short. Group by reason and refine the system instructions around those gaps.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <span className="recommendation-icon">2</span>
            <div>
              <strong>Correlate feedback with tone</strong>
              <p>High-rated plans show which tones work best for different user profiles. Use that signal to improve tone selection.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <span className="recommendation-icon">3</span>
            <div>
              <strong>Track engagement by focus area</strong>
              <p>If some roadmap focuses lead to weaker follow-through, they need better routines or smaller first actions.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <span className="recommendation-icon">4</span>
            <div>
              <strong>A/B test new prompts</strong>
              <p>Try prompt version A and B, then compare ratings, adjustments, and check-in quality before rolling one out more broadly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPanel;
