import TaskCard from "./TaskCard";

function PlannerBoard({ currentPlan, goals, habits, activeTab, onGoToTab, children }) {
  const activeGoals = goals.filter((goal) => goal.status !== "completed");
  const completedHabits = habits.filter((habit) => habit.isTodayComplete);

  const cards = [
    {
      key: "cta",
      eyebrow: "What should I do today?",
      title: currentPlan ? currentPlan.title : "Start with one honest plan",
      body: currentPlan
        ? "Open the latest plan, protect one clear action, and keep the next step visible."
        : "Use the planner to turn stress, uncertainty, and scattered goals into a calmer operating system.",
      meta: currentPlan ? "Live planner context" : "Ready when you are",
      tone: "task",
    },
    {
      key: "goals",
      eyebrow: "Goals in motion",
      title: `${activeGoals.length} active goals`,
      body: activeGoals.length
        ? "Your routine can now steer real outcomes instead of just surviving the week."
        : "Add one goal so the planner has something concrete to build toward.",
      meta: "Open goals",
      tone: "progress",
    },
    {
      key: "habits",
      eyebrow: "Consistency",
      title: `${completedHabits.length} habits marked today`,
      body: completedHabits.length
        ? "Small wins are already stacking. Keep momentum visible while you refine the system."
        : "No habits marked yet today. A tiny version still counts.",
      meta: "Daily traction",
      tone: completedHabits.length ? "completed" : "task",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 xl:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => {
              if (card.key === "goals") onGoToTab("goals");
              if (card.key === "habits") onGoToTab("habits");
              if (card.key === "cta") onGoToTab("planner");
            }}
            className="text-left"
          >
            <TaskCard {...card} />
          </button>
        ))}
      </div>

      <div key={activeTab} className="min-w-0">
        {children}
      </div>
    </section>
  );
}

export default PlannerBoard;
