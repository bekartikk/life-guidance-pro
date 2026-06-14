import { cn } from "../../lib/cn.js";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineFire,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
} from "react-icons/hi2";
import { motion as Motion } from "framer-motion";

export function KPICard({ label, value, delta, deltaType, icon: Icon, className }) {
  return (
    <Motion.div
      className={cn("lt-kpi-card", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="lt-kpi-card__label">{label}</p>
          <p className="lt-kpi-card__value">{value}</p>
          {delta !== undefined && (
            <div className={cn(
              "lt-kpi-card__delta",
              deltaType === "positive" ? "lt-kpi-card__delta--positive" : "lt-kpi-card__delta--negative"
            )}>
              {deltaType === "positive" ? (
                <HiOutlineArrowTrendingUp className="w-3.5 h-3.5" />
              ) : (
                <HiOutlineArrowTrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{delta}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-lt-primary-subtle flex items-center justify-center">
            <Icon className="w-5 h-5 text-lt-primary" />
          </div>
        )}
      </div>
    </Motion.div>
  );
}

export function KPIGrid({ children, className }) {
  return (
    <div className={cn("lt-kpi-grid", className)}>
      {children}
    </div>
  );
}

export default function KPICards({ stats = {} }) {
  const defaultStats = [
    {
      label: "Momentum Points",
      value: stats.momentumPoints ?? 0,
      delta: stats.momentumDeltaText,
      deltaType: stats.momentumDeltaType || "positive",
      icon: HiOutlineFire,
    },
    {
      label: "Day Streak",
      value: `${stats.activeStreak ?? 0} days`,
      delta: stats.streakDeltaText,
      deltaType: stats.streakDeltaType || "positive",
      icon: HiOutlineClipboardDocumentCheck,
    },
    {
      label: "Tasks Completed",
      value: stats.tasksCompleted ?? 0,
      delta: stats.tasksDeltaText,
      deltaType: stats.tasksDeltaType || "positive",
      icon: HiOutlineArrowTrendingUp,
    },
    {
      label: "Focus Time",
      value: `${stats.focusHours ?? 0}h`,
      delta: stats.focusDeltaText,
      deltaType: stats.focusDeltaType || null,
      icon: HiOutlineClock,
    },
  ];

  return (
    <KPIGrid>
      {defaultStats.map((stat, index) => (
        <KPICard key={index} {...stat} />
      ))}
    </KPIGrid>
  );
}

