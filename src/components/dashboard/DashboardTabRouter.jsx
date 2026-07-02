import { Suspense, lazy } from "react";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineBolt,
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineFlag,
  HiOutlineQueueList,
  HiOutlineSparkles,
} from "react-icons/hi2";

import { WidgetErrorBoundary } from "../AppErrorBoundary.jsx";
import PlannerTab from "./PlannerTab.jsx";
import { AnalyticsV2, StudyCenter } from "../light/index.js";

const LAZY_IMPORT_TIMEOUT_MS = 8000;

function LazyImportFallback({ title }) {
  return (
    <section className="section-loading-card widget-fallback-card">
      <div>
        <strong>{title}</strong>
        <p>This section could not load right now. Try switching tabs or refreshing the workspace.</p>
      </div>
    </section>
  );
}

function isComponentLike(value) {
  if (typeof value === "function") {
    return true;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  const reactType = value.$$typeof;
  const description = typeof reactType === "symbol" ? reactType.description : "";

  return description === "react.memo" || description === "react.forward_ref";
}

function resolveLazyComponent(module) {
  const directDefault = module?.default;
  if (isComponentLike(directDefault)) {
    return directDefault;
  }

  const nestedDefault = directDefault?.default;
  if (isComponentLike(nestedDefault)) {
    return nestedDefault;
  }

  return null;
}

function safeLazy(loader, title) {
  const wrappedLoader = () => {
    let timeoutId = null;

    return Promise.race([
      loader(),
      new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error(`Lazy import timed out for ${title}.`)), LAZY_IMPORT_TIMEOUT_MS);
      }),
    ])
      .then((module) => {
        const component = resolveLazyComponent(module);
        if (!component) {
          throw new Error(`Invalid lazy component export for ${title}.`);
        }
        return { default: component };
      })
      .catch(() => {
        return {
          default: function LazyModuleFallback() {
            return <LazyImportFallback title={title} />;
          },
        };
      })
      .finally(() => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      });
  };

  const LazyComponent = lazy(wrappedLoader);
  LazyComponent.preload = () => wrappedLoader().then(() => null).catch(() => null);
  return LazyComponent;
}

function SectionLoadingCard({ title, description }) {
  return (
    <section className="section-loading-card">
      <div className="section-loading-card__spinner" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </section>
  );
}

function LazySection({ title, description, children }) {
  return (
    <Suspense fallback={<SectionLoadingCard title={title} description={description} />}>
      {children}
    </Suspense>
  );
}

const GoalTabDirect = safeLazy(() => import("./GoalTab.jsx"), "Goals");
const HabitTabDirect = safeLazy(() => import("./HabitTab.jsx"), "Habits");
const DailyProgressTabDirect = safeLazy(() => import("./DailyProgressTab.jsx"), "Daily progress");
const WeeklyProgressTabDirect = safeLazy(() => import("./WeeklyProgressTab.jsx"), "Weekly progress");
const WeeklyReviewTabDirect = safeLazy(() => import("./WeeklyReviewTab.jsx"), "Weekly review");
const MonthlyReviewTabDirect = safeLazy(() => import("./MonthlyReviewTab.jsx"), "Monthly review");
const CareerExplorerTabDirect = safeLazy(() => import("./CareerExplorerTab.jsx"), "Career explorer");
const HobbyIncomeTabDirect = safeLazy(() => import("./HobbyIncomeTab.jsx"), "Income paths");
const RoutineBuilderTabDirect = safeLazy(() => import("./RoutineBuilderTab.jsx"), "Routine builder");
const ChatExtensionTabDirect = safeLazy(() => import("./ChatExtensionTab.jsx"), "AI coach");
const AchievementTabDirect = safeLazy(() => import("./AchievementTab.jsx"), "Achievements");
const MissionsTabDirect = safeLazy(() => import("./MissionsTab.jsx"), "Missions");
const HistoryTabDirect = safeLazy(() => import("./HistoryTab.jsx"), "History");
const ProfileTabDirect = safeLazy(() => import("./ProfileTab.jsx"), "Profile");
const FeedbackTabDirect = safeLazy(() => import("./FeedbackTab.jsx"), "Feedback");
const ReminderTabDirect = safeLazy(() => import("./ReminderTab.jsx"), "Reminders");
const SupportTabDirect = safeLazy(() => import("./SupportTab.jsx"), "Support");
const SettingsTabDirect = safeLazy(() => import("./SettingsTab.jsx"), "Settings");
const AdminTabDirect = safeLazy(() => import("./AdminTab.jsx"), "Admin");

const tabMeta = {
  planner: {
    label: "Planner",
    description: "Shape an adaptive plan around your real energy, constraints, and future pressure.",
    icon: HiOutlineClipboardDocumentList,
  },
  goals: {
    label: "Goals",
    description: "Turn the bigger picture into milestones the planner can actually support.",
    icon: HiOutlineFlag,
  },
  habits: {
    label: "Habits",
    description: "Keep your consistency layer visible so momentum survives difficult days.",
    icon: HiOutlineQueueList,
  },
  daily: {
    label: "Daily Progress",
    description: "Read your latest check-ins, reward patterns, and day-to-day traction.",
    icon: HiOutlineArrowTrendingUp,
  },
  weekly: {
    label: "Weekly Progress",
    description: "Watch consistency, weekly completion, and what your current system is really doing.",
    icon: HiOutlineChartBarSquare,
  },
  review: {
    label: "Weekly Review",
    description: "Reflect on what worked, what felt heavy, and what should evolve next.",
    icon: HiOutlineSparkles,
  },
  monthly: {
    label: "Monthly Review",
    description: "Zoom out and see the larger reset, trend, and growth picture.",
    icon: HiOutlineChartBarSquare,
  },
  career: {
    label: "Career Explorer",
    description: "Map possible directions from your strengths, interests, and constraints.",
    icon: HiOutlineSparkles,
  },
  income: {
    label: "Income Paths",
    description: "Translate hobbies and curiosities into grounded experiments and future scope.",
    icon: HiOutlineBolt,
  },
  routine: {
    label: "Routine Builder",
    description: "Design a living routine blueprint the planner can work with instead of against.",
    icon: HiOutlineClipboardDocumentList,
  },
  chat: {
    label: "AI Coach",
    description: "Refine the current plan without starting over from scratch.",
    icon: HiOutlineSparkles,
  },
  achievements: {
    label: "Achievements",
    description: "See momentum, badges, and signals that your system is compounding.",
    icon: HiOutlineBolt,
  },
  missions: {
    label: "Tasks",
    description: "Track the next level, streak pressure, and the smallest useful push forward.",
    icon: HiOutlineArrowTrendingUp,
  },
  insights: {
    label: "Insights",
    description: "Let the system summarize the patterns it sees across your history and profile.",
    icon: HiOutlineSparkles,
  },
  system: {
    label: "System Map",
    description: "Understand how the product is wired without re-explaining the project every time.",
    icon: HiOutlineChartBarSquare,
  },
  history: {
    label: "History",
    description: "Browse saved plans and return to the versions that still feel relevant.",
    icon: HiOutlineClipboardDocumentList,
  },
  profile: {
    label: "Profile",
    description: "Keep your life context, preferences, and long-view direction current.",
    icon: HiOutlineSparkles,
  },
  feedback: {
    label: "Feedback",
    description: "Teach the planner what felt useful so the next version gets sharper.",
    icon: HiOutlineBolt,
  },
  reminders: {
    label: "Reminders",
    description: "Control nudges, weekly resets, and the tone of external support.",
    icon: HiOutlineSparkles,
  },
  support: {
    label: "Support",
    description: "Use calmer recovery prompts when life feels heavier than the plan.",
    icon: HiOutlineSparkles,
  },
  settings: {
    label: "Settings",
    description: "Control privacy, exports, account actions, and the edges of the workspace.",
    icon: HiOutlineChartBarSquare,
  },
  admin: {
    label: "Admin",
    description: "Review product activity and the current operational snapshot.",
    icon: HiOutlineChartBarSquare,
  },
};

function DashboardTabRouter({
  activeTab,
  sectionLoading,
  isLoadingWorkspace,
  plannerBootstrapPending,
  progressPanelPending,
  form,
  consentChecked,
  isLoading,
  updateField,
  setConsentChecked,
  applyQuickFocus,
  resetPlanner,
  requestPlan,
  applyProfileToPlanner,
  goalDraft,
  goals,
  isSavingGoal,
  updateGoalField,
  handleSaveGoal,
  handleDeleteGoal,
  handleGoalStatusChange,
  habitDraft,
  habits,
  isSavingHabit,
  updateHabitField,
  handleSaveHabit,
  handleDeleteHabit,
  handleToggleHabit,
  checkins,
  progress,
  rewardEvents,
  behavioralInsights,
  adaptiveWorkspace,
  handleExportWeeklySummary,
  handleShareWeeklySummary,
  reviewDraft,
  reviews,
  isSavingReview,
  updateReviewField,
  handleSaveWeeklyReview,
  monthlyReviewDraft,
  monthlyReviews,
  isSavingMonthlyReview,
  updateMonthlyReviewField,
  handleSaveMonthlyReview,
  careerDraft,
  careerExplorations,
  isSavingCareer,
  updateCareerField,
  handleSaveCareerExploration,
  hobbyDraft,
  hobbyPlans,
  isSavingHobbyPath,
  updateHobbyField,
  handleSaveHobbyPath,
  routineBuilderDraft,
  routineBlockDraft,
  routineBuilders,
  isSavingRoutineBuilder,
  updateRoutineBuilderField,
  updateRoutineBlockField,
  handleAddRoutineBlock,
  handleRemoveRoutineBlock,
  handleToggleRoutineBlockLock,
  handleSaveRoutineBuilder,
  handleDeleteRoutineBuilder,
  handleExportRoutineCalendar,
  currentPlan,
  chatPrompt,
  chatMessages,
  isSendingChat,
  setChatPrompt,
  handleSendChat,
  missionSummary,
  plans,
  setCurrentPlan,
  setForm,
  handleTabChange,
  handleDeletePlan,
  formatDate,
  profile,
  isSavingProfile,
  updateProfileField,
  handleSaveProfile,
  feedbackItems,
  feedbackMessage,
  feedbackRating,
  isSubmittingFeedback,
  setFeedbackMessage,
  setFeedbackRating,
  handleSubmitFeedback,
  reminderSettings,
  isSavingReminderSettings,
  notificationState,
  updateReminderField,
  handleEnableNotifications,
  handleSendTestReminder,
  handleSaveReminderSettings,
  user,
  handleDeleteMyData,
  handleExportData,
  handleResendVerification,
  handleShareProgress,
  careerExplorationsForSettings,
  hobbyPlansForSettings,
  routineBuildersForSettings,
  isAdmin,
  adminSnapshot,
  userId,
}) {
  const tabLoadingConfig = {
    goals: sectionLoading.goals,
    habits: sectionLoading.habits,
    daily: progressPanelPending,
    weekly: progressPanelPending,
    review: sectionLoading.reviews || sectionLoading.goals,
    monthly: sectionLoading.monthlyReviews || sectionLoading.goals,
    career: sectionLoading.careerExplorations,
    income: sectionLoading.hobbyPlans,
    routine: sectionLoading.routineBuilders,
    achievements: sectionLoading.progress || sectionLoading.rewardEvents,
    missions: sectionLoading.progress,
    insights: sectionLoading.profile || sectionLoading.plans || sectionLoading.checkins,
    history: sectionLoading.plans,
    profile: sectionLoading.profile,
    feedback: sectionLoading.feedback,
    reminders: sectionLoading.reminders,
    settings: isLoadingWorkspace && sectionLoading.profile,
  };

  if (activeTab === "planner") {
    return (
      <>
        {plannerBootstrapPending && (
          <SectionLoadingCard
            title="Loading your saved context"
            description="WeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢re pulling in your latest plans, profile, and feedback so the planner can start from your real history."
          />
        )}
        <PlannerTab
          form={form}
          consentChecked={consentChecked}
          isLoading={isLoading}
          onChange={updateField}
          onConsentChange={(event) => setConsentChecked(event.target.checked)}
          onQuickFocus={applyQuickFocus}
          onReset={resetPlanner}
          onSubmit={(event) => {
            event.preventDefault();
            requestPlan();
          }}
          onUseProfile={applyProfileToPlanner}
        />
      </>
    );
  }

  if (tabLoadingConfig[activeTab]) {
    return (
      <SectionLoadingCard
        title={`Loading ${activeTab} data`}
        description="This section is filling in from your saved workspace so the content reflects your latest state."
      />
    );
  }

  switch (activeTab) {
    case "goals":
      return <WidgetErrorBoundary title="Goals unavailable" description="The goals workspace hit a rendering problem."><LazySection title="Loading goals" description="Opening your goals and milestone workspace."><GoalTabDirect goalDraft={goalDraft} goals={goals} isSavingGoal={isSavingGoal} onChange={updateGoalField} onSubmit={handleSaveGoal} onDelete={handleDeleteGoal} onStatusChange={handleGoalStatusChange} /></LazySection></WidgetErrorBoundary>;
    case "habits":
      return <WidgetErrorBoundary title="Habits unavailable" description="The habits workspace hit a rendering problem."><LazySection title="Loading habits" description="Opening your consistency and habit tracking workspace."><HabitTabDirect habitDraft={habitDraft} habits={habits} isSavingHabit={isSavingHabit} onChange={updateHabitField} onSubmit={handleSaveHabit} onDelete={handleDeleteHabit} onToggle={handleToggleHabit} /></LazySection></WidgetErrorBoundary>;
    case "daily":
      return <WidgetErrorBoundary title="Daily progress unavailable" description="Check-in history could not render."><LazySection title="Loading daily progress" description="Preparing your check-ins, rewards, and adaptive signals."><DailyProgressTabDirect checkins={checkins} progress={progress} rewards={rewardEvents} behavioralInsights={behavioralInsights} adaptiveWorkspace={adaptiveWorkspace} /></LazySection></WidgetErrorBoundary>;
    case "weekly":
      return <WidgetErrorBoundary title="Weekly progress unavailable" description="The weekly progress view could not render."><LazySection title="Loading weekly progress" description="Pulling in the weekly view and performance summaries."><WeeklyProgressTabDirect checkins={checkins} progress={progress} rewards={rewardEvents} onExportWeeklySummary={handleExportWeeklySummary} onShareWeeklySummary={handleShareWeeklySummary} /></LazySection></WidgetErrorBoundary>;
    case "review":
      return <WidgetErrorBoundary title="Weekly review unavailable" description="The weekly reflection surface could not render."><LazySection title="Loading weekly review" description="Preparing your weekly reflection and review history."><WeeklyReviewTabDirect reviewDraft={reviewDraft} reviews={reviews} goals={goals} isSavingReview={isSavingReview} onChange={updateReviewField} onSubmit={handleSaveWeeklyReview} /></LazySection></WidgetErrorBoundary>;
    case "monthly":
      return <WidgetErrorBoundary title="Monthly review unavailable" description="The monthly review surface could not render."><LazySection title="Loading monthly review" description="Preparing the longer-view reflection surface."><MonthlyReviewTabDirect monthlyReviewDraft={monthlyReviewDraft} monthlyReviews={monthlyReviews} goals={goals} isSavingMonthlyReview={isSavingMonthlyReview} onChange={updateMonthlyReviewField} onSubmit={handleSaveMonthlyReview} /></LazySection></WidgetErrorBoundary>;
    case "career":
      return <WidgetErrorBoundary title="Career explorer unavailable" description="The career direction surface could not render."><LazySection title="Loading career explorer" description="Pulling in the direction and pathfinding workspace."><CareerExplorerTabDirect draft={careerDraft} savedItems={careerExplorations} isSaving={isSavingCareer} onChange={updateCareerField} onSubmit={handleSaveCareerExploration} /></LazySection></WidgetErrorBoundary>;
    case "income":
      return <WidgetErrorBoundary title="Income paths unavailable" description="The hobby income surface could not render."><LazySection title="Loading hobby income paths" description="Opening the growth and monetization workspace."><HobbyIncomeTabDirect draft={hobbyDraft} savedItems={hobbyPlans} isSaving={isSavingHobbyPath} onChange={updateHobbyField} onSubmit={handleSaveHobbyPath} /></LazySection></WidgetErrorBoundary>;
    case "routine":
      return <WidgetErrorBoundary title="Routine builder unavailable" description="The routine builder could not render."><LazySection title="Loading routine builder" description="Preparing the routine system and calendar tools."><RoutineBuilderTabDirect builderDraft={routineBuilderDraft} blockDraft={routineBlockDraft} savedItems={routineBuilders} isSaving={isSavingRoutineBuilder} onBuilderChange={updateRoutineBuilderField} onBlockChange={updateRoutineBlockField} onAddBlock={handleAddRoutineBlock} onRemoveBlock={handleRemoveRoutineBlock} onToggleLock={handleToggleRoutineBlockLock} onSave={handleSaveRoutineBuilder} onDelete={handleDeleteRoutineBuilder} onExportCalendar={handleExportRoutineCalendar} /></LazySection></WidgetErrorBoundary>;
    case "chat":
      return <WidgetErrorBoundary title="AI coach unavailable" description="The follow-up coach surface could not render."><LazySection title="Loading AI coach" description="Opening the conversational follow-up workspace."><ChatExtensionTabDirect currentPlan={currentPlan} chatPrompt={chatPrompt} chatMessages={chatMessages} isSendingChat={isSendingChat} onPromptChange={(event) => setChatPrompt(event.target.value)} onQuickPrompt={setChatPrompt} onSubmit={handleSendChat} /></LazySection></WidgetErrorBoundary>;
    case "achievements":
      return <WidgetErrorBoundary title="Achievements unavailable" description="The achievement surface could not render."><LazySection title="Loading achievements" description="Preparing achievement and reward history."><AchievementTabDirect progress={progress} rewardEvents={rewardEvents} /></LazySection></WidgetErrorBoundary>;
    case "missions":
      return <WidgetErrorBoundary title="Missions unavailable" description="The mission surface could not render."><LazySection title="Loading missions" description="Preparing daily and weekly progression goals."><MissionsTabDirect progress={progress} missionSummary={missionSummary} /></LazySection></WidgetErrorBoundary>;
    case "insights":
      return (
        <WidgetErrorBoundary title="Analytics/Insights unavailable" description="The analytics insights surface could not render.">
          <LazySection title="Loading analytics" description="Reading your productivity and mood insights.">
            <AnalyticsV2
              insights={
                Array.isArray(behavioralInsights?.adaptiveRecommendations)
                  ? { recommendations: behavioralInsights.adaptiveRecommendations }
                  : {}
              }
            />
          </LazySection>
        </WidgetErrorBoundary>
      );
    case "system":
      return (
        <WidgetErrorBoundary title="Resources/System unavailable" description="The resources system surface could not render.">
          <LazySection title="Loading resources" description="Opening the project memory and system overview.">
            <StudyCenter />
          </LazySection>
        </WidgetErrorBoundary>
      );
    case "history":
      return <WidgetErrorBoundary title="History unavailable" description="The plan history surface could not render."><LazySection title="Loading history" description="Opening saved plans and reusable answers."><HistoryTabDirect plans={plans} onView={setCurrentPlan} onUseAnswers={(item) => { setForm(item.profileSnapshot); handleTabChange("planner"); }} onDelete={handleDeletePlan} formatDate={formatDate} /></LazySection></WidgetErrorBoundary>;
    case "profile":
      return <WidgetErrorBoundary title="Profile unavailable" description="The profile surface could not render."><LazySection title="Loading profile" description="Opening profile and onboarding context."><ProfileTabDirect profile={profile} isSavingProfile={isSavingProfile} onChange={updateProfileField} onSubmit={handleSaveProfile} onApplyToPlanner={applyProfileToPlanner} /></LazySection></WidgetErrorBoundary>;
    case "feedback":
      return <WidgetErrorBoundary title="Feedback unavailable" description="The feedback surface could not render."><LazySection title="Loading feedback" description="Opening plan feedback and quality signals."><FeedbackTabDirect currentPlan={currentPlan} feedbackItems={feedbackItems} feedbackMessage={feedbackMessage} feedbackRating={feedbackRating} isSubmittingFeedback={isSubmittingFeedback} formatDate={formatDate} onMessageChange={(event) => setFeedbackMessage(event.target.value)} onRatingChange={(event) => setFeedbackRating(event.target.value)} onSubmit={handleSubmitFeedback} /></LazySection></WidgetErrorBoundary>;
    case "reminders":
      return <WidgetErrorBoundary title="Reminders unavailable" description="The reminder surface could not render."><LazySection title="Loading reminders" description="Opening adaptive reminder settings and notification tools."><ReminderTabDirect reminderSettings={reminderSettings} isSaving={isSavingReminderSettings} notificationState={notificationState} onChange={updateReminderField} onEnableNotifications={handleEnableNotifications} onSendTestReminder={handleSendTestReminder} onSubmit={handleSaveReminderSettings} /></LazySection></WidgetErrorBoundary>;
    case "support":
      return <WidgetErrorBoundary title="Support unavailable" description="The support surface could not render."><LazySection title="Loading support" description="Opening support guidance and help content."><SupportTabDirect /></LazySection></WidgetErrorBoundary>;
    case "settings":
      return <WidgetErrorBoundary title="Settings unavailable" description="The settings surface could not render."><LazySection title="Loading settings" description="Opening account, export, and privacy controls."><SettingsTabDirect user={user} profile={profile} plans={plans} goals={goals} habits={habits} reviews={reviews} monthlyReviews={monthlyReviews} checkins={checkins} rewardEvents={rewardEvents} careerExplorations={careerExplorationsForSettings} hobbyPlans={hobbyPlansForSettings} routineBuilders={routineBuildersForSettings} reminderSettings={reminderSettings} onDeleteMyData={handleDeleteMyData} onExportData={handleExportData} onResendVerification={handleResendVerification} onShareProgress={handleShareProgress} /></LazySection></WidgetErrorBoundary>;
    case "admin":
      return isAdmin ? <WidgetErrorBoundary title="Admin dashboard unavailable" description="The admin surface could not render."><LazySection title="Loading admin dashboard" description="Preparing usage and analytics administration."><AdminTabDirect adminSnapshot={adminSnapshot} userId={userId} /></LazySection></WidgetErrorBoundary> : null;
    default:
      return null;
  }
}

DashboardTabRouter.tabMeta = tabMeta;
export default DashboardTabRouter;
