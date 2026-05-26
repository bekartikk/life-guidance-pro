import { getSupabaseBrowserClient } from "./supabaseBrowser";
import { isHybridRealtimeEnabled } from "./backendMode";

const activeRecommendationChannels = new Map();

export async function subscribeToAdaptiveRecommendations({ userId, onUpdate }) {
  if (!isHybridRealtimeEnabled()) {
    return () => {};
  }

  const client = await getSupabaseBrowserClient();
  if (!client || !userId || typeof onUpdate !== "function") {
    return () => {};
  }

  const existing = activeRecommendationChannels.get(userId);
  if (existing) {
    existing.listeners.add(onUpdate);
    return () => {
      existing.listeners.delete(onUpdate);
      if (!existing.listeners.size) {
        client.removeChannel(existing.channel);
        activeRecommendationChannels.delete(userId);
      }
    };
  }

  const listeners = new Set([onUpdate]);
  const channel = client
    .channel(`ai-recommendations:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "ai_recommendations",
        filter: `external_user_id=eq.${userId}`,
      },
      (payload) => {
        listeners.forEach((listener) => {
          try {
            listener(payload);
          } catch {
            return;
          }
        });
      },
    )
    .subscribe();

  activeRecommendationChannels.set(userId, {
    channel,
    listeners,
  });

  return () => {
    const current = activeRecommendationChannels.get(userId);
    if (!current) {
      return;
    }

    current.listeners.delete(onUpdate);
    if (!current.listeners.size) {
      client.removeChannel(current.channel);
      activeRecommendationChannels.delete(userId);
    }
  };
}
