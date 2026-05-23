export const dbRuntimeConfig = {
  backendMode: String(process.env.BACKEND_MODE || "firebase").toLowerCase(),
  enableSupabaseMirror: String(process.env.ENABLE_SUPABASE_MIRROR || "false").toLowerCase() === "true",
  enableRealtimeMirror: String(process.env.ENABLE_SUPABASE_REALTIME || "false").toLowerCase() === "true",
  enableEmbeddings: String(process.env.ENABLE_AI_EMBEDDINGS || "false").toLowerCase() === "true",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
};

export function isSupabaseMirrorReady() {
  return Boolean(
    dbRuntimeConfig.enableSupabaseMirror &&
      dbRuntimeConfig.supabaseUrl &&
      dbRuntimeConfig.supabaseServiceRoleKey,
  );
}
