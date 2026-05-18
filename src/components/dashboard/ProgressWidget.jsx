import { memo, useMemo } from "react";
import { motion } from "framer-motion";

const MotionSection = motion.section;

function ProgressWidget({ completion, progress, plans, goals, habits, behavioralInsights }) {
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
    <MotionSection
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      className="saas-panel premium-progress-widget"
    >
      <div className="premium-widget-head">
        <div>
          <p>Progress overview</p>
          <h3>Daily completion</h3>
        </div>
        <span className="status-chip">
          {behavioralInsights.lifeState.label}
        </span>
      </div>

      <div className="premium-widget-hero">
        <div className="premium-widget-hero-inner">
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
                You have {pendingGoals} active goals, {habitCount} habits in rotation, and a {progress.activeStreak}-day streak. {behavioralInsights.burnoutRisk.summary}
              </p>
            </div>
            <div className="premium-widget-mini-grid">
              <div className="premium-mini-card">
                <p>Burnout risk</p>
                <strong>{behavioralInsights.burnoutRisk.score}%</strong>
              </div>
              <div className="premium-mini-card">
                <p>Coach mode</p>
                <strong>{behavioralInsights.personalityMode.active}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="premium-stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="premium-stat-card">
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </MotionSection>
  );
}

export default memo(ProgressWidget);
