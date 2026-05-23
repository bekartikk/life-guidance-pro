import { generateStructuredWithGemini } from "./providers/geminiProvider.js";
import { generateStructuredWithOpenAI } from "./providers/openaiProvider.js";

export function resolveAiProvider() {
  const preferred = String(process.env.AI_PROVIDER || "").trim().toLowerCase();

  if (preferred === "openai" && process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      generateStructured: (options) =>
        generateStructuredWithOpenAI({
          ...options,
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.OPENAI_MODEL || "gpt-5-mini",
        }),
    };
  }

  if (preferred === "gemini" && process.env.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generateStructured: (options) =>
        generateStructuredWithGemini({
          ...options,
          apiKey: process.env.GEMINI_API_KEY,
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        }),
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      generateStructured: (options) =>
        generateStructuredWithOpenAI({
          ...options,
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.OPENAI_MODEL || "gpt-5-mini",
        }),
    };
  }

  if (process.env.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generateStructured: (options) =>
        generateStructuredWithGemini({
          ...options,
          apiKey: process.env.GEMINI_API_KEY,
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        }),
    };
  }

  return null;
}
