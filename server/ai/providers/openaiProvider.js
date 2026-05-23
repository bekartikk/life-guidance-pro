const openAiUrl = "https://api.openai.com/v1/responses";

function getOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const outputs = Array.isArray(data.output) ? data.output : [];
  const text = outputs
    .flatMap((item) => item.content || [])
    .map((part) => part.text || part.output_text || "")
    .join("\n")
    .trim();

  return text;
}

export async function generateStructuredWithOpenAI({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  schema,
  temperature = 0.6,
}) {
  const response = await fetch(openAiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
      temperature,
      text: {
        format: {
          type: "json_schema",
          name: schema.name,
          description: schema.description,
          schema: schema.schema,
          strict: true,
        },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || "OpenAI request failed.";
    throw Object.assign(new Error(message), { status: response.status, provider: "openai" });
  }

  const payloadText = getOutputText(data);
  if (!payloadText) {
    throw Object.assign(new Error("OpenAI returned an empty structured response."), { status: 502, provider: "openai" });
  }

  try {
    return JSON.parse(payloadText);
  } catch (error) {
    throw Object.assign(new Error("OpenAI returned invalid JSON."), {
      status: 502,
      provider: "openai",
      cause: error,
      raw: payloadText,
    });
  }
}
