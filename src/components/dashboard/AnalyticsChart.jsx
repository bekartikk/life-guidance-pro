import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BAR_COLORS = ["#60a5fa", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#38bdf8", "#a78bfa"];

function normalizeDay(item, index) {
  const label = item?.date
    ? new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(item.date))
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] || `D${index + 1}`;

  const productivity = item
    ? item.status === "completed"
      ? 100
      : item.status === "partial"
        ? 70
        : item.status === "difficult"
          ? 55
          : 15
    : 0;

  return {
    label,
    productivity,
    mood: Number(item?.mood || 0),
  };
}

function buildFallbackData() {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, index) => ({
    label,
    productivity: [48, 72, 65, 88, 55, 40, 60][index],
    mood: [2, 3, 3, 4, 3, 2, 4][index],
  }));
}

function getDisplayText(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return value.label || value.title || value.name || value.summary || fallback;
  }
  return fallback;
}

function AnalyticsChart({ checkins, progress, behavioralInsights }) {
  const safeBehavioralInsights = behavioralInsights && typeof behavioralInsights === "object" ? behavioralInsights : {};
  const chartData = useMemo(
    () => (Array.isArray(checkins) && checkins.length ? checkins.slice(0, 7).reverse().map(normalizeDay) : buildFallbackData()),
    [checkins],
  );
  const strongestDay = useMemo(
    () => [...chartData].sort((left, right) => right.productivity - left.productivity)[0] || buildFallbackData()[0],
    [chartData],
  );
  const average = useMemo(
    () => Math.round(chartData.reduce((sum, item) => sum + item.productivity, 0) / chartData.length),
    [chartData],
  );
  const weakestDay = useMemo(
    () => [...chartData].sort((left, right) => left.productivity - right.productivity)[0] || buildFallbackData()[0],
    [chartData],
  );
  const moodAverage = useMemo(
    () => (chartData.reduce((sum, item) => sum + item.mood, 0) / chartData.length).toFixed(1),
    [chartData],
  );

  return (
    <section className="saas-panel premium-analytics-widget">
      <div className="premium-widget-head">
        <div>
          <p>Weekly insights</p>
          <h3>Productivity pulse</h3>
        </div>
        <span className="status-chip">Adaptive read</span>
      </div>
      <p className="premium-analytics-copy">
        Average completion is {average}%. Your strongest recent day was {String(strongestDay.label || "recently").toLowerCase()}.
      </p>

      <div className="space-y-6">
        <div className="premium-insight-grid">
          <div className="premium-insight-card">
            <p>Peak day</p>
            <strong>{getDisplayText(strongestDay.label, "Mon")}</strong>
            <span>{Number(strongestDay.productivity || 0)}% completion</span>
          </div>
          <div className="premium-insight-card">
            <p>Needs support</p>
            <strong>{getDisplayText(weakestDay.label, "Tue")}</strong>
            <span>{Number(weakestDay.productivity || 0)}% completion</span>
          </div>
          <div className="premium-insight-card">
            <p>Life state</p>
            <strong>{getDisplayText(safeBehavioralInsights?.lifeState, "Stabilizing")}</strong>
            <span>{Number(safeBehavioralInsights?.burnoutRisk?.score || 0)}% burnout risk</span>
          </div>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="productivity" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`${entry.label}-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  color: "#e2e8f0",
                }}
              />
              <Line type="monotone" dataKey="mood" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: "#22c55e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-stat-grid premium-stat-grid--triple">
          <div className="premium-stat-card">
            <p>Mood</p>
            <strong>{moodAverage}/5</strong>
          </div>
          <div className="premium-stat-card">
            <p>Streak</p>
            <strong>{Number(progress?.activeStreak || 0)}</strong>
          </div>
          <div className="premium-stat-card">
            <p>Recovery</p>
            <strong>{safeBehavioralInsights?.metrics?.avgSleep ? Number(safeBehavioralInsights.metrics.avgSleep).toFixed(1) : "—"}/5</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(AnalyticsChart);
