/**
 * LoadingDashboard
 *
 * Full-page skeleton that mirrors the top-level dashboard layout:
 * a sidebar column on the left, a hero grid, KPI chips, and a content
 * column on the right.  Designed to fill the viewport while the workspace
 * data and lazy tab components are loading.
 *
 * Props:
 *   showSidebar {boolean}  Render the sidebar stub (default true).
 *   className   {string}
 */
import { cn } from "../../lib/cn.js";
import {
  Shimmer,
  SkeletonCard,
  SkeletonKpi,
  SkeletonBadge,
  SkeletonLine,
  SkeletonSectionHeader,
} from "./SkeletonBase.jsx";

/* ── Small helpers ────────────────────────────────────────────────── */

function SidebarSkeleton() {
  return (
    <aside
      aria-hidden="true"
      className="hidden w-[88px] shrink-0 lg:block xl:w-[260px]"
    >
      <div className="ds-glass ds-card-base flex h-[calc(100vh-48px)] flex-col gap-5 rounded-[28px] p-4">
        {/* Logo row */}
        <div className="flex items-center gap-3 border-b border-[var(--ds-color-border-default)] pb-5">
          <Shimmer className="h-11 w-11 rounded-2xl shrink-0" />
          <Shimmer className="hidden h-4 w-32 xl:block" />
        </div>

        {/* Nav items */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-1">
              <Shimmer className="h-9 w-9 shrink-0 rounded-2xl" />
              <Shimmer className={cn("hidden h-3.5 rounded xl:block", i === 0 ? "w-20" : "w-16")} />
            </div>
          ))}
        </div>

        {/* Profile card stub */}
        <div className="hidden xl:block">
          <Shimmer className="h-20 w-full rounded-3xl" />
        </div>
      </div>
    </aside>
  );
}

function HeroGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
      {/* Primary hero card */}
      <SkeletonCard className="flex flex-col gap-4">
        <SkeletonSectionHeader />
        <div className="grid grid-cols-3 gap-3">
          <SkeletonKpi />
          <SkeletonKpi />
          <SkeletonKpi />
        </div>
      </SkeletonCard>

      {/* Secondary hero card */}
      <SkeletonCard className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <SkeletonSectionHeader />
          <SkeletonBadge />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {/* Tab bar */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Main panel */}
      <SkeletonCard className="flex flex-col gap-5">
        <SkeletonSectionHeader />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLine key={i} width={["w-full", "w-5/6", "w-4/5", "w-3/4"][i]} />
          ))}
        </div>
        <Shimmer className="h-40 w-full rounded-xl" />
      </SkeletonCard>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */

function LoadingDashboard({ showSidebar = true, className }) {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      aria-busy="true"
      className={cn(
        "flex min-h-screen gap-6 bg-[var(--ds-color-bg-app)] p-4 sm:p-6",
        className,
      )}
    >
      {showSidebar && <SidebarSkeleton />}

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        {/* Top header bar */}
        <div className="flex items-center justify-between gap-4" aria-hidden="true">
          <Shimmer className="h-9 w-40 rounded-xl" />
          <div className="flex items-center gap-3">
            <Shimmer className="h-9 w-28 rounded-xl" />
            <Shimmer className="h-9 w-9 rounded-xl" />
          </div>
        </div>

        <HeroGridSkeleton />
        <ContentSkeleton />
      </div>
    </div>
  );
}

export default LoadingDashboard;
