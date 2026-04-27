const recoveryPrompts = [
  "Text or call one trusted person and say exactly how your day is going.",
  "Switch to the minimum version of your routine instead of abandoning the whole day.",
  "Leave the room, drink water, and take a ten-minute reset before choosing the next step.",
  "Write one sentence: 'What hurts right now, and what would make the next hour 5% easier?'",
];

const supportLanes = [
  {
    title: "If you feel emotionally unsafe right now",
    description:
      "Pause the planner and reach out to a trusted person, local emergency services, or a crisis support line in your area immediately.",
  },
  {
    title: "If you feel lonely or flooded",
    description:
      "Use one tiny grounding action first: water, sunlight, a short walk, or a simple message to someone safe.",
  },
  {
    title: "If the routine feels impossible",
    description:
      "Shrink the day instead of judging it. A minimum version still counts as keeping contact with your life.",
  },
];

function SupportTab() {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">Support & Safety</p>
          <h2>Keep the app supportive when life gets heavy</h2>
          <p className="muted-text">
            This space is here for grounding, safer fallback choices, and reminders that a routine app should never replace urgent human support.
          </p>
        </div>
      </div>

      <div className="split-progress-grid">
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>When to step away from the planner</h3>
              <p className="muted-text">The app is for planning support, not crisis care or emergency decision-making.</p>
            </div>
          </div>
          <div className="goal-list">
            {supportLanes.map((item) => (
              <article key={item.title} className="goal-card">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Fast recovery prompts</h3>
              <p className="muted-text">Use these when motivation crashes and you need the day to become survivable again.</p>
            </div>
          </div>
          <div className="goal-list">
            {recoveryPrompts.map((prompt) => (
              <article key={prompt} className="goal-card">
                <p>{prompt}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h3>What belongs here later</h3>
            <p className="muted-text">This foundation gives us a safe place to grow stronger support features over time.</p>
          </div>
        </div>
        <div className="goal-list">
          <article className="goal-card">
            <strong>Crisis resource localization</strong>
            <p>Later we can add country-specific helplines and trusted-person prompts.</p>
          </article>
          <article className="goal-card">
            <strong>Risk-sensitive AI fallback</strong>
            <p>The backend can keep escalating to stronger safety language when certain risk patterns appear.</p>
          </article>
          <article className="goal-card">
            <strong>Gentle day planning mode</strong>
            <p>Future routines can switch automatically into low-energy mode instead of pretending every day is the same.</p>
          </article>
        </div>
      </section>
    </section>
  );
}

export default SupportTab;
