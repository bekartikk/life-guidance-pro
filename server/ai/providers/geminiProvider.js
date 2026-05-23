function extractCandidateText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("\n")
      .trim() || ""
  );
}

export async function generateStructuredWithGemini({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  schema,
  temperature = 0.65,
}) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [
        {
          role: "user",
          parts: [{
            text: `${userPrompt}\n\nJSON schema name: ${schema.name}\nSchema:\n${JSON.stringify(schema.schema, null, 2)}\n\nReturn only valid JSON.`,
          }],
        },
      ],
      generationConfig: {
        temperature,
        topP: 0.9,
        maxOutputTokens: 3800,
        responseMimeType: "application/json",
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || "Gemini request failed.";
    throw Object.assign(new Error(message), { status: response.status, provider: "gemini" });
  }

  const raw = extractCandidateText(data);
  if (!raw) {
    throw Object.assign(new Error("Gemini returned an empty structured response."), { status: 502, provider: "gemini" });
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw Object.assign(new Error("Gemini returned invalid JSON."), {
      status: 502,
      provider: "gemini",
      cause: error,
      raw,
    });
  }
}
