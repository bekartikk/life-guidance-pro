import { Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function QuickActionsCard({ actions }) {
  return (
    <Card className="structured-plan-card" tone="soft">
      <CardHeader><CardTitle>Three actions for today</CardTitle></CardHeader>
      <CardContent><ol className="structured-plan-list">{actions.map((action) => <li key={action.title}><strong>{action.title}</strong><span>{action.detail}</span></li>)}</ol></CardContent>
    </Card>
  );
}
