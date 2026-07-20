import { Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function PlannerSummaryCard({ summary }) {
  return (
    <Card className="structured-plan-card structured-plan-summary" tone="elevated">
      <CardHeader><CardTitle>Quick understanding</CardTitle></CardHeader>
      <CardContent>
        <p>{summary.quickUnderstanding}</p>
        <blockquote className="result-rich-callout">{summary.motivationalNote}</blockquote>
        <p>{summary.mainPlanSummary}</p>
      </CardContent>
    </Card>
  );
}
