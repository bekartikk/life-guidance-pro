import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config({ path: new URL(".env", import.meta.url) });

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = String(process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "24kb" }));

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

const guidanceSystemPrompt = `
You are a supportive life-planning, habit-building, and career-roadmap assistant.
Create practical guidance from the user's planner answers and saved profile context.
Do not diagnose mental health conditions.
Do not claim certainty about the user's future.
If the user mentions self-harm, abuse, or immediate danger, gently tell them to contact local emergency services or a trusted person right now.

Always make the response realistic, motivating, and adjustable.
Write like a warm mentor: clear, grounded, encouraging, and practical.
Use compact headings, short paragraphs, and clean numbered steps.
Do not give generic advice. Tie suggestions directly to the user's routine, goals, hobbies, happiness sources, obstacles, energy, and preferred tone.
Do not repeat the user's own words back for too long. Move quickly from understanding to a useful plan.
Make the routine concrete enough to follow today, not just inspiring to read once.
If the user feels stuck, choose the smallest realistic next step instead of an idealized plan.
If the user asks for a 1-week plan, give a full Monday-Sunday routine with morning, afternoon, evening, and night blocks.
If the user asks for a 1-month plan, give a full first-week day-by-day plan plus week 2, week 3, and week 4 milestones.
If the user asks for a 3-month roadmap, give a full first-week day-by-day plan plus month 1, month 2, and month 3 milestones.
If the user wants professional or career guidance, include future scopes based on hobbies, likes, goals, current study or work, and skills to build.
If the user is unsure about a profession, suggest 3 to 5 suitable paths and explain how to explore each one safely.
If this is an adjustment request, revise the existing plan according to the user's difficulty instead of repeating the same plan.
Include a fallback routine for difficult days so the user does not quit completely.
Include one short self-check question at the end that the user can answer for the next adjustment.

Return the answer with these headings:
1. Quick understanding
2. Motivational note
3. Main plan summary
4. Complete routine plan
5. Problem-solving suggestions
6. Future scopes from hobbies and likes
7. Career or study roadmap
8. Activities for lonely or low-energy moments
9. Difficulty rescue plan
10. How to customize if this becomes difficult
11. Three actions for today
12. Question for your next adjustment
13. Privacy and safety reminder
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const urgentSupportKeywords = [
  "self harm",
  "suicide",
  "kill myself",
  "end my life",
  "abuse",
  "unsafe at home",
  "violence",
  "panic attack",
  "i want to disappear",
];

function getFriendlyApiError(status, apiMessage = "") {
  const normalizedMessage = apiMessage.toLowerCase();

  if (
    status === 429 ||
    status === 503 ||
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("quota")
  ) {
    return {
      status: 503,
      message: "The AI service is busy right now. Please wait a moment and try again.",
    };
  }

  if (status >= 500) {
    return {
      status: 502,
      message: "The AI service had a temporary problem. Please try again in a moment.",
    };
  }

  return {
    status: status || 500,
    message: apiMessage || "The AI provider rejected the request.",
  };
}

function containsUrgentSupportLanguage(...values) {
  const joined = values.join(" ").toLowerCase();
  return urgentSupportKeywords.some((keyword) => joined.includes(keyword));
}

function appendSafetySupport(text) {
  return `${text}\n\nUrgent support note: If you feel in immediate danger, at risk of self-harm, or unsafe with someone around you, pause the planner and contact local emergency services or a trusted person right now.`;
}

function extractCandidateText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("\n")
      .trim() || ""
  );
}

function extractFinishReason(data) {
  return String(data?.candidates?.[0]?.finishReason || "").trim();
}

function needsPlanContinuation(plan, finishReason) {
  if (!plan.trim()) return false;
  if (finishReason === "MAX_TOKENS") return true;
  return !plan.includes("13. Privacy and safety reminder");
}

async function requestGuidanceFromGemini(payload) {
  let lastResult = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(geminiApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    lastResult = { response, data };

    const apiMessage = data.error?.message || "";
    const shouldRetry =
      attempt === 0 &&
      (
        response.status === 429 ||
        response.status === 503 ||
        apiMessage.toLowerCase().includes("high demand")
      );

    if (!shouldRetry) {
      break;
    }

    await delay(1200);
  }

  return lastResult;
}

async function generateCompletedPlan({ profile, adjustmentRequest, previousPlan }) {
  const basePayload = {
    systemInstruction: { parts: [{ text: guidanceSystemPrompt }] },
    contents: [
      {
        role: "user",
        parts: [
          { text: `Create a life guidance plan from this profile:\n${JSON.stringify(profile, null, 2)}` },
          { text: adjustmentRequest ? `The user wants this change:\n${adjustmentRequest}\n\nPrevious plan:\n${previousPlan}` : "This is a new plan request." },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 5200,
    },
  };

  const firstPass = await requestGuidanceFromGemini(basePayload);
  if (!firstPass.response.ok) {
    return firstPass;
  }

  let plan = extractCandidateText(firstPass.data);
  const finishReason = extractFinishReason(firstPass.data);

  if (!plan) {
    return firstPass;
  }

  if (needsPlanContinuation(plan, finishReason)) {
    const continuationPayload = {
      systemInstruction: {
        parts: [{
          text: `${guidanceSystemPrompt}\n\nThe previous answer was cut off. Continue from the next unfinished heading only. Do not restart from the beginning. Do not repeat sections that are already complete.`,
        }],
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: `Original user profile:\n${JSON.stringify(profile, null, 2)}` },
            { text: adjustmentRequest ? `Adjustment request:\n${adjustmentRequest}` : "This is still the same new plan request." },
            { text: `Partial answer already generated:\n${plan}` },
            { text: "Continue the answer from the next missing heading so the response becomes complete." },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.68,
        topP: 0.9,
        maxOutputTokens: 2600,
      },
    };

    const secondPass = await requestGuidanceFromGemini(continuationPayload);
    if (secondPass.response.ok) {
      const continuation = extractCandidateText(secondPass.data);
      if (continuation) {
        plan = `${plan.trim()}\n\n${continuation.trim()}`;
      }
    }
  }

  return {
    ...firstPass,
    data: {
      ...firstPass.data,
      completedPlan: plan,
    },
  };
}

function cleanProfile(profile = {}) {
  return {
    wakeTime: String(profile.wakeTime || "").slice(0, 80),
    sleepTime: String(profile.sleepTime || "").slice(0, 80),
    currentRoutine: String(profile.currentRoutine || "").slice(0, 1200),
    workOrStudy: String(profile.workOrStudy || "").slice(0, 1200),
    personalChallenges: String(profile.personalChallenges || "").slice(0, 1200),
    futureConfusion: String(profile.futureConfusion || "").slice(0, 1200),
    goals: String(profile.goals || "").slice(0, 1200),
    hobbies: String(profile.hobbies || "").slice(0, 800),
    happinessSources: String(profile.happinessSources || "").slice(0, 800),
    lonelyMoments: String(profile.lonelyMoments || "").slice(0, 800),
    knownObstacles: String(profile.knownObstacles || "").slice(0, 1000),
    skillsToBuild: String(profile.skillsToBuild || "").slice(0, 1000),
    planDuration: String(profile.planDuration || "1-week").slice(0, 40),
    roadmapFocus: String(profile.roadmapFocus || "balanced").slice(0, 60),
    professionalHelp: String(profile.professionalHelp || "roadmap").slice(0, 60),
    flexibilityLevel: String(profile.flexibilityLevel || "flexible").slice(0, 60),
    energyLevel: String(profile.energyLevel || "medium").slice(0, 40),
    preferredTone: String(profile.preferredTone || "gentle").slice(0, 40),
    profileContext: {
      fullName: String(profile.profileContext?.fullName || "").slice(0, 80),
      ageGroup: String(profile.profileContext?.ageGroup || "").slice(0, 40),
      role: String(profile.profileContext?.role || "").slice(0, 60),
      mainGoal: String(profile.profileContext?.mainGoal || "").slice(0, 800),
      interests: String(profile.profileContext?.interests || "").slice(0, 800),
      preferredRoutineStyle: String(profile.profileContext?.preferredRoutineStyle || "").slice(0, 60),
      careerInterest: String(profile.profileContext?.careerInterest || "").slice(0, 800),
      noteToPlanner: String(profile.profileContext?.noteToPlanner || "").slice(0, 1000),
    },
  };
}

function hasRequiredProfile(profile) {
  return ["currentRoutine", "workOrStudy", "personalChallenges", "futureConfusion", "goals", "hobbies", "happinessSources"].every((field) => profile[field]?.trim());
}

app.get("/", (req, res) => {
  res.json({ status: "Life Guidance API is running" });
});

app.get("/healthz", (req, res) => {
  res.json({ ok: true, model: geminiModel });
});

app.post("/api/guidance", async (req, res) => {
  const profile = cleanProfile(req.body.profile);
  const adjustmentRequest = String(req.body.adjustmentRequest || "").slice(0, 1600);
  const previousPlan = String(req.body.previousPlan || "").slice(0, 7000);
  const needsUrgentSupport = containsUrgentSupportLanguage(
    JSON.stringify(profile),
    adjustmentRequest,
    previousPlan,
  );

  if (!hasRequiredProfile(profile)) {
    return res.status(400).json({ message: "Please complete all required profile fields." });
  }

  if (!geminiApiKey) {
    return res.status(500).json({ message: "Gemini API key is missing on the server." });
  }

  try {
    const { response, data } = await generateCompletedPlan({ profile, adjustmentRequest, previousPlan });
    if (!response.ok) {
      const friendlyError = getFriendlyApiError(response.status, data.error?.message);
      return res.status(friendlyError.status).json({ message: friendlyError.message });
    }

    const plan = data.completedPlan || extractCandidateText(data);
    if (!plan?.trim()) {
      return res.status(502).json({
        message: "The AI returned an empty plan. Please try again.",
      });
    }

    return res.json({ plan: needsUrgentSupport ? appendSafetySupport(plan) : plan });
  } catch {
    return res.status(500).json({
      message: "Server error while creating your plan. Please try again.",
    });
  }
});

app.post("/api/followup", async (req, res) => {
  const profile = cleanProfile(req.body.profile);
  const currentPlan = String(req.body.currentPlan || "").slice(0, 9000);
  const followUpPrompt = String(req.body.followUpPrompt || "").slice(0, 1600);
  const needsUrgentSupport = containsUrgentSupportLanguage(
    JSON.stringify(profile),
    currentPlan,
    followUpPrompt,
  );

  if (!currentPlan.trim()) {
    return res.status(400).json({ message: "A current plan is required for follow-up guidance." });
  }

  if (!followUpPrompt.trim()) {
    return res.status(400).json({ message: "Write a follow-up request before sending it." });
  }

  if (!geminiApiKey) {
    return res.status(500).json({ message: "Gemini API key is missing on the server." });
  }

  try {
    const payload = {
      systemInstruction: {
        parts: [{
          text: `${guidanceSystemPrompt}\n\nThis is a follow-up refinement request. Do not rewrite everything from scratch unless necessary. Focus tightly on the user's request, keep it concise, and preserve the useful parts of the existing plan.`,
        }],
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: `User profile context:\n${JSON.stringify(profile, null, 2)}` },
            { text: `Current saved plan:\n${currentPlan}` },
            { text: `Follow-up request:\n${followUpPrompt}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2200,
      },
    };

    const { response, data } = await requestGuidanceFromGemini(payload);
    if (!response.ok) {
      const friendlyError = getFriendlyApiError(response.status, data.error?.message);
      return res.status(friendlyError.status).json({ message: friendlyError.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply?.trim()) {
      return res.status(502).json({ message: "The AI returned an empty follow-up. Please try again." });
    }

    return res.json({ reply: needsUrgentSupport ? appendSafetySupport(reply) : reply });
  } catch {
    return res.status(500).json({ message: "Server error while creating follow-up guidance. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Life Guidance API running on port ${PORT}`);
});
