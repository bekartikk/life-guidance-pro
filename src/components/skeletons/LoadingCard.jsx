/**
 * LoadingCard
 *
 * A generic panel skeleton that mirrors the shape of a `<Card>` component.
 * Use wherever a single content card is loading.
 *
 * Props:
 *   lines    {number}  Number of body text lines to render (default 3).
 *   showBadge {boolean} Show an eyebrow badge stub (default true).
 *   className {string}  Extra classes on the outer card shell.
 */
import { cn } from "../../lib/cn.js";
import {
  SkeletonCard,
  SkeletonSectionHeader,
  SkeletonParagraph,
  SkeletonBadge,
  SkeletonButton,
  Shimmer,
} from "./SkeletonBase.jsx";

function LoadingCard({
  lines = 3,
  showBadge = true,
  showAction = false,
  className,
}) {
  return (
    <SkeletonCard
      className={cn("flex flex-col gap-5", className)}
      role="status"
      aria-label="Loading content"
      aria-busy="true"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <SkeletonSectionHeader />
        {showBadge && <SkeletonBadge />}
      </div>

      {/* Body lines */}
      <div className="flex flex-col gap-2" aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => {
          const widths = ["w-full", "w-4/5", "w-3/5", "w-full", "w-5/6"];
          return (
            <Shimmer
              key={i}
              className={cn("h-3.5", widths[i % widths.length])}
            />
          );
        })}
      </div>

      {/* Optional action button stub */}
      {showAction && (
        <div className="mt-2">
          <SkeletonButton />
        </div>
      )}
    </SkeletonCard>
  );
}

export default LoadingCard;
