import { useState } from "react";
import { cn } from "../../lib/cn.js";
import {
  HiOutlineBars3 as HiOutlineMenu,
  HiOutlineMagnifyingGlass as HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import AIRail from "./AIRail.jsx";

const WORKSPACE_MODES = [
  { id: "student", label: "Student" },
  { id: "employee", label: "Employee" },
  { id: "freelancer", label: "Freelancer" },
  { id: "entrepreneur", label: "Entrepreneur" },
];

export default function DashboardShell({
  activeTab,
  onTabChange,
  headerTitle = "Good morning",
  headerSubtitle = "Let's make today productive",
  sidebarCollapsed: sidebarCollapsedProp,
  onSidebarToggle,
  searchOpen: searchOpenProp,
  onSearchOpenChange,
  activeWorkspace: activeWorkspaceProp,
  onWorkspaceChange,
  aiInsights,
  children,
}) {
  const [sidebarCollapsedInternal, setSidebarCollapsedInternal] = useState(false);
  const sidebarCollapsed = sidebarCollapsedProp ?? sidebarCollapsedInternal;

  const [searchOpenInternal, setSearchOpenInternal] = useState(false);
  const searchOpen = searchOpenProp ?? searchOpenInternal;

  const [activeWorkspaceInternal, setActiveWorkspaceInternal] = useState("student");
  const activeWorkspace = activeWorkspaceProp ?? activeWorkspaceInternal;

  const toggleSidebar = () => {
    if (onSidebarToggle) onSidebarToggle();
    else setSidebarCollapsedInternal((v) => !v);
  };

  const setSearch = (next) => {
    if (onSearchOpenChange) onSearchOpenChange(next);
    else setSearchOpenInternal(next);
  };

  const changeWorkspace = (id) => {
    if (onWorkspaceChange) onWorkspaceChange(id);
    else setActiveWorkspaceInternal(id);
  };

  return (
    <div className="lt-app lt-dashboard-shell">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} collapsed={sidebarCollapsed} />

      <main className="lt-main-column">
        <header className="lt-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-lt-bg-surface rounded-lg transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <HiOutlineMenu className="w-5 h-5 text-lt-text-secondary" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-lt-text-primary">{headerTitle}</h1>
              <p className="text-sm text-lt-text-tertiary">{headerSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                searchOpen ? "w-64" : "w-10"
              )}
            >
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="lt-input py-2"
                  autoFocus
                  onBlur={() => setSearch(false)}
                />
              )}
              <button
                className="p-2 hover:bg-lt-bg-surface rounded-lg transition-colors"
                onClick={() => setSearch(!searchOpen)}
                aria-label="Toggle search"
              >
                <HiOutlineSearch className="w-5 h-5 text-lt-text-secondary" />
              </button>
            </div>

            <button
              className="p-2 hover:bg-lt-bg-surface rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <HiOutlineBell className="w-5 h-5 text-lt-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-info-500" />
              <HiOutlineChevronDown className="w-4 h-4 text-lt-text-secondary" />
            </div>
          </div>
        </header>

        <div className="lt-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-lt-text-primary">Workspace Mode</p>
              <p className="text-xs text-lt-text-tertiary mt-0.5">Select your current focus mode</p>
            </div>
            <div className="lt-workspace-selector">
              {WORKSPACE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  className={cn(
                    "lt-workspace-option",
                    activeWorkspace === mode.id && "lt-workspace-option--active"
                  )}
                  onClick={() => changeWorkspace(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </Motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AIRail insights={aiInsights} />
    </div>
  );
}


