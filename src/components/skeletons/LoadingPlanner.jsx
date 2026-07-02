/**
 * LoadingPlanner
 *
 * Skeleton for the Planner tab (PlannerTab).
 * Mirrors the 4-step accordion form layout:
 *   – Step progress strip
 *   – Accordion step cards (4 steps, first one open)
 *   – Result panel area at the bottom
 *
 * Props:
 *   showResult {boolean}  Render the result panel stub (default true).
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

/* ── Step strip ─────────────────────────────────────────────────── */

function StepStrip() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex shrink-0 items-center gap-2">
          <Shimmer className="h-7 w-20 rounded-full" />
          {i < 3 && <Shimmer className="h-px w-6 rounded-full" />}
        </div>
      ))}
    </div>
  );
}

/* ── Collapsed step (just a header bar) ─────────────────────────── */

function CollapsedStep() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border-default)] bg-white/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <Shimmer className="h-5 w-14 rounded-full" />
        <Shimmer className="h-4 w-36 sm:w-48" />
      </div>
      <Shimmer className="h-5 w-5 shrink-0 rounded-md" />
    </div>
  );
}

/* ── Open step (full field contents) ───────────────────────────── */

function OpenStep() {
  return (
    <SkeletonCard className="flex flex-col gap-5">
      {/* Step header */}
      <div className="flex items-start justify-between gap-3">
        <SkeletonSectionHeader />
        <SkeletonBadge />
      </div>

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SkeletonInput />
        <SkeletonInput />
      </div>
      <SkeletonTextarea rows={3} />
      <SkeletonTextarea rows={3} />
    </SkeletonCard>
  );
}

/* ── Result panel stub ──────────────────────────────────────────── */

function ResultPanelSkeleton() {
  return (
    <SkeletonCard className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <SkeletonSectionHeader />
        <div className="flex gap-2">
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>

      {/* Plan section cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 border-l-2 border-[var(--ds-color-border-default)] pl-4">
          <Shimmer className="h-4 w-40" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-4/5" />
        </div>
      ))}
    </SkeletonCard>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

function LoadingPlanner({ showResult = true, className }) {
  return (
    <div
      role="status"
      aria-label="Loading planner"
      aria-busy="true"
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Section eyebrow + heading */}
      <SkeletonCard className="flex flex-col gap-4">
        <SkeletonSectionHeader />
        <StepStrip />
      </SkeletonCard>

      {/* Step 1 – open */}
      <OpenStep />

      {/* Steps 2–4 – collapsed */}
      <CollapsedStep />
      <CollapsedStep />
      <CollapsedStep />

      {/* Generate button */}
      <div className="flex justify-end" aria-hidden="true">
        <SkeletonButton wide />
      </div>

      {/* Result panel */}
      {showResult && <ResultPanelSkeleton />}
    </div>
  );
}

export default LoadingPlanner;
