import { useState } from "react";
import { cn } from "../../lib/cn.js";
import {
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlinePlay,
  HiOutlineCheck,
  HiOutlineLightBulb,
  HiOutlineCalendar,
  HiOutlineFire,
} from "react-icons/hi2";
import { motion as Motion } from "framer-motion";

const STUDY_SESSIONS = [
  {
    id: 1,
    subject: "Web Development",
    topic: "React Hooks Deep Dive",
    duration: 45,
    completed: true,
    date: "Today",
  },
  {
    id: 2,
    subject: "Data Science",
    topic: "Machine Learning Basics",
    duration: 60,
    completed: false,
    date: "Today",
  },
  {
    id: 3,
    subject: "Design",
    topic: "UI/UX Principles",
    duration: 30,
    completed: false,
    date: "Tomorrow",
  },
];

const STUDY_STATS = {
  totalHours: 24,
  thisWeek: 8.5,
  streak: 5,
  subjects: 4,
};

export function StudySessionCard({ session }) {
  return (
    <Motion.div
      className={cn(
        "lt-card p-4 flex items-center gap-4",
        session.completed && "opacity-75"
      )}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        session.completed
          ? "bg-success-100 text-success-600"
          : "bg-lt-primary-subtle text-lt-primary"
      )}>
        {session.completed ? (
          <HiOutlineCheck className="w-6 h-6" />
        ) : (
          <HiOutlinePlay className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-lt-text-tertiary uppercase tracking-wide">
            {session.subject}
          </span>
          <span className="text-xs text-lt-border-default">•</span>
          <span className="text-xs text-lt-text-tertiary">{session.date}</span>
        </div>
        <h4 className="text-sm font-semibold text-lt-text-primary mt-1 truncate">
          {session.topic}
        </h4>
        <div className="flex items-center gap-1 mt-1 text-xs text-lt-text-tertiary">
          <HiOutlineClock className="w-3.5 h-3.5" />
          <span>{session.duration} minutes</span>
        </div>
      </div>
    </Motion.div>
  );
}

export function StudyStats() {
  const stats = [
    {
      label: "Total Hours",
      value: `${STUDY_STATS.totalHours}h`,
      icon: HiOutlineClock,
      color: "text-info-500",
      bgColor: "bg-info-100",
    },
    {
      label: "This Week",
      value: `${STUDY_STATS.thisWeek}h`,
      icon: HiOutlineCalendar,
      color: "text-success-500",
      bgColor: "bg-success-100",
    },
    {
      label: "Day Streak",
      value: `${STUDY_STATS.streak} days`,
      icon: HiOutlineFire,
      color: "text-warning-500",
      bgColor: "bg-warning-100",
    },
    {
      label: "Subjects",
      value: STUDY_STATS.subjects,
      icon: HiOutlineBookOpen,
      color: "text-primary-500",
      bgColor: "bg-primary-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Motion.div
            key={index}
            className="lt-card p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={cn("w-10 h-10 rounded-lg", stat.bgColor, "flex items-center justify-center mb-3")}>
              <Icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-2xl font-bold text-lt-text-primary">{stat.value}</p>
            <p className="text-xs text-lt-text-tertiary mt-1">{stat.label}</p>
          </Motion.div>
        );
      })}
    </div>
  );
}

export function StudyPlan() {
  const plans = [
    { day: "Monday", focus: "Deep Work", hours: 2, color: "primary" },
    { day: "Tuesday", focus: "Review", hours: 1, color: "success" },
    { day: "Wednesday", focus: "Deep Work", hours: 2, color: "primary" },
    { day: "Thursday", focus: "Practice", hours: 1.5, color: "info" },
    { day: "Friday", focus: "Review", hours: 1, color: "success" },
    { day: "Saturday", focus: "Project", hours: 3, color: "warning" },
    { day: "Sunday", focus: "Rest", hours: 0, color: "neutral" },
  ];

  const colorMap = {
    primary: "bg-primary-500",
    success: "bg-success-500",
    info: "bg-info-500",
    warning: "bg-warning-500",
    neutral: "bg-lt-border-subtle",
  };

  return (
    <div className="lt-card p-6">
      <h3 className="text-lg font-semibold text-lt-text-primary mb-4">Weekly Study Plan</h3>
      <div className="space-y-3">
        {plans.map((plan) => (
          <div key={plan.day} className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-lt-text-secondary">
              {plan.day}
            </span>
            <div className="flex-1 h-8 bg-lt-bg-surface rounded-lg overflow-hidden">
              <div
                className={cn("h-full rounded-lg transition-all duration-500", colorMap[plan.color])}
                style={{ width: `${(plan.hours / 3) * 100}%` }}
              />
            </div>
            <span className="w-16 text-sm text-lt-text-tertiary text-right">
              {plan.hours}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudyCenter() {
  const [activeTab, setActiveTab] = useState("sessions");

  const tabs = [
    { id: "sessions", label: "Sessions", icon: HiOutlinePlay },
    { id: "plan", label: "Plan", icon: HiOutlineCalendar },
    { id: "stats", label: "Statistics", icon: HiOutlineChartBar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-lt-text-primary">Study Center</h2>
        <p className="text-sm text-lt-text-tertiary mt-1">
          Track your learning progress and stay consistent
        </p>
      </div>

      {/* Stats */}
      <StudyStats />

      {/* Tabs */}
      <div className="lt-workspace-selector">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={cn(
                "lt-workspace-option",
                activeTab === tab.id && "lt-workspace-option--active"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "sessions" && (
        <div className="space-y-3">
          {STUDY_SESSIONS.map((session) => (
            <StudySessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {activeTab === "plan" && <StudyPlan />}

      {activeTab === "stats" && (
        <div className="lt-card p-6">
          <h3 className="text-lg font-semibold text-lt-text-primary mb-4">
            Learning Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-lt-primary-subtle flex items-center justify-center flex-shrink-0">
                <HiOutlineLightBulb className="w-4 h-4 text-lt-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-lt-text-primary">
                  Best Focus Time
                </p>
                <p className="text-sm text-lt-text-secondary">
                  You're most focused between 9 AM - 11 AM. Schedule challenging topics during this window.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center flex-shrink-0">
                <HiOutlineChartBar className="w-4 h-4 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-lt-text-primary">
                  Weekly Progress
                </p>
                <p className="text-sm text-lt-text-secondary">
                  You've increased study time by 25% compared to last week. Keep the momentum!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}