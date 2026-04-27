const QUICK_FEEDBACK_OPTIONS = [
  "Too generic",
  "Too difficult",
  "Too long",
  "Helpful structure",
  "Good motivation",
  "More career detail needed",
];

function FeedbackTab({
  currentPlan,
  feedbackItems,
  feedbackMessage,
  feedbackRating,
  isSubmittingFeedback,
  formatDate,
  onMessageChange,
  onRatingChange,
  onSubmit,
}) {
  const addQuickFeedback = (chip) => {
    const nextValue = feedbackMessage.includes(chip)
      ? feedbackMessage
      : `${feedbackMessage}${feedbackMessage ? "\n" : ""}${chip}`;

    onMessageChange({ target: { value: nextValue } });
  };

  return (
    <section className="planner-form feedback-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">Feedback</p>
          <h2>Rate the plan quality</h2>
          <p className="muted-text">
            Structured feedback makes the planner, weekly reviews, and future AI tuning much stronger.
          </p>
        </div>
      </div>

      <form className="feedback-form" onSubmit={onSubmit}>
        <label>
          Rating
          <select value={feedbackRating} onChange={onRatingChange}>
            <option value="5">5 - Very helpful</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Weak</option>
            <option value="1">1 - Not useful</option>
          </select>
        </label>

        <div className="goal-milestones">
          {QUICK_FEEDBACK_OPTIONS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="secondary-button"
              onClick={() => addQuickFeedback(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        <label>
          What should improve?
          <textarea
            value={feedbackMessage}
            onChange={onMessageChange}
            placeholder="Tell the app what felt generic, unrealistic, or especially helpful."
          />
        </label>

        <button className="primary-button" disabled={isSubmittingFeedback || !currentPlan}>
          {isSubmittingFeedback ? "Saving feedback..." : currentPlan ? "Send feedback" : "Open a plan first"}
        </button>
      </form>

      <div className="feedback-history">
        <h3>Your recent feedback</h3>
        {feedbackItems.length === 0 ? (
          <p className="muted-text">You have not rated any plans yet.</p>
        ) : (
          feedbackItems.map((item) => (
            <article className="feedback-card" key={item.id}>
              <strong>{item.planTitle || "Plan feedback"}</strong>
              <span>{formatDate(item.createdAt)}</span>
              <span>Rating: {item.rating}/5</span>
              <p>{item.message || "No written note."}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default FeedbackTab;
