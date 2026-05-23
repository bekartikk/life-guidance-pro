import { dbRuntimeConfig, isSupabaseMirrorReady } from "./config.js";

let cachedClientPromise = null;

export async function getSupabaseAdmin() {
  if (!isSupabaseMirrorReady()) return null;
  if (cachedClientPromise) return cachedClientPromise;

  cachedClientPromise = import("@supabase/supabase-js")
    .then(({ createClient }) =>
      createClient(
        dbRuntimeConfig.supabaseUrl,
        dbRuntimeConfig.supabaseServiceRoleKey,
        {
          auth: { autoRefreshToken: false, persistSession: false },
          db: { schema: "public" },
          global: {
            headers: {
              "x-application-name": "life-guidance-pro-server",
            },
          },
        },
      ))
    .catch(() => null);

  return cachedClientPromise;
}
