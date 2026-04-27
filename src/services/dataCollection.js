import { collection, doc, getDocs, query, runTransaction, where } from "firebase/firestore";
import { db } from "../firebase";

async function runSafeAnalyticsWrite(writeOperation) {
  try {
    await writeOperation();
    return true;
  } catch (error) {
    console.warn("Analytics write skipped:", error?.message || error);
    return false;
  }
}

function stripUndefinedDeep(value) {
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep).filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, stripUndefinedDeep(item)])
        .filter(([, item]) => item !== undefined),
    );
  }

  return value === undefined ? undefined : value;
}

export async function logPlanGeneration(userId, planData) {
  const eventRef = doc(collection(db, "analytics", userId, "plan_events"));
  const timestamp = new Date().toISOString();

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(eventRef, stripUndefinedDeep({
        type: "plan-generated",
        userId,
        timestamp,
        profile: {
          planDuration: planData.profile?.planDuration,
          roadmapFocus: planData.profile?.roadmapFocus,
          preferredTone: planData.profile?.preferredTone,
          flexibilityLevel: planData.profile?.flexibilityLevel,
          energyLevel: planData.profile?.energyLevel,
          ageGroup: planData.profile?.profileContext?.ageGroup,
          role: planData.profile?.profileContext?.role,
        },
        planTokens: Math.ceil((planData.plan?.length || 0) / 4),
        hasAdjustment: !!planData.adjustmentRequest,
        keywords: extractKeywords(planData.profile),
      }));
    }),
  );
}

export async function logPlanFeedback(userId, planId, feedback) {
  const eventRef = doc(collection(db, "analytics", userId, "feedback_events"));

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(eventRef, stripUndefinedDeep({
        type: "feedback-submitted",
        userId,
        planId,
        timestamp: new Date().toISOString(),
        rating: Number(feedback.rating) || null,
        message: String(feedback.message || "").slice(0, 500),
        sentiment: analyzeSentiment(feedback.message),
        useful: feedback.message?.toLowerCase().includes("helpful") || feedback.message?.toLowerCase().includes("useful"),
      }));
    }),
  );
}

export async function logPlanAdjustment(userId, adjustmentData) {
  const eventRef = doc(collection(db, "analytics", userId, "adjustment_events"));

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(eventRef, stripUndefinedDeep({
        type: "plan-adjusted",
        userId,
        timestamp: new Date().toISOString(),
        originalFocus: adjustmentData.originalFocus,
        adjustmentRequest: String(adjustmentData.adjustmentRequest || "").slice(0, 500),
        reason: categorizeAdjustmentReason(adjustmentData.adjustmentRequest),
        duration: adjustmentData.planDuration,
      }));
    }),
  );
}

export async function logCheckinPattern(userId, checkinStats) {
  const metricsRef = doc(collection(db, "analytics", userId, "checkin_metrics"));

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(
        metricsRef,
        stripUndefinedDeep({
          timestamp: new Date().toISOString(),
          completedDays: checkinStats.completedDays || 0,
          partialDays: checkinStats.partialDays || 0,
          difficultDays: checkinStats.difficultDays || 0,
          missedDays: checkinStats.missedDays || 0,
          activeStreak: checkinStats.activeStreak || 0,
          engagementScore: calculateEngagementScore(checkinStats),
        }),
        { merge: true },
      );
    }),
  );
}

export async function getAnalyticsSummary(timeframeHours = 168) {
  const cutoffDate = new Date(Date.now() - timeframeHours * 3600000);

  return {
    period: `Last ${timeframeHours} hours`,
    cutoffDate: cutoffDate.toISOString(),
    note: "Aggregation should be done with Cloud Functions for scale",
  };
}

export async function getTopPerformingConfigs() {
  return {
    note: "Requires Cloud Function for aggregation",
    hint: "Group by (tone, focus, flexibility) and correlate with average rating",
  };
}

function extractKeywords(profile) {
  const text = [
    profile?.currentRoutine,
    profile?.goals,
    profile?.hobbies,
    profile?.personalChallenges,
    profile?.skillsToBuild,
  ]
    .join(" ")
    .toLowerCase();

  const keywords = [];
  const patterns = {
    career: ["career", "job", "work", "business", "freelance", "interview"],
    health: ["health", "fitness", "exercise", "sleep", "energy", "mental"],
    learning: ["learn", "skill", "course", "study", "training", "improve"],
    relationships: ["friend", "family", "social", "lonely", "connect", "relationship"],
    creative: ["art", "music", "write", "design", "creative", "hobby"],
    productivity: ["routine", "schedule", "productivity", "organized", "time"],
  };

  Object.entries(patterns).forEach(([category, words]) => {
    if (words.some((word) => text.includes(word))) {
      keywords.push(category);
    }
  });

  return keywords;
}

function analyzeSentiment(message = "") {
  const text = message.toLowerCase();
  const positiveWords = ["great", "helpful", "good", "excellent", "perfect", "love", "amazing", "useful", "clear"];
  const negativeWords = ["bad", "poor", "confusing", "unclear", "useless", "hate", "terrible", "wrong"];

  const positiveCount = positiveWords.filter((word) => text.includes(word)).length;
  const negativeCount = negativeWords.filter((word) => text.includes(word)).length;

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

function categorizeAdjustmentReason(adjustmentRequest = "") {
  const text = adjustmentRequest.toLowerCase();

  if (text.includes("too much") || text.includes("overwhelming") || text.includes("hard")) return "too-difficult";
  if (text.includes("too easy") || text.includes("bored") || text.includes("simple")) return "not-challenging";
  if (text.includes("time") || text.includes("schedule") || text.includes("busy")) return "time-constraints";
  if (text.includes("motivation") || text.includes("energy") || text.includes("tired")) return "low-energy";
  if (text.includes("unclear") || text.includes("confusing") || text.includes("understand")) return "clarity";
  if (text.includes("personal") || text.includes("specific") || text.includes("relevant")) return "personalization";

  return "general";
}

function calculateEngagementScore(checkinStats) {
  const total = checkinStats.completedDays + checkinStats.partialDays + checkinStats.difficultDays + checkinStats.missedDays;
  if (total === 0) return 0;

  const weighted = (checkinStats.completedDays * 100 + checkinStats.partialDays * 50 + checkinStats.difficultDays * 25) / total;
  return Math.round(weighted);
}

export async function getHighRatedPlans(userId, minRating = 4) {
  const feedbackQuery = query(
    collection(db, "analytics", userId, "feedback_events"),
    where("rating", ">=", minRating),
  );

  const snapshot = await getDocs(feedbackQuery);
  return snapshot.docs.map((item) => item.data());
}

export async function getCommonAdjustmentPatterns(userId) {
  const adjustQuery = query(collection(db, "analytics", userId, "adjustment_events"));
  const snapshot = await getDocs(adjustQuery);
  const adjustments = snapshot.docs.map((item) => item.data());

  const grouped = {};
  adjustments.forEach((adjustment) => {
    if (!grouped[adjustment.reason]) {
      grouped[adjustment.reason] = [];
    }
    grouped[adjustment.reason].push(adjustment);
  });

  return Object.entries(grouped)
    .map(([reason, items]) => ({
      reason,
      count: items.length,
      exampleRequests: items.slice(0, 3).map((item) => item.adjustmentRequest),
    }))
    .sort((left, right) => right.count - left.count);
}
