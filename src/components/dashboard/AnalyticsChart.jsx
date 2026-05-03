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
import { motion } from "framer-motion";

const MotionSection = motion.section;

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

function AnalyticsChart({ checkins, progress }) {
  const chartData = checkins.length
    ? checkins.slice(0, 7).reverse().map(normalizeDay)
    : buildFallbackData();

  const strongestDay = [...chartData].sort((left, right) => right.productivity - left.productivity)[0];
  const average = Math.round(chartData.reduce((sum, item) => sum + item.productivity, 0) / chartData.length);
  const weakestDay = [...chartData].sort((left, right) => left.productivity - right.productivity)[0];
  const moodAverage = (chartData.reduce((sum, item) => sum + item.mood, 0) / chartData.length).toFixed(1);

  return (
    <MotionSection
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 }}
      className="saas-panel p-6"
    >
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Weekly insights</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-100">Productivity pulse</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Average completion is {average}%. Your strongest recent day was {strongestDay.label.toLowerCase()}.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[22px] border border-white/8 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Peak day</p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{strongestDay.label}</p>
            <p className="mt-1 text-sm text-slate-400">{strongestDay.productivity}% completion</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Needs support</p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{weakestDay.label}</p>
            <p className="mt-1 text-sm text-slate-400">{weakestDay.productivity}% completion</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mood trend</p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{moodAverage}/5</p>
            <p className="mt-1 text-sm text-slate-400">Average check-in mood</p>
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
                  <Cell key={entry.label} fill={BAR_COLORS[index % BAR_COLORS.length]} />
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

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Streak</p>
            <p className="mt-2 text-xl font-semibold text-slate-100">{progress.activeStreak}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Best week</p>
            <p className="mt-2 text-xl font-semibold text-slate-100">{progress.bestWeekCompletion || 0}%</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Wins</p>
            <p className="mt-2 text-xl font-semibold text-slate-100">{progress.comebackWins}</p>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

export default AnalyticsChart;
