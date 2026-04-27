function SettingsTab({
  user,
  profile,
  plans,
  goals,
  habits,
  reviews,
  monthlyReviews,
  checkins,
  rewardEvents,
  careerExplorations,
  hobbyPlans,
  routineBuilders,
  reminderSettings,
  onDeleteMyData,
  onExportData,
  onResendVerification,
  onShareProgress,
}) {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Privacy & Settings</p>
          <h2>Understand and control what is stored</h2>
          <p className="muted-text">
            This page is the foundation for stronger consent, export controls, account safety, and future delivery settings.
          </p>
        </div>
      </div>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>What the app currently stores</h3>
              <p className="muted-text">A plain-language summary for trust and clarity.</p>
            </div>
          </div>
          <div className="goal-list">
            <article className="goal-card">
              <strong>Account</strong>
              <span className="goal-meta">{user.email}</span>
            </article>
            <article className="goal-card">
              <strong>Profile snapshot</strong>
              <span className="goal-meta">{profile.fullName || "No saved name"} - {profile.ageGroup}</span>
            </article>
            <article className="goal-card">
              <strong>Planner data</strong>
              <span className="goal-meta">{plans.length} plans saved</span>
            </article>
            <article className="goal-card">
              <strong>Goal system</strong>
              <span className="goal-meta">{goals.length} goals saved</span>
            </article>
            <article className="goal-card">
              <strong>Habit tracker</strong>
              <span className="goal-meta">{habits.length} habits saved</span>
            </article>
            <article className="goal-card">
              <strong>Weekly reviews</strong>
              <span className="goal-meta">{reviews.length} reviews saved</span>
            </article>
            <article className="goal-card">
              <strong>Monthly reviews</strong>
              <span className="goal-meta">{monthlyReviews.length} monthly reviews saved</span>
            </article>
            <article className="goal-card">
              <strong>Career maps and hobby paths</strong>
              <span className="goal-meta">{careerExplorations.length} career maps - {hobbyPlans.length} hobby paths</span>
            </article>
            <article className="goal-card">
              <strong>Routine builder and reminders</strong>
              <span className="goal-meta">{routineBuilders.length} saved blueprints - {reminderSettings.dailyEnabled ? "daily reminder configured" : "no daily reminder set"}</span>
            </article>
            <article className="goal-card">
              <strong>Progress data</strong>
              <span className="goal-meta">{checkins.length} check-ins - {rewardEvents.length} reward events</span>
            </article>
          </div>
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Privacy commitments</h3>
              <p className="muted-text">What this product should keep honoring as it grows.</p>
            </div>
          </div>
          <div className="goal-list">
            <article className="goal-card">
              <strong>Never enter private IDs or bank details</strong>
              <p>The planner should only hold the information needed to build routines, reviews, and progress.</p>
            </article>
            <article className="goal-card">
              <strong>Delete control stays visible</strong>
              <p>You can remove your stored data directly from the app instead of needing admin help.</p>
            </article>
            <article className="goal-card">
              <strong>Export should stay user-friendly</strong>
              <p>This page is where richer JSON, CSV, and PDF export controls can keep growing.</p>
            </article>
            <article className="goal-card">
              <strong>Reminder settings are not live delivery yet</strong>
              <p>The app now saves reminder preferences, but browser alerts, emails, and push notifications still need separate external setup.</p>
            </article>
          </div>
        </section>
      </div>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Account</h3>
            <p className="muted-text">Keep login and recovery basics visible instead of hiding them in setup docs.</p>
          </div>
        </div>
        <div className="goal-list">
          <article className="goal-card">
            <strong>Email</strong>
            <span className="goal-meta">{user.email}</span>
          </article>
          <article className="goal-card">
            <strong>Email verification</strong>
            <span className="goal-meta">{user.emailVerified ? "Verified" : "Not verified yet"}</span>
          </article>
        </div>
        {!user.emailVerified ? (
          <button type="button" className="secondary-button" onClick={onResendVerification}>
            Resend verification email
          </button>
        ) : null}
      </section>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Export</h3>
            <p className="muted-text">Download a snapshot of your current app data for your own records.</p>
          </div>
        </div>
        <div className="action-row">
          <button type="button" className="secondary-button" onClick={onExportData}>
            Export my data as JSON
          </button>
          <button type="button" className="secondary-button" onClick={onShareProgress}>
            Share progress snapshot
          </button>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Danger zone</h3>
            <p className="muted-text">Use this only when you want to remove your stored app data.</p>
          </div>
        </div>
        <button type="button" className="danger-link" onClick={onDeleteMyData}>
          Delete my stored data
        </button>
      </section>
    </section>
  );
}

export default SettingsTab;
