import { Badge, Card, CardContent, CardHeader, CardTitle } from "../../ui/index.js";

export function RoutineTimeline({ phases }) {
  return (
    <Card className="structured-plan-card" tone="elevated">
      <CardHeader><CardTitle>Routine timeline</CardTitle></CardHeader>
      <CardContent><div className="structured-timeline">{phases.map((phase) => <article className="structured-timeline__item" key={phase.phase}><Badge tone="info">{phase.intensity}</Badge><h4>{phase.phase}</h4><p>{phase.focus}</p><ul className="structured-plan-list">{phase.blocks.map((block) => <li key={block.label}><strong>{block.label}</strong><span>{block.detail}</span><small>Fallback: {block.fallback}</small></li>)}</ul></article>)}</div></CardContent>
    </Card>
  );
}
