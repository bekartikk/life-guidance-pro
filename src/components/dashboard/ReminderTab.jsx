function ReminderTab({
  reminderSettings,
  isSaving,
  notificationState,
  onChange,
  onEnableNotifications,
  onSendTestReminder,
  onSubmit,
}) {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Reminders & Calendar Prep</p>
          <h2>Prepare gentle reminders before full notification delivery</h2>
          <p className="muted-text">
            This phase stores the reminder preferences and review rhythm we can later connect to browser, email, or calendar delivery.
          </p>
        </div>
      </div>

      <form className="planner-form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="section-heading">
            <h3>Reminder preferences</h3>
            <p>These settings give us a clean foundation for later notification and calendar integrations.</p>
          </div>

          <div className="two-column">
            <label className="consent-box">
              <input
                type="checkbox"
                name="dailyEnabled"
                checked={reminderSettings.dailyEnabled}
                onChange={onChange}
              />
              <span>Use a daily routine reminder</span>
            </label>
            <label>
              Daily reminder time
              <input
                type="time"
                name="dailyTime"
                value={reminderSettings.dailyTime}
                onChange={onChange}
                placeholder="07:30"
              />
            </label>
          </div>

          <div className="two-column">
            <label>
              Weekly review day
              <select name="weeklyDay" value={reminderSettings.weeklyDay} onChange={onChange}>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </label>
            <label>
              Weekly review time
              <input
                type="time"
                name="weeklyTime"
                value={reminderSettings.weeklyTime}
                onChange={onChange}
                placeholder="20:00"
              />
            </label>
          </div>

          <div className="two-column">
            <label className="consent-box">
              <input
                type="checkbox"
                name="comebackEnabled"
                checked={reminderSettings.comebackEnabled}
                onChange={onChange}
              />
              <span>Use comeback reminders after missed routine days</span>
            </label>
            <label>
              Motivation style
              <select name="motivationStyle" value={reminderSettings.motivationStyle} onChange={onChange}>
                <option value="gentle">Gentle</option>
                <option value="direct">Direct</option>
                <option value="mentor">Mentor-style</option>
              </select>
            </label>
          </div>

          <label>
            Notes for future notifications
            <textarea
              name="notes"
              value={reminderSettings.notes}
              onChange={onChange}
              placeholder="What kind of reminder tone or timing usually helps you?"
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving reminder settings..." : "Save reminder settings"}
          </button>
          <div className="action-row">
            <button type="button" className="secondary-button" onClick={onEnableNotifications}>
              {notificationState === "granted" ? "Browser notifications enabled" : "Enable browser reminders"}
            </button>
            <button type="button" className="secondary-button" onClick={onSendTestReminder}>
              Send test reminder
            </button>
          </div>
          <p className="muted-text">
            Browser reminders work while this device supports notifications. Email and push delivery still need later live-service setup.
          </p>
        </div>
      </form>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>What this unlocks later</h3>
            <p className="muted-text">These preferences are the bridge into later reminder delivery.</p>
          </div>
        </div>
        <div className="goal-list">
          <article className="goal-card">
            <strong>Browser reminders</strong>
            <p>Later we can connect these settings to browser notifications.</p>
          </article>
          <article className="goal-card">
            <strong>Email summaries</strong>
            <p>Weekly review reminders and comeback emails can use this same schedule data.</p>
          </article>
          <article className="goal-card">
            <strong>Calendar sync</strong>
            <p>The stored reminder rhythm can inform recurring calendar events and review sessions.</p>
          </article>
        </div>
      </section>
    </section>
  );
}

export default ReminderTab;
