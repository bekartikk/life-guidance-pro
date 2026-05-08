import { motion } from "framer-motion";
import { HiOutlineArrowTrendingUp, HiOutlineBolt, HiOutlineCheckBadge } from "react-icons/hi2";

const ICONS = {
  task: HiOutlineBolt,
  progress: HiOutlineArrowTrendingUp,
  completed: HiOutlineCheckBadge,
};

const MotionArticle = motion.article;

function TaskCard({ eyebrow, title, body, meta, tone = "task" }) {
  const Icon = ICONS[tone] || ICONS.task;

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.25 }}
      className="saas-panel task-card-premium"
    >
      <div className="task-card-head">
        <div className="task-card-copy">
          <p>{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <div className="task-card-icon">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="task-card-body">{body}</p>
      {meta ? <span className="task-card-meta">{meta}</span> : null}
    </MotionArticle>
  );
}

export default TaskCard;
