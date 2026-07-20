import { Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function RecoveryCard({ recovery }) {
  return (
    <Card className="structured-plan-card" tone="elevated">
      <CardHeader><CardTitle>Recovery plan</CardTitle></CardHeader>
      <CardContent className="structured-recovery"><div><strong>For lonely or low-energy moments</strong><ul className="result-rich-list">{recovery.lonelyMoments.map((item) => <li key={item}>{item}</li>)}</ul></div><div><strong>When the day gets difficult</strong><ul className="result-rich-list">{recovery.difficultDayPlan.map((item) => <li key={item}>{item}</li>)}</ul></div></CardContent>
    </Card>
  );
}
