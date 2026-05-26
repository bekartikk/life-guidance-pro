# Life Guidance Pro Frontend Modernization Implementation Backlog

This document translates the redesign system in:

- [FIGMA_REDESIGN_EXECUTION_PLAN.md](C:/Users/User/Downloads/projects/life-guidance-pro/FIGMA_REDESIGN_EXECUTION_PLAN.md)
- [FIGMA_COMPONENT_IMPLEMENTATION_MAP.md](C:/Users/User/Downloads/projects/life-guidance-pro/FIGMA_COMPONENT_IMPLEMENTATION_MAP.md)

into an incremental implementation roadmap for the current React + Vite codebase.

## 1. Scope and Constraints

### In Scope

- Incremental UI modernization of the current frontend shell and major product surfaces
- Reusable shared UI primitive extraction
- Dashboard, planner, AI surface, analytics, and mobile UX refinement
- Better visual alignment with the adaptive AI product direction
- Performance, stability, and rollout safety work required to ship redesign slices cleanly

### Must Preserve

- Firebase Auth flow
- Firestore operational structure and read/write contracts
- Supabase hybrid semantic-memory architecture
- adaptive AI modules, `aiMeta` payload shape, and AI recommendation surfaces
- Render backend API contracts and request shapes
- route structure and lazy-loading/code-splitting behavior
- existing planner, dashboard, progress, history, review, and recommendation logic

### Explicit Non-Goals

- No app rewrite
- No routing replacement
- No Firebase replacement
- No visual-only Figma drift that ignores the real component tree
- No architecture churn that breaks existing backend or data contracts

## 2. Priority Labels

- `P0`: foundation or stability work required before broader UI rollout
- `P1`: high-value implementation with acceptable risk and clear ROI
- `P2`: important experience upgrades that depend on earlier groundwork
- `P3`: polish, low-priority cleanup, or deferred enhancements

## 3. Global Rollout Strategy

### Delivery Model

1. Establish a stable design-system layer.
2. Modernize shell surfaces before deep content surfaces.
3. Migrate one screen family at a time.
4. Keep data logic where it already lives; move visual complexity into components and styles.
5. Preserve lazy boundaries and route splitting.
6. Ship each phase behind visual-only changes or component-level swaps, not contract changes.

### Safe Incremental Rollout Rules

- Never combine UI restructuring and backend contract changes in the same slice.
- Prefer wrapping existing JSX with new primitives before extracting state upward.
- Keep current tab/page ownership intact until the phase for that surface is complete.
- Treat mobile acceptance criteria as phase-level requirements, not post-pass cleanup.
- Preserve current loading, error, and timeout fallbacks during redesign work.

### Chunk and Lazy-Load Preservation Notes

- Keep route-level lazy loading in [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx).
- Keep dashboard widget lazy loading in [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx).
- Do not eagerly import:
  - `AnalyticsChart`
  - `AdaptiveIntelligenceRail`
  - `AdaptiveHistorySurface`
  - heavy dashboard tabs
- Shared primitives must stay lightweight and dependency-safe.
- If a redesign component introduces motion, it must not force heavy parent rerenders.

## 4. Quick Wins

- Standardize radius, panel borders, and card padding across landing, auth, and dashboard shell.
- Replace repeated panel wrappers with one shared shell component family.
- Unify status chips, small metric cards, and section headers.
- Consolidate loading skeleton styles used across dashboard and AI widgets.
- Restyle dashboard header/sidebar before touching deeper stateful tabs.
- Normalize right-rail spacing and hierarchy without changing dashboard logic.

## 5. High-Risk Refactors

- Breaking `Dashboard.jsx` state orchestration into too many new providers or contexts.
- Reworking planner/result contracts while redesigning the workspace.
- Replacing charting libraries during visual redesign phases.
- Overusing `framer-motion` inside hot dashboard surfaces.
- Moving Supabase/Firebase logic into UI primitives.
- Global CSS rewrites that destabilize landing/auth/dashboard at once.

---

## 6. Phase Roadmap

## Phase 1 - Design System Core

### Priority

- `P0`

### Purpose

Establish a shared visual system layer so subsequent implementation can be incremental, consistent, and low-risk.

### Target React Files

- [src/App.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.css)
- [src/index.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/index.css)
- [src/styles/dashboard-modern.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/dashboard-modern.css)
- [src/styles/landing-experience.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/landing-experience.css)
- [src/styles/auth-onboarding.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/auth-onboarding.css)
- optional shared stylesheet: `src/styles/design-system.css`

### Dependencies

- Existing dark theme variables and shell styles
- Redesign token definitions from `FIGMA_REDESIGN_EXECUTION_PLAN.md`

### Reusable Components to Extract

- `GlassPanel`
- `SectionHeader`
- `StatusChip`
- `MetricCard`
- `ActionButton`
- `FieldShell`
- `SegmentedSwitch`
- `SkeletonCard`

### API/Data Dependencies

- None

### Firebase/Supabase Touchpoints

- None directly

### Acceptance Criteria

- Shared token layer exists for color, spacing, radius, elevation, and typography.
- Repeated shell styles are normalized without changing logic.
- Panels, chips, and buttons align with the redesign token system.
- No regressions to landing, auth, or dashboard boot.

### Mobile Requirements

- Token layer includes mobile padding, stack spacing, and compact card variants.
- Small-screen typography and touch targets are part of the base system.

### Performance Considerations

- CSS-first implementation; no theming runtime.
- Avoid new JS wrappers unless they remove meaningful duplication.
- Keep primitive components presentational.

### Risk Level

- `Low`

### Rollout Order

1. Token layer
2. Shared shell classes
3. Button/chip/panel primitives
4. Loading and skeleton primitives

### Testing Requirements

- Visual smoke check: landing, login, dashboard shell
- `npm run lint`
- `npm run build`

---

## Phase 2 - App Shell Modernization

### Priority

- `P1`

### Purpose

Modernize the application shell, navigation, and error/loading framing without changing routing or business logic.

### Target React Files

- [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx)
- [src/components/AppErrorBoundary.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/AppErrorBoundary.jsx)
- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/components/dashboard/Header.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Header.jsx)
- [src/components/dashboard/Sidebar.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Sidebar.jsx)
- [src/components/dashboard/QuickAddModal.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/QuickAddModal.jsx)

### Dependencies

- Phase 1 tokens and primitives
- Existing route-level lazy loading
- Current auth and dashboard shell props

### Reusable Components to Extract

- `TopAppBar`
- `SidebarGroup`
- `SidebarItem`
- `QuickActionCluster`
- `ModalShell`
- `FullScreenLoader`
- `EmptyErrorState`

### API/Data Dependencies

- Auth state only
- No new backend dependency

### Firebase/Supabase Touchpoints

- Must not alter Firebase auth hydration behavior
- Must not move Supabase hooks into shell components

### Acceptance Criteria

- Sidebar, header, and quick-add surfaces align with redesign system.
- Error boundary and loading shell remain stable and fail-open.
- Route transitions still rely on existing lazy boundaries.
- No auth refresh regressions.

### Mobile Requirements

- Header remains compact and readable.
- Bottom navigation works with the updated shell hierarchy.
- Quick add behaves like a bottom sheet on small screens.

### Performance Considerations

- Avoid prop-drilling cosmetic state through the full dashboard tree.
- Motion stays subtle and shell-only.
- Keep shell primitives memo-friendly.

### Risk Level

- `Medium`

### Rollout Order

1. Error/loading shell
2. Header
3. Sidebar
4. Quick-add modal
5. Shell spacing cleanup in `Dashboard.jsx`

### Testing Requirements

- Login -> dashboard
- Logout
- Sidebar navigation
- Quick add open/close
- Refresh `/dashboard`
- Route fallback behavior during slow lazy load

---

## Phase 3 - Dashboard Redesign

### Priority

- `P1`

### Purpose

Upgrade the main dashboard reading experience while preserving current state orchestration and tab behavior.

### Target React Files

- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/components/dashboard/PlannerBoard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerBoard.jsx)
- [src/components/dashboard/TaskCard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/TaskCard.jsx)
- [src/styles/dashboard-modern.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/dashboard-modern.css)

### Dependencies

- Phase 1 design system
- Phase 2 shell primitives
- Existing dashboard state and lazy widget loading

### Reusable Components to Extract

- `HeroSummaryCard`
- `SignalPanel`
- `ActionStrip`
- `SecondaryInsightCard`
- `DashboardSectionShell`
- `StickyMobileActionBar`

### API/Data Dependencies

- Existing `behavioralInsights`
- Existing `adaptiveWorkspace`
- Existing `progress`, `plans`, `goals`, `habits`

### Firebase/Supabase Touchpoints

- Firestore remains the operational source of dashboard content
- Supabase read surfaces remain opt-in through existing AI hooks only

### Acceptance Criteria

- Dashboard hero and rail hierarchy are cleaner and more readable.
- Inline cards become reusable panels without changing behavior.
- No new loading deadlocks or hydration issues.
- Dashboard still renders if AI/Supabase data is absent.

### Mobile Requirements

- Hero condenses into a single strong stack.
- Right rail becomes an ordered card feed.
- Heavy charting remains deferred on smaller screens.

### Performance Considerations

- Preserve lazy boundaries.
- Avoid splitting state ownership out of `Dashboard.jsx` prematurely.
- Memoize presentational wrappers around derived metrics only when useful.

### Risk Level

- `Medium`

### Rollout Order

1. Hero stack
2. Right rail layout cleanup
3. Shared section shells
4. Mobile dashboard stack tuning

### Testing Requirements

- Dashboard first load
- Refresh after login
- Tab switching
- Empty AI states
- Mobile shell smoke pass

---

## Phase 4 - Planner Workspace Redesign

### Priority

- `P1`

### Purpose

Modernize the planner workspace and result pairing while preserving current planning contracts and workflow logic.

### Target React Files

- [src/components/dashboard/PlannerTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerTab.jsx)
- [src/components/dashboard/PlannerBoard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerBoard.jsx)
- [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx)

### Dependencies

- Phase 1 form and panel primitives
- Phase 3 dashboard section shells
- Existing Render API planner/follow-up contracts

### Reusable Components to Extract

- `PlannerSectionCard`
- `PlannerIntroCard`
- `PlannerFieldGroup`
- `ResultSectionCard`
- `InsightChipRow`
- `AssistantComposer`

### API/Data Dependencies

- `POST /api/guidance`
- `POST /api/followup`
- Existing result and follow-up payload shapes

### Firebase/Supabase Touchpoints

- Firebase user identity remains the planner actor source
- Supabase memory persistence must remain behind current backend behavior

### Acceptance Criteria

- Planner layout is more structured and calmer.
- Result panel hierarchy is improved without changing data meaning.
- “Why the plan changed” remains visible and stable.
- Follow-up UX remains intact.

### Mobile Requirements

- Planner form and result panel stack cleanly.
- Planner submit and follow-up actions stay reachable without scroll fatigue.
- Result sections collapse gracefully on smaller screens if needed.

### Performance Considerations

- Keep planner form local state unchanged.
- Do not add large client-only orchestration layers.
- Maintain lazy-loaded dashboard parent behavior.

### Risk Level

- `Medium`

### Rollout Order

1. Planner section shells
2. Result section shells
3. Assistant composer and explanation surfaces
4. Mobile planner stack refinement

### Testing Requirements

- Planner create flow
- Follow-up generation flow
- Empty result state
- Loading and timeout states
- Mobile planner + result stack

---

## Phase 5 - Adaptive Intelligence Surfaces

### Priority

- `P1`

### Purpose

Turn the adaptive AI layer into a coherent, premium surface system without changing AI contracts or recommendation logic.

### Target React Files

- [src/components/ai/AdaptiveIntelligenceRail.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveIntelligenceRail.jsx)
- [src/components/ai/AdaptiveHistorySurface.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveHistorySurface.jsx)
- [src/components/ai/AdaptiveWidgetSkeleton.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveWidgetSkeleton.jsx)
- [src/components/ai/useAdaptiveInsightsFeed.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/useAdaptiveInsightsFeed.js)
- [src/components/ai/adaptiveInsightsRepository.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/adaptiveInsightsRepository.js)
- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)

### Dependencies

- Phase 1 card/chip system
- Phase 3 dashboard section shells
- Existing `aiMeta` and adaptive insight fallback logic

### Reusable Components to Extract

- `AdaptiveSignalCard`
- `RiskMeter`
- `InsightFeedCard`
- `RecommendationCard`
- `PatternBarGroup`
- `MemorySnippetCard`

### API/Data Dependencies

- Existing `aiMeta`
- Existing `/api/adaptive-insights`
- Existing local behavioral fallback data

### Firebase/Supabase Touchpoints

- Supabase remains read-only/fail-open from the frontend perspective
- Firebase stays the operational user/session system

### Acceptance Criteria

- Today’s AI focus, momentum, burnout, recovery, and weekly patterns share one card language.
- Adaptive history remains readable with missing or partial data.
- Widget rendering never blocks dashboard paint.
- Realtime or semantic memory absence does not break the UI.

### Mobile Requirements

- AI cards stack in priority order.
- Memory and history surfaces avoid horizontal overflow.
- Recommendation cards remain actionable on touch devices.

### Performance Considerations

- Keep AI widgets lazy-loaded.
- Memoize derived display models, not raw fetched payloads.
- Avoid heavy chart dependencies inside AI cards.

### Risk Level

- `Medium`

### Rollout Order

1. Card language unification
2. Adaptive rail cleanup
3. History/memory surface cleanup
4. Mobile AI feed tuning

### Testing Requirements

- Dashboard with AI data present
- Dashboard with AI data missing
- Adaptive insights API timeout/failure
- Realtime disabled scenario
- Mobile AI card stack

---

## Phase 6 - Analytics and Progress Redesign

### Priority

- `P2`

### Purpose

Modernize progress and analytics surfaces with stronger readability and lower cognitive load while preserving current metrics and chart logic.

### Target React Files

- [src/components/dashboard/ProgressWidget.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ProgressWidget.jsx)
- [src/components/dashboard/AnalyticsChart.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/AnalyticsChart.jsx)
- [src/components/dashboard/DailyProgressTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/DailyProgressTab.jsx)
- [src/components/dashboard/WeeklyProgressTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/WeeklyProgressTab.jsx)

### Dependencies

- Phase 1 metric and panel primitives
- Phase 5 AI surface language for insight summaries

### Reusable Components to Extract

- `DataPanel`
- `MetricBand`
- `TrendSummaryCard`
- `ChartShell`
- `InsightCallout`

### API/Data Dependencies

- Existing progress and analytics service layer
- Existing chart data generation

### Firebase/Supabase Touchpoints

- Firestore remains primary for progress history
- Supabase can inform AI summaries but not replace progress ownership

### Acceptance Criteria

- Charts are framed more clearly but not more complex.
- Textual takeaways are more important than raw graph density.
- Daily and weekly tabs align visually with AI surfaces.
- Empty analytics states remain graceful.

### Mobile Requirements

- Metric summary appears before chart.
- Chart shells remain readable without overflow.
- Secondary detail can collapse under the summary.

### Performance Considerations

- Keep charts deferred.
- Avoid adding new chart libraries.
- Preserve memoized derived analytics data.

### Risk Level

- `Low-Medium`

### Rollout Order

1. Progress widget shell
2. Chart shell
3. Daily progress visual cleanup
4. Weekly progress cleanup

### Testing Requirements

- Progress data present
- Progress data empty
- Slow dashboard load on mobile
- Chart lazy-load timing

---

## Phase 7 - Mobile Responsiveness

### Priority

- `P1`

### Purpose

Systematically optimize all major surfaces for touch, one-handed navigation, and low cognitive load on phones.

### Target React Files

- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/pages/Landing.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/pages/Landing.jsx)
- [src/components/Login.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Login.jsx)
- [src/components/dashboard/PlannerBoard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerBoard.jsx)
- [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx)
- [src/styles/dashboard-modern.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/dashboard-modern.css)
- [src/styles/landing-experience.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/landing-experience.css)
- [src/styles/auth-onboarding.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/auth-onboarding.css)

### Dependencies

- Phases 1 through 6
- Existing mobile bottom nav behavior

### Reusable Components to Extract

- `BottomNavBar`
- `MobileSectionStack`
- `StickyActionFooter`
- `CompactHeroCard`
- `MobileDrawerSheet`

### API/Data Dependencies

- None new

### Firebase/Supabase Touchpoints

- None new; all mobile changes remain presentation-focused

### Acceptance Criteria

- Major screens are usable with minimal zoom/scroll fatigue.
- Bottom nav, planner actions, and AI cards remain easy to reach.
- Text never overflows or occludes adjacent content.
- Heavy secondary content is deferred or collapsed appropriately.

### Mobile Requirements

- This phase is the mobile requirements phase.
- Each major screen must have explicit phone behavior and stack order.

### Performance Considerations

- Mobile-first chunk loading for heavy dashboard children.
- Avoid animation-heavy enters on low-end devices.
- Keep bottom nav and sticky actions layout-stable.

### Risk Level

- `Medium`

### Rollout Order

1. Shell and navigation
2. Planner/result mobile stack
3. AI card feed
4. Landing and auth refinement
5. Small-screen analytics tuning

### Testing Requirements

- 390px width smoke pass across landing, auth, dashboard, planner, insights
- Touch target verification
- Sticky action behavior
- Mobile loading skeleton behavior

---

## Phase 8 - Semantic Memory Visualization

### Priority

- `P2`

### Purpose

Expose semantic memory and adaptive history more clearly without changing the underlying hybrid AI architecture.

### Target React Files

- [src/components/ai/AdaptiveHistorySurface.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveHistorySurface.jsx)
- [src/components/ai/useAdaptiveInsightsFeed.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/useAdaptiveInsightsFeed.js)
- [src/components/ai/adaptiveInsightsRepository.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/adaptiveInsightsRepository.js)
- [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx)

### Dependencies

- Phase 5 AI card system
- Current semantic memory payloads and fallback behavior
- Existing Supabase hybrid read architecture

### Reusable Components to Extract

- `MemoryTimeline`
- `MemoryEvidenceCard`
- `RecommendationHistoryCard`
- `PatternClusterCard`
- `RetrievalContextChip`

### API/Data Dependencies

- Existing adaptive insight response
- Existing semantic memory summary payloads
- Existing follow-up explanation surfaces

### Firebase/Supabase Touchpoints

- Supabase is the semantic memory layer
- Firebase remains the operational account/session layer
- UI must tolerate mirror data absence

### Acceptance Criteria

- Memory surfaces communicate why the AI remembered something.
- Recommendation history reads as a coherent adaptive timeline.
- Missing vector or semantic data falls back cleanly.
- Result panel explanation language stays aligned with the dashboard memory story.

### Mobile Requirements

- Timeline becomes stacked memory cards on small screens.
- Chips and metadata remain readable without overflow.

### Performance Considerations

- Memory surfaces remain lazy-loaded.
- Avoid long unvirtualized feeds.
- Keep semantic snippets concise to reduce render and cognitive load.

### Risk Level

- `Medium-High`

### Rollout Order

1. Recommendation history shell
2. Memory evidence cards
3. Timeline grouping
4. Result-panel explanation alignment

### Testing Requirements

- Supabase data available scenario
- Supabase absent scenario
- Adaptive insights timeout scenario
- Small-screen memory feed behavior

---

## Phase 9 - Performance Optimization and Stabilization

### Priority

- `P0`

### Purpose

Lock in the redesigned frontend with strong runtime safety, bundle discipline, and stable async behavior.

### Target React Files

- [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx)
- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/components/ai/useAdaptiveInsightsFeed.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/useAdaptiveInsightsFeed.js)
- [src/components/dashboard/AnalyticsChart.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/AnalyticsChart.jsx)
- [src/components/dashboard/ProgressWidget.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ProgressWidget.jsx)
- [vite.config.js](C:/Users/User/Downloads/projects/life-guidance-pro/vite.config.js)

### Dependencies

- Completion of earlier surface phases
- Existing lazy import guards and dashboard fallback behavior

### Reusable Components to Extract

- `LazyLoadFallback`
- `TimeoutFallbackCard`
- `DeferredSectionShell`
- `StableSkeletonStack`

### API/Data Dependencies

- Existing Render API contracts
- Existing Firebase and Supabase runtime behavior

### Firebase/Supabase Touchpoints

- Ensure duplicate realtime subscriptions are not introduced
- Ensure Firebase auth hydration remains stable
- Ensure Supabase clients remain singletons where intended

### Acceptance Criteria

- No new render loops or hydration mismatches.
- No blank-screen states introduced by redesign phases.
- Heavy chunks remain deferred.
- Dashboard first paint remains stable after refresh/login cycles.

### Mobile Requirements

- Loading and fallback behavior are smooth on slower mobile devices.
- Mobile-first chunk ordering remains intact.

### Performance Considerations

- Reduce chart cost where possible without functional rewrite.
- Avoid new vendor bloat.
- Keep AI widgets memoized only where it reduces real churn.
- Preserve idle analytics loading.

### Risk Level

- `High` because it touches cross-cutting runtime concerns

### Rollout Order

1. Bundle review
2. Async stability audit
3. Lazy/fallback verification
4. Mobile performance pass
5. Final regression sweep

### Testing Requirements

- `npm run lint`
- `npm run build`
- repeated login/refresh cycles
- dashboard tab switching
- planner generation/follow-up
- AI surface fallbacks
- mobile viewport smoke pass

---

## 7. Screen Implementation Matrix

## Landing Page

### Current Component Mapping

- [src/pages/Landing.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/pages/Landing.jsx)
- [src/styles/landing-experience.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/landing-experience.css)

### Redesign Target Behavior

- Keep the current section sequence and CTA logic.
- Increase contrast hierarchy between hero, workflow, AI memory, and proof surfaces.
- Make intelligence feel product-real rather than marketing-only.

### Required Shared UI Primitives

- `GlassPanel`
- `SectionHeader`
- `MetricCard`
- `ActionButton`
- `FeatureGridCard`

### Animation and Motion Expectations

- Soft reveal on section entrance
- CTA hover polish only
- No decorative looping hero effects

### Responsive Behavior

- Hero becomes a stacked first-view composition on mobile.
- Proof and feature grids collapse to one card per row.
- CTA bar remains visible without feeling sticky or heavy.

### State-Management Considerations

- Keep existing local landing interactivity intact.
- Do not introduce app-wide state for marketing surfaces.

## Authentication and Onboarding

### Current Component Mapping

- [src/components/Login.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Login.jsx)
- [src/styles/auth-onboarding.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/auth-onboarding.css)

### Redesign Target Behavior

- Make auth feel calm, trustworthy, and intelligence-forward.
- Preserve Firebase login/signup flow and existing onboarding steps.
- Clarify story panel, trust signals, and mode selection.

### Required Shared UI Primitives

- `FieldShell`
- `ActionButton`
- `StatusBanner`
- `PersonalitySelector`
- `TimelineCard`

### Animation and Motion Expectations

- Panel entrance fade/slide only
- Form state changes remain subtle

### Responsive Behavior

- Story panel shifts below or above form cleanly.
- Form actions stay readable and thumb-friendly.

### State-Management Considerations

- Keep all auth logic local to the existing component and Firebase helpers.
- No new auth provider architecture.

## Dashboard Shell

### Current Component Mapping

- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/components/dashboard/Header.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Header.jsx)
- [src/components/dashboard/Sidebar.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Sidebar.jsx)
- [src/components/dashboard/QuickAddModal.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/QuickAddModal.jsx)

### Redesign Target Behavior

- Present a calmer, more premium operating system shell.
- Make the header/sidebar/hero relationship easier to scan.
- Keep all existing tab routing and dashboard state orchestration.

### Required Shared UI Primitives

- `TopAppBar`
- `SidebarItem`
- `DashboardSectionShell`
- `ModalShell`
- `CompactHeroCard`

### Animation and Motion Expectations

- Sidebar hover and active transitions
- Header action hover polish
- Modal entrance motion only where already expected

### Responsive Behavior

- Sidebar turns into mobile nav and drawer patterns.
- Right rail becomes a stacked card feed.

### State-Management Considerations

- Keep current dashboard-owned state and effects.
- Avoid splitting shell state into new global contexts.

## Planner Workspace

### Current Component Mapping

- [src/components/dashboard/PlannerBoard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerBoard.jsx)
- [src/components/dashboard/PlannerTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerTab.jsx)
- [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx)

### Redesign Target Behavior

- Preserve the current planner mental model.
- Give the form stronger section rhythm and the result panel clearer insight hierarchy.
- Make follow-up guidance feel more like an assistant conversation surface.

### Required Shared UI Primitives

- `PlannerSectionCard`
- `ResultSectionCard`
- `InsightChipRow`
- `AssistantComposer`
- `StickyActionFooter`

### Animation and Motion Expectations

- Section transitions stay calm
- Result updates may crossfade but should not animate excessively

### Responsive Behavior

- Planner and result stack vertically on mobile.
- Actions remain reachable without full-screen scroll fatigue.

### State-Management Considerations

- Keep current planner form and result state shape.
- Keep API payload contracts unchanged.

## Adaptive Intelligence Hub

### Current Component Mapping

- [src/components/ai/AdaptiveIntelligenceRail.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveIntelligenceRail.jsx)
- [src/components/ai/AdaptiveHistorySurface.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveHistorySurface.jsx)
- [src/components/ai/useAdaptiveInsightsFeed.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/useAdaptiveInsightsFeed.js)

### Redesign Target Behavior

- Surface adaptive guidance as a coherent operating layer, not scattered widgets.
- Connect focus, burnout, recovery, momentum, and memory into one visual language.

### Required Shared UI Primitives

- `AdaptiveSignalCard`
- `RiskMeter`
- `InsightFeedCard`
- `RecommendationCard`
- `PatternBarGroup`

### Animation and Motion Expectations

- Small metric and card entrance transitions only
- No constant activity or pulsing indicators

### Responsive Behavior

- Cards reorder by importance on small screens.
- Memory/history cards remain readable as vertical stacks.

### State-Management Considerations

- Keep adaptive hook ownership intact.
- Derived UI models should be memoized locally where needed.

## Analytics and Progress Surfaces

### Current Component Mapping

- [src/components/dashboard/ProgressWidget.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ProgressWidget.jsx)
- [src/components/dashboard/AnalyticsChart.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/AnalyticsChart.jsx)
- [src/components/dashboard/DailyProgressTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/DailyProgressTab.jsx)
- [src/components/dashboard/WeeklyProgressTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/WeeklyProgressTab.jsx)

### Redesign Target Behavior

- Lead with interpretation, not graph density.
- Make progress feel supportive and comprehensible.
- Visually align progress surfaces with the AI layer.

### Required Shared UI Primitives

- `DataPanel`
- `MetricBand`
- `ChartShell`
- `InsightCallout`

### Animation and Motion Expectations

- Minimal chart reveal only after lazy load
- No motion-heavy graph interactions

### Responsive Behavior

- Metrics first, charts second
- Detail and comparison blocks collapse cleanly

### State-Management Considerations

- Preserve current analytics derivation and memoization strategy.
- Do not move chart logic into global state.

## Settings, Profile, Support, and Admin

### Current Component Mapping

- `ProfileTab.jsx`
- `SettingsTab.jsx`
- `SupportTab.jsx`
- `AdminTab.jsx`

### Redesign Target Behavior

- Apply the shared builder/settings surface language.
- Improve information hierarchy and field grouping.
- Preserve current data-entry and support/admin flows.

### Required Shared UI Primitives

- `SettingsSectionCard`
- `ToggleRow`
- `ActionListItem`
- `SupportNoticeCard`

### Animation and Motion Expectations

- Minimal; mostly static management screens

### Responsive Behavior

- Sections stack into single-column forms/cards
- Actions remain accessible without deep nesting

### State-Management Considerations

- Leave settings and admin logic where it currently lives.
- Avoid introducing cross-tab dependencies.

---

## 8. Testing Matrix by Phase

| Phase | Core Verification |
|---|---|
| Phase 1 | visual smoke on landing/auth/dashboard shell; build + lint |
| Phase 2 | login/logout, refresh, sidebar nav, quick add modal, lazy route fallback |
| Phase 3 | dashboard first load, right rail render, tab switching, mobile shell |
| Phase 4 | planner create, follow-up, result rendering, mobile planner stack |
| Phase 5 | adaptive insights present/absent, timeout fallback, AI widget lazy load |
| Phase 6 | progress views, analytics chart lazy load, empty analytics states |
| Phase 7 | 390px viewport pass across key screens, touch target review |
| Phase 8 | semantic memory available/empty, recommendation history readability |
| Phase 9 | repeated refresh/login cycles, bundle health, mobile performance smoke |

## 9. Recommended Implementation Order

1. Phase 1 - Design system core
2. Phase 2 - App shell modernization
3. Phase 3 - Dashboard redesign
4. Phase 4 - Planner workspace redesign
5. Phase 5 - Adaptive intelligence surfaces
6. Phase 6 - Analytics and progress redesign
7. Phase 7 - Mobile responsiveness
8. Phase 8 - Semantic memory visualization
9. Phase 9 - Performance optimization and stabilization

## 10. Exit Criteria for the Modernization Program

The redesign implementation is ready to be treated as complete when:

- all major product surfaces use the shared design primitives
- landing, auth, dashboard, planner, AI surfaces, and analytics align visually
- Firebase and Render flows remain contract-compatible
- Supabase semantic-memory surfaces remain additive and fail-open
- lazy loading and bundle safety are preserved
- mobile experience is first-class rather than compressed desktop UI
- no new runtime instability was introduced during the visual modernization
