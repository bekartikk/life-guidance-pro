/**
 * src/components/skeletons/index.js
 *
 * Public API for all loading skeleton components.
 *
 * Usage:
 *   import { LoadingCard, LoadingPlanner } from "../skeletons/index.js";
 *
 * Available skeletons:
 *   LoadingCard       – Generic single-panel card skeleton.
 *   LoadingTable      – Tabular data skeleton with configurable rows/columns.
 *   LoadingDashboard  – Full-page dashboard layout skeleton (sidebar + hero + content).
 *   LoadingAnalytics  – Analytics / weekly-progress skeleton with a bar-chart area.
 *   LoadingProfile    – Profile tab skeleton (form inputs + action row).
 *   LoadingPlanner    – Planner tab skeleton (4-step accordion + result panel).
 *   LoadingGoals      – Goal tab skeleton (form + goal card list).
 *   LoadingHabits     – Habit tab skeleton (form + habit card list).
 *   LoadingChat       – AI Coach tab skeleton (quick prompts + message thread + input).
 *
 * Lower-level shared primitives (Shimmer, SkeletonCard, SkeletonLine, …) are
 * exported from SkeletonBase.jsx for cases where you need to compose a bespoke
 * skeleton inside a feature component.
 */

export { default as LoadingCard }      from "./LoadingCard.jsx";
export { default as LoadingTable }     from "./LoadingTable.jsx";
export { default as LoadingDashboard } from "./LoadingDashboard.jsx";
export { default as LoadingAnalytics } from "./LoadingAnalytics.jsx";
export { default as LoadingProfile }   from "./LoadingProfile.jsx";
export { default as LoadingPlanner }   from "./LoadingPlanner.jsx";
export { default as LoadingGoals }     from "./LoadingGoals.jsx";
export { default as LoadingHabits }    from "./LoadingHabits.jsx";
export { default as LoadingChat }      from "./LoadingChat.jsx";

/* Primitives – expose for bespoke skeleton composition */
export {
  Shimmer,
  SkeletonLine,
  SkeletonParagraph,
  SkeletonSectionHeader,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonInput,
  SkeletonTextarea,
  SkeletonButton,
  SkeletonKpi,
  SkeletonBadge,
} from "./SkeletonBase.jsx";
