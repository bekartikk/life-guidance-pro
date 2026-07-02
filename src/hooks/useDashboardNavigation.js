import { useEffect, useState } from "react";

import { trackEvent } from "../utils/analytics";

export function useDashboardNavigation({ currentPlanId, resultPanelRef }) {
  const [activeTab, setActiveTab] = useState("planner");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event) => setIsCompactMobile(event.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (activeTab !== "planner" || !currentPlanId) return undefined;

    const timer = window.setTimeout(() => {
      resultPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 260);

    return () => window.clearTimeout(timer);
  }, [activeTab, currentPlanId, resultPanelRef]);

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
    setIsMobileNavOpen(false);
    trackEvent("dashboard_tab_viewed", { tab: nextTab });
  };

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileNavOpen,
    setIsMobileNavOpen,
    isCompactMobile,
  };
}