import { useEffect, useMemo, useRef, useState } from "react";

import {
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { sendEmailVerification, signOut } from "firebase/auth";

import DashboardTabRouter from "./dashboard/DashboardTabRouter.jsx";
import DashboardShell from "./dashboard/DashboardShell.jsx";

import { useAdaptiveInsightsFeed } from "./ai/useAdaptiveInsightsFeed.js";
import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import { usePlanGeneration } from "../hooks/usePlanGeneration.js";
import { useDashboardNavigation } from "../hooks/useDashboardNavigation.js";

import "../styles/dashboard-modern.css";
import { auth } from "../firebase";

import {
  deleteRoutineBuilderRecord,
  deleteAllUserData,
  deleteGoalRecord,
  deleteHabitRecord,
  deletePlanRecord,
  loadAdminSnapshot,
  saveCareerExplorationRecord,
  saveGoalRecord,
  saveHabitRecord,
  saveHobbyPlanRecord,
  saveMonthlyReviewRecord,
  saveReminderSettings,
  saveRoutineBuilderRecord,
  saveUserProfile,
  saveWeeklyReviewRecord,
  submitFeedbackRecord,
  updateGoalRecord,
  updateHabitRecord,
} from "../services/appData";
import { getDateKey } from "../services/rewards";
import { applyRewardAction, submitDailyCheckin } from "../services/progressData";
import { logPlanFeedback, logCheckinPattern } from "../services/dataCollection";
import { buildBehavioralInsights } from "../services/behavioralInsights";
import { buildAdaptiveIntelligence } from "../ai/orchestration/adaptiveIntelligence.js";
import { buildAiRequestContext } from "../ai/orchestration/buildAiRequestContext.js";
import { trackEvent } from "../utils/analytics";

const tabMeta = DashboardTabRouter.tabMeta;

function toDisplayText(value, fallback = "Unavailable") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => toDisplayText(item, ""))
      .filter(Boolean)
      .join(", ");
    return joined || fallback;
  }
  if (typeof value === "object") {
    return value.label || value.title || value.name || value.summary || value.detail || fallback;
  }
  return fallback;
}



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
  stress: "",
  motivation: "",
  productivity: "",
  sleepQuality: "",
  happiness: "",
  emotionalState: "",
  pressureLevel: "",
  personalIssue: "",
  wins: "",
  reflection: "",
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

const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const adminEmails = String(import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
const requiredFields = ["currentRoutine", "workOrStudy", "personalChallenges", "futureConfusion", "goals", "hobbies", "happinessSources"];
const navigationItems = ["planner", "goals", "habits", "daily", "weekly", "review", "monthly", "career", "income", "routine", "chat", "achievements", "missions", "insights", "system", "history", "profile", "feedback", "reminders", "support", "settings", "admin"];
const sidebarGroups = [
  { label: "Workspace", items: ["planner", "daily", "habits", "goals", "missions", "routine"] },
  { label: "Growth", items: ["career", "income", "chat", "weekly", "review", "insights"] },
  { label: "Memory", items: ["history", "feedback", "system", "reminders", "support", "settings", "admin"] },
];
function formatDate(value) {
  if (!value) return "Just now";
  const dateValue = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(dateValue);
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
function Dashboard({ user }) {
  const userId = typeof user?.uid === "string" ? user.uid : "";
  const userEmail = typeof user?.email === "string" ? user.email : "";
  const plannerFormRef = useRef(null);
  const resultPanelRef = useRef(null);
  const analyticsPanelRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [profile, setProfile] = useState(initialProfile);
  const [consentChecked, setConsentChecked] = useState(false);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [followupAiMeta, setFollowupAiMeta] = useState(null);
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
  const [focusMode, setFocusMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [showMobileAnalytics, setShowMobileAnalytics] = useState(false);
  const [shouldHydrateAnalytics, setShouldHydrateAnalytics] = useState(false);
  const [quickAddDraft, setQuickAddDraft] = useState({
    type: "goal",
    title: "",
    note: "",
  });

  const {
    activeTab,
    setActiveTab,
    handleTabChange,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileNavOpen,
    setIsMobileNavOpen,
    isCompactMobile,
  } = useDashboardNavigation({
    currentPlanId: currentPlan?.id,
    resultPanelRef,
  });

  const { isLoadingWorkspace, sectionLoading } = useWorkspaceData({
    userId,
    initialProfile,
    initialReminderSettings,
    initialCheckinFields,
    emptyProgress,
    setPlans,
    setCurrentPlan,
    setFollowupAiMeta,
    setFeedbackItems,
    setGoals,
    setHabits,
    setReviews,
    setMonthlyReviews,
    setCareerExplorations,
    setHobbyPlans,
    setRoutineBuilders,
    setReminderSettings,
    setProgress,
    setRewardEvents,
    setCheckins,
    setTodayCheckin,
    setCheckinNote,
    setCheckinFields,
    setProfile,
    setError,
    setStatusMessage,
  });

  const isAdmin = adminEmails.includes(String(userEmail || "").toLowerCase());
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
    if (typeof window === "undefined" || shouldHydrateAnalytics) {
      return undefined;
    }

    const analyticsShouldAutoLoad =
      !isCompactMobile || showMobileAnalytics || ["daily", "weekly", "insights"].includes(activeTab);

    if (!analyticsShouldAutoLoad) {
      return undefined;
    }

    let cancelled = false;
    let idleId = null;
    let timeoutId = null;
    let observer = null;

    const hydrateAnalytics = () => {
      if (cancelled) return;
      import("./dashboard/AnalyticsChart.jsx").catch(() => null);
      setShouldHydrateAnalytics(true);
    };

    const scheduleHydration = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => hydrateAnalytics(), { timeout: 1400 });
      } else {
        timeoutId = window.setTimeout(hydrateAnalytics, 280);
      }
    };

    if (analyticsPanelRef.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          hydrateAnalytics();
          observer?.disconnect();
          observer = null;
        }
      }, { rootMargin: isCompactMobile ? "180px 0px" : "120px 0px" });

      observer.observe(analyticsPanelRef.current);
      scheduleHydration();
    } else {
      scheduleHydration();
    }

    return () => {
      cancelled = true;
      if (observer) {
        observer.disconnect();
      }
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [activeTab, isCompactMobile, shouldHydrateAnalytics, showMobileAnalytics]);


  useEffect(() => {
    let ignore = false;
    async function loadAdminData() {
      if (!userId || !isAdmin || activeTab !== "admin") return;
      try {
        const snapshot = await loadAdminSnapshot();
        if (!ignore) setAdminSnapshot(snapshot);
      } catch (adminError) {
        if (!ignore) setError(adminError.message || "Could not load admin dashboard.");
      }
    }
    loadAdminData();
    return () => { ignore = true; };
  }, [activeTab, isAdmin, userId]);

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
        body: "Time to reconnect with todayÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢s routine. Even the minimum version counts.",
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
  const behavioralInsights = useMemo(
    () => {
      try {
        return buildBehavioralInsights({
          profile,
          plans,
          goals,
          habits,
          checkins,
          progress,
          hobbyPlans,
        });
      } catch {
        return buildBehavioralInsights({
          profile: initialProfile,
          plans: [],
          goals: [],
          habits: [],
          checkins: [],
          progress: emptyProgress,
          hobbyPlans: [],
        });
      }
    },
    [profile, plans, goals, habits, checkins, progress, hobbyPlans],
  );
  const adaptiveWorkspace = useMemo(
    () => {
      try {
        return buildAdaptiveIntelligence({
          userId,
          profile,
          plans,
          goals,
          habits,
          checkins,
          progress,
          hobbyPlans,
          currentPlan,
          behavioralInsights,
        });
      } catch {
        return buildAdaptiveIntelligence({
          userId,
          profile: initialProfile,
          plans: [],
          goals: [],
          habits: [],
          checkins: [],
          progress: emptyProgress,
          hobbyPlans: [],
          currentPlan: null,
          behavioralInsights,
        });
      }
    },
    [userId, profile, plans, goals, habits, checkins, progress, hobbyPlans, currentPlan, behavioralInsights],
  );
  const aiRequestContext = useMemo(
    () => {
      try {
        return buildAiRequestContext({
          behavioralInsights,
          adaptiveWorkspace,
          progress,
          checkins,
        });
      } catch {
        return buildAiRequestContext({
          behavioralInsights,
          adaptiveWorkspace,
          progress: emptyProgress,
          checkins: [],
        });
      }
    },
    [adaptiveWorkspace, behavioralInsights, checkins, progress],
  );
  const {
    isLoading,
    isAdjusting,
    requestPlan,
    mergeRewardResult,
  } = usePlanGeneration({
    form,
    profile,
    consentChecked,
    requiredFields,
    userId,
    userEmail,
    currentPlan,
    aiRequestContext,
    setError,
    setStatusMessage,
    setPlans,
    setCurrentPlan,
    setFollowupAiMeta,
    setAdjustmentRequest,
    setActiveTab,
    setProgress,
    setRewardEvents,
  });
  const activeAiMeta = followupAiMeta || currentPlan?.aiMeta || null;
  const { adaptiveInsights, isLoadingAdaptiveInsights } = useAdaptiveInsightsFeed({
    userId,
    activeAiMeta,
    adaptiveWorkspace,
    behavioralInsights,
    checkins,
  });
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
          ? behavioralInsights.adaptiveRecommendations[0] || "Protect one next step from the latest plan, then use the rail to watch your energy and consistency."
          : "Use the planner once with honest answers. The rest of the dashboard gets much smarter after the first plan.",
    }),
    [behavioralInsights.adaptiveRecommendations, currentPlan, profile.fullName, personalizationInsights.bestFocus],
  );


  const handleLogout = async () => {
    try {
      trackEvent("logout_clicked", { surface: "dashboard_header" });
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
    setFollowupAiMeta(null);
    setAdjustmentRequest("");
    setError("");
    setStatusMessage("");
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
      trackEvent("quick_add_used", { type: "goal" });
      setStatusMessage("Goal draft prepared. Finish the details and save it when ready.");
    } else if (quickAddDraft.type === "habit") {
      setHabitDraft((current) => ({
        ...current,
        title,
        standardVersion: note || current.standardVersion,
      }));
      setActiveTab("habits");
      trackEvent("quick_add_used", { type: "habit" });
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

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setError("");
    try {
      await saveUserProfile(userId, { ...profile, userEmail });
      const rewardResult = await applyRewardAction(userId, { type: "profile-saved" });
      mergeRewardResult(rewardResult);
      trackEvent("profile_completed", {
        role: profile.role,
        working_style: profile.workingStyle,
        has_vision: Boolean(profile.longTermVision),
      });
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
        userId,
        userEmail,
        planId: currentPlan.id,
        rating: Number(feedbackRating),
        message: feedbackMessage,
        planTitle: currentPlan.title,
      });
      const rewardResult = await applyRewardAction(userId, { type: "feedback-submitted", planId: currentPlan.id });
      mergeRewardResult(rewardResult);
      
      // Log feedback for AI learning
      await logPlanFeedback(userId, currentPlan.id, {
        rating: Number(feedbackRating),
        message: feedbackMessage,
      });
      trackEvent("feedback_submitted", {
        rating: Number(feedbackRating),
        plan_id: currentPlan.id,
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
      const result = await submitDailyCheckin(userId, {
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
        stress: result.checkin.stress || "",
        motivation: result.checkin.motivation || "",
        productivity: result.checkin.productivity || "",
        sleepQuality: result.checkin.sleepQuality || "",
        happiness: result.checkin.happiness || "",
        emotionalState: result.checkin.emotionalState || "",
        pressureLevel: result.checkin.pressureLevel || "",
        personalIssue: result.checkin.personalIssue || "",
        wins: result.checkin.wins || "",
        reflection: result.checkin.reflection || "",
        loneliness: result.checkin.loneliness || "",
        difficultyReason: result.checkin.difficultyReason || "",
      });
      setCheckins((current) => {
        const filtered = current.filter((c) => c.date !== result.checkin.date);
        return [result.checkin, ...filtered];
      });
      
      // Log checkin pattern for engagement tracking
      await logCheckinPattern(userId, result.progress);
      trackEvent("daily_checkin_saved", {
        status,
        mood: checkinFields.mood,
        energy: checkinFields.energy,
        mobile: typeof window !== "undefined" ? window.innerWidth <= 768 : false,
      });
      
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
      if (currentPlan?.id === planId) {
        setCurrentPlan(nextPlans[0] || null);
        setFollowupAiMeta(null);
      }
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
        userId,
        userEmail,
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
        userId,
        userEmail,
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
        userId,
        userEmail,
        title: `${hobbyDraft.hobby.trim()} path`,
        summary: `${hobbyDraft.level} level ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· ${hobbyDraft.timePerWeek} each week ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· ${hobbyDraft.incomeStyle} style`,
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
        userId,
        userEmail,
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
      await saveReminderSettings(userId, { ...reminderSettings, userEmail });
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
      const response = await fetch(`${API_BASE}/api/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: buildPlannerProfile(form, profile),
          currentPlan: currentPlan.result,
          followUpPrompt: chatPrompt.trim(),
          userEmail,
          userId,
          planId: currentPlan.id,
          aiContext: aiRequestContext,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not get follow-up guidance.");

      setChatMessages((current) => [...current, userMessage, { role: "assistant", content: data.reply }]);
      setFollowupAiMeta(data.aiMeta || currentPlan?.aiMeta || null);
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
        userId,
        userEmail,
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
      }, goal);

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
        userId,
        userEmail,
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
      }, habit);
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
        userId,
        userEmail,
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
      await deleteAllUserData(userId);
      setPlans([]);
      setCurrentPlan(null);
      setFollowupAiMeta(null);
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
  const renderedTab = (
    <DashboardTabRouter
      activeTab={activeTab}
      sectionLoading={sectionLoading}
      isLoadingWorkspace={isLoadingWorkspace}
      plannerBootstrapPending={plannerBootstrapPending}
      progressPanelPending={progressPanelPending}
      form={form}
      consentChecked={consentChecked}
      isLoading={isLoading}
      updateField={updateField}
      setConsentChecked={setConsentChecked}
      applyQuickFocus={applyQuickFocus}
      resetPlanner={resetPlanner}
      requestPlan={requestPlan}
      applyProfileToPlanner={applyProfileToPlanner}
      goalDraft={goalDraft}
      goals={goals}
      isSavingGoal={isSavingGoal}
      updateGoalField={updateGoalField}
      handleSaveGoal={handleSaveGoal}
      handleDeleteGoal={handleDeleteGoal}
      handleGoalStatusChange={handleGoalStatusChange}
      habitDraft={habitDraft}
      habits={habits}
      isSavingHabit={isSavingHabit}
      updateHabitField={updateHabitField}
      handleSaveHabit={handleSaveHabit}
      handleDeleteHabit={handleDeleteHabit}
      handleToggleHabit={handleToggleHabit}
      checkins={checkins}
      progress={progress}
      rewardEvents={rewardEvents}
      behavioralInsights={behavioralInsights}
      adaptiveWorkspace={adaptiveWorkspace}
      handleExportWeeklySummary={handleExportWeeklySummary}
      handleShareWeeklySummary={handleShareWeeklySummary}
      reviewDraft={reviewDraft}
      reviews={reviews}
      isSavingReview={isSavingReview}
      updateReviewField={updateReviewField}
      handleSaveWeeklyReview={handleSaveWeeklyReview}
      monthlyReviewDraft={monthlyReviewDraft}
      monthlyReviews={monthlyReviews}
      isSavingMonthlyReview={isSavingMonthlyReview}
      updateMonthlyReviewField={updateMonthlyReviewField}
      handleSaveMonthlyReview={handleSaveMonthlyReview}
      careerDraft={careerDraft}
      careerExplorations={careerExplorations}
      isSavingCareer={isSavingCareer}
      updateCareerField={updateCareerField}
      handleSaveCareerExploration={handleSaveCareerExploration}
      hobbyDraft={hobbyDraft}
      hobbyPlans={hobbyPlans}
      isSavingHobbyPath={isSavingHobbyPath}
      updateHobbyField={updateHobbyField}
      handleSaveHobbyPath={handleSaveHobbyPath}
      routineBuilderDraft={routineBuilderDraft}
      routineBlockDraft={routineBlockDraft}
      routineBuilders={routineBuilders}
      isSavingRoutineBuilder={isSavingRoutineBuilder}
      updateRoutineBuilderField={updateRoutineBuilderField}
      updateRoutineBlockField={updateRoutineBlockField}
      handleAddRoutineBlock={handleAddRoutineBlock}
      handleRemoveRoutineBlock={handleRemoveRoutineBlock}
      handleToggleRoutineBlockLock={handleToggleRoutineBlockLock}
      handleSaveRoutineBuilder={handleSaveRoutineBuilder}
      handleDeleteRoutineBuilder={handleDeleteRoutineBuilder}
      handleExportRoutineCalendar={handleExportRoutineCalendar}
      currentPlan={currentPlan}
      chatPrompt={chatPrompt}
      chatMessages={chatMessages}
      isSendingChat={isSendingChat}
      setChatPrompt={setChatPrompt}
      handleSendChat={handleSendChat}
      missionSummary={missionSummary}
      setCurrentPlan={setCurrentPlan}
      setForm={setForm}
      handleTabChange={handleTabChange}
      handleDeletePlan={handleDeletePlan}
      formatDate={formatDate}
      profile={profile}
      isSavingProfile={isSavingProfile}
      updateProfileField={updateProfileField}
      handleSaveProfile={handleSaveProfile}
      feedbackItems={feedbackItems}
      feedbackMessage={feedbackMessage}
      feedbackRating={feedbackRating}
      isSubmittingFeedback={isSubmittingFeedback}
      setFeedbackMessage={setFeedbackMessage}
      setFeedbackRating={setFeedbackRating}
      handleSubmitFeedback={handleSubmitFeedback}
      reminderSettings={reminderSettings}
      isSavingReminderSettings={isSavingReminderSettings}
      notificationState={notificationState}
      updateReminderField={updateReminderField}
      handleEnableNotifications={handleEnableNotifications}
      handleSendTestReminder={handleSendTestReminder}
      handleSaveReminderSettings={handleSaveReminderSettings}
      user={user}
      handleDeleteMyData={handleDeleteMyData}
      handleExportData={handleExportData}
      handleResendVerification={handleResendVerification}
      handleShareProgress={handleShareProgress}
      careerExplorationsForSettings={careerExplorations}
      hobbyPlansForSettings={hobbyPlans}
      routineBuildersForSettings={routineBuilders}
      isAdmin={isAdmin}
      adminSnapshot={adminSnapshot}
      userId={userId}
    />
  );
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
  const dashboardGreetingName = (profile.fullName || user?.displayName || "Alex").split(" ")[0] || "Alex";
  const dashboardKpis = [
    { label: "Momentum Score", value: `${Math.min(100, Math.max(0, progress.momentumPoints || 0))}%`, hint: `${progress.activeStreak || 0} day streak` },
    { label: "Focus Time", value: currentPlan ? "4h 20m" : "Ready", hint: currentPlan ? "Protected today" : "Generate a plan" },
    { label: "Tasks Completed", value: `${completion.completed}/${completion.total || 4}`, hint: completion.total ? "Plan actions" : "Starter checklist" },
    { label: "Goal Progress", value: `${Math.min(100, Math.round(completion.percent || 0))}%`, hint: `${goals.filter((goal) => goal.status !== "completed").length} active goals` },
  ];
  const todayTimeline = [
    { time: "09:00", title: "Deep Work", note: "Most important focus block" },
    { time: "11:00", title: "Class", note: "Learning or work session" },
    { time: "01:00", title: "Break", note: "Recovery and reset" },
    { time: "02:00", title: "Project Work", note: "Move one outcome forward" },
    { time: "05:00", title: "Review", note: "Close loops and adjust tomorrow" },
  ];
  const dashboardTasks = [
    currentPlan ? currentPlan.title : "Generate today's AI plan",
    goals[0]?.title || "Choose one priority goal",
    habits[0]?.title || "Complete one tiny habit",
  ];
  const habitPreview = habits.slice(0, 3).map((habit, index) => ({
    title: habit.title,
    streak: habit.streak || progress.activeStreak || index + 1,
    percent: habit.isTodayComplete ? 100 : Math.max(32, 72 - index * 14),
  }));
  const fallbackHabitPreview = [
    { title: "Morning routine", streak: progress.activeStreak || 3, percent: 76 },
    { title: "Study session", streak: 5, percent: 62 },
    { title: "Evening review", streak: 2, percent: 48 },
  ];
  const dashboardHabits = habitPreview.length ? habitPreview : fallbackHabitPreview;
  const aiCoachCards = [
    { title: "Today's Focus", body: formatDisplayLabel(insightNarrative.focus) },
    { title: "Why This Focus", body: personalizationInsights.nextMove },
    { title: "Recovery Suggestion", body: personalizationInsights.lowEnergyPattern },
    { title: "Your Pattern", body: personalizationInsights.routineStyle },
    { title: "Quick Actions", body: "Review plan, log check-in, or adjust intensity." },
  ];
  const showMobilePlannerSkeleton = showResultPanel && (plannerBootstrapPending || isLoading || isAdjusting);
  const showMobileInsightSkeleton = progressPanelPending || sectionLoading.profile;
  const mobileBottomNavItems = [
    { key: "home", label: "Home", icon: HiOutlineChartBarSquare, action: () => handleTabChange("planner") },
    { key: "plan", label: "Plan", icon: HiOutlineClipboardDocumentList, action: () => handleTabChange("planner") },
    { key: "quick-add", label: "Add", icon: HiOutlinePlus, action: () => setIsQuickAddOpen(true), isPrimary: true },
    { key: "coach", label: "AI Coach", icon: HiOutlineSparkles, action: () => handleTabChange("chat") },
    { key: "insights", label: "Insights", icon: HiOutlineChartBarSquare, action: () => handleTabChange("insights") },
    { key: "profile", label: "Profile", icon: HiOutlineUserCircle, action: () => handleTabChange("profile") },
  ];
  const shouldRenderAnalyticsChart =
    !isCompactMobile || showMobileAnalytics || ["daily", "weekly", "insights"].includes(activeTab);
  const canRenderAnalyticsChart = shouldRenderAnalyticsChart && shouldHydrateAnalytics;

  return (
    <DashboardShell
      focusMode={focusMode}
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      isSidebarCollapsed={isSidebarCollapsed}
      setIsSidebarCollapsed={setIsSidebarCollapsed}
      handleTabChange={handleTabChange}
      user={user}
      handleLogout={handleLogout}
      activeMeta={activeMeta}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      streakLabel={streakLabel}
      setIsQuickAddOpen={setIsQuickAddOpen}
      setFocusMode={setFocusMode}
      setIsMobileNavOpen={setIsMobileNavOpen}
      insightNarrative={insightNarrative}
      plannerSnapshots={plannerSnapshots}
      missionSummary={missionSummary}
      intelligenceCards={intelligenceCards}
      isMobileNavOpen={isMobileNavOpen}
      mobileNavItems={mobileNavItems}
      tabMeta={tabMeta}
      statusMessage={statusMessage}
      statusTone={statusTone}
      error={error}
      isLoadingWorkspace={isLoadingWorkspace}
      dashboardGreetingName={dashboardGreetingName}
      dashboardKpis={dashboardKpis}
      todayTimeline={todayTimeline}
      dashboardTasks={dashboardTasks}
      currentPlan={currentPlan}
      dashboardHabits={dashboardHabits}
      aiCoachCards={aiCoachCards}
      completion={completion}
      goals={goals}
      habits={habits}
      showResultPanel={showResultPanel}
      plannerFormRef={plannerFormRef}
      showMobilePlannerSkeleton={showMobilePlannerSkeleton}
      renderedTab={renderedTab}
      resultPanelRef={resultPanelRef}
      isLoading={isLoading}
      activeAiMeta={activeAiMeta}
      currentPlanFeedback={currentPlanFeedback}
      adjustmentRequest={adjustmentRequest}
      checkinNote={checkinNote}
      checkinFields={checkinFields}
      isAdjusting={isAdjusting}
      isSubmittingCheckin={isSubmittingCheckin}
      progress={progress}
      recentRewards={recentRewards}
      todayCheckin={todayCheckin}
      behavioralInsights={behavioralInsights}
      formatDate={formatDate}
      setAdjustmentRequest={setAdjustmentRequest}
      requestPlan={requestPlan}
      setError={setError}
      handleDailyCheckin={handleDailyCheckin}
      updateCheckinField={updateCheckinField}
      setCheckinNote={setCheckinNote}
      showMobileInsightSkeleton={showMobileInsightSkeleton}
      toDisplayText={toDisplayText}
      adaptiveWorkspace={adaptiveWorkspace}
      formatDisplayLabel={formatDisplayLabel}
      checkins={checkins}
      isLoadingAdaptiveInsights={isLoadingAdaptiveInsights}
      adaptiveInsights={adaptiveInsights}
      plans={plans}
      analyticsPanelRef={analyticsPanelRef}
      canRenderAnalyticsChart={canRenderAnalyticsChart}
      shouldRenderAnalyticsChart={shouldRenderAnalyticsChart}
      setShowMobileAnalytics={setShowMobileAnalytics}
      handleDeleteMyData={handleDeleteMyData}
      isDeletingData={isDeletingData}
      isQuickAddOpen={isQuickAddOpen}
      quickAddDraft={quickAddDraft}
      setQuickAddDraft={setQuickAddDraft}
      handleQuickAddSubmit={handleQuickAddSubmit}
      mobileBottomNavItems={mobileBottomNavItems}
    />
  );
}

export default Dashboard;

