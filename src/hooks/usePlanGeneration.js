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
    console.log('Validation passed');
    console.log('Loading=true');
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
      console.log('fetch called');
      // Log response details
      console.log('response.status', response.status);
      console.log('response.ok', response.ok);
      const responseClone = response.clone();
      const rawBody = await responseClone.text();
      console.log('response.body (first 500 chars):', rawBody.slice(0, 500));
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not create your plan.");
      // Normalize plan into canonical UI model
      const normalized = normalizePlanForUI(data.plan);
      const planResult = normalized.plainText;
      const savedPlan = await savePlanRecord({
        userId,
        userEmail,
        title: createPlanTitle(form),
        profileSnapshot: form,
        profileSummary: profile,
        result: planResult,
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
      console.log('Response received');
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
      console.error('Generate Plan failed', requestError);
      setError(requestError.message || "Something went wrong while creating your plan.");
    } finally {
      console.log('Loading=false');
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
