import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith("#"))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
}

async function main() {
  const projectRoot = process.cwd();
  const env = {
    ...parseEnvFile(path.join(projectRoot, ".env")),
    ...process.env,
  };

  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Supabase validation failed: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.");
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count, error } = await supabase
    .from("ai_memory_snapshots")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error(`Supabase validation failed: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Supabase validation succeeded: ai_memory_snapshots is reachable (${count ?? 0} rows counted).`);
}

main().catch((error) => {
  console.error(`Supabase validation crashed: ${error.message}`);
  process.exitCode = 1;
});
