import { motion } from "framer-motion";
import { HiOutlineMoon, HiOutlinePlus, HiOutlineSparkles } from "react-icons/hi2";

const MotionHeader = motion.header;

function Header({ title, description, onQuickAdd, focusMode, onToggleFocus }) {
  return (
    <MotionHeader
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="saas-panel flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="space-y-2">
        <p className="saas-pill w-fit">
          <HiOutlineSparkles className="h-3.5 w-3.5" />
          Workspace
        </p>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 lg:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 lg:text-base">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onToggleFocus} className="saas-button-secondary">
          <HiOutlineMoon className="h-4 w-4" />
          {focusMode ? "Exit Focus" : "Focus Mode"}
        </button>
        <button type="button" onClick={onQuickAdd} className="saas-button-primary">
          <HiOutlinePlus className="h-4 w-4" />
          Add Task
        </button>
      </div>
    </MotionHeader>
  );
}

export default Header;
