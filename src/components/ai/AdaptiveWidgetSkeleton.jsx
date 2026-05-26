import { Card, CardContent, Skeleton } from "../ui/index.js";

function AdaptiveWidgetSkeleton({ compact = false, title = "Preparing adaptive surface" }) {
  return (
    <Card className={`saas-panel ai-surface-skeleton${compact ? " ai-surface-skeleton--compact" : ""}`} tone="soft" aria-hidden="true">
      <CardContent>
        <div className="ai-surface-skeleton__copy">
          <strong>{title}</strong>
          <span>Your guidance layer is gathering recent signals, continuity, and the next calm move.</span>
        </div>
        <Skeleton className="ai-surface-skeleton__hero" />
        <div className="ai-surface-skeleton__grid">
          <Skeleton className="ai-surface-skeleton__card" />
          <Skeleton className="ai-surface-skeleton__card" />
        </div>
        <div className="ai-surface-skeleton__list">
          <Skeleton className="ai-surface-skeleton__line" />
          <Skeleton className="ai-surface-skeleton__line" />
          <Skeleton className="ai-surface-skeleton__line" />
        </div>
      </CardContent>
    </Card>
  );
}

export default AdaptiveWidgetSkeleton;
