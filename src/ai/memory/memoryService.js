import { createMemorySnapshot } from "./memorySchema";

export function buildEditableMemoryProfile({
  userId,
  profile,
  checkins,
  goals,
  habits,
  behavioralInsights,
}) {
  const snapshot = createMemorySnapshot({
    userId,
    profile,
    checkins,
    goals,
    habits,
    behavioralInsights,
  });

  return {
    ...snapshot,
    controls: {
      editable: true,
      deletable: true,
      shared: false,
      providerReady: "pinecone-later",
    },
  };
}

export function buildMemoryExplanation(memoryProfile) {
  return {
    title: "AI memory stays private and user-controlled",
    points: [
      "This memory is used only to improve planning quality, emotional awareness, and adaptive guidance.",
      "You can edit or delete future memory surfaces without affecting login or account access.",
      "The structure is ready for a dedicated vector memory layer later, but it stays local to this product architecture for now.",
    ],
    profile: memoryProfile,
  };
}
