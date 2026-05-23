let supabasePromise = null;

export async function getSupabaseBrowserClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (supabasePromise) return supabasePromise;

  supabasePromise = import("@supabase/supabase-js")
    .then(({ createClient }) =>
      createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }),
    )
    .catch(() => null);

  return supabasePromise;
}
