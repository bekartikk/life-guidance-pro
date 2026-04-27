function PlannerTab({
  form,
  consentChecked,
  isLoading,
  onChange,
  onConsentChange,
  onQuickFocus,
  onReset,
  onSubmit,
  onUseProfile,
}) {
  return (
    <form className="planner-form" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <p className="eyebrow">Planner</p>
          <h2>Build a new plan</h2>
        </div>
        <button className="link-button" type="button" onClick={onReset}>
          Start fresh
        </button>
      </div>

      <div className="quick-options">
        <button type="button" onClick={() => onQuickFocus("career", "1-week")}>Job roadmap</button>
        <button type="button" onClick={() => onQuickFocus("hobbies", "1-month")}>Hobbies to income</button>
        <button type="button" onClick={() => onQuickFocus("mental-energy", "1-week")}>Motivation reset</button>
      </div>

      <section className="form-section">
        <div className="section-heading">
          <h3>Routine and life context</h3>
          <p>Start with what your real days already look like.</p>
        </div>
        <div className="two-column">
          <label>Wake time<input name="wakeTime" value={form.wakeTime} onChange={onChange} placeholder="Example: 7:00 AM" /></label>
          <label>Sleep time<input name="sleepTime" value={form.sleepTime} onChange={onChange} placeholder="Example: 11:30 PM" /></label>
        </div>
        <label>Daily routine<textarea name="currentRoutine" value={form.currentRoutine} onChange={onChange} placeholder="What happens in your normal day from morning to night?" /></label>
        <label>Work, study, or earning situation<textarea name="workOrStudy" value={form.workOrStudy} onChange={onChange} placeholder="What do you do now for study, job, business, freelancing, or income?" /></label>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <h3>Pressure points and goals</h3>
          <p>These answers guide the roadmap and motivational support.</p>
        </div>
        <label>Personal issues or stress points<textarea name="personalChallenges" value={form.personalChallenges} onChange={onChange} placeholder="What is making life heavy, confusing, lonely, or stuck?" /></label>
        <label>Future confusion<textarea name="futureConfusion" value={form.futureConfusion} onChange={onChange} placeholder="Career, job, family pressure, money, skills, confidence, anything." /></label>
        <label>Goals<textarea name="goals" value={form.goals} onChange={onChange} placeholder="What would you like to improve in the next 3 to 12 months?" /></label>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <h3>Interests and emotional support</h3>
          <p>These help the app create happier routines and future scopes.</p>
        </div>
        <div className="two-column">
          <label>Hobbies and interests<textarea name="hobbies" value={form.hobbies} onChange={onChange} placeholder="Music, games, fitness, art, reading, coding, cooking..." /></label>
          <label>What makes you happy<textarea name="happinessSources" value={form.happinessSources} onChange={onChange} placeholder="People, places, activities, memories, small comforts..." /></label>
        </div>
        <label>When do you feel alone?<textarea name="lonelyMoments" value={form.lonelyMoments} onChange={onChange} placeholder="Evening, weekends, after scrolling, after work, while studying..." /></label>
        <label>What may make this routine hard to follow?<textarea name="knownObstacles" value={form.knownObstacles} onChange={onChange} placeholder="Late sleep, family duties, college timing, low motivation, phone use, travel, money limits..." /></label>
        <label>Skills or interests you may want to turn into future scope<textarea name="skillsToBuild" value={form.skillsToBuild} onChange={onChange} placeholder="Example: sketching, music, coding, teaching, fitness, public speaking, content creation..." /></label>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <h3>Plan settings</h3>
          <p>Choose the style and depth of guidance you want back from the AI.</p>
        </div>
        <div className="two-column">
          <label>Plan length<select name="planDuration" value={form.planDuration} onChange={onChange}><option value="1-week">Full 1 week plan</option><option value="1-month">1 month plan</option><option value="3-months">3 month roadmap</option></select></label>
          <label>Main focus<select name="roadmapFocus" value={form.roadmapFocus} onChange={onChange}><option value="balanced">Balanced life, study/work, happiness</option><option value="career">Career and job roadmap</option><option value="study">Study and skill improvement</option><option value="mental-energy">Motivation, loneliness, and energy</option><option value="hobbies">Hobbies into future opportunities</option></select></label>
          <label>Career help<select name="professionalHelp" value={form.professionalHelp} onChange={onChange}><option value="roadmap">Give me a roadmap</option><option value="ask-first">Ask what profession I want first</option><option value="explore-options">Suggest future scopes from my hobbies</option><option value="professional-support">Tell me when to take professional help</option></select></label>
          <label>Routine style<select name="flexibilityLevel" value={form.flexibilityLevel} onChange={onChange}><option value="flexible">Flexible and easy to adjust</option><option value="structured">Structured with clear time blocks</option><option value="low-pressure">Low pressure for difficult days</option></select></label>
          <label>Energy level<select name="energyLevel" value={form.energyLevel} onChange={onChange}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label>Guidance style<select name="preferredTone" value={form.preferredTone} onChange={onChange}><option value="gentle">Gentle</option><option value="direct">Direct</option><option value="motivational">Motivational</option><option value="mentor">Mentor style</option></select></label>
        </div>
      </section>

      <label className="consent-box">
        <input type="checkbox" checked={consentChecked} onChange={onConsentChange} />
        <span>I understand this planner is not therapy, medical care, legal advice, or emergency support, and I agree to save my plan history in the app.</span>
      </label>

      <div className="action-row">
        <button className="primary-button" disabled={isLoading}>{isLoading ? "Creating your plan..." : "Create my guidance plan"}</button>
        <button className="secondary-button" type="button" onClick={onUseProfile}>Use saved profile</button>
      </div>
    </form>
  );
}

export default PlannerTab;
