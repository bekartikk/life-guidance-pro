# Life Guidance Pro Component Implementation Map

This document maps the redesign system in
[FIGMA_REDESIGN_EXECUTION_PLAN.md](C:/Users/User/Downloads/projects/life-guidance-pro/FIGMA_REDESIGN_EXECUTION_PLAN.md)
back to the current React + Vite codebase.

Use it for:

- manual Figma reconstruction
- React implementation planning
- UI refactor sequencing
- design QA against the live product architecture

The goal is not to invent a new app structure. The goal is to upgrade the existing one safely.

## 1. Core App Shell Mapping

| Product Surface | Current File | Role in Current App | Redesign Responsibility |
|---|---|---|---|
| App router shell | [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx) | auth gate, lazy routes, route shell | preserve route structure, improve loading polish only |
| App entry | [src/main.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/main.jsx) | boot React, analytics init | no layout responsibility |
| Global shell styles | [src/App.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.css) | legacy app-wide styling | gradually reduce in favor of scoped system styles |
| Global index styles | [src/index.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/index.css) | global resets/base rules | maintain token bridge and app background |

## 2. Landing Page Mapping

### Main Screen

- Current file:
  - [src/pages/Landing.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/pages/Landing.jsx)
- Primary styles:
  - [src/styles/landing-experience.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/landing-experience.css)

### Redesign Sections to Map

| Redesign Section | Current JSX Area | Notes |
|---|---|---|
| Navbar | landing nav block in `Landing.jsx` | keep CTA structure, upgrade spacing/hierarchy |
| Hero | `landing-hero` | preserve CTA logic and metrics, improve premium framing |
| Audience fit grid | `audienceCards` section | convert into stronger design-system card pattern |
| How AI works | `workflowSteps` section | maintain structure, improve step rhythm |
| AI memory | `memoryInsights` section | turn into premium memory card stack |
| Hobby to income | `hobbyRoadmap` section | convert to clearer roadmap rail |
| Daily check-ins | `checkinSignals` section | make phone preview + explanation pairing |
| Analytics | `analyticsCards` section | keep content, improve visual hierarchy |
| Demo modes | `demoModes` section | turn into polished tabbed preview shell |
| Journeys | `journeys` section | use consistent testimonial / case-study cards |
| Trust | trust/privacy section | keep direct language, improve card structure |

### Design Notes

- `Landing.jsx` is already structurally rich, so implementation should mostly be a componentization and hierarchy pass, not a rewrite.
- The mobile progressive reveal behavior already exists and should be preserved.

## 3. Authentication + Onboarding Mapping

### Main Screen

- Current file:
  - [src/components/Login.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Login.jsx)
- Styles:
  - [src/styles/auth-onboarding.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/auth-onboarding.css)

### Redesign Mapping

| Redesign Module | Current Source | Notes |
|---|---|---|
| Back link | top of `Login.jsx` | keep routing behavior |
| Story panel | `auth-story-panel` | upgrade typography and card layering |
| Trust signals | `trustSignals` | convert to reusable checklist row component |
| Setup journey | `onboardingSteps` | convert to timeline/progress card |
| Personality preview | `coachModes` | map into reusable AI personality selector |
| Auth card | `auth-form-panel` | preserve login/signup flow and Firebase behavior |
| Mode switch | `auth-mode-switch` | convert to system segmented control |
| Form fields | email/password labels | standardize field components for app-wide reuse |
| Social auth | Google action | keep logic, upgrade button system |
| Feedback messages | message strip | convert to reusable status banner |

### Design Notes

- This screen is already the right product surface; the redesign should mostly improve:
  - visual hierarchy
  - trust communication
  - personality selection polish
  - mobile readability

## 4. Dashboard Shell Mapping

### Main Screen

- Current file:
  - [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- Styles:
  - [src/styles/dashboard-modern.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/dashboard-modern.css)

This is the most important implementation file in the product.

### Main Structural Areas in `Dashboard.jsx`

| Redesign Surface | Current Component / Area | File |
|---|---|---|
| Left sidebar | `Sidebar` | [src/components/dashboard/Sidebar.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Sidebar.jsx) |
| Top header | `Header` | [src/components/dashboard/Header.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Header.jsx) |
| Dashboard hero | `dashboard-hero-grid` area in `Dashboard.jsx` | inline composition in dashboard |
| Planner shell | `PlannerBoard` | [src/components/dashboard/PlannerBoard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerBoard.jsx) |
| Quick add modal | `QuickAddModal` | [src/components/dashboard/QuickAddModal.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/QuickAddModal.jsx) |
| Result panel | `ResultPanel` | [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx) |
| Mobile bottom nav | `dashboard-bottom-nav` block in `Dashboard.jsx` | inline composition in dashboard |
| Right intelligence rail | stacked right-column sections in `Dashboard.jsx` | composed from lazy widgets and inline cards |

### Dashboard Refactor Priority

1. stabilize and restyle shell primitives first
2. convert inline hero/intelligence cards into reusable system cards
3. preserve all current data/state logic in `Dashboard.jsx`
4. move visual complexity into component props and CSS, not new app state

## 5. Planner Workspace Mapping

### Main Surfaces

- Current file:
  - [src/components/dashboard/PlannerTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerTab.jsx)
- Parent shell:
  - [src/components/dashboard/PlannerBoard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/PlannerBoard.jsx)

### Redesign Mapping

| Redesign Module | Current Source | Notes |
|---|---|---|
| Planner intro hero | planner top section in `PlannerTab.jsx` | convert to reusable planner intro card |
| Guided steps | form sections in `PlannerTab.jsx` | preserve current product logic exactly |
| Accordion structure | existing step groupings | standardize visually as planner step cards |
| Consent / final submit area | planner action footer | make sticky on mobile |
| Result-empty state | handled in `Dashboard.jsx` + `ResultPanel.jsx` conditions | keep behavior, improve visual surface |
| Result-loading state | handled in `Dashboard.jsx` | convert into system loading card |

### Design Notes

- This is not a wizard rewrite.
- The redesign should keep the same mental model:
  - form on one side
  - result on the other
  - mobile stacked

## 6. Result Experience Mapping

### Main Surface

- Current file:
  - [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx)

### Redesign Modules

| Redesign Module | Current Source Area | Notes |
|---|---|---|
| Result header | top of `ResultPanel.jsx` | title + saved time + controls |
| Summary strip | current summary zones / AI meta areas | convert into premium signal cards |
| Key shifts / Today / Next 7 days / Longer horizon | result sections | preserve content model, improve hierarchy |
| Daily check-in | current check-in region | keep form logic, improve readability |
| Rewards / wins | reward summary portions | convert into compact metric band |
| Why the plan changed | existing tiny explanation surface | keep as explanation module |
| Adjust plan | follow-up input / adjust flow | convert to assistant composer pattern |

### Design Notes

- This is one of the most important “AI feeling” surfaces.
- Avoid dense prose blocks; restructure into cards, chips, and collapsible grouped sections.

## 7. Adaptive Intelligence Surface Mapping

### Main AI Components

- [src/components/ai/AdaptiveIntelligenceRail.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveIntelligenceRail.jsx)
- [src/components/ai/AdaptiveHistorySurface.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveHistorySurface.jsx)
- [src/components/ai/AdaptiveWidgetSkeleton.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveWidgetSkeleton.jsx)
- [src/components/ai/useAdaptiveInsightsFeed.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/useAdaptiveInsightsFeed.js)
- [src/components/ai/adaptiveInsightsRepository.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/adaptiveInsightsRepository.js)

### Redesign Mapping

| Redesign Module | Current File | Notes |
|---|---|---|
| Today’s AI Focus | `AdaptiveIntelligenceRail.jsx` | keep as top AI signal card |
| Momentum Score | `AdaptiveIntelligenceRail.jsx` / `ProgressWidget.jsx` | align both visually |
| Burnout Risk | `AdaptiveIntelligenceRail.jsx` | convert to meter + recommendation card |
| Recovery Suggestions | `AdaptiveIntelligenceRail.jsx` | needs action-oriented card design |
| Cognitive Load | `AdaptiveIntelligenceRail.jsx` | compact interpretation card |
| Weekly Pattern | `AdaptiveIntelligenceRail.jsx` | use lightweight chart or bars |
| Adaptive history | `AdaptiveHistorySurface.jsx` | history feed + trend grouping |
| Semantic memory surfaces | `AdaptiveHistorySurface.jsx` | keep as remembered-pattern cards |

### Design Notes

- These should feel like a coherent AI system, not random cards.
- Use one consistent AI card language across all of them.

## 8. Progress + Analytics Mapping

### Main Components

- [src/components/dashboard/ProgressWidget.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ProgressWidget.jsx)
- [src/components/dashboard/AnalyticsChart.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/AnalyticsChart.jsx)
- [src/components/dashboard/DailyProgressTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/DailyProgressTab.jsx)
- [src/components/dashboard/WeeklyProgressTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/WeeklyProgressTab.jsx)

### Redesign Mapping

| Redesign Module | Current File | Notes |
|---|---|---|
| Progress summary card | `ProgressWidget.jsx` | keep lightweight, more premium hierarchy |
| Trend chart | `AnalyticsChart.jsx` | keep chart logic, improve panel shell only |
| Daily insight surface | `DailyProgressTab.jsx` | align with AI insight system |
| Weekly consistency surface | `WeeklyProgressTab.jsx` | use same data-widget language |

### Design Notes

- Visual redesign should not increase chart complexity.
- Textual takeaways should remain more important than the graph itself.

## 9. Goals / Habits / Routine / Career / Income Mapping

### Files

- [src/components/dashboard/GoalTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/GoalTab.jsx)
- [src/components/dashboard/HabitTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/HabitTab.jsx)
- [src/components/dashboard/RoutineBuilderTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/RoutineBuilderTab.jsx)
- [src/components/dashboard/CareerExplorerTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/CareerExplorerTab.jsx)
- [src/components/dashboard/HobbyIncomeTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/HobbyIncomeTab.jsx)

### Redesign Role

These tabs should share one common “builder surface” system:

- builder header
- context paragraph
- primary form card
- supporting insight card if needed
- list/history card under the form

Use the same component family for:

- form section cards
- small saved item cards
- action footer rows

## 10. Review / Reflection Mapping

### Files

- [src/components/dashboard/WeeklyReviewTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/WeeklyReviewTab.jsx)
- [src/components/dashboard/MonthlyReviewTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/MonthlyReviewTab.jsx)
- [src/components/dashboard/HistoryTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/HistoryTab.jsx)

### Redesign Role

These should use a reflection/timeline visual language:

- recap cards
- prompt cards
- memory/history list rows
- expandable detail areas

## 11. Profile / Feedback / Reminders / Settings / Support / Admin Mapping

### Files

- [src/components/dashboard/ProfileTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ProfileTab.jsx)
- [src/components/dashboard/FeedbackTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/FeedbackTab.jsx)
- [src/components/dashboard/ReminderTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ReminderTab.jsx)
- [src/components/dashboard/SettingsTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/SettingsTab.jsx)
- [src/components/dashboard/SupportTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/SupportTab.jsx)
- [src/components/dashboard/AdminTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/AdminTab.jsx)

### Redesign Role

These should become a shared “utility surface” family:

- section header
- simple form panel
- compact action list
- calm destructive-action zone

Admin stays more utilitarian than the rest of the app.

## 12. Skeleton + Loading State Mapping

### Current Files

- [src/components/ai/AdaptiveWidgetSkeleton.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveWidgetSkeleton.jsx)
- inline dashboard skeleton areas in [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)

### Redesign Role

All loading states should use the same skeleton language:

- muted dark surface
- 2-4 shimmer lines
- one subtle pulse block
- no bright flashing

## 13. Shared Visual System Refactor Targets

### Good Candidates for Reusable Design Components

Build in Figma and later reflect in code as reusable patterns:

1. app shell header
2. sidebar item
3. primary action button
4. ghost button
5. segmented switch
6. planner section card
7. AI signal card
8. AI recommendation card
9. memory card
10. chart container
11. utility form panel
12. mobile nav item

## 14. Tailwind / CSS Implementation Strategy

### Phase 1

Use current CSS files, but map new component classes into:

- [src/styles/dashboard-modern.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/dashboard-modern.css)
- [src/styles/landing-experience.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/landing-experience.css)
- [src/styles/auth-onboarding.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/auth-onboarding.css)

### Phase 2

Extract repeated primitives into shared class patterns or component wrappers.

Do not start by rewriting all styling architecture at once.

## 15. Suggested Implementation Order

1. dashboard shell primitives
2. result panel primitives
3. AI insight cards
4. planner step cards
5. auth surface refinement
6. landing page section system
7. mobile nav + mobile dashboard
8. utility tabs

## 16. What Must Not Change

Do not break:

- Firebase auth flow
- planner generation flow
- dashboard routing
- Supabase hybrid architecture
- adaptive intelligence data surfaces
- existing lazy-load behavior

This redesign maps onto the current product. It does not replace the product.

