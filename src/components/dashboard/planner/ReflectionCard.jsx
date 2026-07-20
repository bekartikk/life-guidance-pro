import { Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function ReflectionCard({ customization, nextQuestion, privacyNote }) {
  return (
    <Card className="structured-plan-card" tone="soft">
      <CardHeader><CardTitle>Reflect and adapt</CardTitle></CardHeader>
      <CardContent><strong>{nextQuestion}</strong><ul className="result-rich-list">{customization.map((item) => <li key={item}>{item}</li>)}</ul><small>{privacyNote}</small></CardContent>
    </Card>
  );
}
