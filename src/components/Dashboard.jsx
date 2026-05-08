import { useEffect, useMemo, useState } from "react";
import { sampleProfiles } from "../data/sampleProfiles";
import { motion } from "framer-motion";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineBolt,
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineFlag,
  HiOutlineQueueList,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { sendEmailVerification, signOut } from "firebase/auth";
import Header from "./dashboard/Header";
import PlannerBoard from "./dashboard/PlannerBoard";
import PlannerTab from "./dashboard/PlannerTab";
import ProgressWidget from "./dashboard/ProgressWidget";
import AnalyticsChart from "./dashboard/AnalyticsChart";
import QuickAddModal from "./dashboard/QuickAddModal";
import ResultPanel from "./dashboard/ResultPanel";
import Sidebar from "./dashboard/Sidebar";
import GoalTabDirect from "./dashboard/GoalTab";
import HabitTabDirect from "./dashboard/HabitTab";
import DailyProgressTabDirect from "./dashboard/DailyProgressTab";
import WeeklyProgressTabDirect from "./dashboard/WeeklyProgressTab";
import WeeklyReviewTabDirect from "./dashboard/WeeklyReviewTab";
import MonthlyReviewTabDirect from "./dashboard/MonthlyReviewTab";
import CareerExplorerTabDirect from "./dashboard/CareerExplorerTab";
import HobbyIncomeTabDirect from "./dashboard/HobbyIncomeTab";
import RoutineBuilderTabDirect from "./dashboard/RoutineBuilderTab";
import ChatExtensionTabDirect from "./dashboard/ChatExtensionTab";
import AchievementTabDirect from "./dashboard/AchievementTab";
import MissionsTabDirect from "./dashboard/MissionsTab";
import PersonalizationTabDirect from "./dashboard/PersonalizationTab";
import ProjectMapTabDirect from "./dashboard/ProjectMapTab";
import HistoryTabDirect from "./dashboard/HistoryTab";
import ProfileTabDirect from "./dashboard/ProfileTab";
import FeedbackTabDirect from "./dashboard/FeedbackTab";
import ReminderTabDirect from "./dashboard/ReminderTab";
import SupportTabDirect from "./dashboard/SupportTab";
import SettingsTabDirect from "./dashboard/SettingsTab";
import AdminTabDirect from "./dashboard/AdminTab";
import { WidgetErrorBoundary } from "./AppErrorBoundary";
import "../styles/dashboard-modern.css";
import { auth } from "../firebase";
import {
  deleteRoutineBuilderRecord,
  deleteAllUserData,
  deleteGoalRecord,
  deleteHabitRecord,
  deletePlanRecord,
  loadAdminSnapshot,
  loadReminderSettings,
  loadUserCareerExplorations,
  loadUserFeedback,
  loadUserGoals,
  loadUserHabits,
  loadUserHobbyPlans,
  loadMonthlyReviews,
  loadUserPlans,
  loadUserProfile,
  loadUserRoutineBuilders,
  loadWeeklyReviews,
  saveCareerExplorationRecord,
  saveGoalRecord,
  saveHabitRecord,
  saveHobbyPlanRecord,
  saveMonthlyReviewRecord,
  savePlanRecord,
  saveReminderSettings,
  saveRoutineBuilderRecord,
  saveUserProfile,
  saveWeeklyReviewRecord,
  submitFeedbackRecord,
  updateGoalRecord,
  updateHabitRecord,
} from "../services/appData";
import { getDateKey } from "../services/rewards";
import { applyRewardAction, loadRewardEvents, loadUserCheckins, loadUserProgress, submitDailyCheckin } from "../services/progressData";
import { logPlanGeneration, logPlanFeedback, logPlanAdjustment, logCheckinPattern } from "../services/dataCollection";


const initialForm = {
  wakeTime: "",
  sleepTime: "",
  currentRoutine: "",
  workOrStudy: "",
  personalChallenges: "",
  futureConfusion: "",
  goals: "",
  hobbies: "",
  happinessSources: "",
  lonelyMoments: "",
  knownObstacles: "",
  skillsToBuild: "",
  planDuration: "1-week",
  roadmapFocus: "balanced",
  professionalHelp: "roadmap",
  flexibilityLevel: "flexible",
  energyLevel: "medium",
  preferredTone: "motivational",
};

const initialProfile = {
  fullName: "",
  ageGroup: "18-24",
  role: "student",
  mainGoal: "",
  interests: "",
  preferredRoutineStyle: "flexible",
  careerInterest: "",
  lifePriorities: "",
  workingStyle: "",
  sleepPreference: "",
  stressLevel: "medium",
  longTermVision: "",
  noteToPlanner: "",
};

const initialGoalDraft = {
  title: "",
  category: "life",
  targetDate: "",
  reason: "",
  milestonesText: "",
};

const initialHabitDraft = {
  title: "",
  difficulty: "easy",
  anchor: "",
  standardVersion: "",
  minimumVersion: "",
};

const initialReviewDraft = {
  worked: "",
  heavy: "",
  moodLift: "",
  nextStep: "",
};

const initialMonthlyReviewDraft = {
  biggestWin: "",
  strongestArea: "",
  weakestArea: "",
  trend: "",
  resetPlan: "",
};

const initialCareerDraft = {
  interests: "",
  strengths: "",
  environment: "flexible",
  constraint: "clarity",
  future: "",
};

const initialHobbyDraft = {
  hobby: "",
  level: "beginner",
  timePerWeek: "2-4 hours",
  incomeStyle: "explore",
  goal: "",
};

const initialRoutineBuilderDraft = {
  title: "",
  notes: "",
  wakeTime: "",
  sleepTime: "",
  blocks: [],
};

const initialRoutineBlockDraft = {
  day: "Monday",
  time: "",
  type: "study",
  label: "",
};

const initialReminderSettings = {
  dailyEnabled: false,
  dailyTime: "",
  weeklyDay: "Sunday",
  weeklyTime: "",
  comebackEnabled: true,
  motivationStyle: "gentle",
  notes: "",
};

const initialCheckinFields = {
  mood: "",
  energy: "",
  focus: "",
  loneliness: "",
  difficultyReason: "",
};

const emptyProgress = {
  momentumPoints: 0,
  activeStreak: 0,
  longestStreak: 0,
  comebackWins: 0,
  weeklyCompletions: 0,
  bestWeekCompletion: 0,
  badges: [],
  milestones: [],
  latestBadge: null,
  lastWeekSummary: null,
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const adminEmails = String(import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
const requiredFields = ["currentRoutine", "workOrStudy", "personalChallenges", "futureConfusion", "goals", "hobbies", "happinessSources"];
const navigationItems = ["planner", "goals", "habits", "daily", "weekly", "review", "monthly", "career", "income", "routine", "chat", "achievements", "missions", "insights", "system", "history", "profile", "feedback", "reminders", "support", "settings", "admin"];
const sidebarGroups = [
  { label: "Workspace", items: ["planner", "goals", "habits", "routine", "career"] },
  { label: "Intelligence", items: ["daily", "weekly", "review", "monthly", "insights", "chat", "achievements", "missions"] },
  { label: "Memory", items: ["history", "feedback", "system", "reminders", "support", "settings", "admin"] },
];
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
    label: "Missions",
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

const initialSectionLoading = {
  plans: true,
  profile: true,
  feedback: true,
  goals: true,
  habits: true,
  reviews: true,
  monthlyReviews: true,
  careerExplorations: true,
  hobbyPlans: true,
  routineBuilders: true,
  reminders: true,
  progress: true,
  rewardEvents: true,
  checkins: true,
};

function formatDate(value) {
  if (!value) return "Just now";
  const dateValue = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(dateValue);
}

function createPlanTitle(form) {
  const goalWords = form.goals.trim().split(/\s+/).slice(0, 7).join(" ");
  return goalWords || `${form.planDuration} ${form.roadmapFocus} plan`;
}

function buildPlannerProfile(form, profile) {
  return { ...form, profileContext: profile };
}

function buildAutofillFromProfile(profile) {
  return {
    goals: profile.mainGoal || "",
    hobbies: profile.interests || "",
    roadmapFocus: profile.careerInterest ? "career" : "balanced",
    flexibilityLevel: profile.preferredRoutineStyle || "flexible",
    preferredTone: "mentor",
  };
}

function tokenizeText(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function scoreKeywordSet(text, keywords) {
  const haystack = tokenizeText(text);
  return keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0);
}

function buildCareerSuggestions({ draft, profile, form }) {
  const combinedText = [
    draft.interests,
    draft.strengths,
    draft.future,
    profile.interests,
    profile.careerInterest,
    form.hobbies,
    form.skillsToBuild,
  ].join(" ");

  const library = [
    {
      title: "UI / visual design",
      keywords: ["design", "sketch", "art", "creative", "ui", "ux", "visual", "drawing"],
      reason: "Fits visual thinking, sketch-based interests, and creative direction.",
    },
    {
      title: "Content creation and brand storytelling",
      keywords: ["writing", "content", "story", "video", "editing", "music", "social", "creative"],
      reason: "Strong fit when communication and creative expression keep showing up.",
    },
    {
      title: "Web development or product building",
      keywords: ["coding", "web", "build", "logic", "tech", "software", "analysis"],
      reason: "A good direction if structured problem-solving and digital skills feel satisfying.",
    },
    {
      title: "Teaching, coaching, or mentoring",
      keywords: ["help", "teach", "support", "guide", "explain", "empathy"],
      reason: "Useful when patience, empathy, and explaining things are real strengths.",
    },
    {
      title: "Operations, coordination, or project support",
      keywords: ["organize", "planning", "system", "schedule", "operations", "coordination"],
      reason: "Good fit for structure-minded people who like keeping work clear and moving.",
    },
    {
      title: "Marketing and audience growth",
      keywords: ["marketing", "brand", "audience", "sales", "social", "business"],
      reason: "Worth exploring when communication, visibility, and audience-building matter.",
    },
  ];

  const matched = library
    .map((item) => ({ ...item, score: scoreKeywordSet(combinedText, item.keywords) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);

  if (matched.length > 0) return matched;

  return [
    {
      title: "Structured skill-building track",
      reason: "Best when you need clarity first and want a safe path into future options.",
    },
    {
      title: "Portfolio-first exploration track",
      reason: "Helpful when you learn best by making small public or private projects.",
    },
    {
      title: "Entry-level career reset track",
      reason: "Useful when you need practical movement, not just more overthinking.",
    },
  ];
}

function buildHobbyIncomeIdeas(draft) {
  const hobby = String(draft.hobby || "").toLowerCase();
  const suggestions = [];

  if (/(sketch|design|art|drawing|illustration)/.test(hobby)) {
    suggestions.push("Create 3 small portfolio pieces and offer low-pressure custom work to friends first.");
    suggestions.push("Practice one digital design tool and turn sketches into simple social media or poster samples.");
  }
  if (/(music|sing|beat|guitar|piano|audio)/.test(hobby)) {
    suggestions.push("Record short polished samples and test content, tutoring, or basic freelance audio tasks.");
    suggestions.push("Build a tiny weekly practice catalog so the hobby starts leaving proof of skill behind.");
  }
  if (/(coding|programming|web|software)/.test(hobby)) {
    suggestions.push("Build two useful mini projects, then turn them into a beginner portfolio and freelance starter pitch.");
    suggestions.push("Choose one stack only for the next month so skill depth grows faster than scattered learning.");
  }
  if (/(writing|blog|story|poetry|copy)/.test(hobby)) {
    suggestions.push("Write 5 strong samples for one niche and test copywriting, scripts, or newsletter support.");
    suggestions.push("Turn hobby writing into a repeatable content workflow with one publish day each week.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Turn the hobby into one visible sample each week so it can become proof, not just interest.");
    suggestions.push("Test one low-risk income experiment before trying to monetize the whole hobby at once.");
    suggestions.push("Pick one platform, one offer, and one weekly practice block for the next month.");
  }

  return suggestions.slice(0, 4);
}

function escapeIcs(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function buildRoutineCalendarIcs(builderDraft) {
  const dayMap = {
    Monday: "MO",
    Tuesday: "TU",
    Wednesday: "WE",
    Thursday: "TH",
    Friday: "FR",
    Saturday: "SA",
    Sunday: "SU",
  };

  const events = builderDraft.blocks
    .filter((block) => block.day && block.time && block.label)
    .map((block, index) => {
      const [hour = "09", minute = "00"] = String(block.time).split(":");
      const start = new Date(Date.UTC(2026, 0, 5, Number(hour), Number(minute)));
      const end = new Date(start.getTime() + (60 * 60 * 1000));
      const startString = start.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endString = end.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      return [
        "BEGIN:VEVENT",
        `UID:routine-${index}-${Date.now()}@life-guidance-pro`,
        `DTSTAMP:${startString}`,
        `DTSTART:${startString}`,
        `DTEND:${endString}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${dayMap[block.day] || "MO"}`,
        `SUMMARY:${escapeIcs(block.label)}`,
        `DESCRIPTION:${escapeIcs(`${block.type} block from ${builderDraft.title || "Routine blueprint"}`)}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Life Guidance Pro//Routine Builder//EN",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

function buildPersonalizationInsights({ profile, plans, checkins }) {
  const preferredTone = plans[0]?.profileSnapshot?.preferredTone || profile.preferredRoutineStyle || "mentor";
  const focusCounts = new Map();
  plans.forEach((plan) => {
    const focus = plan.profileSnapshot?.roadmapFocus;
    if (focus) focusCounts.set(focus, (focusCounts.get(focus) || 0) + 1);
  });
  const bestFocus = [...focusCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || "balanced";

  const completed = checkins.filter((item) => item.status === "completed").length;
  const difficult = checkins.filter((item) => item.status === "difficult").length;
  const lowEnergyDays = checkins.filter((item) => item.energy === "low").length;

  return {
    preferredTone,
    bestFocus,
    routineStyle:
      profile.preferredRoutineStyle === "structured"
        ? "You seem to respond best when the routine is clearly structured and visible."
        : "You seem to benefit from flexible planning that protects direction without becoming rigid.",
    lowEnergyPattern:
      lowEnergyDays > 2 || difficult > completed
        ? "Low-energy fallback routines should stay prominent. Minimum versions matter more than ideal ones right now."
        : "You have enough momentum to keep a full routine, but fallback versions should stay available for rough days.",
    nextMove:
      bestFocus === "career"
        ? "Keep the next plan career-heavy and connect weekly work to one skill path at a time."
        : "Use the next plan to tighten consistency first, then layer career direction on top of it.",
    bestDayWindow:
      completed >= 3 ? "Your strongest pattern so far is showing up and finishing the day, not just starting it." : "You are still building a stable check-in rhythm, so shorter review loops will help.",
  };
}

function buildMissionSummary(progress) {
  const points = progress.momentumPoints || 0;
  const level = Math.max(1, Math.floor(points / 120) + 1);
  const pointsToNext = Math.max(0, level * 120 - points);
  const levelTitles = ["Restart", "Stabilizing", "Consistent", "Focused", "Expanding", "Self-Led", "Momentum Builder", "Pathmaker"];

  return {
    level,
    pointsToNext,
    levelTitle: levelTitles[Math.min(level - 1, levelTitles.length - 1)],
    dailyMissions: [
      {
        title: "Show up once on purpose",
        description: "Complete one meaningful action instead of waiting for a perfect day.",
        reward: "+10 momentum points through a completed check-in",
      },
      {
        title: "Protect your minimum version",
        description: "Keep one tiny habit or one low-energy routine block alive.",
        reward: "Supports streak protection and comeback wins",
      },
      {
        title: "Write one honest sentence",
        description: "Use chat, review, or notes to say what the day actually felt like.",
        reward: "Improves future planning quality",
      },
    ],
    weeklyChallenges: [
      {
        title: "Five positive check-in days",
        description: "Aim for at least five days marked completed, partial, or difficult-but-tried.",
        reward: "Good week reward and stronger weekly continuity",
      },
      {
        title: "One review before the week ends",
        description: "Close the week with one clear reflection instead of drifting into the next one.",
        reward: "Better next-step clarity",
      },
      {
        title: "One future-facing action",
        description: "Advance one goal, habit, career map, or hobby path on purpose.",
        reward: "Momentum beyond routine maintenance",
      },
    ],
    growthMap: [
      { level: 1, title: "Seed", description: "Start by showing up and making the app real.", unlocked: level >= 1 },
      { level: 2, title: "Path", description: "Consistency begins to matter more than intensity.", unlocked: level >= 2 },
      { level: 3, title: "Bridge", description: "You are connecting planning to actual lived follow-through.", unlocked: level >= 3 },
      { level: 4, title: "Climb", description: "The system starts helping future goals instead of only managing chaos.", unlocked: level >= 4 },
      { level: 5, title: "Viewpoint", description: "You can look back and see real evidence of growth.", unlocked: level >= 5 },
      { level: 6, title: "Horizon", description: "The routine becomes a base for bigger life direction.", unlocked: level >= 6 },
    ],
  };
}

function buildWeeklySummaryText(week, progress) {
  if (!week) {
    return `Life Guidance Pro weekly snapshot\n\nNo weekly check-in data yet. Momentum points: ${progress.momentumPoints}.`;
  }

  return [
    "Life Guidance Pro weekly snapshot",
    "",
    `Week: ${week.weekStart} to ${week.weekEnd}`,
    `Positive days: ${week.positiveDays}/7`,
    `Completion score: ${week.completionRate}%`,
    `Completed days: ${week.completed}`,
    `Partial days: ${week.partial}`,
    `Difficult days: ${week.difficult}`,
    `Missed days: ${week.missed}`,
    `Points earned this week: ${week.pointsEarned}`,
    `Overall momentum points: ${progress.momentumPoints}`,
    `Active streak: ${progress.activeStreak}`,
  ].join("\n");
}

function formatDisplayLabel(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function SectionLoadingCard({ title, description }) {
  return (
    <section className="section-loading-card">
      <div className="section-loading-pulse" />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </section>
  );
}

const MotionSection = motion.section;

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("planner");
  const [form, setForm] = useState(initialForm);
  const [profile, setProfile] = useState(initialProfile);
  const [consentChecked, setConsentChecked] = useState(false);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [goals, setGoals] = useState([]);
  const [goalDraft, setGoalDraft] = useState(initialGoalDraft);
  const [habits, setHabits] = useState([]);
  const [habitDraft, setHabitDraft] = useState(initialHabitDraft);
  const [reviews, setReviews] = useState([]);
  const [reviewDraft, setReviewDraft] = useState(initialReviewDraft);
  const [monthlyReviews, setMonthlyReviews] = useState([]);
  const [monthlyReviewDraft, setMonthlyReviewDraft] = useState(initialMonthlyReviewDraft);
  const [careerDraft, setCareerDraft] = useState(initialCareerDraft);
  const [careerExplorations, setCareerExplorations] = useState([]);
  const [hobbyDraft, setHobbyDraft] = useState(initialHobbyDraft);
  const [hobbyPlans, setHobbyPlans] = useState([]);
  const [routineBuilderDraft, setRoutineBuilderDraft] = useState(initialRoutineBuilderDraft);
  const [routineBlockDraft, setRoutineBlockDraft] = useState(initialRoutineBlockDraft);
  const [routineBuilders, setRoutineBuilders] = useState([]);
  const [reminderSettings, setReminderSettings] = useState(initialReminderSettings);
  const [notificationState, setNotificationState] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported",
  );
  const [adminSnapshot, setAdminSnapshot] = useState(null);
  const [progress, setProgress] = useState(emptyProgress);
  const [rewardEvents, setRewardEvents] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [todayCheckin, setTodayCheckin] = useState(null);
  const [checkinNote, setCheckinNote] = useState("");
  const [checkinFields, setCheckinFields] = useState(initialCheckinFields);
  const [adjustmentRequest, setAdjustmentRequest] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(initialSectionLoading);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [isSavingHabit, setIsSavingHabit] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [isSavingMonthlyReview, setIsSavingMonthlyReview] = useState(false);
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const [isSavingHobbyPath, setIsSavingHobbyPath] = useState(false);
  const [isSavingRoutineBuilder, setIsSavingRoutineBuilder] = useState(false);
  const [isSavingReminderSettings, setIsSavingReminderSettings] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDraft, setQuickAddDraft] = useState({
    type: "goal",
    title: "",
    note: "",
  });

  const isAdmin = adminEmails.includes(String(user?.email || "").toLowerCase());
  const statusTone =
    statusMessage.startsWith("Some ") || statusMessage.startsWith("Cloud data")
      ? "info"
      : "success";
  const activeMeta = tabMeta[activeTab] || tabMeta.planner;

  useEffect(() => {
    if (!statusMessage || statusTone === "info") return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 4800);
    return () => window.clearTimeout(timer);
  }, [statusMessage, statusTone]);

  useEffect(() => {
    let isMounted = true;
    async function loadWorkspace() {
      setIsLoadingWorkspace(true);
      setSectionLoading(initialSectionLoading);
      try {
        const safeLoad = async (key, loader, fallback) => {
          try {
            return { key, status: "fulfilled", value: await loader() };
          } catch (reason) {
            return { key, status: "rejected", reason, value: fallback };
          } finally {
            if (isMounted) {
              setSectionLoading((current) => ({ ...current, [key]: false }));
            }
          }
        };

        const results = [
          await safeLoad("plans", () => loadUserPlans(user.uid), []),
          await safeLoad("profile", () => loadUserProfile(user.uid), null),
          await safeLoad("feedback", () => loadUserFeedback(user.uid), []),
          await safeLoad("goals", () => loadUserGoals(user.uid), []),
          await safeLoad("habits", () => loadUserHabits(user.uid), []),
          await safeLoad("reviews", () => loadWeeklyReviews(user.uid), []),
          await safeLoad("monthlyReviews", () => loadMonthlyReviews(user.uid), []),
          await safeLoad("careerExplorations", () => loadUserCareerExplorations(user.uid), []),
          await safeLoad("hobbyPlans", () => loadUserHobbyPlans(user.uid), []),
          await safeLoad("routineBuilders", () => loadUserRoutineBuilders(user.uid), []),
          await safeLoad("reminders", () => loadReminderSettings(user.uid), null),
          await safeLoad("progress", () => loadUserProgress(user.uid), emptyProgress),
          await safeLoad("rewardEvents", () => loadRewardEvents(user.uid), []),
          await safeLoad("checkins", () => loadUserCheckins(user.uid), []),
        ];
        if (!isMounted) return;
        const resultMap = Object.fromEntries(results.map((item) => [item.key, item]));
        const getValue = (key, fallback) =>
          resultMap[key]?.status === "fulfilled" ? resultMap[key].value : (resultMap[key]?.value ?? fallback);

        const loadedPlans = getValue("plans", []);
        const loadedProfile = getValue("profile", null);
        const loadedFeedback = getValue("feedback", []);
        const loadedGoals = getValue("goals", []);
        const loadedHabits = getValue("habits", []);
        const loadedReviews = getValue("reviews", []);
        const loadedMonthlyReviews = getValue("monthlyReviews", []);
        const loadedCareerExplorations = getValue("careerExplorations", []);
        const loadedHobbyPlans = getValue("hobbyPlans", []);
        const loadedRoutineBuilders = getValue("routineBuilders", []);
        const loadedReminderSettings = getValue("reminders", null);
        const loadedProgress = getValue("progress", emptyProgress);
        const loadedEvents = getValue("rewardEvents", []);
        const loadedCheckins = getValue("checkins", []);

        setPlans(loadedPlans);
        setCurrentPlan(loadedPlans[0] || null);
        setFeedbackItems(loadedFeedback);
        setGoals(loadedGoals);
        setHabits(loadedHabits);
        setReviews(loadedReviews);
        setMonthlyReviews(loadedMonthlyReviews);
        setCareerExplorations(loadedCareerExplorations);
        setHobbyPlans(loadedHobbyPlans);
        setRoutineBuilders(loadedRoutineBuilders);
        if (loadedReminderSettings) setReminderSettings({ ...initialReminderSettings, ...loadedReminderSettings });
        setProgress({ ...emptyProgress, ...loadedProgress });
        setRewardEvents(loadedEvents);
        setCheckins(loadedCheckins);
        const today = loadedCheckins.find((item) => item.date === getDateKey());
        setTodayCheckin(today || null);
        setCheckinNote(today?.note || "");
        setCheckinFields(today ? {
          mood: today.mood || "",
          energy: today.energy || "",
          focus: today.focus || "",
          loneliness: today.loneliness || "",
          difficultyReason: today.difficultyReason || "",
        } : initialCheckinFields);
        if (loadedProfile) setProfile({ ...initialProfile, ...loadedProfile });
        setError("");

        const rejectedMessages = results
          .filter((item) => item.status === "rejected")
          .map((item) => String(item.reason?.message || item.reason || ""))
          .filter(Boolean);
        if (rejectedMessages.length > 0) {
          // Console suppressed for production
          const combined = rejectedMessages.join(" ");
          if (
            combined.includes("offline") ||
            combined.includes("unavailable") ||
            combined.includes("AbortError") ||
            combined.includes("IndexedDbTransactionError")
          ) {
            setStatusMessage("Some cloud data could not load right now, but the planner is still open. Try again after reconnecting or reloading.");
          } else {
            setStatusMessage("Some saved data could not be loaded yet, but the planner is still open.");
          }
        }
      } catch (workspaceError) {
        if (isMounted) {
          const message = String(workspaceError?.message || "");
          if (
            message.includes("IndexedDbTransactionError") ||
            message.includes("AbortError") ||
            message.includes("offline") ||
            message.includes("unavailable")
          ) {
            setError("");
            setStatusMessage("Cloud data is temporarily unavailable, but you can still use the planner. Try reloading in a moment.");
          } else {
            setError(message || "Could not load your workspace.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingWorkspace(false);
          setSectionLoading((current) =>
            Object.fromEntries(Object.keys(current).map((key) => [key, false])),
          );
        }
      }
    }
    loadWorkspace();
    return () => {
      isMounted = false;
    };
  }, [user.uid]);

  useEffect(() => {
    let ignore = false;
    async function loadAdminData() {
      if (!isAdmin || activeTab !== "admin") return;
      try {
        const snapshot = await loadAdminSnapshot();
        if (!ignore) setAdminSnapshot(snapshot);
      } catch (adminError) {
        if (!ignore) setError(adminError.message || "Could not load admin dashboard.");
      }
    }
    loadAdminData();
    return () => { ignore = true; };
  }, [activeTab, isAdmin]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "granted" ||
      !reminderSettings.dailyEnabled ||
      !reminderSettings.dailyTime
    ) {
      return undefined;
    }

    const [hourString = "9", minuteString = "0"] = String(reminderSettings.dailyTime).split(":");
    const target = new Date();
    target.setHours(Number(hourString), Number(minuteString), 0, 0);
    if (target.getTime() <= Date.now()) {
      return undefined;
    }

    const storageKey = `lgp-reminder-${getDateKey()}-${reminderSettings.dailyTime}`;
    if (window.localStorage.getItem(storageKey) === "sent") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const notification = new Notification("Life Guidance Pro", {
        body: "Time to reconnect with today’s routine. Even the minimum version counts.",
      });
      window.localStorage.setItem(storageKey, "sent");
      window.setTimeout(() => notification.close(), 7000);
    }, target.getTime() - Date.now());

    return () => window.clearTimeout(timer);
  }, [reminderSettings.dailyEnabled, reminderSettings.dailyTime]);

  const completion = useMemo(() => {
    const filledCount = requiredFields.filter((field) => form[field].trim()).length;
    return Math.round((filledCount / requiredFields.length) * 100);
  }, [form]);

  const currentPlanFeedback = feedbackItems.find((item) => item.planId === currentPlan?.id);
  const recentRewards = rewardEvents.slice(0, 5);
  const personalizationInsights = useMemo(
    () => buildPersonalizationInsights({ profile, plans, checkins }),
    [profile, plans, checkins],
  );
  const missionSummary = useMemo(() => buildMissionSummary(progress), [progress]);
  const onboardingSteps = useMemo(
    () => [
      { label: "Save your profile", done: Boolean(profile.mainGoal || profile.interests || profile.fullName) },
      { label: "Create your first plan", done: plans.length > 0 },
      { label: "Add one goal", done: goals.length > 0 },
      { label: "Track one daily check-in", done: checkins.length > 0 },
    ],
    [profile, plans.length, goals.length, checkins.length],
  );
  const sidebarItems = useMemo(
    () =>
      sidebarGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item !== "admin" || isAdmin),
        }))
        .filter((group) => group.items.length > 0),
    [isAdmin],
  );
  const mobileNavItems = useMemo(
    () =>
      navigationItems.filter((item) => {
        if (item === "admin" && !isAdmin) return false;
        if (!searchQuery.trim()) return true;
        const meta = tabMeta[item];
        const query = searchQuery.trim().toLowerCase();
        return meta?.label.toLowerCase().includes(query) || meta?.description.toLowerCase().includes(query);
      }),
    [isAdmin, searchQuery],
  );
  const plannerSnapshots = useMemo(
    () => [
      { label: "Live plans", value: plans.length, hint: plans.length ? "Stored for reuse" : "Create the first one" },
      { label: "Momentum", value: progress.momentumPoints, hint: `${progress.activeStreak} day streak` },
      { label: "Core setup", value: `${completion}%`, hint: `${requiredFields.filter((field) => form[field].trim()).length}/${requiredFields.length} signals` },
    ],
    [plans.length, progress.momentumPoints, progress.activeStreak, completion, form],
  );
  const streakLabel = `${progress.activeStreak || 0} day streak`;
  const insightNarrative = useMemo(
    () => ({
      greeting:
        currentPlan?.title ||
        profile.fullName ||
        "Your guidance workspace is ready",
      focus:
        currentPlan?.profileSnapshot?.roadmapFocus ||
        personalizationInsights.bestFocus ||
        "balanced",
      recommendation:
        currentPlan
          ? "Protect one next step from the latest plan, then use the rail to watch your energy and consistency."
          : "Use the planner once with honest answers. The rest of the dashboard gets much smarter after the first plan.",
    }),
    [currentPlan, profile.fullName, personalizationInsights.bestFocus],
  );

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
    setIsMobileNavOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStatusMessage("Signed out successfully.");
      setError("");
    } catch (logoutError) {
      setError(logoutError.message || "Could not sign out right now.");
    }
  };

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateProfileField = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateGoalField = (event) => setGoalDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateHabitField = (event) => setHabitDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateReviewField = (event) => setReviewDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateMonthlyReviewField = (event) => setMonthlyReviewDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateCareerField = (event) => setCareerDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateHobbyField = (event) => setHobbyDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateRoutineBuilderField = (event) => setRoutineBuilderDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateRoutineBlockField = (event) => setRoutineBlockDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateCheckinField = (event) => setCheckinFields((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateReminderField = (event) => {
    const { name, type, checked, value } = event.target;
    setReminderSettings((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };
  const applyQuickFocus = (roadmapFocus, planDuration = form.planDuration) => setForm((current) => ({ ...current, roadmapFocus, planDuration }));

  const resetPlanner = () => {
    setForm(initialForm);
    setConsentChecked(false);
    setCurrentPlan(null);
    setAdjustmentRequest("");
    setError("");
    setStatusMessage("");
  };

  const loadSampleProfile = (sample) => {
    setForm((current) => ({ ...current, ...sample.values }));
    setActiveTab("planner");
    setStatusMessage(`Loaded sample: ${sample.label}`);
    setError("");
  };

  const handleQuickAddSubmit = (event) => {
    event.preventDefault();
    const title = quickAddDraft.title.trim();
    const note = quickAddDraft.note.trim();
    if (!title) {
      setError("Give the quick add a title first.");
      return;
    }

    if (quickAddDraft.type === "goal") {
      setGoalDraft((current) => ({
        ...current,
        title,
        reason: note || current.reason,
      }));
      setActiveTab("goals");
      setStatusMessage("Goal draft prepared. Finish the details and save it when ready.");
    } else if (quickAddDraft.type === "habit") {
      setHabitDraft((current) => ({
        ...current,
        title,
        standardVersion: note || current.standardVersion,
      }));
      setActiveTab("habits");
      setStatusMessage("Habit draft prepared. You can save it from the habits tab.");
    } else {
      setForm((current) => ({
        ...current,
        goals: current.goals ? `${current.goals}\n${title}` : title,
        knownObstacles: note ? (current.knownObstacles ? `${current.knownObstacles}\n${note}` : note) : current.knownObstacles,
      }));
      setActiveTab("planner");
      setStatusMessage("Planner note added to your current setup.");
    }

    setQuickAddDraft({ type: "goal", title: "", note: "" });
    setIsQuickAddOpen(false);
    setError("");
  };

  const applyProfileToPlanner = () => {
    setForm((current) => ({ ...current, ...buildAutofillFromProfile(profile) }));
    setActiveTab("planner");
    setStatusMessage("Your saved profile has been applied to the planner.");
  };

  const validatePlanner = () => {
    if (requiredFields.find((field) => !form[field].trim())) {
      setError("Please complete the main questions before generating your plan.");
      return false;
    }
    if (!consentChecked) {
      setError("Please confirm the privacy checkbox before generating a plan.");
      return false;
    }
    return true;
  };

  const mergeRewardResult = (result) => {
    if (!result) return;
    setProgress((current) => ({ ...current, ...result.progress }));
    if (result.rewards?.length) {
      const stampedRewards = result.rewards.map((reward, index) => ({
        id: `${Date.now()}-${index}-${reward.reason}`,
        ...reward,
        createdAt: new Date().toISOString(),
      }));
      setRewardEvents((current) => [...stampedRewards, ...current]);
    }
  };

  const requestPlan = async ({ adjustment = "" } = {}) => {
    setError("");
    setStatusMessage("");
    if (!validatePlanner()) return;
    adjustment ? setIsAdjusting(true) : setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/guidance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: buildPlannerProfile(form, profile),
          userEmail: user.email,
          previousPlan: currentPlan?.result || "",
          adjustmentRequest: adjustment,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not create your plan.");
      const savedPlan = await savePlanRecord({
        userId: user.uid,
        userEmail: user.email,
        title: createPlanTitle(form),
        profileSnapshot: form,
        profileSummary: profile,
        result: data.plan,
        adjustment,
      });
      const rewardResult = await applyRewardAction(user.uid, {
        type: adjustment ? "plan-adjusted" : "plan-created",
        planId: savedPlan.id,
        roadmapFocus: form.roadmapFocus,
      });
      mergeRewardResult(rewardResult);
      
      // Log data for AI improvement
      if (adjustment) {
        await logPlanAdjustment(user.uid, {
          originalFocus: currentPlan?.profileSnapshot?.roadmapFocus,
          adjustmentRequest: adjustment,
          planDuration: form.planDuration,
        });
      } else {
        await logPlanGeneration(user.uid, {
          profile: buildPlannerProfile(form, profile),
          plan: data.plan,
          adjustmentRequest: null,
        });
      }
      
      setPlans((current) => [savedPlan, ...current]);
      setCurrentPlan(savedPlan);
      setAdjustmentRequest("");
      setActiveTab("planner");
      setStatusMessage(adjustment ? "Plan updated successfully. Your revised plan is ready below." : "Plan generated successfully. Your new guidance plan is ready below.");
    } catch (requestError) {
      setError(requestError.message || "Something went wrong while creating your plan.");
    } finally {
      setIsLoading(false);
      setIsAdjusting(false);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setError("");
    try {
      await saveUserProfile(user.uid, { ...profile, userEmail: user.email });
      const rewardResult = await applyRewardAction(user.uid, { type: "profile-saved" });
      mergeRewardResult(rewardResult);
      setStatusMessage("Profile saved. You can now use it to autofill the planner.");
    } catch (profileError) {
      setError(profileError.message || "Could not save your profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();
    if (!currentPlan) {
      setError("Create or open a plan before sending feedback.");
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const savedFeedback = await submitFeedbackRecord({
        userId: user.uid,
        userEmail: user.email,
        planId: currentPlan.id,
        rating: Number(feedbackRating),
        message: feedbackMessage,
        planTitle: currentPlan.title,
      });
      const rewardResult = await applyRewardAction(user.uid, { type: "feedback-submitted", planId: currentPlan.id });
      mergeRewardResult(rewardResult);
      
      // Log feedback for AI learning
      await logPlanFeedback(user.uid, currentPlan.id, {
        rating: Number(feedbackRating),
        message: feedbackMessage,
      });
      
      setFeedbackItems((current) => [savedFeedback, ...current]);
      setFeedbackMessage("");
      setFeedbackRating(5);
      setStatusMessage("Feedback saved and added to your momentum.");
    } catch (feedbackError) {
      setError(feedbackError.message || "Could not save feedback.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleDailyCheckin = async (status) => {
    if (!currentPlan) {
      setError("Open a plan before checking in.");
      return;
    }
    setIsSubmittingCheckin(true);
    setError("");
    try {
      const result = await submitDailyCheckin(user.uid, {
        dateKey: getDateKey(),
        status,
        note: checkinNote,
        ...checkinFields,
        planId: currentPlan.id,
      });
      mergeRewardResult(result);
      setTodayCheckin(result.checkin);
      setCheckinFields({
        mood: result.checkin.mood || "",
        energy: result.checkin.energy || "",
        focus: result.checkin.focus || "",
        loneliness: result.checkin.loneliness || "",
        difficultyReason: result.checkin.difficultyReason || "",
      });
      setCheckins((current) => {
        const filtered = current.filter((c) => c.date !== result.checkin.date);
        return [result.checkin, ...filtered];
      });
      
      // Log checkin pattern for engagement tracking
      await logCheckinPattern(user.uid, result.progress);
      
      setStatusMessage(`Today's progress was saved as ${status.replace(/-/g, " ")}.`);
    } catch (checkinError) {
      setError(checkinError.message || "Could not save today's check-in.");
    } finally {
      setIsSubmittingCheckin(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlanRecord(planId);
      const nextPlans = plans.filter((plan) => plan.id !== planId);
      setPlans(nextPlans);
      if (currentPlan?.id === planId) setCurrentPlan(nextPlans[0] || null);
      setStatusMessage("Plan deleted.");
    } catch (planError) {
      setError(planError.message || "Could not delete the plan.");
    }
  };

  const handleSaveMonthlyReview = async (event) => {
    event.preventDefault();
    if (!monthlyReviewDraft.biggestWin.trim() && !monthlyReviewDraft.resetPlan.trim()) {
      setError("Write at least one meaningful monthly reflection before saving.");
      return;
    }

    setIsSavingMonthlyReview(true);
    setError("");
    try {
      const savedReview = await saveMonthlyReviewRecord({
        userId: user.uid,
        userEmail: user.email,
        monthLabel: new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date()),
        ...monthlyReviewDraft,
      });
      setMonthlyReviews((current) => [savedReview, ...current]);
      setMonthlyReviewDraft(initialMonthlyReviewDraft);
      setStatusMessage("Monthly review saved.");
    } catch (reviewError) {
      setError(reviewError.message || "Could not save the monthly review.");
    } finally {
      setIsSavingMonthlyReview(false);
    }
  };

  const handleSaveCareerExploration = async (event) => {
    event.preventDefault();
    if (!careerDraft.interests.trim() && !careerDraft.strengths.trim()) {
      setError("Share at least some interests or strengths before building career directions.");
      return;
    }

    setIsSavingCareer(true);
    setError("");
    try {
      const suggestions = buildCareerSuggestions({ draft: careerDraft, profile, form });
      const savedItem = await saveCareerExplorationRecord({
        userId: user.uid,
        userEmail: user.email,
        title: suggestions[0]?.title || "Career exploration",
        summary: `Environment: ${careerDraft.environment}. Constraint: ${careerDraft.constraint}.`,
        inputs: careerDraft,
        suggestions,
      });
      setCareerExplorations((current) => [savedItem, ...current]);
      setCareerDraft(initialCareerDraft);
      setStatusMessage("Career directions saved. You now have a stronger future-planning layer to work with.");
    } catch (itemError) {
      setError(itemError.message || "Could not save the career exploration.");
    } finally {
      setIsSavingCareer(false);
    }
  };

  const handleSaveHobbyPath = async (event) => {
    event.preventDefault();
    if (!hobbyDraft.hobby.trim()) {
      setError("Choose a hobby before building a path.");
      return;
    }

    setIsSavingHobbyPath(true);
    setError("");
    try {
      const experiments = buildHobbyIncomeIdeas(hobbyDraft);
      const savedItem = await saveHobbyPlanRecord({
        userId: user.uid,
        userEmail: user.email,
        title: `${hobbyDraft.hobby.trim()} path`,
        summary: `${hobbyDraft.level} level · ${hobbyDraft.timePerWeek} each week · ${hobbyDraft.incomeStyle} style`,
        inputs: hobbyDraft,
        experiments,
      });
      setHobbyPlans((current) => [savedItem, ...current]);
      setHobbyDraft(initialHobbyDraft);
      setStatusMessage("Hobby path saved. You now have small experiments to test instead of a vague dream.");
    } catch (itemError) {
      setError(itemError.message || "Could not save the hobby path.");
    } finally {
      setIsSavingHobbyPath(false);
    }
  };

  const handleAddRoutineBlock = () => {
    if (!routineBlockDraft.time.trim() || !routineBlockDraft.label.trim()) {
      setError("Add both a time and a block label before adding it.");
      return;
    }

    setRoutineBuilderDraft((current) => ({
      ...current,
      blocks: [...current.blocks, { ...routineBlockDraft, locked: true }],
    }));
    setRoutineBlockDraft(initialRoutineBlockDraft);
    setError("");
  };

  const handleRemoveRoutineBlock = (index) => {
    setRoutineBuilderDraft((current) => ({
      ...current,
      blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index),
    }));
  };

  const handleToggleRoutineBlockLock = (index) => {
    setRoutineBuilderDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, locked: !block.locked } : block,
      ),
    }));
  };

  const handleSaveRoutineBuilder = async (event) => {
    event.preventDefault();
    if (!routineBuilderDraft.title.trim()) {
      setError("Give the blueprint a clear name before saving.");
      return;
    }
    if (routineBuilderDraft.blocks.length === 0) {
      setError("Add at least one routine block before saving the blueprint.");
      return;
    }

    setIsSavingRoutineBuilder(true);
    setError("");
    try {
      const savedItem = await saveRoutineBuilderRecord({
        userId: user.uid,
        userEmail: user.email,
        ...routineBuilderDraft,
      });
      setRoutineBuilders((current) => [savedItem, ...current]);
      setRoutineBuilderDraft(initialRoutineBuilderDraft);
      setStatusMessage("Routine blueprint saved. This gives future planning a structure it can respect.");
    } catch (itemError) {
      setError(itemError.message || "Could not save the routine blueprint.");
    } finally {
      setIsSavingRoutineBuilder(false);
    }
  };

  const handleDeleteRoutineBuilder = async (recordId) => {
    try {
      await deleteRoutineBuilderRecord(recordId);
      setRoutineBuilders((current) => current.filter((item) => item.id !== recordId));
      setStatusMessage("Routine blueprint deleted.");
    } catch (itemError) {
      setError(itemError.message || "Could not delete the routine blueprint.");
    }
  };

  const handleExportRoutineCalendar = () => {
    if (routineBuilderDraft.blocks.length === 0) {
      setError("Add routine blocks before exporting a calendar file.");
      return;
    }

    const calendarText = buildRoutineCalendarIcs(routineBuilderDraft);
    const blob = new Blob([calendarText], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(routineBuilderDraft.title || "routine-blueprint").replace(/\s+/g, "-").toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Calendar export started. You can import the file into a calendar app.");
  };

  const handleSaveReminderSettings = async (event) => {
    event.preventDefault();
    setIsSavingReminderSettings(true);
    setError("");
    try {
      await saveReminderSettings(user.uid, { ...reminderSettings, userEmail: user.email });
      setStatusMessage("Reminder settings saved. We can connect these preferences to real delivery later.");
    } catch (itemError) {
      setError(itemError.message || "Could not save reminder settings.");
    } finally {
      setIsSavingReminderSettings(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setError("This browser does not support notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationState(permission);
      if (permission === "granted") {
        setStatusMessage("Browser notifications are enabled on this device.");
      } else {
        setError("Notification permission was not granted.");
      }
    } catch {
      setError("Could not enable notifications in this browser.");
    }
  };

  const handleSendTestReminder = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setError("This browser does not support notifications.");
      return;
    }
    if (Notification.permission !== "granted") {
      setError("Enable browser notifications first.");
      return;
    }

    const notification = new Notification("Life Guidance Pro", {
      body: "Tiny reset: come back to your routine, even if today only gets the minimum version.",
    });
    window.setTimeout(() => notification.close(), 6000);
    setStatusMessage("Test reminder sent.");
  };

  const handleResendVerification = async () => {
    try {
      if (!user) {
        setError("No signed-in user was found for verification.");
        return;
      }
      await sendEmailVerification(user);
      setStatusMessage("Verification email sent.");
    } catch (verificationError) {
      setError(verificationError.message || "Could not send verification email.");
    }
  };

  const handleShareProgress = async () => {
    const shareText = `Life Guidance Pro snapshot\nMomentum points: ${progress.momentumPoints}\nActive streak: ${progress.activeStreak}\nPlans saved: ${plans.length}\nGoals saved: ${goals.length}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Life Guidance Pro snapshot", text: shareText });
        setStatusMessage("Progress snapshot shared.");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setStatusMessage("Progress snapshot copied to clipboard.");
        return;
      }

      setError("Sharing is not available in this browser.");
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        setError(shareError.message || "Could not share the progress snapshot.");
      }
    }
  };

  const handleExportWeeklySummary = (week) => {
    const text = buildWeeklySummaryText(week, progress);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `weekly-summary-${week?.weekStart || getDateKey()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Weekly summary export started.");
  };

  const handleShareWeeklySummary = async (week) => {
    const text = buildWeeklySummaryText(week, progress);
    try {
      if (navigator.share) {
        await navigator.share({ title: "Weekly progress snapshot", text });
        setStatusMessage("Weekly snapshot shared.");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setStatusMessage("Weekly snapshot copied to clipboard.");
        return;
      }

      setError("Sharing is not available in this browser.");
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        setError(shareError.message || "Could not share the weekly summary.");
      }
    }
  };

  const handleSendChat = async (event) => {
    event.preventDefault();
    if (!currentPlan) {
      setError("Open a plan before sending a follow-up request.");
      return;
    }
    if (!chatPrompt.trim()) {
      setError("Write a follow-up prompt first.");
      return;
    }

    setIsSendingChat(true);
    setError("");
    const userMessage = { role: "user", content: chatPrompt.trim() };
    try {
      const response = await fetch(`${apiBaseUrl}/api/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: buildPlannerProfile(form, profile),
          currentPlan: currentPlan.result,
          followUpPrompt: chatPrompt.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not get follow-up guidance.");

      setChatMessages((current) => [...current, userMessage, { role: "assistant", content: data.reply }]);
      setChatPrompt("");
      setStatusMessage("Follow-up guidance added.");
    } catch (chatError) {
      setError(chatError.message || "Could not send the follow-up request.");
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile,
      plans,
      goals,
      habits,
      weeklyReviews: reviews,
      monthlyReviews,
      careerExplorations,
      hobbyPlans,
      routineBuilders,
      reminderSettings,
      checkins,
      rewardEvents,
      progress,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `life-guidance-export-${getDateKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Your data export has started.");
  };

  const handleSaveGoal = async (event) => {
    event.preventDefault();
    if (!goalDraft.title.trim()) {
      setError("Write a goal title before saving.");
      return;
    }

    setIsSavingGoal(true);
    setError("");
    try {
      const savedGoal = await saveGoalRecord({
        userId: user.uid,
        userEmail: user.email,
        title: goalDraft.title.trim(),
        category: goalDraft.category,
        targetDate: goalDraft.targetDate || null,
        reason: goalDraft.reason.trim(),
        milestones: goalDraft.milestonesText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        status: "planned",
      });

      setGoals((current) => [savedGoal, ...current]);
      setGoalDraft(initialGoalDraft);
      setStatusMessage("Goal saved. We can now build future phases around it.");
    } catch (goalError) {
      setError(goalError.message || "Could not save your goal.");
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleGoalStatusChange = async (goal, nextStatus) => {
    try {
      const updatedGoal = await updateGoalRecord(goal.id, {
        status: nextStatus,
        completedAt: nextStatus === "completed" ? getDateKey() : null,
      });

      setGoals((current) =>
        current.map((item) => (item.id === goal.id ? updatedGoal : item)),
      );
      setStatusMessage(`Goal marked as ${nextStatus.replace(/-/g, " ")}.`);
    } catch (goalError) {
      setError(goalError.message || "Could not update the goal.");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoalRecord(goalId);
      setGoals((current) => current.filter((goal) => goal.id !== goalId));
      setStatusMessage("Goal deleted.");
    } catch (goalError) {
      setError(goalError.message || "Could not delete the goal.");
    }
  };

  const handleSaveHabit = async (event) => {
    event.preventDefault();
    if (!habitDraft.title.trim()) {
      setError("Write a habit title before saving.");
      return;
    }

    setIsSavingHabit(true);
    setError("");
    try {
      const savedHabit = await saveHabitRecord({
        userId: user.uid,
        userEmail: user.email,
        title: habitDraft.title.trim(),
        difficulty: habitDraft.difficulty,
        anchor: habitDraft.anchor.trim(),
        standardVersion: habitDraft.standardVersion.trim(),
        minimumVersion: habitDraft.minimumVersion.trim(),
        currentStreak: 0,
        bestStreak: 0,
        isTodayComplete: false,
      });
      setHabits((current) => [savedHabit, ...current]);
      setHabitDraft(initialHabitDraft);
      setStatusMessage("Habit saved. You can start tracking it right away.");
    } catch (habitError) {
      setError(habitError.message || "Could not save the habit.");
    } finally {
      setIsSavingHabit(false);
    }
  };

  const handleToggleHabit = async (habit) => {
    try {
      const nextComplete = !habit.isTodayComplete;
      const nextCurrentStreak = nextComplete ? (habit.currentStreak || 0) + 1 : Math.max((habit.currentStreak || 1) - 1, 0);
      const updatedHabit = await updateHabitRecord(habit.id, {
        isTodayComplete: nextComplete,
        currentStreak: nextCurrentStreak,
        bestStreak: Math.max(habit.bestStreak || 0, nextCurrentStreak),
        lastCompletedDate: nextComplete ? getDateKey() : habit.lastCompletedDate || null,
      });
      setHabits((current) => current.map((item) => (item.id === habit.id ? updatedHabit : item)));
      setStatusMessage(nextComplete ? "Habit marked for today." : "Habit mark removed for today.");
    } catch (habitError) {
      setError(habitError.message || "Could not update the habit.");
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabitRecord(habitId);
      setHabits((current) => current.filter((habit) => habit.id !== habitId));
      setStatusMessage("Habit deleted.");
    } catch (habitError) {
      setError(habitError.message || "Could not delete the habit.");
    }
  };

  const handleSaveWeeklyReview = async (event) => {
    event.preventDefault();
    if (!reviewDraft.worked.trim() && !reviewDraft.heavy.trim() && !reviewDraft.nextStep.trim()) {
      setError("Write at least one weekly reflection point before saving.");
      return;
    }

    setIsSavingReview(true);
    setError("");
    try {
      const savedReview = await saveWeeklyReviewRecord({
        userId: user.uid,
        userEmail: user.email,
        weekLabel: `Week of ${getDateKey()}`,
        ...reviewDraft,
      });
      setReviews((current) => [savedReview, ...current]);
      setReviewDraft(initialReviewDraft);
      setStatusMessage("Weekly review saved. This will make future planning much smarter.");
    } catch (reviewError) {
      setError(reviewError.message || "Could not save the weekly review.");
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleDeleteMyData = async () => {
    if (!window.confirm("Delete your saved profile, plan history, feedback, progress, and reward history from the app database?")) return;
    setIsDeletingData(true);
    try {
      await deleteAllUserData(user.uid);
      setPlans([]);
      setCurrentPlan(null);
      setFeedbackItems([]);
      setGoals([]);
      setGoalDraft(initialGoalDraft);
      setHabits([]);
      setHabitDraft(initialHabitDraft);
      setReviews([]);
      setReviewDraft(initialReviewDraft);
      setMonthlyReviews([]);
      setMonthlyReviewDraft(initialMonthlyReviewDraft);
      setCareerDraft(initialCareerDraft);
      setCareerExplorations([]);
      setHobbyDraft(initialHobbyDraft);
      setHobbyPlans([]);
      setRoutineBuilderDraft(initialRoutineBuilderDraft);
      setRoutineBlockDraft(initialRoutineBlockDraft);
      setRoutineBuilders([]);
      setReminderSettings(initialReminderSettings);
      setProfile(initialProfile);
      setProgress(emptyProgress);
      setRewardEvents([]);
      setTodayCheckin(null);
      setCheckinNote("");
      setCheckinFields(initialCheckinFields);
      setChatMessages([]);
      setChatPrompt("");
      setStatusMessage("Your stored data has been deleted from the app.");
    } catch (deletionError) {
      setError(deletionError.message || "Could not delete your data.");
    } finally {
      setIsDeletingData(false);
    }
  };

  const plannerBootstrapPending = sectionLoading.plans || sectionLoading.profile || sectionLoading.feedback;
  const progressPanelPending = sectionLoading.progress || sectionLoading.rewardEvents || sectionLoading.checkins;

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

  const renderActiveTab = () => {
    if (activeTab === "planner") {
      return (
        <>
          {plannerBootstrapPending && (
            <SectionLoadingCard
              title="Loading your saved context"
              description="We’re pulling in your latest plans, profile, and feedback so the planner can start from your real history."
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
        return <WidgetErrorBoundary title="Goals unavailable" description="The goals workspace hit a rendering problem."><GoalTabDirect goalDraft={goalDraft} goals={goals} isSavingGoal={isSavingGoal} onChange={updateGoalField} onSubmit={handleSaveGoal} onDelete={handleDeleteGoal} onStatusChange={handleGoalStatusChange} /></WidgetErrorBoundary>;
      case "habits":
        return <WidgetErrorBoundary title="Habits unavailable" description="The habits workspace hit a rendering problem."><HabitTabDirect habitDraft={habitDraft} habits={habits} isSavingHabit={isSavingHabit} onChange={updateHabitField} onSubmit={handleSaveHabit} onDelete={handleDeleteHabit} onToggle={handleToggleHabit} /></WidgetErrorBoundary>;
      case "daily":
        return <WidgetErrorBoundary title="Daily progress unavailable" description="Check-in history could not render."><DailyProgressTabDirect checkins={checkins} progress={progress} rewards={rewardEvents} /></WidgetErrorBoundary>;
      case "weekly":
        return <WidgetErrorBoundary title="Weekly progress unavailable" description="The weekly progress view could not render."><WeeklyProgressTabDirect checkins={checkins} progress={progress} rewards={rewardEvents} onExportWeeklySummary={handleExportWeeklySummary} onShareWeeklySummary={handleShareWeeklySummary} /></WidgetErrorBoundary>;
      case "review":
        return <WidgetErrorBoundary title="Weekly review unavailable" description="The weekly reflection surface could not render."><WeeklyReviewTabDirect reviewDraft={reviewDraft} reviews={reviews} goals={goals} isSavingReview={isSavingReview} onChange={updateReviewField} onSubmit={handleSaveWeeklyReview} /></WidgetErrorBoundary>;
      case "monthly":
        return <WidgetErrorBoundary title="Monthly review unavailable" description="The monthly review surface could not render."><MonthlyReviewTabDirect monthlyReviewDraft={monthlyReviewDraft} monthlyReviews={monthlyReviews} goals={goals} isSavingMonthlyReview={isSavingMonthlyReview} onChange={updateMonthlyReviewField} onSubmit={handleSaveMonthlyReview} /></WidgetErrorBoundary>;
      case "career":
        return <WidgetErrorBoundary title="Career explorer unavailable" description="The career direction surface could not render."><CareerExplorerTabDirect draft={careerDraft} savedItems={careerExplorations} isSaving={isSavingCareer} onChange={updateCareerField} onSubmit={handleSaveCareerExploration} /></WidgetErrorBoundary>;
      case "income":
        return <WidgetErrorBoundary title="Income paths unavailable" description="The hobby income surface could not render."><HobbyIncomeTabDirect draft={hobbyDraft} savedItems={hobbyPlans} isSaving={isSavingHobbyPath} onChange={updateHobbyField} onSubmit={handleSaveHobbyPath} /></WidgetErrorBoundary>;
      case "routine":
        return <WidgetErrorBoundary title="Routine builder unavailable" description="The routine builder could not render."><RoutineBuilderTabDirect builderDraft={routineBuilderDraft} blockDraft={routineBlockDraft} savedItems={routineBuilders} isSaving={isSavingRoutineBuilder} onBuilderChange={updateRoutineBuilderField} onBlockChange={updateRoutineBlockField} onAddBlock={handleAddRoutineBlock} onRemoveBlock={handleRemoveRoutineBlock} onToggleLock={handleToggleRoutineBlockLock} onSave={handleSaveRoutineBuilder} onDelete={handleDeleteRoutineBuilder} onExportCalendar={handleExportRoutineCalendar} /></WidgetErrorBoundary>;
      case "chat":
        return <WidgetErrorBoundary title="AI coach unavailable" description="The follow-up coach surface could not render."><ChatExtensionTabDirect currentPlan={currentPlan} chatPrompt={chatPrompt} chatMessages={chatMessages} isSendingChat={isSendingChat} onPromptChange={(event) => setChatPrompt(event.target.value)} onQuickPrompt={setChatPrompt} onSubmit={handleSendChat} /></WidgetErrorBoundary>;
      case "achievements":
        return <WidgetErrorBoundary title="Achievements unavailable" description="The achievement surface could not render."><AchievementTabDirect progress={progress} rewardEvents={rewardEvents} /></WidgetErrorBoundary>;
      case "missions":
        return <WidgetErrorBoundary title="Missions unavailable" description="The mission surface could not render."><MissionsTabDirect progress={progress} missionSummary={missionSummary} /></WidgetErrorBoundary>;
      case "insights":
        return <WidgetErrorBoundary title="Insights unavailable" description="The personalization surface could not render."><PersonalizationTabDirect insights={personalizationInsights} profile={profile} plans={plans} checkins={checkins} /></WidgetErrorBoundary>;
      case "system":
        return <WidgetErrorBoundary title="System map unavailable" description="The project brain map could not render."><ProjectMapTabDirect /></WidgetErrorBoundary>;
      case "history":
        return <WidgetErrorBoundary title="History unavailable" description="The plan history surface could not render."><HistoryTabDirect plans={plans} onView={setCurrentPlan} onUseAnswers={(item) => { setForm(item.profileSnapshot); handleTabChange("planner"); }} onDelete={handleDeletePlan} formatDate={formatDate} /></WidgetErrorBoundary>;
      case "profile":
        return <WidgetErrorBoundary title="Profile unavailable" description="The profile surface could not render."><ProfileTabDirect profile={profile} isSavingProfile={isSavingProfile} onChange={updateProfileField} onSubmit={handleSaveProfile} onApplyToPlanner={applyProfileToPlanner} /></WidgetErrorBoundary>;
      case "feedback":
        return <WidgetErrorBoundary title="Feedback unavailable" description="The feedback surface could not render."><FeedbackTabDirect currentPlan={currentPlan} feedbackItems={feedbackItems} feedbackMessage={feedbackMessage} feedbackRating={feedbackRating} isSubmittingFeedback={isSubmittingFeedback} formatDate={formatDate} onMessageChange={(event) => setFeedbackMessage(event.target.value)} onRatingChange={(event) => setFeedbackRating(event.target.value)} onSubmit={handleSubmitFeedback} /></WidgetErrorBoundary>;
      case "reminders":
        return <WidgetErrorBoundary title="Reminders unavailable" description="The reminder surface could not render."><ReminderTabDirect reminderSettings={reminderSettings} isSaving={isSavingReminderSettings} notificationState={notificationState} onChange={updateReminderField} onEnableNotifications={handleEnableNotifications} onSendTestReminder={handleSendTestReminder} onSubmit={handleSaveReminderSettings} /></WidgetErrorBoundary>;
      case "support":
        return <WidgetErrorBoundary title="Support unavailable" description="The support surface could not render."><SupportTabDirect /></WidgetErrorBoundary>;
      case "settings":
        return <WidgetErrorBoundary title="Settings unavailable" description="The settings surface could not render."><SettingsTabDirect user={user} profile={profile} plans={plans} goals={goals} habits={habits} reviews={reviews} monthlyReviews={monthlyReviews} checkins={checkins} rewardEvents={rewardEvents} careerExplorations={careerExplorations} hobbyPlans={hobbyPlans} routineBuilders={routineBuilders} reminderSettings={reminderSettings} onDeleteMyData={handleDeleteMyData} onExportData={handleExportData} onResendVerification={handleResendVerification} onShareProgress={handleShareProgress} /></WidgetErrorBoundary>;
      case "admin":
        return isAdmin ? <WidgetErrorBoundary title="Admin dashboard unavailable" description="The admin surface could not render."><AdminTabDirect adminSnapshot={adminSnapshot} userId={user.uid} /></WidgetErrorBoundary> : null;
      default:
        return null;
    }
  };

  const renderedTab = renderActiveTab();
  const filteredSamples = sampleProfiles.filter((sample) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return (
      sample.label.toLowerCase().includes(query) ||
      sample.description.toLowerCase().includes(query)
    );
  });
  const intelligenceCards = [
    {
      label: "Current focus",
      value: formatDisplayLabel(insightNarrative.focus),
      detail: personalizationInsights.nextMove,
    },
    {
      label: "Low-energy pattern",
      value: progress.activeStreak > 0 ? "Protected" : "Needs backup",
      detail: personalizationInsights.lowEnergyPattern,
    },
    {
      label: "Best guidance tone",
      value: formatDisplayLabel(personalizationInsights.preferredTone),
      detail: personalizationInsights.routineStyle,
    },
  ];
  const showResultPanel = activeTab === "planner";

  return (
    <>
      <div className={`dashboard-app-shell${focusMode ? " dashboard-app-shell--focus" : ""}`}>
        <div className="dashboard-app-shell__orb dashboard-app-shell__orb--violet" />
        <div className="dashboard-app-shell__orb dashboard-app-shell__orb--cyan" />
        <div className="dashboard-app-shell__grain" />

        <Sidebar
          items={sidebarItems}
          activeItem={activeTab}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((current) => !current)}
          onSelect={handleTabChange}
        />

        <div className="dashboard-main-frame">
          <Header
            title={activeMeta.label}
            description={activeMeta.description}
            searchQuery={searchQuery}
            onSearchChange={(event) => setSearchQuery(event.target.value)}
            streakLabel={streakLabel}
            onQuickAdd={() => setIsQuickAddOpen(true)}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode((current) => !current)}
            onToggleMobileNav={() => setIsMobileNavOpen((current) => !current)}
            userEmail={user?.email || ""}
            onLogout={handleLogout}
          />

          <MotionSection
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="dashboard-hero-grid"
          >
            <article className="saas-panel dashboard-hero-card dashboard-hero-card--primary">
              <div className="dashboard-hero-copy">
                <p className="dashboard-eyebrow">Adaptive life operating system</p>
                <h2>{insightNarrative.greeting}</h2>
                <p>{insightNarrative.recommendation}</p>
              </div>
              <div className="dashboard-hero-metrics">
                {plannerSnapshots.map((item) => (
                  <div key={item.label} className="dashboard-hero-metric">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <small>{item.hint}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="saas-panel dashboard-hero-card dashboard-hero-card--secondary">
              <div className="dashboard-hero-secondary-head">
                <p className="dashboard-eyebrow">AI guidance pulse</p>
                <span className="hero-header-chip">{missionSummary.levelTitle}</span>
              </div>
              <h3>What the system sees right now</h3>
              <div className="dashboard-guidance-list">
                {intelligenceCards.map((card) => (
                  <div key={card.label} className="dashboard-guidance-item">
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <p>{card.detail}</p>
                  </div>
                ))}
              </div>
            </article>
          </MotionSection>

          <div className={`dashboard-mobile-nav${isMobileNavOpen ? " dashboard-mobile-nav--open" : ""}`}>
            {mobileNavItems.map((item) => (
              <button
                key={item}
                type="button"
                className={item === activeTab ? "dashboard-mobile-nav__chip active" : "dashboard-mobile-nav__chip"}
                onClick={() => handleTabChange(item)}
              >
                {(tabMeta[item] || { label: item }).label}
              </button>
            ))}
          </div>

          {statusMessage && <div className={`status-toast ${statusTone === "info" ? "status-toast-info" : "status-toast-success"}`}>{statusMessage}</div>}
          {error && <p className="error-message">{error}</p>}
          {isLoadingWorkspace && <SectionLoadingCard title="Syncing your workspace" description="We’re warming up your saved planner data section by section so you can keep using the app while it loads." />}

          <div className="dashboard-content-grid">
            <main className="dashboard-center-column">
              <PlannerBoard
                currentPlan={currentPlan}
                goals={goals}
                habits={habits}
                activeTab={activeTab}
                onGoToTab={handleTabChange}
              >
                {showResultPanel ? (
                  <div className="planner-workspace-grid">
                    <div className="planner-workspace-grid__form">{renderedTab}</div>
                    <div className="planner-workspace-grid__result">
                      {currentPlan ? (
                        <ResultPanel
                          currentPlan={currentPlan}
                          currentPlanFeedback={currentPlanFeedback}
                          adjustmentRequest={adjustmentRequest}
                          checkinNote={checkinNote}
                          checkinFields={checkinFields}
                          isAdjusting={isAdjusting}
                          isSubmittingCheckin={isSubmittingCheckin}
                          progress={progress}
                          recentRewards={recentRewards}
                          todayCheckin={todayCheckin}
                          formatDate={formatDate}
                          onAdjustChange={(event) => setAdjustmentRequest(event.target.value)}
                          onAdjust={() => adjustmentRequest.trim() ? requestPlan({ adjustment: adjustmentRequest }) : setError("Write what feels difficult or what you want to change.")}
                          onCheckin={handleDailyCheckin}
                          onCheckinFieldChange={updateCheckinField}
                          onCheckinNoteChange={(event) => setCheckinNote(event.target.value)}
                          onRegenerate={() => requestPlan()}
                          onRate={() => handleTabChange("feedback")}
                        />
                      ) : (
                        <section className="saas-panel result-empty-state">
                          <p className="dashboard-eyebrow">AI result surface</p>
                          <h3>Your plan will appear here</h3>
                          <p>
                            Once you generate a plan, this space becomes your adaptive roadmap, check-in surface, and guidance memory.
                          </p>
                          <div className="result-empty-state__points">
                            <div>
                              <strong>Timeline blocks</strong>
                              <span>Readable daily flow instead of one giant wall of text</span>
                            </div>
                            <div>
                              <strong>Action layers</strong>
                              <span>Key shifts, today&apos;s focus, next 7 days, and longer-horizon guidance</span>
                            </div>
                            <div>
                              <strong>Refine loop</strong>
                              <span>Adjust the plan without rebuilding everything from zero</span>
                            </div>
                          </div>
                        </section>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-tab-surface">{renderedTab}</div>
                )}
              </PlannerBoard>
            </main>

            <aside className="dashboard-intelligence-rail">
              <ProgressWidget completion={completion} progress={progress} plans={plans} goals={goals} habits={habits} />
              <AnalyticsChart checkins={checkins} progress={progress} />

              <section className="saas-panel intelligence-panel">
                <div className="intelligence-panel__head">
                  <p className="dashboard-eyebrow">Onboarding momentum</p>
                  <span className="hero-header-chip">{onboardingSteps.filter((step) => step.done).length}/{onboardingSteps.length} done</span>
                </div>
                <div className="intelligence-panel__list">
                  {onboardingSteps.map((step) => (
                    <article key={step.label} className={`intelligence-checkpoint${step.done ? " is-done" : ""}`}>
                      <strong>{step.label}</strong>
                      <span>{step.done ? "Complete" : "Still open"}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="saas-panel intelligence-panel">
                <div className="intelligence-panel__head">
                  <p className="dashboard-eyebrow">Sample profiles</p>
                  <span className="hero-header-chip">{filteredSamples.length} ready</span>
                </div>
                <div className="intelligence-sample-list">
                  {filteredSamples.slice(0, 4).map((sample) => (
                    <button type="button" key={sample.id} className="intelligence-sample-card" onClick={() => loadSampleProfile(sample)}>
                      <strong>{sample.label}</strong>
                      <p>{sample.description}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="saas-panel intelligence-panel intelligence-panel--danger">
                <div className="intelligence-panel__head">
                  <p className="dashboard-eyebrow">Privacy and control</p>
                </div>
                <p className="intelligence-panel__body">
                  Do not write passwords, account numbers, legal IDs, or medical records. Only store details needed to shape routines and future direction.
                </p>
                <button className="danger-link" type="button" onClick={handleDeleteMyData} disabled={isDeletingData}>
                  {isDeletingData ? "Deleting your data..." : "Delete my stored data"}
                </button>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        type={quickAddDraft.type}
        title={quickAddDraft.title}
        note={quickAddDraft.note}
        onTypeChange={(event) => setQuickAddDraft((current) => ({ ...current, type: event.target.value }))}
        onTitleChange={(event) => setQuickAddDraft((current) => ({ ...current, title: event.target.value }))}
        onNoteChange={(event) => setQuickAddDraft((current) => ({ ...current, note: event.target.value }))}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
      />
    </>
  );
}

export default Dashboard;
 


