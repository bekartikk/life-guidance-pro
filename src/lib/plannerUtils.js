/* src/lib/plannerUtils.js */

/**
 * Split plain text plan into sections based on numbered headings.
 * Returns an array of { heading, body } objects.
 */
export function splitPlanSections(text) {
  const source = String(text || "").trim();
  if (!source) return [];

  const matches = [...source.matchAll(/(^|\n)(\d+\.\s+[^\n]+)\n/g)];
  if (matches.length === 0) {
    return [{ heading: "Full plan", body: source }];
  }

  return matches.map((match, index) => {
    const heading = match[2].trim();
    const start = match.index + match[1].length + heading.length + 1;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    return {
      heading,
      body: source.slice(start, end).trim(),
    };
  });
}

/**
 * Normalize a planner response (legacy string or structured JSON) into a canonical model.
 * The returned object always contains:
 *   - title: string (if available)
 *   - sections: array of { heading, body }
 *   - plainText: raw plan text
 *   - exportText: text used for export/share (defaults to plainText)
 */
export function normalizePlanForUI(plan) {
  // Legacy plain‑text plan
  if (typeof plan === "string") {
    const sections = splitPlanSections(plan);
    return {
      title: "",
      sections,
      plainText: plan,
      exportText: plan,
    };
  }

  // Structured plan object from Gemini
  if (plan && typeof plan === "object") {
    const title = typeof plan.title === "string" ? plan.title : "";
    const sections = Array.isArray(plan.sections)
      ? plan.sections
      : splitPlanSections(plan.plainText || "");
    const plainText = typeof plan.plainText === "string" ? plan.plainText : "";
    const exportText = typeof plan.exportText === "string" ? plan.exportText : plainText;
    return { title, sections, plainText, exportText };
  }

  // Fallback empty model
  return { title: "", sections: [], plainText: "", exportText: "" };
}
