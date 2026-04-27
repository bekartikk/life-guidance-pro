function RoutineBuilderTab({
  builderDraft,
  blockDraft,
  savedItems,
  isSaving,
  onBuilderChange,
  onBlockChange,
  onAddBlock,
  onRemoveBlock,
  onToggleLock,
  onSave,
  onDelete,
  onExportCalendar,
}) {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Routine Builder</p>
          <h2>Shape a weekly blueprint block by block</h2>
          <p className="muted-text">
            This is the first foundation for a smarter routine builder. You can lock the pieces that must stay fixed and export them as calendar events.
          </p>
        </div>
      </div>

      <div className="split-progress-grid">
        <form className="planner-form" onSubmit={onSave}>
          <div className="form-section">
            <div className="section-heading">
              <h3>Blueprint setup</h3>
              <p>Build a weekly structure that later AI adjustments can respect instead of overwriting blindly.</p>
            </div>

            <div className="two-column">
              <label>
                Blueprint name
                <input name="title" value={builderDraft.title} onChange={onBuilderChange} placeholder="Exam week, calm week, work reset..." />
              </label>
              <label>
                Notes
                <input name="notes" value={builderDraft.notes} onChange={onBuilderChange} placeholder="What is this routine trying to protect?" />
              </label>
            </div>

            <div className="two-column">
              <label>
                Wake time
                <input name="wakeTime" value={builderDraft.wakeTime} onChange={onBuilderChange} placeholder="7:00 AM" />
              </label>
              <label>
                Sleep time
                <input name="sleepTime" value={builderDraft.sleepTime} onChange={onBuilderChange} placeholder="11:30 PM" />
              </label>
            </div>

            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h3>Add a block</h3>
                  <p className="muted-text">These blocks become the first version of a routine map and calendar export.</p>
                </div>
              </div>

              <div className="routine-block-grid">
                <label>
                  Day
                  <select name="day" value={blockDraft.day} onChange={onBlockChange}>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </label>
                <label>
                  Time
                  <input name="time" value={blockDraft.time} onChange={onBlockChange} placeholder="6:00 PM" />
                </label>
                <label>
                  Type
                  <select name="type" value={blockDraft.type} onChange={onBlockChange}>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="exercise">Exercise</option>
                    <option value="rest">Rest</option>
                    <option value="hobby">Hobby</option>
                    <option value="social">Social</option>
                    <option value="sleep">Sleep</option>
                  </select>
                </label>
                <label>
                  Block label
                  <input name="label" value={blockDraft.label} onChange={onBlockChange} placeholder="Deep work, sketching, walk..." />
                </label>
              </div>

              <button type="button" className="secondary-button" onClick={onAddBlock}>
                Add block
              </button>
            </div>

            <div className="goal-list">
              {builderDraft.blocks.length === 0 ? (
                <p className="muted-text">No blocks yet. Add a few anchors before saving the blueprint.</p>
              ) : (
                builderDraft.blocks.map((block, index) => (
                  <article key={`${block.day}-${block.time}-${index}`} className="goal-card">
                    <div className="goal-card-header">
                      <div>
                        <strong>{block.day} · {block.time}</strong>
                        <span className="goal-meta">{block.type} · {block.label}</span>
                      </div>
                      <div className="history-actions">
                        <button type="button" onClick={() => onToggleLock(index)}>
                          {block.locked ? "Unlock" : "Lock"}
                        </button>
                        <button type="button" className="danger-button" onClick={() => onRemoveBlock(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="action-row">
              <button className="primary-button" type="submit" disabled={isSaving}>
                {isSaving ? "Saving blueprint..." : "Save routine blueprint"}
              </button>
              <button type="button" className="secondary-button" onClick={onExportCalendar} disabled={builderDraft.blocks.length === 0}>
                Export calendar file
              </button>
            </div>
          </div>
        </form>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Saved blueprints</h3>
              <p className="muted-text">These become reusable routine structures for different seasons of life.</p>
            </div>
            <p className="feedback-badge">{savedItems.length} saved</p>
          </div>

          {savedItems.length === 0 ? (
            <p className="muted-text">Save your first routine blueprint to start building reusable weekly structures.</p>
          ) : (
            <div className="goal-list">
              {savedItems.slice(0, 8).map((item) => (
                <article key={item.id} className="goal-card">
                  <div className="goal-card-header">
                    <div>
                      <strong>{item.title}</strong>
                      <span className="goal-meta">{item.blocks?.length || 0} blocks · wake {item.wakeTime || "—"} · sleep {item.sleepTime || "—"}</span>
                    </div>
                    <button type="button" className="danger-button" onClick={() => onDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                  <div className="goal-milestones">
                    {(item.blocks || []).slice(0, 6).map((block, index) => (
                      <span key={`${item.id}-${index}`} className="goal-milestone-chip">
                        {block.day} {block.time} {block.label}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default RoutineBuilderTab;
