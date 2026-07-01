import { useState } from "react";
import { cn } from "../../lib/cn.js";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineMinus,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineLightBulb,
} from "react-icons/hi2";
import { motion as Motion } from "framer-motion";

const TIME_RANGES = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
];

const PRODUCTIVITY_DATA = [
  { day: "Mon", value: 75 },
  { day: "Tue", value: 85 },
  { day: "Wed", value: 65 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 80 },
  { day: "Sat", value: 45 },
  { day: "Sun", value: 35 },
];

const MOOD_DATA = [
  { day: "Mon", value: 7, label: "Good" },
  { day: "Tue", value: 8, label: "Great" },
  { day: "Wed", value: 5, label: "Neutral" },
  { day: "Thu", value: 8, label: "Great" },
  { day: "Fri", value: 7, label: "Good" },
  { day: "Sat", value: 9, label: "Excellent" },
  { day: "Sun", value: 6, label: "Okay" },
];

const INSIGHTS = [
  {
    type: "productivity",
    title: "Peak Performance",
    description: "Your most productive hours are 9-11 AM",
    trend: "positive",
  },
  {
    type: "recovery",
    title: "Recovery Pattern",
    description: "Weekend recovery is improving by 15%",
    trend: "positive",
  },
  {
    type: "warning",
    title: "Energy Dip",
    description: "Afternoon energy drops consistently at 3 PM",
    trend: "neutral",
  },
];

export function MetricCard({ title, value, delta, deltaType, icon: Icon, subtitle }) {
  const getTrendIcon = () => {
    if (deltaType === "positive") return <HiOutlineArrowTrendingUp className="w-4 h-4" />;
    if (deltaType === "negative") return <HiOutlineArrowTrendingDown className="w-4 h-4" />;
    return <HiOutlineMinus className="w-4 h-4" />;
  };

  return (
    <Motion.div
      className="lt-card p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-lt-primary-subtle flex items-center justify-center">
          {Icon && <Icon className="w-5 h-5 text-lt-primary" />}
        </div>
        {delta !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              deltaType === "positive"
                ? "text-success-600"
                : deltaType === "negative"
                ? "text-error-600"
                : "text-lt-text-tertiary"
            )}
          >
            {getTrendIcon()}
            <span>{delta}</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-lt-text-primary">{value}</h3>
      <p className="text-sm text-lt-text-secondary mt-1">{title}</p>
      {subtitle && <p className="text-xs text-lt-text-tertiary mt-1">{subtitle}</p>}
    </Motion.div>
  );
}

export function ChartBar({ value, max, label, color = "primary" }) {
  const height = (value / max) * 100;
  const colorClasses = {
    primary: "bg-lt-primary",
    success: "bg-success-500",
    warning: "bg-warning-500",
    info: "bg-info-500",
  };

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-full h-24 bg-lt-bg-surface rounded-lg relative overflow-hidden">
        <Motion.div
          className={cn("absolute bottom-0 w-full rounded-lg", colorClasses[color])}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>
      <span className="text-xs text-lt-text-tertiary font-medium">{label}</span>
    </div>
  );
}

export function MoodStrip({ data }) {
  return (
    <div className="lt-card p-5">
      <h3 className="text-base font-semibold text-lt-text-primary mb-4">Mood Trends</h3>
      <div className="flex items-end gap-2 h-24">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <Motion.div
              className={cn(
                "w-full rounded-t-lg",
                item.value >= 8
                  ? "bg-success-400"
                  : item.value >= 6
                  ? "bg-info-400"
                  : item.value >= 4
                  ? "bg-warning-400"
                  : "bg-error-400"
              )}
              style={{ height: `${(item.value / 10) * 100}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / 10) * 100}%` }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            />
            <span className="text-xs text-lt-text-tertiary">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightsPanel({ insights }) {
  const getInsightStyles = (type) => {
    switch (type) {
      case "productivity":
        return { bg: "bg-lt-ai-focus-bg", border: "border-lt-ai-focus/20", text: "text-lt-ai-focus" };
      case "recovery":
        return { bg: "bg-lt-ai-recovery-bg", border: "border-lt-ai-recovery/20", text: "text-lt-ai-recovery" };
      case "warning":
        return { bg: "bg-warning-50", border: "border-warning-200", text: "text-warning-600" };
      default:
        return { bg: "bg-lt-bg-surface", border: "border-lt-border-subtle", text: "text-lt-text-primary" };
    }
  };

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => {
        const styles = getInsightStyles(insight.type);
        return (
          <Motion.div
            key={index}
            className={cn("p-4 rounded-xl border", styles.bg, styles.border)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", styles.bg)}>
                {insight.type === "productivity" && <HiOutlineLightBulb className={cn("w-4 h-4", styles.text)} />}
                {insight.type === "recovery" && <HiOutlineHeart className={cn("w-4 h-4", styles.text)} />}
                {insight.type === "warning" && <HiOutlineTrendingDown className={cn("w-4 h-4", styles.text)} />}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-lt-text-primary">{insight.title}</h4>
                <p className="text-sm text-lt-text-secondary mt-1">{insight.description}</p>
              </div>
            </div>
          </Motion.div>
        );
      })}
    </div>
  );
}

export default function AnalyticsV2() {
  const [selectedRange, setSelectedRange] = useState("7d");

  const metrics = [
    {
      title: "Productivity Score",
      value: "78",
      delta: "+12%",
      deltaType: "positive",
      icon: HiOutlineArrowTrendingUp,
      subtitle: "Above your monthly average",
    },
    {
      title: "Focus Hours",
      value: "32h",
      delta: "+4h",
      deltaType: "positive",
      icon: HiOutlineClock,
      subtitle: "This week",
    },
    {
      title: "Mood Average",
      value: "7.2",
      delta: "+0.5",
      deltaType: "positive",
      icon: HiOutlineHeart,
      subtitle: "Out of 10",
    },
    {
      title: "Recovery Score",
      value: "85",
      delta: "+8%",
      deltaType: "positive",
      icon: HiOutlineLightBulb,
      subtitle: "Well-rested",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-lt-text-primary">Analytics</h2>
          <p className="text-sm text-lt-text-tertiary mt-1">
            Track your progress and patterns
          </p>
        </div>
        <div className="lt-workspace-selector">
          {TIME_RANGES.map((range) => (
            <button
              key={range.id}
              className={cn(
                "lt-workspace-option",
                selectedRange === range.id && "lt-workspace-option--active"
              )}
              onClick={() => setSelectedRange(range.id)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <div className="lt-card p-5">
          <h3 className="text-base font-semibold text-lt-text-primary mb-4">
            Productivity Trend
          </h3>
          <div className="flex items-end gap-3 h-32">
            {PRODUCTIVITY_DATA.map((item, index) => (
              <ChartBar
                key={index}
                value={item.value}
                max={100}
                label={item.day}
                color="primary"
              />
            ))}
          </div>
        </div>

        {/* Mood Strip */}
        <MoodStrip data={MOOD_DATA} />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="lt-card p-5">
            <h3 className="text-base font-semibold text-lt-text-primary mb-4">
              Weekly Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-lt-bg-surface rounded-lg">
                <span className="text-sm text-lt-text-secondary">Completed Tasks</span>
                <span className="text-sm font-semibold text-lt-text-primary">24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-lt-bg-surface rounded-lg">
                <span className="text-sm text-lt-text-secondary">Average Sleep</span>
                <span className="text-sm font-semibold text-lt-text-primary">7.2h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-lt-bg-surface rounded-lg">
                <span className="text-sm text-lt-text-secondary">Check-ins</span>
                <span className="text-sm font-semibold text-lt-text-primary">6/7</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-lt-bg-surface rounded-lg">
                <span className="text-sm text-lt-text-secondary">Streak Days</span>
                <span className="text-sm font-semibold text-lt-text-primary">5</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-lt-text-primary mb-4">
            AI Insights
          </h3>
          <InsightsPanel insights={INSIGHTS} />
        </div>
      </div>
    </div>
  );
}
