import AnalyticsPanel from "./AnalyticsPanel";

function AdminTab({ adminSnapshot, userId }) {
  return (
    <section className="planner-form admin-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Usage snapshot & AI analytics</h2>
        </div>
      </div>

      {!adminSnapshot ? (
        <p className="muted-text">Loading admin data...</p>
      ) : (
        <>
          <div className="admin-metrics">
            <div><strong>{adminSnapshot.totals.users}</strong><span>profiles</span></div>
            <div><strong>{adminSnapshot.totals.plans}</strong><span>plans</span></div>
            <div><strong>{adminSnapshot.totals.goals}</strong><span>goals</span></div>
            <div><strong>{adminSnapshot.totals.habits}</strong><span>habits</span></div>
            <div><strong>{adminSnapshot.totals.reviews}</strong><span>reviews</span></div>
            <div><strong>{adminSnapshot.totals.monthlyReviews}</strong><span>monthly reviews</span></div>
            <div><strong>{adminSnapshot.totals.careerExplorations}</strong><span>career maps</span></div>
            <div><strong>{adminSnapshot.totals.hobbyPlans}</strong><span>hobby paths</span></div>
            <div><strong>{adminSnapshot.totals.routineBuilders}</strong><span>routine builders</span></div>
            <div><strong>{adminSnapshot.totals.reminderProfiles}</strong><span>reminder profiles</span></div>
            <div><strong>{adminSnapshot.totals.feedback}</strong><span>feedback</span></div>
            <div><strong>{adminSnapshot.totals.positiveFeedback}</strong><span>positive ratings</span></div>
          </div>

          <div className="admin-grid">
            <section>
              <h3>Top goals</h3>
              {adminSnapshot.topGoals.map((item) => (
                <div className="stat-row" key={item.label}><span>{item.label}</span><strong>{item.count}</strong></div>
              ))}
            </section>
            <section>
              <h3>Top hobbies</h3>
              {adminSnapshot.topHobbies.map((item) => (
                <div className="stat-row" key={item.label}><span>{item.label}</span><strong>{item.count}</strong></div>
              ))}
            </section>
          </div>
        </>
      )}

      {userId && <AnalyticsPanel userId={userId} />}
    </section>
  );
}

export default AdminTab;
