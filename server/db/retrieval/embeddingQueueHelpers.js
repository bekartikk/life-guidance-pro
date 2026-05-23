const pendingEmbeddings = new Set();

function getEmbeddingKey({ externalUserId, summary }) {
  return `${externalUserId || "unknown"}:${String(summary || "").slice(0, 120)}`;
}

export function markEmbeddingPending(payload) {
  const key = getEmbeddingKey(payload);
  if (pendingEmbeddings.has(key)) {
    return { queued: false, duplicate: true };
  }

  pendingEmbeddings.add(key);
  return { queued: true, duplicate: false };
}

export function clearEmbeddingPending(payload) {
  pendingEmbeddings.delete(getEmbeddingKey(payload));
}
