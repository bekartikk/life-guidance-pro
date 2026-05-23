function AdaptiveWidgetSkeleton() {
  return (
    <section className="saas-panel ai-surface-skeleton" aria-hidden="true">
      <div className="ai-surface-skeleton__hero" />
      <div className="ai-surface-skeleton__grid">
        <div className="ai-surface-skeleton__card" />
        <div className="ai-surface-skeleton__card" />
      </div>
      <div className="ai-surface-skeleton__list">
        <div className="ai-surface-skeleton__line" />
        <div className="ai-surface-skeleton__line" />
        <div className="ai-surface-skeleton__line" />
      </div>
    </section>
  );
}

export default AdaptiveWidgetSkeleton;
