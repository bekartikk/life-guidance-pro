const QUICK_CHAT_PROMPTS = [
  "Make this easier",
  "Make this more career focused",
  "What should I do today only?",
  "Give me a low-energy version",
  "Make this suitable for exams/job prep",
];

function ChatExtensionTab({
  currentPlan,
  chatPrompt,
  chatMessages,
  isSendingChat,
  onPromptChange,
  onQuickPrompt,
  onSubmit,
}) {
  return (
    <section className="goals-panel in-workspace">
      <div className="form-header">
        <div>
          <p className="eyebrow">AI Follow-up Chat</p>
          <h2>Refine the plan instead of starting over</h2>
          <p className="muted-text">
            Use this to ask for simpler versions, sharper career direction, or a one-day-only plan.
          </p>
        </div>
      </div>

      {!currentPlan ? (
        <section className="section-card">
          <p className="muted-text">Open or generate a plan first, then the follow-up chat can build on it.</p>
        </section>
      ) : (
        <>
          <form className="planner-form" onSubmit={onSubmit}>
            <div className="form-section">
              <div className="section-heading">
                <h3>Ask the planner for a sharper version</h3>
                <p>Short requests work well here because the current plan is already in context.</p>
              </div>

              <div className="goal-milestones">
                {QUICK_CHAT_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="secondary-button"
                    onClick={() => onQuickPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <label>
                Follow-up request
                <textarea
                  value={chatPrompt}
                  onChange={onPromptChange}
                  placeholder="Ask for a softer version, more structure, a stronger career path, or just today's version."
                />
              </label>

              <button className="primary-button" type="submit" disabled={isSendingChat}>
                {isSendingChat ? "Getting follow-up guidance..." : "Send follow-up"}
              </button>
            </div>
          </form>

          <section className="section-card">
            <div className="section-card-header">
              <div>
                <h3>Conversation</h3>
                <p className="muted-text">Each reply builds on your latest saved plan instead of replacing it blindly.</p>
              </div>
              <p className="feedback-badge">{chatMessages.length} messages</p>
            </div>

            {chatMessages.length === 0 ? (
              <p className="muted-text">Your follow-up guidance will appear here after the first question.</p>
            ) : (
              <div className="goal-list">
                {chatMessages.map((message, index) => (
                  <article key={`${message.role}-${index}`} className={`goal-card ${message.role === "assistant" ? "completed" : ""}`}>
                    <strong>{message.role === "assistant" ? "Planner reply" : "You asked"}</strong>
                    <p>{message.content}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default ChatExtensionTab;
