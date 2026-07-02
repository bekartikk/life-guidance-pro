import { useState } from "react";

import { savePlanRecord } from "../services/appData";
import { applyRewardAction } from "../services/progressData";
import { logPlanAdjustment, logPlanGeneration } from "../services/dataCollection";
import { trackEvent } from "../utils/analytics";

const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function createPlanTitle(form) {
  const goalWords = form.goals.trim().split(/\s+/).slice(0, 7).join(" ");
  return goalWords || `${form.planDuration} ${form.roadmapFocus} plan`;
}

function buildPlannerProfile(form, profile) {
  return { ...form, profileContext: profile };
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
      const response = await fetch(`${API_BASE}/api/guidance`, {
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
      const savedPlan = await savePlanRecord({
        userId,
        userEmail,
        title: createPlanTitle(form),
        profileSnapshot: form,
        profileSummary: profile,
        result: data.plan,
        aiMeta: data.aiMeta || null,
        adjustment,
      });
      const rewardResult = await applyRewardAction(userId, {
        type: adjustment ? "plan-adjusted" : "plan-created",
        planId: savedPlan.id,
        roadmapFocus: form.roadmapFocus,
      });
      mergeRewardResult(rewardResult);

      // Log data for AI improvement
      if (adjustment) {
        await logPlanAdjustment(userId, {
          originalFocus: currentPlan?.profileSnapshot?.roadmapFocus,
          adjustmentRequest: adjustment,
          planDuration: form.planDuration,
        });
      } else {
        await logPlanGeneration(userId, {
          profile: buildPlannerProfile(form, profile),
          plan: data.plan,
          adjustmentRequest: null,
        });
      }
      trackEvent(adjustment ? "plan_adjusted" : "plan_generated", {
        roadmap_focus: form.roadmapFocus,
        duration: form.planDuration,
        preferred_tone: form.preferredTone,
        has_profile_context: Boolean(profile.fullName || profile.mainGoal),
      });

      setPlans((current) => [savedPlan, ...current]);
      setCurrentPlan(savedPlan);
      setFollowupAiMeta(null);
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

  return {
    isLoading,
    isAdjusting,
    requestPlan,
    mergeRewardResult,
  };
}
