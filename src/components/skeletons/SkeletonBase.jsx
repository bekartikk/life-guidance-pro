/**
 * SkeletonBase – shared low-level building blocks consumed by every skeleton
 * in this folder. Never import this file from outside src/components/skeletons/.
 */
import { cn } from "../../lib/cn.js";

/* ─── Primitive shimmer block ────────────────────────────────────────────── */

/** A single shimmer rectangle. Wraps the `ds-skeleton` design-system class. */
export function Shimmer({ className, style, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn("ds-skeleton rounded-[var(--ds-radius-md)]", className)}
      style={style}
      {...props}
    />
  );
}

/* ─── Text line presets ──────────────────────────────────────────────────── */

/** A single shimmer text line. `width` accepts a Tailwind width class or "full". */
export function SkeletonLine({ width = "w-full", className }) {
  return <Shimmer className={cn("h-3.5", width, className)} />;
}

/** A standard paragraph block: 3 lines, the last one shorter. */
export function SkeletonParagraph({ className }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden="true">
      <SkeletonLine width="w-full" />
      <SkeletonLine width="w-4/5" />
      <SkeletonLine width="w-3/5" />
    </div>
  );
}

/* ─── Eyebrow + heading row ──────────────────────────────────────────────── */

export function SkeletonSectionHeader({ className }) {
  return (
    <div className={cn("flex flex-col gap-3", className)} aria-hidden="true">
      <Shimmer className="h-3 w-24 rounded-full" />
      <Shimmer className="h-6 w-56 sm:w-72" />
    </div>
  );
}

/* ─── Avatar / icon placeholder ─────────────────────────────────────────── */

export function SkeletonAvatar({ size = "md", className }) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  };
  return <Shimmer className={cn("rounded-full shrink-0", sizeMap[size] ?? sizeMap.md, className)} />;
}

/* ─── Card shell ─────────────────────────────────────────────────────────── */

export function SkeletonCard({ className, children, padded = true }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "ds-card-base ds-glass",
        padded && "ds-card-shell",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────────────────── */

export function SkeletonInput({ className }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden="true">
      <Shimmer className="h-3 w-28" />      {/* label */}
      <Shimmer className="h-11 w-full rounded-[var(--ds-radius-md)]" /> {/* input */}
    </div>
  );
}

/* ─── Textarea field ─────────────────────────────────────────────────────── */

export function SkeletonTextarea({ rows = 3, className }) {
  const heights = { 2: "h-20", 3: "h-28", 4: "h-36", 5: "h-44" };
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden="true">
      <Shimmer className="h-3 w-28" />
      <Shimmer className={cn("w-full rounded-[var(--ds-radius-md)]", heights[rows] ?? heights[3])} />
    </div>
  );
}

/* ─── Button stub ────────────────────────────────────────────────────────── */

export function SkeletonButton({ wide = false, className }) {
  return (
    <Shimmer
      className={cn(
        "h-11 rounded-[var(--ds-radius-pill)]",
        wide ? "w-40" : "w-28",
        className,
      )}
    />
  );
}

/* ─── Stat / KPI chip ────────────────────────────────────────────────────── */

export function SkeletonKpi({ className }) {
  return (
    <div className={cn("ds-glass-soft ds-card-base flex flex-col gap-2 p-4", className)} aria-hidden="true">
      <Shimmer className="h-3 w-20" />    {/* label  */}
      <Shimmer className="h-7 w-14" />    {/* value  */}
      <Shimmer className="h-3 w-24" />    {/* hint   */}
    </div>
  );
}

/* ─── Badge / pill ───────────────────────────────────────────────────────── */

export function SkeletonBadge({ className }) {
  return <Shimmer className={cn("h-7 w-16 rounded-full", className)} />;
}
