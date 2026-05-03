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
      className="saas-panel flex h-full flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
          <h3 className="text-lg font-semibold leading-7 text-slate-100">{title}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-blue-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm leading-6 text-slate-400">{body}</p>
      {meta ? <span className="mt-auto text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{meta}</span> : null}
    </MotionArticle>
  );
}

export default TaskCard;
