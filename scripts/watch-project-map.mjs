import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateProjectMap } from "./generate-project-map.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const ignored = ["node_modules", "dist", ".git"];

let timer = null;
const schedule = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    generateProjectMap().catch((error) => {
      console.error("Project brain map update failed:", error);
    });
  }, 200);
};

await generateProjectMap();
console.log("Watching project for map updates...");

fs.watch(projectRoot, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const normalized = String(filename).replace(/\\/g, "/");
  if (ignored.some((segment) => normalized.includes(segment))) return;
  schedule();
});
