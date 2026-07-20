import { Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function InsightsCard({ insights }) {
  return (
    <Card className="structured-plan-card" tone="soft">
      <CardHeader><CardTitle>Problem-solving insights</CardTitle></CardHeader>
      <CardContent><div className="structured-insights">{insights.map((insight) => <article key={insight.title}><strong>{insight.title}</strong><p>{insight.detail}</p><small>Why: {insight.why}</small></article>)}</div></CardContent>
    </Card>
  );
}
