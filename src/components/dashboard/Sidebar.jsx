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
  dashboard: { label: "Home", icon: HiOutlineChartBarSquare },
  planner: { label: "Plan", icon: HiOutlineClipboardDocumentList },
  goals: { label: "Goals", icon: HiOutlineFlag },
  habits: { label: "Habits", icon: HiOutlineQueueList },
  daily: { label: "Check-In", icon: HiOutlineChartBarSquare },
  weekly: { label: "Analytics", icon: HiOutlineChartBarSquare },
  review: { label: "Journal", icon: HiOutlineSparkles },
  monthly: { label: "Monthly", icon: HiOutlineArchiveBox },
  routine: { label: "Study Center", icon: HiOutlineCalendarDays },
  career: { label: "Career", icon: HiOutlineLightBulb },
  income: { label: "Resources", icon: HiOutlineRocketLaunch },
  insights: { label: "Insights", icon: HiOutlineSparkles },
  chat: { label: "AI Coach", icon: HiOutlineChatBubbleLeftRight },
  achievements: { label: "Focus Timer", icon: HiOutlineTrophy },
  missions: { label: "Tasks", icon: HiOutlineBolt },
  history: { label: "History", icon: HiOutlineClipboardDocumentList },
  feedback: { label: "Feedback", icon: HiOutlineChatBubbleLeftRight },
  reminders: { label: "Reminders", icon: HiOutlineCalendarDays },
  support: { label: "Support", icon: HiOutlineHeart },
  system: { label: "System", icon: HiOutlineArchiveBox },
  admin: { label: "Admin", icon: HiOutlineChartBarSquare },
  settings: { label: "Settings", icon: HiOutlineCog6Tooth },
};

function Sidebar({ items, activeItem, isCollapsed, onToggle, onSelect, userEmail = "" }) {
  return (
    <aside
      className="sidebar-shell sticky top-6 hidden h-[calc(100vh-48px)] shrink-0 overflow-hidden lg:block"
      style={{ width: isCollapsed ? 92 : 280 }}
    >
      <SidebarShell className="h-full rounded-[28px] p-4">
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-blue-100 pb-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-sky-400 to-violet-500 text-white shadow-[var(--ds-shadow-glow)]">
              <HiOutlineSparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-slate-950">Life Guidance Pro</p>
                <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-500">AI Coach</p>
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
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <HiOutlineBolt className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">One clear next step</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Stay with the current plan, protect one task, and let the dashboard do less at once.</p>
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
                        ? "bg-gradient-to-r from-blue-500 via-sky-400 to-violet-500 text-white shadow-[var(--ds-shadow-glow)]"
                        : "border border-blue-100 bg-white/70 text-slate-600 hover:bg-blue-50"
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
          <Card className="mt-6 rounded-[24px] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-violet-50 p-4 text-sm text-slate-600 shadow-[0_20px_40px_rgba(37,99,235,0.12)]">
            <CardContent className="gap-2">
              <Badge className="w-fit border-blue-200 bg-blue-100 text-blue-700">Profile</Badge>
              <p className="font-semibold text-slate-950">{userEmail || "Your workspace"}</p>
              <p className="leading-6 text-slate-500">
                Personal coaching, progress, memory, and planning stay connected here.
              </p>
            </CardContent>
          </Card>
        )}
      </SidebarShell>
    </aside>
  );
}

export default Sidebar;
