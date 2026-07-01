/**
 * LoadingTable
 *
 * A skeleton that mimics a labelled data table with a column-header row
 * and configurable body rows.
 *
 * Props:
 *   rows    {number}  Number of body rows (default 5).
 *   columns {number}  Number of columns per row (default 4).
 *   showHeader {boolean} Render a section-header block above the table (default true).
 *   className {string}
 */
import { cn } from "../../lib/cn.js";
import {
  SkeletonCard,
  SkeletonSectionHeader,
  Shimmer,
} from "./SkeletonBase.jsx";

function LoadingTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}) {
  /* Column widths cycle through a deliberately irregular set so the
     skeleton looks like real data rather than a perfectly uniform grid. */
  const colWidths = ["w-1/3", "w-1/4", "w-1/5", "w-1/6", "w-2/5"];

  return (
    <SkeletonCard
      className={cn("flex flex-col gap-5", className)}
      role="status"
      aria-label="Loading table"
      aria-busy="true"
    >
      {showHeader && <SkeletonSectionHeader />}

      {/* Table shell */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[480px]">

          {/* Column headers */}
          <div
            className="mb-3 grid gap-x-4 border-b border-[var(--ds-color-border-default)] pb-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            aria-hidden="true"
          >
            {Array.from({ length: columns }).map((_, ci) => (
              <Shimmer key={ci} className={cn("h-3 rounded-full", colWidths[ci % colWidths.length])} />
            ))}
          </div>

          {/* Body rows */}
          <div className="flex flex-col gap-3" aria-hidden="true">
            {Array.from({ length: rows }).map((_, ri) => (
              <div
                key={ri}
                className="grid items-center gap-x-4 py-1"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: columns }).map((_, ci) => (
                  <Shimmer
                    key={ci}
                    className={cn(
                      "h-3.5 rounded",
                      /* First column slightly wider to suggest a row label */
                      ci === 0 ? "w-full" : colWidths[(ri + ci) % colWidths.length],
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

export default LoadingTable;
