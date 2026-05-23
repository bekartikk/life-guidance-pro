export const guidancePlanSchema = {
  name: "adaptive_guidance_plan",
  description: "A structured adaptive life guidance roadmap for a single user.",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "summary",
      "adaptiveState",
      "dailyFocus",
      "quickActions",
      "routinePlan",
      "roadmap",
      "insights",
      "recovery",
      "customization",
      "nextQuestion",
      "privacyNote",
    ],
    properties: {
      summary: {
        type: "object",
        additionalProperties: false,
        required: ["quickUnderstanding", "motivationalNote", "mainPlanSummary"],
        properties: {
          quickUnderstanding: { type: "string" },
          motivationalNote: { type: "string" },
          mainPlanSummary: { type: "string" },
        },
      },
      adaptiveState: {
        type: "object",
        additionalProperties: false,
        required: ["personality", "burnoutRisk", "taskIntensity", "recoveryMode", "momentumScore"],
        properties: {
          personality: { type: "string" },
          burnoutRisk: { type: "integer" },
          taskIntensity: { type: "string", enum: ["low", "medium", "high"] },
          recoveryMode: { type: "boolean" },
          momentumScore: { type: "integer" },
        },
      },
      dailyFocus: {
        type: "object",
        additionalProperties: false,
        required: ["title", "whyItMatters", "todayTarget"],
        properties: {
          title: { type: "string" },
          whyItMatters: { type: "string" },
          todayTarget: { type: "string" },
        },
      },
      quickActions: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
          },
        },
      },
      routinePlan: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["phase", "focus", "intensity", "blocks"],
          properties: {
            phase: { type: "string" },
            focus: { type: "string" },
            intensity: { type: "string" },
            blocks: {
              type: "array",
              minItems: 2,
              maxItems: 6,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["label", "detail", "fallback"],
                properties: {
                  label: { type: "string" },
                  detail: { type: "string" },
                  fallback: { type: "string" },
                },
              },
            },
          },
        },
      },
      roadmap: {
        type: "array",
        minItems: 2,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["phase", "goal", "milestones", "recoveryGuard"],
          properties: {
            phase: { type: "string" },
            goal: { type: "string" },
            milestones: {
              type: "array",
              minItems: 2,
              maxItems: 5,
              items: { type: "string" },
            },
            recoveryGuard: { type: "string" },
          },
        },
      },
      insights: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail", "why"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
            why: { type: "string" },
          },
        },
      },
      recovery: {
        type: "object",
        additionalProperties: false,
        required: ["lonelyMoments", "difficultDayPlan"],
        properties: {
          lonelyMoments: {
            type: "array",
            minItems: 2,
            maxItems: 5,
            items: { type: "string" },
          },
          difficultDayPlan: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            items: { type: "string" },
          },
        },
      },
      customization: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: { type: "string" },
      },
      nextQuestion: { type: "string" },
      privacyNote: { type: "string" },
    },
  },
};

export const followupSchema = {
  name: "adaptive_followup_reply",
  description: "A structured follow-up refinement reply for an existing guidance plan.",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["summary", "changes", "nextSteps", "supportNote"],
    properties: {
      summary: { type: "string" },
      changes: {
        type: "array",
        minItems: 2,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
          },
        },
      },
      nextSteps: {
        type: "array",
        minItems: 2,
        maxItems: 4,
        items: { type: "string" },
      },
      supportNote: { type: "string" },
    },
  },
};
