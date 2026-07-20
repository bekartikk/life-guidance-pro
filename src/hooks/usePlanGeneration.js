import { useState } from "react";

import { savePlanRecord } from "../services/appData";
import { applyRewardAction } from "../services/progressData";
import { logPlanAdjustment, logPlanGeneration } from "../services/dataCollection";
import { trackEvent } from "../utils/analytics";
import { fetchWithFirebaseAuth } from "../utils/authFetch";
import { normalizePlanForUI } from "../lib/plannerUtils";

const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function createPlanTitle(form) {
  const goalWords = form.goals.trim().split(/\s+/).slice(0, 7).join(" ");
  return goalWords || `${form.planDuration} ${form.roadmapFocus} plan`;
}

function buildPlannerProfile(form, profile) {
  return { ...form, profileContext: profile };
}

function createPendingPlan({ form, profile, planResult, structuredPlan, aiMeta, adjustment, userId, userEmail }) {
  const createdAt = new Date().toISOString();
  return {
    id: `pending-${Date.now()}`,
    userId,
    userEmail,
    title: createPlanTitle(form),
    profileSnapshot: form,
    profileSummary: profile,
    result: planResult,
    structuredPlan,
    aiMeta,
    adjustment,
    createdAt,
    updatedAt: createdAt,
  };
}

export function usePlanGeneration({
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
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);

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
      const response = await fetchWithFirebaseAuth(`${API_BASE}/api/guidance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: buildPlannerProfile(form, profile),
          userEmail,
          userId,
          planId: currentPlan?.id || null,
          previousPlan: currentPlan?.result || "",
          adjustmentRequest: adjustment,
          aiContext: aiRequestContext,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not create your plan.");

      const normalized = normalizePlanForUI(data.plan);
      const planResult = normalized.plainText;
      if (!planResult.trim()) {
        throw new Error("The guidance service returned an empty plan.");
      }

      const pendingPlan = createPendingPlan({
        form,
        profile,
        planResult,
        structuredPlan: data.structuredPlan || null,
        aiMeta: data.aiMeta || null,
        adjustment,
        userId,
        userEmail,
      });

      // Rendering the returned plan must never wait on Firestore acknowledgements.
      setPlans((current) => [pendingPlan, ...current]);
      setCurrentPlan(pendingPlan);
      setFollowupAiMeta(null);
      setAdjustmentRequest("");
      setActiveTab("planner");
      setStatusMessage(adjustment ? "Plan updated successfully. Your revised plan is ready below." : "Plan generated successfully. Your new guidance plan is ready below.");
      setIsLoading(false);
      setIsAdjusting(false);

      const savedPlan = await savePlanRecord({
        userId,
        userEmail,
        title: createPlanTitle(form),
        profileSnapshot: form,
        profileSummary: profile,
        result: planResult,
        structuredPlan: data.structuredPlan || null,
        aiMeta: data.aiMeta || null,
        adjustment,
      });

      setPlans((current) => current.map((plan) => (plan.id === pendingPlan.id ? savedPlan : plan)));
      setCurrentPlan((plan) => (plan?.id === pendingPlan.id ? savedPlan : plan));

      void applyRewardAction(userId, {
        type: adjustment ? "plan-adjusted" : "plan-created",
        planId: savedPlan.id,
        roadmapFocus: form.roadmapFocus,
      })
        .then(mergeRewardResult)
        .catch((error) => console.error("Plan reward update failed", error.stack || error));

      const analyticsWrite = adjustment
        ? logPlanAdjustment(userId, {
          originalFocus: currentPlan?.profileSnapshot?.roadmapFocus,
          adjustmentRequest: adjustment,
          planDuration: form.planDuration,
        })
        : logPlanGeneration(userId, {
          profile: buildPlannerProfile(form, profile),
          plan: data.plan,
          adjustmentRequest: null,
        });
      void analyticsWrite.catch((error) => console.error("Plan analytics write failed", error.stack || error));

      trackEvent(adjustment ? "plan_adjusted" : "plan_generated", {
        roadmap_focus: form.roadmapFocus,
        duration: form.planDuration,
        preferred_tone: form.preferredTone,
        has_profile_context: Boolean(profile.fullName || profile.mainGoal),
      });

    } catch (requestError) {
      console.error("Generate Plan failed", requestError.stack || requestError);
      setError(requestError.message || "Something went wrong while creating your plan.");
    } finally {
      setIsLoading(false);
      setIsAdjusting(false);
    }
  };

  return {
    isLoading,
    isAdjusting,
    requestPlan,
    mergeRewardResult,
  };
}
