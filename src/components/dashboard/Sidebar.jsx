import { motion } from "framer-motion";
import {
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineFlag,
  HiOutlineQueueList,
  HiOutlineSparkles,
  HiOutlineBars3BottomLeft,
  HiOutlineBolt,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const ITEM_META = {
  dashboard: { label: "Dashboard", icon: HiOutlineChartBarSquare },
  planner: { label: "Planner", icon: HiOutlineClipboardDocumentList },
  goals: { label: "Goals", icon: HiOutlineFlag },
  habits: { label: "Habits", icon: HiOutlineQueueList },
  analytics: { label: "Analytics", icon: HiOutlineSparkles },
};

const MotionAside = motion.aside;

function Sidebar({ items, activeItem, isCollapsed, onToggle, onSelect }) {
  return (
    <MotionAside
      animate={{ width: isCollapsed ? 92 : 280 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className="saas-panel sticky top-6 hidden h-[calc(100vh-48px)] shrink-0 overflow-hidden p-4 lg:flex lg:flex-col"
    >
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/8 pb-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_14px_28px_rgba(99,102,241,0.35)]">
            <HiOutlineSparkles className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-slate-50">Life Guidance Pro</p>
              <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-500">Planning OS</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          <HiOutlineBars3BottomLeft className="h-5 w-5" />
        </button>
      </div>

      {!isCollapsed && (
        <div className="mb-5 rounded-3xl border border-white/8 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Today&apos;s posture</p>
          <div className="mt-3 flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <HiOutlineBolt className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100">One clear next step</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">Stay with the current plan, protect one task, and let the dashboard do less at once.</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-2" aria-label="Primary navigation">
        {!isCollapsed ? (
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace</p>
        ) : null}
        {items.map((item) => {
          const meta = ITEM_META[item] || ITEM_META.dashboard;
          const Icon = meta.icon;
          const isActive = item === activeItem;

          return (
            <motion.button
              key={item}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onSelect(item)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-[0_18px_36px_rgba(79,70,229,0.35)]"
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
            </motion.button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-800/70 p-4 text-sm text-slate-300 shadow-[0_20px_40px_rgba(2,6,23,0.35)]">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-200/80">Focus mode</p>
          <p className="font-semibold text-slate-50">Reduce the noise.</p>
          <p className="mt-2 leading-6 text-slate-400">
            Keep one clear next step visible and let the rest fade into the background.
          </p>
        </div>
      )}
    </MotionAside>
  );
}

export default Sidebar;
