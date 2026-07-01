import { useEffect, useState } from "react";

import {
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
} from "../services/appData";
import { getDateKey } from "../services/rewards";
import { loadRewardEvents, loadUserCheckins, loadUserProgress } from "../services/progressData";

const WORKSPACE_SECTION_TIMEOUT_MS = 12000;
const WORKSPACE_BOOT_TIMEOUT_MS = 15000;

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
const resolvedSectionLoading = Object.fromEntries(
  Object.keys(initialSectionLoading).map((key) => [key, false]),
);

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
      Promise.resolve(promise).finally(() => window.clearTimeout(timeoutId));
    }),
  ]);
}

function buildCheckinFields(entry, initialCheckinFields) {
  if (!entry) return initialCheckinFields;
  return {
    mood: entry.mood || "",
    energy: entry.energy || "",
    focus: entry.focus || "",
    stress: entry.stress || "",
    motivation: entry.motivation || "",
    productivity: entry.productivity || "",
    sleepQuality: entry.sleepQuality || "",
    happiness: entry.happiness || "",
    emotionalState: entry.emotionalState || "",
    pressureLevel: entry.pressureLevel || "",
    personalIssue: entry.personalIssue || "",
    wins: entry.wins || "",
    reflection: entry.reflection || "",
    loneliness: entry.loneliness || "",
    difficultyReason: entry.difficultyReason || "",
  };
}

export function useWorkspaceData({
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
}) {
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(initialSectionLoading);

  useEffect(() => {
    if (!userId) {
      const resetTimer = window.setTimeout(() => {
        setIsLoadingWorkspace(false);
        setSectionLoading(resolvedSectionLoading);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    let isMounted = true;
    let bootTimeoutId = null;
    async function loadWorkspace() {
      setIsLoadingWorkspace(true);
      setSectionLoading(initialSectionLoading);
      bootTimeoutId = window.setTimeout(() => {
        if (!isMounted) return;
        setIsLoadingWorkspace(false);
        setSectionLoading(resolvedSectionLoading);
        setStatusMessage("Workspace sync is taking longer than usual, but the dashboard is still available.");
      }, WORKSPACE_BOOT_TIMEOUT_MS);
      try {
        const safeLoad = async (key, loader, fallback) => {
          try {
            return {
              key,
              status: "fulfilled",
              value: await withTimeout(
                loader(),
                WORKSPACE_SECTION_TIMEOUT_MS,
                `${key} load timed out`,
              ),
            };
          } catch (reason) {
            return { key, status: "rejected", reason, value: fallback };
          }
        };

        const results = await Promise.all([
          safeLoad("plans", () => loadUserPlans(userId), []),
          safeLoad("profile", () => loadUserProfile(userId), null),
          safeLoad("feedback", () => loadUserFeedback(userId), []),
          safeLoad("goals", () => loadUserGoals(userId), []),
          safeLoad("habits", () => loadUserHabits(userId), []),
          safeLoad("reviews", () => loadWeeklyReviews(userId), []),
          safeLoad("monthlyReviews", () => loadMonthlyReviews(userId), []),
          safeLoad("careerExplorations", () => loadUserCareerExplorations(userId), []),
          safeLoad("hobbyPlans", () => loadUserHobbyPlans(userId), []),
          safeLoad("routineBuilders", () => loadUserRoutineBuilders(userId), []),
          safeLoad("reminders", () => loadReminderSettings(userId), null),
          safeLoad("progress", () => loadUserProgress(userId), emptyProgress),
          safeLoad("rewardEvents", () => loadRewardEvents(userId), []),
          safeLoad("checkins", () => loadUserCheckins(userId), []),
        ]);
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
        setFollowupAiMeta(null);
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
        setCheckinFields(buildCheckinFields(today, initialCheckinFields));
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
        if (bootTimeoutId) {
          window.clearTimeout(bootTimeoutId);
        }
        if (isMounted) {
          setIsLoadingWorkspace(false);
          setSectionLoading(resolvedSectionLoading);
        }
      }
    }
    loadWorkspace();
    return () => {
      isMounted = false;
      if (bootTimeoutId) {
        window.clearTimeout(bootTimeoutId);
      }
    };
  }, [
    emptyProgress,
    initialCheckinFields,
    initialProfile,
    initialReminderSettings,
    setCareerExplorations,
    setCheckinFields,
    setCheckinNote,
    setCheckins,
    setCurrentPlan,
    setError,
    setFeedbackItems,
    setFollowupAiMeta,
    setGoals,
    setHabits,
    setHobbyPlans,
    setMonthlyReviews,
    setPlans,
    setProfile,
    setProgress,
    setReminderSettings,
    setReviews,
    setRewardEvents,
    setRoutineBuilders,
    setStatusMessage,
    setTodayCheckin,
    userId,
  ]);

  return { isLoadingWorkspace, sectionLoading };
}
