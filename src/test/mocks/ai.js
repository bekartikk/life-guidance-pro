import { vi } from 'vitest';

export const mockAiPlanResponse = {
  id: "mock-plan-123",
  title: "Mock AI Life Plan",
  routine: [
    { time: "08:00 AM", activity: "Morning deep work", category: "focus" },
    { time: "12:00 PM", activity: "Lunch and walk", category: "recovery" },
    { time: "02:00 PM", activity: "Secondary tasks", category: "steady" }
  ],
  milestones: [
    { title: "Define first step", status: "completed" },
    { title: "Execute daily checklist", status: "in-progress" }
  ],
  insights: [
    "Your routine is balanced but protect morning focus blocks.",
    "Prioritize recovery times to avoid burnout."
  ]
};

export const mockAiFollowupResponse = {
  reply: "I've updated your plan to focus on shorter study blocks. Let's start with 20 minutes of focused effort.",
  adjustedPlan: {
    ...mockAiPlanResponse,
    id: "mock-plan-123-adjusted",
    title: "Mock AI Life Plan (Adjusted)"
  }
};

export const mockFetchImplementation = (url) => {
  const parsedUrl = typeof url === 'string' ? url : url?.url || '';
  if (parsedUrl.includes('/api/guidance')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAiPlanResponse),
    });
  }
  if (parsedUrl.includes('/api/followup')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAiFollowupResponse),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
};

export const setupAiFetchMock = () => {
  let originalFetch;
  
  // Vitest hooks to mock fetch
  if (typeof global !== 'undefined') {
    originalFetch = global.fetch;
    global.fetch = vi.fn(mockFetchImplementation);
  }

  return () => {
    if (typeof global !== 'undefined' && originalFetch) {
      global.fetch = originalFetch;
    }
  };
};
