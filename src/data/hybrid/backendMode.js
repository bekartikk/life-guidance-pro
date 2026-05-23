export const backendModeConfig = {
  mode: import.meta.env.VITE_BACKEND_MODE || "firebase",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  hasSupabaseBrowser: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
  realtimeEnabled: String(import.meta.env.VITE_SUPABASE_REALTIME || "false").toLowerCase() === "true",
};

export function isHybridSupabaseEnabled() {
  return backendModeConfig.mode === "hybrid" && backendModeConfig.hasSupabaseBrowser;
}

export function isHybridRealtimeEnabled() {
  return isHybridSupabaseEnabled() && backendModeConfig.realtimeEnabled;
}
