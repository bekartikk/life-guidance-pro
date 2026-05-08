export function isRecoverableFirestoreError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.code === "unavailable" ||
    message.includes("offline") ||
    message.includes("network")
  );
}

export async function safeRead(operation, fallback, label = "read") {
  try {
    return await operation();
  } catch (error) {
    if (isRecoverableFirestoreError(error)) {
      return fallback;
    }
    console.error(`safeFirestore ${label} failed:`, error);
    return fallback;
  }
}

// Usage: safeRead(() => getDoc(docRef), null)
// Usage: safeRead(() => getDocs(query), [])


