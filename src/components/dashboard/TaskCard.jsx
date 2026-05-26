import { HiOutlineArrowTrendingUp, HiOutlineBolt, HiOutlineCheckBadge } from "react-icons/hi2";
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/index.js";
import { cn } from "../../lib/cn.js";

const ICONS = {
  task: HiOutlineBolt,
  progress: HiOutlineArrowTrendingUp,
  completed: HiOutlineCheckBadge,
};

const toneClasses = {
  task: "task-card-premium--task",
  progress: "task-card-premium--progress",
  completed: "task-card-premium--completed",
};

function TaskCard({ eyebrow, title, body, meta, tone = "task" }) {
  const Icon = ICONS[tone] || ICONS.task;

  return (
    <article className="task-card-motion-shell">
      <Card padded={false} className={cn("task-card-premium", toneClasses[tone])}>
        <CardHeader className="task-card-head">
          <div className="task-card-copy">
            <Badge className="task-card-eyebrow">{eyebrow}</Badge>
            <CardTitle className="task-card-title">{title}</CardTitle>
          </div>
          <div className="task-card-icon">
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="task-card-body">{body}</p>
        </CardContent>
        {meta ? (
          <CardFooter>
            <span className="task-card-meta">{meta}</span>
          </CardFooter>
        ) : null}
      </Card>
    </article>
  );
}

export default TaskCard;
