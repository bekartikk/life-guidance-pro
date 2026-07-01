/**
 * LoadingProfile
 *
 * Skeleton for the Profile tab, which shows:
 *   – an eyebrow + heading header
 *   – a 2-column grid of input fields (name, age, role, style)
 *   – several single-column textarea fields
 *   – a two-button action row at the bottom
 *
 * Props:
 *   className {string}
 */
import { cn } from "../../lib/cn.js";
import {
  SkeletonCard,
  SkeletonSectionHeader,
  SkeletonInput,
  SkeletonTextarea,
  SkeletonButton,
} from "./SkeletonBase.jsx";

function LoadingProfile({ className }) {
  return (
    <SkeletonCard
      role="status"
      aria-label="Loading profile"
      aria-busy="true"
      className={cn("flex flex-col gap-6", className)}
    >
      {/* Page header */}
      <SkeletonSectionHeader />

      {/* Section: Who you are */}
      <div className="flex flex-col gap-5">
        {/* 2-col grid — name, age, role, style */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonInput />
        </div>

        {/* Full-width textarea — main goal */}
        <SkeletonTextarea rows={3} />

        {/* 2-col textareas — interests / career interest */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTextarea rows={3} />
          <SkeletonTextarea rows={3} />
        </div>

        {/* 2-col textareas — life priorities / working style */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTextarea rows={2} />
          <SkeletonTextarea rows={2} />
        </div>

        {/* 2-col mixed — sleep / stress level */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTextarea rows={2} />
          <SkeletonInput />
        </div>

        {/* Full-width textarea — long-term vision */}
        <SkeletonTextarea rows={3} />

        {/* Full-width textarea — note to planner */}
        <SkeletonTextarea rows={2} />
      </div>

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-3" aria-hidden="true">
        <SkeletonButton wide />
        <SkeletonButton wide />
      </div>
    </SkeletonCard>
  );
}

export default LoadingProfile;
