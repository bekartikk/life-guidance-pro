import { motion } from "framer-motion";

const MotionSection = motion.section;

function ProgressWidget({ completion, progress, plans, goals, habits }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;
  const pendingGoals = goals.filter((goal) => goal.status !== "completed").length;
  const habitCount = habits.length;

  const stats = [
    { label: "Plans", value: plans.length },
    { label: "Goals", value: pendingGoals },
    { label: "Habits", value: habitCount },
    { label: "Streak", value: progress.activeStreak },
  ];

  return (
    <MotionSection
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      className="saas-panel p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Progress overview</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-100">Daily completion</h3>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          {progress.momentumPoints} pts
        </span>
      </div>

      <div className="mb-6 rounded-[28px] border border-white/8 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5">
        <div className="flex items-center gap-5">
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(96,165,250,0.18),transparent_58%)]" />
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
            <div className="absolute text-center">
              <p className="text-3xl font-semibold text-slate-50">{completion}%</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Ready</p>
            </div>
          </div>
          <div className="min-w-0 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">Momentum is live</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                You have {pendingGoals} active goals, {habitCount} habits in rotation, and a {progress.activeStreak}-day streak.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-slate-950/25 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Best week</p>
                <p className="mt-2 text-lg font-semibold text-slate-50">{progress.bestWeekCompletion || 0}%</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/25 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Comebacks</p>
                <p className="mt-2 text-lg font-semibold text-slate-50">{progress.comebackWins}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>
    </MotionSection>
  );
}

export default ProgressWidget;
