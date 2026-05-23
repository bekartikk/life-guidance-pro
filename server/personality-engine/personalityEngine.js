import { AI_PERSONALITIES, getPersonalityById } from "../prompts/personalities.js";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export function resolveAIPersonality({
  profile = {},
  adaptiveState = {},
  behavioralSignals = {},
}) {
  const explicit =
    normalize(profile.aiPersonality) ||
    normalize(profile.profileContext?.aiPersonality);

  if (explicit && AI_PERSONALITIES[explicit]) {
    return {
      ...AI_PERSONALITIES[explicit],
      reason: "Chosen explicitly from the user's saved AI preference.",
    };
  }

  const preferredTone = normalize(profile.preferredTone);
  const roadmapFocus = normalize(profile.roadmapFocus);
  const role = normalize(profile.profileContext?.role || profile.role);
  const stressLevel = normalize(profile.profileContext?.stressLevel || profile.stressLevel);
  const burnoutRisk = Number(adaptiveState.burnoutRiskScore || behavioralSignals.burnoutRiskScore || 0);
  const recoveryMode = Boolean(adaptiveState.recoveryMode);

  if (recoveryMode || burnoutRisk >= 72 || roadmapFocus.includes("mental-energy") || stressLevel === "high") {
    return {
      ...AI_PERSONALITIES.therapist,
      reason: "High stress and recovery signals suggest a more reflective, emotionally validating style.",
    };
  }

  if (roadmapFocus.includes("study") || role.includes("student")) {
    return {
      ...AI_PERSONALITIES.study_mentor,
      reason: "Study pressure and skill-building goals benefit from a structured learning-focused guide.",
    };
  }

  if (
    roadmapFocus.includes("fitness") ||
    normalize(profile.hobbies).includes("fitness") ||
    normalize(profile.skillsToBuild).includes("fitness")
  ) {
    return {
      ...AI_PERSONALITIES.gym_coach,
      reason: "Health and consistency goals fit a rhythm built around reps, recovery, and progressive challenge.",
    };
  }

  if (preferredTone === "direct") {
    return {
      ...AI_PERSONALITIES.strict_coach,
      reason: "The current tone preference leans toward firmer accountability and direct structure.",
    };
  }

  if (preferredTone === "mentor" || preferredTone === "gentle") {
    return {
      ...AI_PERSONALITIES.calm_mentor,
      reason: "A calmer mentoring style best matches the saved tone and current life context.",
    };
  }

  return {
    ...getPersonalityById("calm_mentor"),
    reason: "Calm Mentor is the default when the system has mixed signals and needs a stable coaching voice.",
  };
}
