import { Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function RoadmapCard({ roadmap }) {
  return (
    <Card className="structured-plan-card" tone="soft">
      <CardHeader><CardTitle>Roadmap</CardTitle></CardHeader>
      <CardContent><div className="structured-roadmap">{roadmap.map((step) => <article key={step.phase}><h4>{step.phase}</h4><p>{step.goal}</p><ul className="result-rich-list">{step.milestones.map((milestone) => <li key={milestone}>{milestone}</li>)}</ul><small>Recovery guard: {step.recoveryGuard}</small></article>)}</div></CardContent>
    </Card>
  );
}
