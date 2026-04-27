function ProfileTab({ profile, isSavingProfile, onChange, onSubmit, onApplyToPlanner }) {
  return (
    <form className="planner-form" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Saved preferences</h2>
        </div>
      </div>

      <section className="form-section">
        <div className="section-heading">
          <h3>Who you are</h3>
          <p>Save a few details so future plans can start with better context.</p>
        </div>

        <div className="two-column">
          <label>Name or nickname<input name="fullName" value={profile.fullName} onChange={onChange} placeholder="What should the planner call you?" /></label>
          <label>Age group<select name="ageGroup" value={profile.ageGroup} onChange={onChange}><option value="under-18">Under 18</option><option value="18-24">18-24</option><option value="25-34">25-34</option><option value="35-44">35-44</option><option value="45-plus">45+</option></select></label>
          <label>Current role<select name="role" value={profile.role} onChange={onChange}><option value="student">Student</option><option value="job-seeker">Job seeker</option><option value="working-professional">Working professional</option><option value="freelancer">Freelancer</option><option value="business">Business</option><option value="other">Other</option></select></label>
          <label>Preferred routine style<select name="preferredRoutineStyle" value={profile.preferredRoutineStyle} onChange={onChange}><option value="flexible">Flexible</option><option value="structured">Structured</option><option value="low-pressure">Low pressure</option></select></label>
        </div>

        <label>Main goal<textarea name="mainGoal" value={profile.mainGoal} onChange={onChange} placeholder="What matters most to you right now?" /></label>
        <div className="two-column">
          <label>Interests<textarea name="interests" value={profile.interests} onChange={onChange} placeholder="What are you naturally drawn to?" /></label>
          <label>Career interest<textarea name="careerInterest" value={profile.careerInterest} onChange={onChange} placeholder="Which professions or work styles are you exploring?" /></label>
        </div>
        <div className="two-column">
          <label>Life priorities<textarea name="lifePriorities" value={profile.lifePriorities || ""} onChange={onChange} placeholder="Peace, stability, family, freedom, growth..." /></label>
          <label>Preferred working style<textarea name="workingStyle" value={profile.workingStyle || ""} onChange={onChange} placeholder="Deep work, short bursts, structure, flexibility..." /></label>
        </div>
        <div className="two-column">
          <label>Sleep preference<textarea name="sleepPreference" value={profile.sleepPreference || ""} onChange={onChange} placeholder="Night owl, early riser, somewhere in between..." /></label>
          <label>Current stress level<select name="stressLevel" value={profile.stressLevel || "medium"} onChange={onChange}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        </div>
        <label>Long-term life vision<textarea name="longTermVision" value={profile.longTermVision || ""} onChange={onChange} placeholder="What kind of life are you trying to build over the next few years?" /></label>
        <label>Note to the planner<textarea name="noteToPlanner" value={profile.noteToPlanner} onChange={onChange} placeholder="Any repeating life context you want remembered for future plans?" /></label>
      </section>

      <div className="action-row">
        <button className="primary-button" disabled={isSavingProfile}>{isSavingProfile ? "Saving profile..." : "Save profile"}</button>
        <button className="secondary-button" type="button" onClick={onApplyToPlanner}>Apply profile to planner</button>
      </div>
    </form>
  );
}

export default ProfileTab;
