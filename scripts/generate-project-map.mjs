import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "PROJECT_BRAIN_MAP.md");
const publicOutputPath = path.join(projectRoot, "public", "PROJECT_BRAIN_MAP.md");

const ignoredNames = new Set(["node_modules", "dist", ".git"]);

async function safeRead(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function walk(dirPath, base = projectRoot) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (ignoredNames.has(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(base, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      results.push({ type: "dir", path: relativePath });
      results.push(...await walk(fullPath, base));
    } else {
      results.push({ type: "file", path: relativePath });
    }
  }

  return results;
}

function extractRoutes(serverSource) {
  const routeRegex = /app\.(get|post|put|patch|delete)\(\s*["'`](.*?)["'`]/g;
  const routes = [];
  let match;
  while ((match = routeRegex.exec(serverSource))) {
    routes.push({ method: match[1].toUpperCase(), path: match[2] });
  }
  return routes;
}

function extractEnvKeys(envSource) {
  return envSource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((line) => line.split("=")[0]?.trim())
    .filter(Boolean);
}

function extractCollectionNames(...sources) {
  const names = new Set();
  const regex = /collection\([^)]*["'`]([^"'`]+)["'`]/g;
  for (const source of sources) {
    let match;
    while ((match = regex.exec(source))) {
      names.add(match[1]);
    }
  }
  return [...names].sort();
}

function formatTree(items, prefix) {
  return items
    .filter((item) => item.path.startsWith(prefix))
    .map((item) => item.path)
    .slice(0, 40)
    .map((item) => `- \`${item}\``)
    .join("\n");
}

export async function generateProjectMap() {
  const [packageSource, viteSource, serverSource, envExample, appDataSource, progressSource, analyticsSource] = await Promise.all([
    safeRead(path.join(projectRoot, "package.json")),
    safeRead(path.join(projectRoot, "vite.config.js")),
    safeRead(path.join(projectRoot, "server", "server.js")),
    safeRead(path.join(projectRoot, ".env.example")),
    safeRead(path.join(projectRoot, "src", "services", "appData.js")),
    safeRead(path.join(projectRoot, "src", "services", "progressData.js")),
    safeRead(path.join(projectRoot, "src", "services", "dataCollection.js")),
  ]);

  const packageJson = packageSource ? JSON.parse(packageSource) : {};
  const fileEntries = await walk(projectRoot);
  const routes = extractRoutes(serverSource);
  const envKeys = extractEnvKeys(envExample);
  const collections = extractCollectionNames(appDataSource, progressSource, analyticsSource);
  const dashboardTabs = fileEntries
    .filter((item) => item.type === "file" && item.path.startsWith("src/components/dashboard/") && item.path.endsWith(".jsx"))
    .map((item) => path.basename(item.path, ".jsx"))
    .sort();

  const markdown = `# Project Brain Map

_Auto-generated on ${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}. This file updates from the repo structure and app/server entry points._

## What This Project Is

**Life Guidance Pro** is a full-stack planning app with:
- a React + Vite frontend
- Firebase Auth + Firestore persistence
- an Express backend for Gemini-powered plan generation and follow-up chat
- planner, goals, habits, reviews, rewards, analytics, reminders, profile, admin, and export flows

## Brain Map

\`\`\`mermaid
flowchart TD
  A["User"] --> B["React App"]
  B --> C["Auth Layer"]
  B --> D["Dashboard Workspace"]
  B --> E["Planner + Result Panel"]
  D --> F["Tabs: ${dashboardTabs.slice(0, 8).join(", ")}${dashboardTabs.length > 8 ? ", ..." : ""}"]
  E --> G["Express API"]
  G --> H["Gemini Guidance + Follow-up"]
  D --> I["Firestore Services"]
  I --> J["Collections: ${collections.slice(0, 6).join(", ")}${collections.length > 6 ? ", ..." : ""}"]
  D --> K["Reward + Progress Engine"]
  D --> L["Analytics Logging"]
  B --> M["Project Map Generator"]
  M --> N["PROJECT_BRAIN_MAP.md"]
\`\`\`

## Runtime Flow

1. User signs in with Firebase Auth.
2. Frontend loads dashboard workspace and Firestore-backed user data.
3. Planner form submits to the Express backend.
4. Backend builds a Gemini prompt and returns a complete plan or follow-up response.
5. Frontend saves plan, goals, habits, reviews, progress, reminders, and analytics into Firestore.
6. Reward engine updates points, streaks, badges, milestones, and check-ins.
7. This map file is regenerated on dev-server startup, build startup, and file changes while Vite is running.

## Frontend Surface

- App shell: \`src/App.jsx\`
- Auth screen: \`src/components/Login.jsx\`
- Main workspace: \`src/components/Dashboard.jsx\`
- Shared styles: \`src/App.css\`
- Dashboard tabs:
${dashboardTabs.map((tab) => `  - \`${tab}\``).join("\n")}

## Backend Surface

- API server: \`server/server.js\`
- Routes:
${routes.map((route) => `  - \`${route.method} ${route.path}\``).join("\n")}

## Data Layer

- Firestore-facing services:
  - \`src/services/appData.js\`
  - \`src/services/progressData.js\`
  - \`src/services/dataCollection.js\`
  - \`src/services/rewards.js\`
- Collections discovered from code:
${collections.map((name) => `  - \`${name}\``).join("\n")}

## Environment Variables

${envKeys.map((key) => `- \`${key}\``).join("\n")}

## Tooling

- Package: \`${packageJson.name || "unknown"}\`
- Frontend scripts:
${Object.entries(packageJson.scripts || {}).map(([key, value]) => `  - \`${key}\`: \`${value}\``).join("\n")}
- Vite config present: \`${viteSource ? "yes" : "no"}\`

## High-Level File Map

### src/
${formatTree(fileEntries, "src/")}

### server/
${formatTree(fileEntries, "server/")}

### docs and config
${fileEntries
  .filter((item) => item.type === "file" && !item.path.startsWith("src/") && !item.path.startsWith("server/"))
  .slice(0, 25)
  .map((item) => `- \`${item.path}\``)
  .join("\n")}
`;

  try {
    await fs.writeFile(outputPath, markdown, "utf8");
    await fs.writeFile(publicOutputPath, markdown, "utf8");
  } catch (error) {
    console.warn(`Could not write project brain map automatically: ${error.message}`);
  }
  return outputPath;
}

if (process.argv[1] === __filename) {
  generateProjectMap().then((filePath) => {
    console.log(`Project brain map updated: ${filePath}`);
  });
}
