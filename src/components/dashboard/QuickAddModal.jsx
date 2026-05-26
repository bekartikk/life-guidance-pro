import { Fragment } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button, Input, Modal, Textarea } from "../ui/index.js";

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
    <Fragment>
      {isOpen ? (
        <Modal open={isOpen} onClose={onClose} className="z-[1200]">
          <div className="w-full quick-add-modal-shell">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="saas-pill w-fit">Quick add</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-50">Capture the next useful thing</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Drop in a goal, habit, or planner note without leaving your current flow.
                </p>
              </div>
              <Button type="button" onClick={onClose} variant="secondary" size="icon" className="rounded-2xl" aria-label="Close modal">
                <HiOutlineXMark className="h-5 w-5" />
              </Button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-300">
                  Type
                  <select className="ds-input ds-focus-ring mt-2" value={type} onChange={onTypeChange}>
                    <option value="goal">Goal</option>
                    <option value="habit">Habit</option>
                    <option value="planner">Planner note</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  Title
                  <Input
                    className="mt-2"
                    value={title}
                    onChange={onTitleChange}
                    placeholder="What should we capture?"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-300">
                Notes
                <Textarea
                  className="mt-2 min-h-[120px]"
                  value={note}
                  onChange={onNoteChange}
                  placeholder="Add just enough context to make the next step obvious."
                />
              </label>

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <Button type="button" onClick={onClose} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">
                  Save and continue
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      ) : null}
    </Fragment>
  );
}

export default QuickAddModal;
