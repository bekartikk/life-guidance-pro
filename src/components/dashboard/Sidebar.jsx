import {
  HiOutlineArchiveBox,
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineFlag,
  HiOutlineQueueList,
  HiOutlineSparkles,
  HiOutlineBars3BottomLeft,
  HiOutlineBolt,
  HiOutlineChevronRight,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCog6Tooth,
  HiOutlineHeart,
  HiOutlineLightBulb,
  HiOutlineRocketLaunch,
  HiOutlineTrophy,
} from "react-icons/hi2";
import { Badge, Button, Card, CardContent } from "../ui/index.js";
import { Sidebar as SidebarShell } from "../layout/index.js";

const ITEM_META = {
  dashboard: { label: "Dashboard", icon: HiOutlineChartBarSquare },
  planner: { label: "Planner", icon: HiOutlineClipboardDocumentList },
  goals: { label: "Goals", icon: HiOutlineFlag },
  habits: { label: "Habits", icon: HiOutlineQueueList },
  daily: { label: "Progress", icon: HiOutlineChartBarSquare },
  weekly: { label: "Weekly", icon: HiOutlineChartBarSquare },
  review: { label: "Review", icon: HiOutlineSparkles },
  monthly: { label: "Monthly", icon: HiOutlineArchiveBox },
  routine: { label: "Routines", icon: HiOutlineCalendarDays },
  career: { label: "Career", icon: HiOutlineLightBulb },
  income: { label: "Income", icon: HiOutlineRocketLaunch },
  insights: { label: "Insights", icon: HiOutlineSparkles },
  chat: { label: "AI Coach", icon: HiOutlineChatBubbleLeftRight },
  achievements: { label: "Achievements", icon: HiOutlineTrophy },
  missions: { label: "Missions", icon: HiOutlineBolt },
  history: { label: "History", icon: HiOutlineClipboardDocumentList },
  feedback: { label: "Feedback", icon: HiOutlineChatBubbleLeftRight },
  reminders: { label: "Reminders", icon: HiOutlineCalendarDays },
  support: { label: "Support", icon: HiOutlineHeart },
  system: { label: "System", icon: HiOutlineArchiveBox },
  admin: { label: "Admin", icon: HiOutlineChartBarSquare },
  settings: { label: "Settings", icon: HiOutlineCog6Tooth },
};

function Sidebar({ items, activeItem, isCollapsed, onToggle, onSelect }) {
  return (
    <aside
      className="sidebar-shell sticky top-6 hidden h-[calc(100vh-48px)] shrink-0 overflow-hidden lg:block"
      style={{ width: isCollapsed ? 92 : 280 }}
    >
      <SidebarShell className="h-full rounded-[28px] p-4">
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/8 pb-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-slate-950 shadow-[var(--ds-shadow-glow)]">
              <HiOutlineSparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-slate-50">Life Guidance Pro</p>
                <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-500">Planning OS</p>
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={onToggle}
            variant="secondary"
            size="icon"
            className="rounded-2xl"
            aria-label="Toggle sidebar"
          >
            <HiOutlineBars3BottomLeft className="h-5 w-5" />
          </Button>
        </div>
      

        {!isCollapsed && (
          <Card tone="soft" className="mb-5 rounded-[24px] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <CardContent className="gap-3">
              <Badge className="w-fit">Today&apos;s posture</Badge>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <HiOutlineBolt className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100">One clear next step</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">Stay with the current plan, protect one task, and let the dashboard do less at once.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <nav className="ds-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto" aria-label="Primary navigation">
          {items.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              {!isCollapsed ? (
                <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{group.label}</p>
              ) : null}
              {group.items.map((item) => {
                const meta = ITEM_META[item] || ITEM_META.dashboard;
                const Icon = meta.icon;
                const isActive = item === activeItem;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSelect(item)}
                    aria-label={meta.label}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500 text-slate-950 shadow-[var(--ds-shadow-glow)]"
                        : "border border-white/5 bg-white/0 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium">{meta.label}</span>
                        <HiOutlineChevronRight
                          className={`ml-auto h-4 w-4 transition ${
                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                          }`}
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {!isCollapsed && (
          <Card className="mt-6 rounded-[24px] bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-800/70 p-4 text-sm text-slate-300 shadow-[0_20px_40px_rgba(2,6,23,0.35)]">
            <CardContent className="gap-2">
              <Badge className="w-fit border-blue-200/20 bg-blue-200/10 text-blue-200/90">Focus mode</Badge>
              <p className="font-semibold text-slate-50">Reduce the noise.</p>
              <p className="leading-6 text-slate-400">
                Keep one clear next step visible and let the rest fade into the background.
              </p>
            </CardContent>
          </Card>
        )}
      </SidebarShell>
    </aside>
  );
}

export default Sidebar;
