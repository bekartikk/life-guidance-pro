import { logBackendException } from "../../observability.js";

function extractCandidateText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("\n")
      .trim() || ""
  );
}

function stripMarkdownAndExplanations(rawResponse) {
  const withoutFences = String(rawResponse || "")
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const firstJsonCharacter = withoutFences.search(/[\[{]/);
  return firstJsonCharacter === -1 ? withoutFences : withoutFences.slice(firstJsonCharacter);
}

function extractJsonCandidates(cleanedResponse) {
  const candidates = [];
  for (let start = 0; start < cleanedResponse.length; start += 1) {
    if (cleanedResponse[start] !== "{" && cleanedResponse[start] !== "[") continue;

    const stack = [];
    let inString = false;
    let escaped = false;
    for (let end = start; end < cleanedResponse.length; end += 1) {
      const character = cleanedResponse[end];
      if (inString) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') {
        inString = true;
      } else if (character === "{" || character === "[") {
        stack.push(character);
      } else if (character === "}" || character === "]") {
        const open = stack.pop();
        if ((character === "}" && open !== "{") || (character === "]" && open !== "[")) break;
        if (!stack.length) {
          candidates.push(cleanedResponse.slice(start, end + 1));
          break;
        }
      }
    }
  }
  return candidates;
}

function repairJson(candidate) {
  return candidate
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

function buildParseFallback(rawResponse, parseError) {
  return {
    parseError: parseError?.message || "Gemini response could not be parsed as JSON.",
    rawResponse,
    provider: "gemini",
  };
}

export function processStructuredGeminiResponse(rawResponse, requestContext = {}) {
  const cleanedResponse = stripMarkdownAndExplanations(rawResponse);
  const candidates = extractJsonCandidates(cleanedResponse);
  let parseError;

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (error) {
      parseError = error;
    }
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(repairJson(candidate));
    } catch (error) {
      parseError = error;
    }
  }

  const error = parseError || new Error("No JSON object or array was found in Gemini's response.");
  logBackendException(error, {
    ...requestContext,
    provider: "gemini",
    details: {
      rawResponse,
      cleanedResponse,
      parseError: error.message,
    },
  });
  return buildParseFallback(rawResponse, error);
}

export async function generateStructuredWithGemini({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  schema,
  temperature = 0.65,
  requestContext,
}) {
}) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  // Log the endpoint for debugging
  console.log('Gemini request endpoint:', endpoint);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt + "\n\nSTRICT JSON ONLY. No markdown, explanations, or prose." }] },
      contents: [
        {
          role: "user",
          parts: [{
            text: `${userPrompt}\n\nJSON schema name: ${schema.name}\nSchema:\n${JSON.stringify(schema.schema, null, 2)}\n\nReturn ONLY raw JSON without any surrounding text.`,
          }],
        },
      ],
      generationConfig: {
        temperature,
        topP: 0.9,
        maxOutputTokens: 3800,
        responseMimeType: "application/json",
        // Provide structured output schema if supported by the model (Gemini 2.5+)
        ...(schema && {
          responseSchema: {
            jsonSchema: {
              name: schema.name,
              schema: schema.schema,
              strict: true,
            },
          },
        }),
      },
    }),
  });

  const data = await response.json();
  // Log raw Gemini response for troubleshooting
  console.log('Gemini raw response data:', JSON.stringify(data, null, 2));
  if (!response.ok) {
    const message = data?.error?.message || "Gemini request failed.";
    throw Object.assign(new Error(message), { status: response.status, provider: "gemini" });
  }

  const raw = extractCandidateText(data);
  console.log('Extracted candidate text before parsing:', raw);
  const parsed = processStructuredGeminiResponse(raw, requestContext);
  console.log('Processed Gemini structured response:', parsed);
  return parsed;
}
