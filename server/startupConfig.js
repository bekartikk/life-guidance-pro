function hasValue(name) { return Boolean(String(process.env[name] || "").trim()); }

function validateJsonEnvironment(name, value, decodeBase64 = false) {
  if (!value) return;
  try { JSON.parse(decodeBase64 ? Buffer.from(value, "base64").toString("utf8") : value); }
  catch { throw new Error(`${name} must contain valid service account JSON.`); }
}

export function validateStartupEnvironment() {
  const provider = String(process.env.AI_PROVIDER || "").trim().toLowerCase();
  const errors = [];
  if (provider && !["openai", "gemini"].includes(provider)) errors.push("AI_PROVIDER must be either openai or gemini.");
  if (provider === "openai" && !hasValue("OPENAI_API_KEY")) errors.push("OPENAI_API_KEY is required when AI_PROVIDER=openai.");
  if (provider === "gemini" && !hasValue("GEMINI_API_KEY")) errors.push("GEMINI_API_KEY is required when AI_PROVIDER=gemini.");
  if (!provider && !hasValue("OPENAI_API_KEY") && !hasValue("GEMINI_API_KEY")) errors.push("Set AI_PROVIDER with its API key, or configure OPENAI_API_KEY or GEMINI_API_KEY.");
  if (!["FIREBASE_SERVICE_ACCOUNT_BASE64", "FIREBASE_SERVICE_ACCOUNT_JSON", "GOOGLE_APPLICATION_CREDENTIALS", "FIREBASE_CONFIG"].some(hasValue)) errors.push("Firebase Admin credentials are required for authenticated API routes.");
  const supabaseEnabled = String(process.env.ENABLE_SUPABASE_MIRROR || "false").toLowerCase() === "true";
  const embeddingsEnabled = String(process.env.ENABLE_AI_EMBEDDINGS || "false").toLowerCase() === "true";
  if (supabaseEnabled && (!hasValue("SUPABASE_URL") || !hasValue("SUPABASE_SERVICE_ROLE_KEY"))) errors.push("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required when Supabase mirroring is enabled.");
  if (embeddingsEnabled && !supabaseEnabled) errors.push("ENABLE_SUPABASE_MIRROR must be true when ENABLE_AI_EMBEDDINGS is enabled.");
  if (embeddingsEnabled && !hasValue("OPENAI_API_KEY")) errors.push("OPENAI_API_KEY is required when ENABLE_AI_EMBEDDINGS is enabled.");
  try { validateJsonEnvironment("FIREBASE_SERVICE_ACCOUNT_JSON", process.env.FIREBASE_SERVICE_ACCOUNT_JSON); validateJsonEnvironment("FIREBASE_SERVICE_ACCOUNT_BASE64", process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, true); }
  catch (error) { errors.push(error.message); }
  if (errors.length) throw new Error(`Invalid server configuration: ${errors.join(" ")}`);
}
