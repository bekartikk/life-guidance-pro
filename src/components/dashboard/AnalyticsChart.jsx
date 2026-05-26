import { memo, useMemo } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "../ui/index.js";
import { GridLayout, SectionHeader } from "../layout/index.js";

const BAR_COLORS = ["#60a5fa", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#38bdf8", "#a78bfa"];
const MOOD_LINE_COLOR = "#22c55e";

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

function Sparkline({ data, width = 320, height = 120 }) {
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const points = useMemo(() => {
    if (!safeData.length) return "";
    const max = Math.max(...safeData.map((item) => Number(item.mood) || 0), 1);
    const min = Math.min(...safeData.map((item) => Number(item.mood) || 0), 0);
    const range = Math.max(max - min, 1);
    return safeData
      .map((item, index) => {
        const x = safeData.length === 1 ? width / 2 : (index / (safeData.length - 1)) * (width - 24) + 12;
        const y = height - (((Number(item.mood) || 0) - min) / range) * (height - 24) - 12;
        return `${x},${y}`;
      })
      .join(" ");
  }, [height, safeData, width]);

  return (
    <svg className="analytics-sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mood trend over the week">
      <defs>
        <linearGradient id="analyticsSparklineFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.22)" />
          <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={MOOD_LINE_COLOR}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {safeData.map((item, index) => {
        const max = Math.max(...safeData.map((entry) => Number(entry.mood) || 0), 1);
        const min = Math.min(...safeData.map((entry) => Number(entry.mood) || 0), 0);
        const range = Math.max(max - min, 1);
        const x = safeData.length === 1 ? width / 2 : (index / (safeData.length - 1)) * (width - 24) + 12;
        const y = height - (((Number(item.mood) || 0) - min) / range) * (height - 24) - 12;
        return <circle key={`${item.label}-${index}`} cx={x} cy={y} r="4" fill={MOOD_LINE_COLOR} />;
      })}
    </svg>
  );
}

function BarStrip({ data }) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="analytics-bar-strip" role="img" aria-label="Productivity completion rhythm for the week">
      {safeData.map((item, index) => (
        <div className="analytics-bar-strip__item" key={`${item.label}-${index}`}>
          <div className="analytics-bar-strip__track">
            <span
              className="analytics-bar-strip__bar"
              style={{ height: `${Math.max(12, Number(item.productivity) || 0)}%`, background: BAR_COLORS[index % BAR_COLORS.length] }}
            />
          </div>
          <small>{item.label}</small>
        </div>
      ))}
    </div>
  );
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
    <Card className="saas-panel premium-analytics-widget" tone="elevated">
      <CardHeader className="premium-widget-head">
        <SectionHeader
          title="Productivity pulse"
          description={`Average completion is ${average}%. Your strongest recent day was ${String(strongestDay.label || "recently").toLowerCase()}.`}
          eyebrow="Weekly insights"
          actions={<Badge className="status-chip" tone="info">Adaptive read</Badge>}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <GridLayout className="premium-insight-grid">
          <Card className="premium-insight-card" tone="soft">
            <CardContent>
              <p>Peak day</p>
              <strong>{getDisplayText(strongestDay.label, "Mon")}</strong>
              <span>{Number(strongestDay.productivity || 0)}% completion</span>
            </CardContent>
          </Card>
          <Card className="premium-insight-card" tone="soft">
            <CardContent>
              <p>Needs support</p>
              <strong>{getDisplayText(weakestDay.label, "Tue")}</strong>
              <span>{Number(weakestDay.productivity || 0)}% completion</span>
            </CardContent>
          </Card>
          <Card className="premium-insight-card" tone="soft">
            <CardContent>
              <p>Life state</p>
              <strong>{getDisplayText(safeBehavioralInsights?.lifeState, "Stabilizing")}</strong>
              <span>{Number(safeBehavioralInsights?.burnoutRisk?.score || 0)}% burnout risk</span>
            </CardContent>
          </Card>
        </GridLayout>

        <Card className="analytics-chart-shell" tone="soft">
          <CardHeader>
            <CardTitle>Completion rhythm</CardTitle>
          </CardHeader>
          <CardContent className="analytics-chart-shell__content">
            <BarStrip data={chartData} />
          </CardContent>
        </Card>

        <Card className="analytics-chart-shell" tone="soft">
          <CardHeader>
            <CardTitle>Mood line</CardTitle>
          </CardHeader>
          <CardContent className="analytics-chart-shell__content">
            <Sparkline data={chartData} />
          </CardContent>
        </Card>

        <GridLayout className="premium-stat-grid premium-stat-grid--triple">
          <Card className="premium-stat-card" tone="soft">
            <CardContent>
              <p>Mood</p>
              <strong>{moodAverage}/5</strong>
            </CardContent>
          </Card>
          <Card className="premium-stat-card" tone="soft">
            <CardContent>
              <p>Streak</p>
              <strong>{Number(progress?.activeStreak || 0)}</strong>
            </CardContent>
          </Card>
          <Card className="premium-stat-card" tone="soft">
            <CardContent>
              <p>Recovery</p>
              <strong>{safeBehavioralInsights?.metrics?.avgSleep ? Number(safeBehavioralInsights.metrics.avgSleep).toFixed(1) : "-"}/5</strong>
            </CardContent>
          </Card>
        </GridLayout>
      </CardContent>
    </Card>
  );
}

export default memo(AnalyticsChart);
