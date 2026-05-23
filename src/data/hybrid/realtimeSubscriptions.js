import { getSupabaseBrowserClient } from "./supabaseBrowser";
import { isHybridRealtimeEnabled } from "./backendMode";

export async function subscribeToAdaptiveRecommendations({ userId, onUpdate }) {
  if (!isHybridRealtimeEnabled()) {
    return () => {};
  }

  const client = await getSupabaseBrowserClient();
  if (!client || !userId || typeof onUpdate !== "function") {
    return () => {};
  }

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
      (payload) => onUpdate(payload),
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
