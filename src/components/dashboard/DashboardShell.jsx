import { memo, Suspense, lazy, useEffect } from "react";

import Header from "./Header.jsx";
import PlannerBoard from "./PlannerBoard.jsx";
import QuickAddModal from "./QuickAddModal.jsx";
import ResultPanel from "./ResultPanel.jsx";
import Sidebar from "./Sidebar.jsx";
import AdaptiveWidgetSkeleton from "../ai/AdaptiveWidgetSkeleton.jsx";
import { WidgetErrorBoundary } from "../AppErrorBoundary.jsx";
import { Badge, Button, Card, Skeleton } from "../ui/index.js";
import { DashboardContainer, GridLayout, MobileBottomNav, PanelLayout, SectionHeader } from "../layout/index.js";
import { LoadingCard } from "../skeletons/index.js";
import { ErrorAlert } from "../ui/feedback/index.js";
const LAZY_IMPORT_TIMEOUT_MS = 8000;

function LazyImportFallback({ title }) {
  return (
    <section className="section-loading-card widget-fallback-card">
      <div>
        <strong>{title}</strong>
        <p>This section could not load right now. Try switching tabs or refreshing the workspace.</p>
      </div>
    </section>
  );
}

function isComponentLike(value) {
  if (typeof value === "function") {
    return true;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  const reactType = value.$$typeof;
  const description = typeof reactType === "symbol" ? reactType.description : "";

  return description === "react.memo" || description === "react.forward_ref";
}

function resolveLazyComponent(module) {
  const directDefault = module?.default;
  if (isComponentLike(directDefault)) {
    return directDefault;
  }

  const nestedDefault = directDefault?.default;
  if (isComponentLike(nestedDefault)) {
    return nestedDefault;
  }

  return null;
}

function safeLazy(loader, title) {
  const wrappedLoader = () => {
    let timeoutId = null;

    return Promise.race([
      loader(),
      new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error(`Lazy import timed out for ${title}.`)), LAZY_IMPORT_TIMEOUT_MS);
      }),
    ])
      .then((module) => {
        const component = resolveLazyComponent(module);
        if (!component) {
          throw new Error(`Invalid lazy component export for ${title}.`);
        }
        return { default: component };
      })
      .catch(() => {
        return {
          default: function LazyModuleFallback() {
            return <LazyImportFallback title={title} />;
          },
        };
      })
      .finally(() => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      });
  };

  const LazyComponent = lazy(wrappedLoader);
  LazyComponent.preload = () => wrappedLoader().then(() => null).catch(() => null);
  return LazyComponent;
}
const AdaptiveIntelligenceRail = safeLazy(() => import("../ai/AdaptiveIntelligenceRail.jsx"), "AI intelligence");
const AdaptiveHistorySurface = safeLazy(() => import("../ai/AdaptiveHistorySurface.jsx"), "Adaptive history");
const ProgressWidget = safeLazy(() => import("./ProgressWidget.jsx"), "Progress overview");
const AnalyticsChart = safeLazy(() => import("./AnalyticsChart.jsx"), "Analytics chart");

function SectionLoadingCard({ title, description }) {
  return (
    <section className="section-loading-card">
      <div className="section-loading-pulse" />
      <div className="section-loading-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <div className="section-loading-lines" aria-hidden="true">
        <Skeleton className="section-loading-lines__item section-loading-lines__item--wide" />
        <Skeleton className="section-loading-lines__item" />
      </div>
    </section>
  );
}

function CompactLoadingSkeleton({ title, lines = 2 }) {
  return (
    <section className="dashboard-compact-skeleton" aria-hidden="true">
      <div className="dashboard-compact-skeleton__pulse" />
      <div className="dashboard-compact-skeleton__body">
        <strong>{title}</strong>
        <div className="dashboard-compact-skeleton__lines">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton key={`${title}-${index}`} className="dashboard-compact-skeleton__line" />
          ))}
        </div>
      </div>
    </section>
  );
}

function LazySection({ title, description, children }) {
  return (
    <Suspense fallback={<SectionLoadingCard title={title} description={description} />}>
      {children}
    </Suspense>
  );
}

const DashboardShell = memo(function DashboardShell({
  focusMode,
  sidebarItems,
  activeTab,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  handleTabChange,
  user,
  handleLogout,
  activeMeta,
  searchQuery,
  setSearchQuery,
  streakLabel,
  setIsQuickAddOpen,
  setFocusMode,
  setIsMobileNavOpen,
  insightNarrative,
  plannerSnapshots,
  missionSummary,
  intelligenceCards,
  isMobileNavOpen,
  mobileNavItems,
  tabMeta,
  statusMessage,
  statusTone,
  error,
  isLoadingWorkspace,
  dashboardGreetingName,
  dashboardKpis,
  todayTimeline,
  dashboardTasks,
  currentPlan,
  dashboardHabits,
  aiCoachCards,
  completion,
  goals,
  habits,
  showResultPanel,
  plannerFormRef,
  showMobilePlannerSkeleton,
  renderedTab,
  resultPanelRef,
  isLoading,
  activeAiMeta,
  currentPlanFeedback,
  adjustmentRequest,
  checkinNote,
  checkinFields,
  isAdjusting,
  isSubmittingCheckin,
  progress,
  recentRewards,
  todayCheckin,
  behavioralInsights,
  formatDate,
  setAdjustmentRequest,
  requestPlan,
  setError,
  handleDailyCheckin,
  updateCheckinField,
  setCheckinNote,
  showMobileInsightSkeleton,
  toDisplayText,
  adaptiveWorkspace,
  formatDisplayLabel,
  checkins,
  isLoadingAdaptiveInsights,
  adaptiveInsights,
  plans,
  analyticsPanelRef,
  canRenderAnalyticsChart,
  shouldRenderAnalyticsChart,
  setShowMobileAnalytics,
  handleDeleteMyData,
  isDeletingData,
  isQuickAddOpen,
  quickAddDraft,
  setQuickAddDraft,
  handleQuickAddSubmit,
  mobileBottomNavItems,
}) {
  return (
    <>
      <div className={`dashboard-app-shell${focusMode ? " dashboard-app-shell--focus" : ""}`}>
        <div className="dashboard-app-shell__orb dashboard-app-shell__orb--violet" />
        <div className="dashboard-app-shell__orb dashboard-app-shell__orb--cyan" />
        <div className="dashboard-app-shell__grain" />

        <Sidebar
          items={sidebarItems}
          activeItem={activeTab}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((current) => !current)}
          onSelect={handleTabChange}
          userEmail={user?.email || ""}
        />

        <div className="dashboard-main-frame">
          <Header
            title={activeMeta.label}
            description={activeMeta.description}
            searchQuery={searchQuery}
            onSearchChange={(event) => setSearchQuery(event.target.value)}
            streakLabel={streakLabel}
            onQuickAdd={() => setIsQuickAddOpen(true)}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode((current) => !current)}
            onToggleMobileNav={() => setIsMobileNavOpen((current) => !current)}
            userEmail={user?.email || ""}
            onLogout={handleLogout}
          />

          <section className="dashboard-hero-grid">
            <Card padded={false} className="dashboard-hero-card dashboard-hero-card--primary">
              <SectionHeader
                className="dashboard-hero-copy"
                eyebrow="Adaptive life operating system"
                title={insightNarrative.greeting}
                description={insightNarrative.recommendation}
              />
              <GridLayout columns="auto" className="dashboard-hero-metrics md:grid-cols-3">
                {plannerSnapshots.map((item) => (
                  <Card key={item.label} tone="soft" padded={false} className="dashboard-hero-metric">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <small>{item.hint}</small>
                  </Card>
                ))}
              </GridLayout>
            </Card>

            <Card padded={false} className="dashboard-hero-card dashboard-hero-card--secondary">
              <SectionHeader
                className="dashboard-hero-secondary-head"
                eyebrow="AI guidance pulse"
                title="What the system sees right now"
                actions={<Badge className="hero-header-chip">{missionSummary.levelTitle}</Badge>}
              />
              <PanelLayout className="dashboard-guidance-list">
                {intelligenceCards.map((card) => (
                  <Card key={card.label} tone="soft" padded={false} className="dashboard-guidance-item">
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <p>{card.detail}</p>
                  </Card>
                ))}
              </PanelLayout>
            </Card>
          </section>

          <div className={`dashboard-mobile-nav${isMobileNavOpen ? " dashboard-mobile-nav--open" : ""}`}>
            {mobileNavItems.map((item) => (
              <button
                key={item}
                type="button"
                className={item === activeTab ? "dashboard-mobile-nav__chip active" : "dashboard-mobile-nav__chip"}
                onClick={() => handleTabChange(item)}
              >
                {(tabMeta[item] || { label: item }).label}
              </button>
            ))}
          </div>

          {statusMessage && <div className={`status-toast ${statusTone === "info" ? "status-toast-info" : "status-toast-success"}`}>{statusMessage}</div>}
          {error && <ErrorAlert>{error}</ErrorAlert>}
          {isLoadingWorkspace && <SectionLoadingCard title="Syncing your workspace" description="WeÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢re warming up your saved planner data section by section so you can keep using the app while it loads." />}

          <div className="dashboard-content-grid">
            <main className="dashboard-center-column">
              <section className="dashboard-command-center" aria-label="Daily productivity overview">
                <div className="dashboard-command-center__head">
                  <div>
                    <p className="dashboard-eyebrow">Home</p>
                    <h2>Hi {dashboardGreetingName} ðŸ‘‹</h2>
                    <p>Your AI coach has organized today into focus, recovery, and steady progress.</p>
                  </div>
                  <Badge className="hero-header-chip">AI Coach active</Badge>
                </div>

                <div className="dashboard-kpi-grid">
                  {dashboardKpis.map((item) => (
                    <Card key={item.label} tone="soft" padded={false} className="dashboard-kpi-card">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <small>{item.hint}</small>
                    </Card>
                  ))}
                </div>

                <div className="dashboard-productivity-grid">
                  <Card padded={false} className="dashboard-plan-card">
                    <SectionHeader eyebrow="Today's plan" title="Daily planner timeline" />
                    <div className="dashboard-timeline-list">
                      {todayTimeline.map((item) => (
                        <div key={`${item.time}-${item.title}`} className="dashboard-timeline-row">
                          <time>{item.time}</time>
                          <div>
                            <strong>{item.title}</strong>
                            <span>{item.note}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="dashboard-productivity-stack">
                    <Card padded={false} className="dashboard-checklist-card">
                      <SectionHeader eyebrow="Tasks" title="Priority checklist" />
                      <div className="dashboard-checklist">
                        {dashboardTasks.map((task, index) => (
                          <label key={`${task}-${index}`} className="dashboard-check-item">
                            <input type="checkbox" readOnly checked={index === 0 && Boolean(currentPlan)} />
                            <span>{task}</span>
                          </label>
                        ))}
                      </div>
                    </Card>

                    <Card padded={false} className="dashboard-habits-card">
                      <SectionHeader eyebrow="Habits" title="Streak rhythm" />
                      <div className="dashboard-habit-list">
                        {dashboardHabits.map((habit) => (
                          <div key={habit.title} className="dashboard-habit-row">
                            <div>
                              <strong>{habit.title}</strong>
                              <span>{habit.streak} day streak</span>
                            </div>
                            <div className="dashboard-habit-progress" aria-hidden="true">
                              <span style={{ width: `${habit.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card padded={false} className="dashboard-weekly-card">
                    <SectionHeader eyebrow="Weekly overview" title="Progress snapshot" />
                    <div className="dashboard-weekly-visual">
                      <div className="dashboard-weekly-ring" style={{ "--weekly-progress": `${Math.min(100, Math.max(0, completion.percent || 0))}%` }}>
                        <strong>{Math.min(100, Math.round(completion.percent || 0))}%</strong>
                        <span>complete</span>
                      </div>
                      <div className="dashboard-mini-chart" aria-hidden="true">
                        {[48, 64, 52, 76, 88, 70, 82].map((height, index) => (
                          <span key={index} style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              <PlannerBoard
                currentPlan={currentPlan}
                goals={goals}
                habits={habits}
                activeTab={activeTab}
                onGoToTab={handleTabChange}
              >
                {showResultPanel ? (
                  <div className="planner-workspace-grid">
                    <div className="planner-workspace-grid__form" ref={plannerFormRef}>
                      {showMobilePlannerSkeleton && (
                        <div className="dashboard-mobile-skeletons dashboard-mobile-skeletons--planner">
                          <LoadingCard lines={3} showBadge={false} />
                          <LoadingCard lines={2} showBadge={false} />
                        </div>
                      )}
                      {renderedTab}
                    </div>
                    <div className="planner-workspace-grid__result" ref={resultPanelRef}>
                      {isLoading ? (
                        <Card padded={false} className="result-loading-state">
                          <div className="result-loading-state__pulse" />
                          <div className="result-loading-state__copy">
                            <p className="dashboard-eyebrow">AI is thinking</p>
                            <h3>Building your roadmap</h3>
                            <p>We&apos;re translating your routine, pressure, energy, and preferences into a calmer plan you can actually use.</p>
                          </div>
                          <div className="result-loading-state__meta">
                            <Badge className="hero-header-chip" tone="info">Adaptive memory syncing</Badge>
                            <Badge className="hero-header-chip" tone="info">Planner output formatting</Badge>
                          </div>
                          <div className="result-loading-state__skeletons">
                            <div className="result-skeleton-card" />
                            <div className="result-skeleton-card" />
                            <div className="result-skeleton-card" />
                          </div>
                        </Card>
                      ) : currentPlan ? (
                        <ResultPanel
                          currentPlan={currentPlan}
                          aiMeta={activeAiMeta}
                          currentPlanFeedback={currentPlanFeedback}
                          adjustmentRequest={adjustmentRequest}
                          checkinNote={checkinNote}
                          checkinFields={checkinFields}
                          isAdjusting={isAdjusting}
                          isSubmittingCheckin={isSubmittingCheckin}
                          progress={progress}
                          recentRewards={recentRewards}
                          todayCheckin={todayCheckin}
                          behavioralInsights={behavioralInsights}
                          formatDate={formatDate}
                          onAdjustChange={(event) => setAdjustmentRequest(event.target.value)}
                          onAdjust={() => adjustmentRequest.trim() ? requestPlan({ adjustment: adjustmentRequest }) : setError("Write what feels difficult or what you want to change.")}
                          onCheckin={handleDailyCheckin}
                          onCheckinFieldChange={updateCheckinField}
                          onCheckinNoteChange={(event) => setCheckinNote(event.target.value)}
                          onRegenerate={() => requestPlan()}
                          onRate={() => handleTabChange("feedback")}
                        />
                      ) : (
                        <Card padded={false} className="result-empty-state">
                          <SectionHeader
                            eyebrow="AI result surface"
                            title="Your plan will appear here"
                            description="Once you generate a plan, this space becomes your adaptive roadmap, check-in surface, and guidance memory."
                          />
                          <GridLayout columns="auto" className="result-empty-state__points">
                            <Card tone="soft" padded={false}>
                              <strong>Timeline blocks</strong>
                              <span>Readable daily flow instead of one giant wall of text</span>
                            </Card>
                            <Card tone="soft" padded={false}>
                              <strong>Action layers</strong>
                              <span>Key shifts, today&apos;s focus, next 7 days, and longer-horizon guidance</span>
                            </Card>
                            <Card tone="soft" padded={false}>
                              <strong>Refine loop</strong>
                              <span>Adjust the plan without rebuilding everything from zero</span>
                            </Card>
                          </GridLayout>
                          <div className="result-empty-state__actions">
                            <Button
                              variant="secondary"
                              type="button"
                              onClick={() => plannerFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                            >
                              Review planner inputs
                            </Button>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-tab-surface">{renderedTab}</div>
                )}
              </PlannerBoard>
            </main>

            <aside className="dashboard-intelligence-rail">
              <DashboardContainer>
              <div className="dashboard-intelligence-rail__core">
                {showMobileInsightSkeleton && (
                  <div className="dashboard-mobile-skeletons dashboard-mobile-skeletons--insights">
                    <LoadingCard lines={2} showBadge={false} />
                    <LoadingCard lines={3} showBadge={false} />
                  </div>
                )}
                <Card padded={false} className="intelligence-panel intelligence-panel--highlight">
                  <SectionHeader
                    className="intelligence-panel__head"
                    eyebrow="Adaptive life state"
                    actions={<Badge className="hero-header-chip">{toDisplayText(adaptiveWorkspace?.workspaceMode?.label, "Focus")}</Badge>}
                  />
                  <PanelLayout className="intelligence-panel__list intelligence-panel__list--compact">
                    <Card tone="soft" padded={false} className="intelligence-checkpoint is-done">
                      <strong>Burnout risk</strong>
                      <span>{toDisplayText(behavioralInsights?.burnoutRisk?.label, "Manage closely")}</span>
                    </Card>
                    <Card tone="soft" padded={false} className="intelligence-checkpoint">
                      <strong>Mode</strong>
                      <span>{toDisplayText(adaptiveWorkspace?.workspaceMode?.summary, "Adaptive guidance is still loading.")}</span>
                    </Card>
                    <Card tone="soft" padded={false} className="intelligence-checkpoint">
                      <strong>Next shift</strong>
                      <span>{toDisplayText(adaptiveWorkspace?.roadmapIntelligence?.nextShift, formatDisplayLabel(insightNarrative.focus))}</span>
                    </Card>
                  </PanelLayout>
                </Card>

                <Card padded={false} className="dashboard-ai-coach-panel">
                  <SectionHeader
                    className="intelligence-panel__head"
                    eyebrow="AI Coach panel"
                    title="Today's guidance"
                    actions={<Badge className="hero-header-chip">Live</Badge>}
                  />
                  <div className="dashboard-ai-coach-list">
                    {aiCoachCards.map((item) => (
                      <Card key={item.title} tone="soft" padded={false} className="dashboard-ai-coach-card">
                        <strong>{item.title}</strong>
                        <p>{item.body}</p>
                      </Card>
                    ))}
                  </div>
                </Card>

                <Suspense fallback={<AdaptiveWidgetSkeleton title="Preparing adaptive intelligence" />}>
                  <WidgetErrorBoundary title="AI intelligence unavailable" description="The adaptive AI summary surface could not render.">
                    <AdaptiveIntelligenceRail
                      aiMeta={activeAiMeta}
                      behavioralInsights={behavioralInsights}
                      checkins={checkins}
                    />
                  </WidgetErrorBoundary>
                </Suspense>

                <Suspense fallback={<AdaptiveWidgetSkeleton title="Preparing adaptive history" />}>
                  <WidgetErrorBoundary title="Adaptive history unavailable" description="The mirrored AI history surface could not render.">
                    {isLoadingAdaptiveInsights ? (
                      <AdaptiveWidgetSkeleton compact title="Loading mirrored memory" />
                    ) : (
                      <AdaptiveHistorySurface
                        adaptiveInsights={adaptiveInsights}
                        activeAiMeta={activeAiMeta}
                        behavioralInsights={behavioralInsights}
                      />
                    )}
                  </WidgetErrorBoundary>
                </Suspense>
              </div>

              <LazySection title="Loading progress overview" description="Preparing the progress and momentum widget.">
                <ProgressWidget completion={completion} progress={progress} plans={plans} goals={goals} habits={habits} behavioralInsights={behavioralInsights} />
              </LazySection>
              <div ref={analyticsPanelRef} className="dashboard-analytics-slot">
              {canRenderAnalyticsChart ? (
                <LazySection title="Loading analytics insights" description="Preparing productivity and mood charts.">
                  <AnalyticsChart checkins={checkins} progress={progress} behavioralInsights={behavioralInsights} />
                </LazySection>
              ) : shouldRenderAnalyticsChart ? (
                <Card padded={false} className="intelligence-panel intelligence-panel--compact-action intelligence-panel--deferred-chart">
                  <SectionHeader
                    className="intelligence-panel__head"
                    eyebrow="Chart insights"
                    actions={<Badge className="hero-header-chip">Preparing analytics</Badge>}
                  />
                  <p className="intelligence-panel__body">
                    The deeper chart surface is loading in the background so the rest of your workspace can stay responsive.
                  </p>
                  <div className="dashboard-chart-placeholder">
                    <Skeleton className="dashboard-chart-placeholder__hero" />
                    <div className="dashboard-chart-placeholder__grid">
                      <Skeleton className="dashboard-chart-placeholder__card" />
                      <Skeleton className="dashboard-chart-placeholder__card" />
                    </div>
                  </div>
                </Card>
              ) : (
                <Card padded={false} className="intelligence-panel intelligence-panel--compact-action">
                  <SectionHeader
                    className="intelligence-panel__head"
                    eyebrow="Chart insights"
                    actions={<Badge className="hero-header-chip">Deferred on mobile</Badge>}
                  />
                  <p className="intelligence-panel__body">
                    The full analytics surface is available when you open progress or insights, or you can load it here if you want the deeper read now.
                  </p>
                  <Button variant="secondary" type="button" onClick={() => setShowMobileAnalytics(true)}>
                    Load analytics
                  </Button>
                </Card>
              )}
              </div>

              <Card padded={false} className="intelligence-panel">
                <SectionHeader
                  className="intelligence-panel__head"
                  eyebrow="AI memory engine"
                  actions={<Badge className="hero-header-chip">{Array.isArray(behavioralInsights?.memoryCards) ? behavioralInsights.memoryCards.length : 0} signals</Badge>}
                />
                <PanelLayout className="intelligence-panel__list">
                  {(Array.isArray(behavioralInsights?.memoryCards) ? behavioralInsights.memoryCards : []).slice(0, 3).map((item, index) => (
                    <Card key={`${toDisplayText(item?.label, "memory")}-${index}`} tone="soft" padded={false} className="intelligence-checkpoint">
                      <strong>{toDisplayText(item?.label, "Memory signal")}</strong>
                      <span>{toDisplayText(item?.value, "Unavailable")}</span>
                      <small>{toDisplayText(item?.detail, "Adaptive memory is still warming up.")}</small>
                    </Card>
                  ))}
                </PanelLayout>
              </Card>

              <Card padded={false} className="intelligence-panel">
                <SectionHeader
                  className="intelligence-panel__head"
                  eyebrow="Future projection"
                  actions={<Badge className="hero-header-chip">{Array.isArray(behavioralInsights?.futureProjection) ? behavioralInsights.futureProjection.length : 0} paths</Badge>}
                />
                <PanelLayout className="intelligence-sample-list">
                  {(Array.isArray(behavioralInsights?.futureProjection) ? behavioralInsights.futureProjection : []).slice(0, 3).map((projection, index) => (
                    <Card key={`${toDisplayText(projection, "projection")}-${index}`} tone="soft" padded={false} className="intelligence-sample-card">
                      <strong>Projected growth</strong>
                      <p>{toDisplayText(projection, "A clearer projection will appear as more behavior data arrives.")}</p>
                    </Card>
                  ))}
                </PanelLayout>
              </Card>

              <Card padded={false} className="intelligence-panel intelligence-panel--danger">
                <SectionHeader className="intelligence-panel__head" eyebrow="Privacy and control" />
                <p className="intelligence-panel__body">
                  Do not write passwords, account numbers, legal IDs, or medical records. Only store details needed to shape routines and future direction.
                </p>
                <Button variant="danger" type="button" onClick={handleDeleteMyData} disabled={isDeletingData}>
                  {isDeletingData ? "Deleting your data..." : "Delete my stored data"}
                </Button>
              </Card>
              </DashboardContainer>
            </aside>
          </div>
        </div>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        type={quickAddDraft.type}
        title={quickAddDraft.title}
        note={quickAddDraft.note}
        onTypeChange={(event) => setQuickAddDraft((current) => ({ ...current, type: event.target.value }))}
        onTitleChange={(event) => setQuickAddDraft((current) => ({ ...current, title: event.target.value }))}
        onNoteChange={(event) => setQuickAddDraft((current) => ({ ...current, note: event.target.value }))}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
      />

      <MobileBottomNav className="dashboard-bottom-nav" aria-label="Mobile primary navigation">
        {mobileBottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.key === "plan" && activeTab === "planner") ||
            (item.key === "coach" && activeTab === "chat") ||
            (item.key === "insights" && activeTab === "insights") ||
            (item.key === "profile" && activeTab === "profile");

          return (
            <button
              key={item.key}
              type="button"
              className={`dashboard-bottom-nav__item${isActive ? " active" : ""}${item.isPrimary ? " dashboard-bottom-nav__item--primary" : ""}`}
              onClick={item.action}
              aria-label={item.label}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </MobileBottomNav>

    </>
  );
});

export default DashboardShell;
