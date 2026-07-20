import { DailyFocusCard } from "./DailyFocusCard.jsx";
import { InsightsCard } from "./InsightsCard.jsx";
import { PlannerSummaryCard } from "./PlannerSummaryCard.jsx";
import { QuickActionsCard } from "./QuickActionsCard.jsx";
import { RecoveryCard } from "./RecoveryCard.jsx";
import { ReflectionCard } from "./ReflectionCard.jsx";
import { RoadmapCard } from "./RoadmapCard.jsx";
import { RoutineTimeline } from "./RoutineTimeline.jsx";
import { hasStructuredPlannerData } from "./structuredPlannerData.js";

export function StructuredPlanner({ plan }) {
  if (!hasStructuredPlannerData(plan)) return null;
  return (
    <section className="structured-planner" aria-label="Structured guidance plan">
      <PlannerSummaryCard summary={plan.summary} />
      <div className="structured-plan-grid"><DailyFocusCard focus={plan.dailyFocus} /><QuickActionsCard actions={plan.quickActions} /></div>
      <RoutineTimeline phases={plan.routinePlan} />
      <RoadmapCard roadmap={plan.roadmap || []} />
      <InsightsCard insights={plan.insights || []} />
      <RecoveryCard recovery={plan.recovery || { lonelyMoments: [], difficultDayPlan: [] }} />
      <ReflectionCard customization={plan.customization || []} nextQuestion={plan.nextQuestion || "What would make tomorrow easier?"} privacyNote={plan.privacyNote || ""} />
    </section>
  );
}
