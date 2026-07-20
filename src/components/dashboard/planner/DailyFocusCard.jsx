import { Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function DailyFocusCard({ focus }) {
  return (
    <Card className="structured-plan-card" tone="soft">
      <CardHeader><CardTitle>{focus.title}</CardTitle></CardHeader>
      <CardContent><strong>{focus.todayTarget}</strong><p>{focus.whyItMatters}</p></CardContent>
    </Card>
  );
}
