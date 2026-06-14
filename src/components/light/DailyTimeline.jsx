import { cn } from "../../lib/cn.js";
import {
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineSun,
  HiOutlineBriefcase,
  HiOutlineBookOpen,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineHome,
  HiOutlineMoon,
} from "react-icons/hi2";
import { motion as Motion } from "framer-motion";

const ICON_MAP = {
  morning: <HiOutlineSun className="w-3 h-3" />,
  work: <HiOutlineBriefcase className="w-3 h-3" />,
  study: <HiOutlineBookOpen className="w-3 h-3" />,
  break: <HiOutlinePause className="w-3 h-3" />,
  exercise: <HiOutlinePlay className="w-3 h-3" />,
  meal: <HiOutlineHome className="w-3 h-3" />,
  evening: <HiOutlineMoon className="w-3 h-3" />,
  sleep: <HiOutlineMoon className="w-3 h-3" />,
};

function getIcon(type) {
  return ICON_MAP[type] || <HiOutlineClock className="w-3 h-3" />;
}

export function TimelineItem({ time, title, description, type, status = "pending", isCurrent = false }) {
  const icon = getIcon(type);

  return (
    <Motion.div
      className={cn("lt-timeline__item")}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="lt-timeline__time">{time}</span>
      <div
        className={cn(
          "lt-timeline__marker",
          status === "completed" && "lt-timeline__marker--completed",
          isCurrent && "lt-timeline__marker--current"
        )}
      >
        {status === "completed" ? (
          <HiOutlineCheck className="w-3 h-3 text-white" />
        ) : isCurrent ? (
          <HiOutlineClock className="w-3 h-3 text-white" />
        ) : (
          icon
        )}
      </div>
      <div className="lt-timeline__content">
        <h4 className="lt-timeline__title">{title}</h4>
        {description && <p className="lt-timeline__description">{description}</p>}
      </div>
    </Motion.div>
  );
}

export default function DailyTimeline({
  items,
  title = "Daily Timeline",
  description = "Your structured day at a glance",
}) {
  const fallbackItems = [
    {
      time: "6:30 AM",
      title: "Morning Routine",
      description: "Wake up, hydrate, light stretching",
      type: "morning",
      status: "completed",
    },
    {
      time: "8:00 AM",
      title: "Deep Work Block",
      description: "Focus on your most important task",
      type: "work",
      status: "completed",
    },
    {
      time: "10:30 AM",
      title: "Break",
      description: "Short walk, hydrate",
      type: "break",
      status: "current",
      isCurrent: true,
    },
    {
      time: "11:00 AM",
      title: "Learning Session",
      description: "Study new skills or review notes",
      type: "study",
      status: "pending",
    },
    {
      time: "1:00 PM",
      title: "Lunch Break",
      description: "Healthy meal, disconnect from screens",
      type: "meal",
      status: "pending",
    },
    {
      time: "2:00 PM",
      title: "Afternoon Work",
      description: "Meetings, emails, collaborative tasks",
      type: "work",
      status: "pending",
    },
    {
      time: "5:00 PM",
      title: "Exercise",
      description: "Workout or physical activity",
      type: "exercise",
      status: "pending",
    },
    {
      time: "7:00 PM",
      title: "Evening Wind Down",
      description: "Dinner, relaxation, journaling",
      type: "evening",
      status: "pending",
    },
    {
      time: "10:00 PM",
      title: "Sleep",
      description: "7-8 hours of quality rest",
      type: "sleep",
      status: "pending",
    },
  ];

  const timelineItems = Array.isArray(items) && items.length > 0 ? items : fallbackItems;

  return (
    <div className="lt-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-lt-text-primary">{title}</h3>
        <p className="text-sm text-lt-text-tertiary mt-1">{description}</p>
      </div>

      <div className="lt-timeline">
        {timelineItems.map((item, index) => (
          <TimelineItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

