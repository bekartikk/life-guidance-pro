/**
 * LoadingHabits
 *
 * Skeleton for the Habit tab (HabitTab).
 * Mirrors the layout:
 *   – Section header
 *   – Add-a-habit form (title, difficulty select, anchor, standard & minimum versions)
 *   – Active habit cards with toggle buttons and difficulty badges
 *
 * Props:
 *   habitCount {number}  Number of habit list item stubs (default 4).
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

/* ── Single habit row card ──────────────────────────────────────── */

function HabitCardSkeleton() {
  return (
    <SkeletonCard className="flex items-start gap-4">
      {/* Check toggle */}
      <Shimmer className="mt-1 h-6 w-6 shrink-0 rounded-md" />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Title + badge */}
        <div className="flex items-center justify-between gap-3">
          <Shimmer className="h-4 w-2/5" />
          <SkeletonBadge />
        </div>

        {/* Anchor text */}
        <Shimmer className="h-3 w-3/5" />

        {/* Standard / minimum labels */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Shimmer className="h-2.5 w-16" />
            <Shimmer className="h-3 w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <Shimmer className="h-2.5 w-16" />
            <Shimmer className="h-3 w-full" />
          </div>
        </div>

        {/* Delete button */}
        <Shimmer className="h-8 w-20 rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

function LoadingHabits({ habitCount = 4, className }) {
  return (
    <div
      role="status"
      aria-label="Loading habits"
      aria-busy="true"
      className={cn("flex flex-col gap-5", className)}
    >
      {/* Section header */}
      <SkeletonCard className="flex flex-col gap-4">
        <SkeletonSectionHeader />
      </SkeletonCard>

      {/* Add-habit form */}
      <SkeletonCard className="flex flex-col gap-4">
        <Shimmer className="h-4 w-28" /> {/* "Add a habit" sub-heading */}

        <SkeletonInput />  {/* Habit title */}

        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonInput />  {/* Difficulty select */}
          <SkeletonInput />  {/* Anchor trigger */}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTextarea rows={2} />  {/* Standard version */}
          <SkeletonTextarea rows={2} />  {/* Minimum version */}
        </div>

        <div className="flex justify-end" aria-hidden="true">
          <SkeletonButton wide />
        </div>
      </SkeletonCard>

      {/* Active habits heading */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <Shimmer className="h-3 w-28 rounded-full" />
        <SkeletonBadge />
      </div>

      {/* Habit list */}
      {Array.from({ length: habitCount }).map((_, i) => (
        <HabitCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default LoadingHabits;
