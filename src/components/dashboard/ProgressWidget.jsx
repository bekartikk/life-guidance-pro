import { memo, useMemo } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "../ui/index.js";
import { GridLayout, SectionHeader } from "../layout/index.js";

function getDisplayText(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return value.label || value.title || value.name || value.summary || fallback;
  }
  return fallback;
}

function ProgressWidget({ completion, progress, plans, goals, habits, behavioralInsights }) {
  const safeBehavioralInsights = behavioralInsights && typeof behavioralInsights === "object" ? behavioralInsights : {};
  const radius = 58;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const offset = useMemo(() => circumference - (completion / 100) * circumference, [circumference, completion]);
  const pendingGoals = useMemo(
    () => goals.filter((goal) => goal.status !== "completed").length,
    [goals],
  );
  const habitCount = habits.length;

  const stats = useMemo(
    () => [
      { label: "Plans", value: plans.length },
      { label: "Goals", value: pendingGoals },
      { label: "Habits", value: habitCount },
      { label: "Streak", value: progress.activeStreak },
    ],
    [plans.length, pendingGoals, habitCount, progress.activeStreak],
  );

  return (
    <Card className="saas-panel premium-progress-widget" tone="elevated">
      <CardHeader className="premium-widget-head">
        <SectionHeader
          title="Daily completion"
          description="Progress overview"
          actions={<Badge className="status-chip" tone="info">{getDisplayText(safeBehavioralInsights?.lifeState, "Stabilizing")}</Badge>}
        />
      </CardHeader>

      <CardContent className="grid gap-6">
        <Card className="premium-widget-hero" tone="soft">
          <CardContent className="premium-widget-hero-inner">
            <div className="premium-widget-ring">
              <div className="premium-widget-glow" />
              <svg className="-rotate-90 h-36 w-36" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="premium-widget-ring-copy">
                <p>{completion}%</p>
                <span>Ready</span>
              </div>
            </div>
            <div className="premium-widget-copy">
              <div>
                <p className="premium-widget-title">Momentum is live</p>
                <p>
                  You have {pendingGoals} active goals, {habitCount} habits in rotation, and a {Number(progress?.activeStreak || 0)}-day streak. {getDisplayText(safeBehavioralInsights?.burnoutRisk?.summary, "Burnout protection is adapting around your current signals.")}
                </p>
              </div>
              <GridLayout className="premium-widget-mini-grid">
                <Card className="premium-mini-card" tone="soft">
                  <CardContent>
                    <p>Burnout risk</p>
                    <strong>{Number(safeBehavioralInsights?.burnoutRisk?.score || 0)}%</strong>
                  </CardContent>
                </Card>
                <Card className="premium-mini-card" tone="soft">
                  <CardContent>
                    <p>Coach mode</p>
                    <strong>{getDisplayText(safeBehavioralInsights?.personalityMode?.active, "Balanced Strategist")}</strong>
                  </CardContent>
                </Card>
              </GridLayout>
            </div>
          </CardContent>
        </Card>

        <GridLayout className="premium-stat-grid">
          {stats.map((stat) => (
            <Card key={stat.label} className="premium-stat-card" tone="soft">
              <CardContent>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </CardContent>
            </Card>
          ))}
        </GridLayout>
      </CardContent>
    </Card>
  );
}

export default memo(ProgressWidget);
