import { dbRuntimeConfig } from "../config.js";

const embeddingUrl = "https://api.openai.com/v1/embeddings";

export async function buildEmbeddingVector(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!dbRuntimeConfig.enableEmbeddings || !apiKey || !text?.trim()) {
    return null;
  }

  try {
    const response = await fetch(embeddingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: dbRuntimeConfig.embeddingModel,
        input: text.slice(0, 6000),
      }),
    });

    const data = await response.json();
    if (!response.ok) return null;
    return Array.isArray(data?.data?.[0]?.embedding) ? data.data[0].embedding : null;
  } catch {
    return null;
  }
}
