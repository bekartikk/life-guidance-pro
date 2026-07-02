import { describe, expect, it } from "vitest";
import { buildCompactContextPack, summarizeConversationTurn } from "./adaptiveContextEngine.js";

describe("adaptive context engine", () => {
  it("builds a compact pack with the highest-signal context first", () => {
    const pack = buildCompactContextPack({
      profile: {
        goals: "Finish my portfolio project",
        profileContext: { mainGoal: "Launch a freelance design business" },
      },
      aiContext: {
        behavioralSignals: {
          avgEnergy: 3,
          avgStress: 4,
          topReasons: [{ label: "overwhelm", reason: "Too many tasks" }],
          neglectedAreas: [{ area: "sleep", reason: "Not enough recovery" }],
          microWins: [{ label: "finished draft" }],
        },
        memory: {
          microWins: ["shipped first prototype"],
          topReasons: [{ label: "overwhelm" }],
          neglectedAreas: [{ area: "sleep" }],
        },
        recentCheckins: [{ reflection: "felt better after a walk" }],
      },
      adjustmentRequest: "Make the plan less intense",
      previousPlan: "A long plan that should be reduced",
      currentPlan: "A current plan with important context",
      followUpPrompt: "Please make this easier",
      memory: {
        behaviorPatterns: {
          topReasons: [{ label: "overwhelm" }],
          neglectedAreas: [{ area: "sleep" }],
        },
      },
      semanticMemory: {
        memories: [{ content: "The user likes short blocks" }],
      },
      conversationSummary: "Earlier turn focused on simplifying the plan.",
    });

    expect(pack.primaryGoal).toContain("freelance design business");
    expect(pack.energyStress).toContain("energy 3/5");
    expect(pack.recentCompletedActions).toContain("finished draft");
    expect(pack.activePlan).toContain("current plan");
    expect(pack.relevantMemories).toContain("overwhelm");
    expect(pack.conversationSummary).toContain("simplifying the plan");
  });

  it("summarizes a new turn without replaying the full history", () => {
    const summary = summarizeConversationTurn({
      previousSummary: "Earlier turn focused on recovery.",
      turnType: "followup",
      adjustmentRequest: "Make this plan lighter",
      followUpPrompt: "Reduce the number of tasks",
    });

    expect(summary).toContain("recovery");
    expect(summary).toContain("lighter");
    expect(summary).toContain("tasks");
  });
});
