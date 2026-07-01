/**
 * LoadingAnalytics
 *
 * Skeleton for the analytics / weekly-progress panel.
 * Mirrors the visual structure of AnalyticsChart + AnalyticsPanel:
 *   – eyebrow + heading
 *   – KPI stat chips in a 3-col grid
 *   – a tall chart placeholder
 *   – a 2-col mini-stat grid below the chart
 *
 * Props:
 *   showChart   {boolean}  Show the tall chart bar area (default true).
 *   chartHeight {string}   Tailwind height class for the chart (default "h-52").
 *   className   {string}
 */
import { cn } from "../../lib/cn.js";
import {
  SkeletonCard,
  SkeletonSectionHeader,
  SkeletonKpi,
  SkeletonBadge,
  Shimmer,
  SkeletonLine,
} from "./SkeletonBase.jsx";

/* ── Bar-chart shimmer ──────────────────────────────────────────── */

function BarChartSkeleton({ height = "h-52" }) {
  /* 7 bars of varying height simulate a week-of-data bar chart */
  const barHeights = ["h-3/5", "h-4/5", "h-2/5", "h-full", "h-3/4", "h-1/2", "h-2/3"];

  return (
    <div className={cn("relative w-full", height)} aria-hidden="true">
      {/* Y-axis grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-px w-full bg-[var(--ds-color-border-default)]" />
        ))}
      </div>

      {/* Bars */}
      <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-2 px-1">
        {barHeights.map((h, i) => (
          <Shimmer key={i} className={cn("flex-1 rounded-t-md", h)} />
        ))}
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

function LoadingAnalytics({ showChart = true, chartHeight = "h-52", className }) {
  return (
    <div
      role="status"
      aria-label="Loading analytics"
      aria-busy="true"
      className={cn("flex flex-col gap-5", className)}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <SkeletonKpi />
        <SkeletonKpi />
        <SkeletonKpi className="hidden sm:flex" />
      </div>

      {/* Main chart card */}
      <SkeletonCard className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <SkeletonSectionHeader />
          <SkeletonBadge />
        </div>

        {showChart && <BarChartSkeleton height={chartHeight} />}

        {/* X-axis day labels */}
        <div className="flex justify-between" aria-hidden="true">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <Shimmer key={`${d}-${i}`} className="h-3 w-5 rounded-full" />
          ))}
        </div>
      </SkeletonCard>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="flex flex-col gap-3">
            <SkeletonLine width="w-1/2" />
            <Shimmer className="h-5 w-20" />
            <SkeletonLine width="w-3/4" />
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

export default LoadingAnalytics;
