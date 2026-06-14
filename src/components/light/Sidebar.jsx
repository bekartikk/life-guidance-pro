import { cn } from "../../lib/cn.js";
import { motion as Motion } from "framer-motion";
import {
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCog6Tooth,
  HiOutlineFire,
  HiOutlineHome,
  HiOutlineLightBulb,
  HiOutlineNewspaper,
  HiOutlinePencil,
  HiOutlinePlayCircle,
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineUser,
} from "react-icons/hi2";

const workspaceItems = [
  { id: "planner", label: "Planner", icon: HiOutlineClipboardDocumentCheck },
  { id: "daily", label: "Daily", icon: HiOutlineCalendarDays },
  { id: "focus", label: "Focus", icon: HiOutlinePlayCircle },
];

const growthItems = [
  { id: "analytics", label: "Analytics", icon: HiOutlineChartBar },
  { id: "achievements", label: "Achievements", icon: HiOutlineTrophy },
  { id: "insights", label: "Insights", icon: HiOutlineLightBulb },
  { id: "ai-coach", label: "AI Coach", icon: HiOutlineSparkles },
];

const memoryItems = [
  { id: "history", label: "History", icon: HiOutlineNewspaper },
  { id: "notes", label: "Notes", icon: HiOutlinePencil },
  { id: "journal", label: "Journal", icon: HiOutlineFire },
];

const bottomItems = [
  { id: "profile", label: "Profile", icon: HiOutlineUser },
  { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
];

export default function Sidebar({ activeTab, onTabChange, collapsed = false }) {
  const renderGroup = (label, items) => (
    <div className="lt-sidebar__group">
      {!collapsed && (
        <span className="lt-sidebar__group-label">{label}</span>
      )}
      <nav className="lt-sidebar__nav">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Motion.button
              key={item.id}
              className={cn(
                "lt-sidebar__item",
                isActive && "lt-sidebar__item--active"
              )}
              onClick={() => onTabChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="lt-sidebar__item-icon" />
              {!collapsed && <span>{item.label}</span>}
            </Motion.button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className={cn("lt-sidebar", collapsed && "lt-sidebar--collapsed")}>
      <div className="lt-sidebar__brand">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center">
          <HiOutlineSparkles className="text-white w-5 h-5" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm text-lt-text-primary">
            Life Guidance
          </span>
        )}
      </div>

      {renderGroup("Workspace", workspaceItems)}
      {renderGroup("Growth", growthItems)}
      {renderGroup("Memory", memoryItems)}

      <div className="mt-auto pt-4 border-t border-lt-border-subtle">
        {renderGroup("", bottomItems)}
      </div>
    </aside>
  );
}