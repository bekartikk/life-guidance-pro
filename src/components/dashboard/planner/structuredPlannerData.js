export function hasStructuredPlannerData(plan) {
  return Boolean(plan?.summary && plan?.dailyFocus && Array.isArray(plan?.quickActions) && Array.isArray(plan?.routinePlan));
}
