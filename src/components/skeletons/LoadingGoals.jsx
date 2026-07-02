/**
 * LoadingGoals
 *
 * Skeleton for the Goal tab (GoalTab).
 * Mirrors the layout:
 *   – Section header
 *   – Add-a-goal form (title input + 2-col selects + target date + reason + milestones)
 *   – List of existing goal cards (active + completed groups)
 *
 * Props:
 *   goalCount  {number}  Number of goal list item stubs (default 3).
 *   className  {string}
 */
import { cn } from "../../lib/cn.js";
import {
  SkeletonCard,
  SkeletonSectionHeader,
  SkeletonInput,
  SkeletonTextarea,
  SkeletonButton,
  SkeletonBadge,
  Shimmer,
} from "./SkeletonBase.jsx";

/* ── Single goal card row ───────────────────────────────────────── */

function GoalCardSkeleton({ completed = false }) {
  return (
    <SkeletonCard className="flex flex-col gap-4">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <Shimmer className="h-4 w-3/5" />
          <Shimmer className="h-3 w-2/5" />
        </div>
        <SkeletonBadge className={completed ? "opacity-50" : ""} />
      </div>

      {/* Reason text */}
      <Shimmer className="h-3 w-4/5" />

      {/* Milestone chips */}
      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <Shimmer key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>

      {/* Action row */}
      <div className="flex gap-2">
        <Shimmer className="h-9 w-24 rounded-xl" />
        <Shimmer className="h-9 w-9 rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

function LoadingGoals({ goalCount = 3, className }) {
  return (
    <div
      role="status"
      aria-label="Loading goals"
      aria-busy="true"
      className={cn("flex flex-col gap-5", className)}
    >
      {/* Section header */}
      <SkeletonCard className="flex flex-col gap-4">
        <SkeletonSectionHeader />
      </SkeletonCard>

      {/* Add-goal form */}
      <SkeletonCard className="flex flex-col gap-4">
        <Shimmer className="h-4 w-32" /> {/* sub-heading */}

        <SkeletonInput />   {/* Goal title */}

        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonInput />   {/* Category */}
          <SkeletonInput />   {/* Target date */}
        </div>

        <SkeletonTextarea rows={2} />  {/* Reason */}
        <SkeletonTextarea rows={2} />  {/* Milestones */}

        <div className="flex justify-end" aria-hidden="true">
          <SkeletonButton wide />
        </div>
      </SkeletonCard>

      {/* Active goals heading */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <Shimmer className="h-3 w-24 rounded-full" />
        <SkeletonBadge />
      </div>

      {/* Active goal cards */}
      {Array.from({ length: goalCount }).map((_, i) => (
        <GoalCardSkeleton key={i} />
      ))}

      {/* Completed goals heading */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <Shimmer className="h-3 w-32 rounded-full" />
        <SkeletonBadge />
      </div>

      {/* One completed card stub */}
      <GoalCardSkeleton completed />
    </div>
  );
}

export default LoadingGoals;
