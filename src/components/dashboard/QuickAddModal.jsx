import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

const MotionDiv = motion.div;

function QuickAddModal({
  isOpen,
  type,
  title,
  note,
  onTypeChange,
  onTitleChange,
  onNoteChange,
  onClose,
  onSubmit,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        >
          <MotionDiv
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="saas-panel w-full max-w-xl p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="saas-pill w-fit">Quick add</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-50">Capture the next useful thing</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Drop in a goal, habit, or planner note without leaving your current flow.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
                aria-label="Close modal"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-300">
                  Type
                  <select className="saas-input mt-2" value={type} onChange={onTypeChange}>
                    <option value="goal">Goal</option>
                    <option value="habit">Habit</option>
                    <option value="planner">Planner note</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  Title
                  <input
                    className="saas-input mt-2"
                    value={title}
                    onChange={onTitleChange}
                    placeholder="What should we capture?"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-300">
                Notes
                <textarea
                  className="saas-input mt-2 min-h-[120px]"
                  value={note}
                  onChange={onNoteChange}
                  placeholder="Add just enough context to make the next step obvious."
                />
              </label>

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="saas-button-secondary">
                  Cancel
                </button>
                <button type="submit" className="saas-button-primary">
                  Save and continue
                </button>
              </div>
            </form>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}

export default QuickAddModal;
