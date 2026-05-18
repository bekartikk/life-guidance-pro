export function isRecoverableFirestoreError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.code === "unavailable" ||
    message.includes("offline") ||
    message.includes("network")
  );
}

export async function safeRead(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    if (isRecoverableFirestoreError(error)) {
      return fallback;
    }
    return fallback;
  }
}

// Usage: safeRead(() => getDoc(docRef), null)
// Usage: safeRead(() => getDocs(query), [])


