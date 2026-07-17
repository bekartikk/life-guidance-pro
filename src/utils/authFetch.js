import { auth } from "../firebase";

export async function getFirebaseIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Please sign in again before continuing.");
  }

  return currentUser.getIdToken();
}

export async function fetchWithFirebaseAuth(url, options = {}) {
  // Set a timeout for the fetch request to avoid indefinite hanging
  const controller = new AbortController();
  const timeoutMs = Number(import.meta.env.VITE_FETCH_TIMEOUT_MS) || 30000; // default 30 seconds
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const token = await getFirebaseIdToken();
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  try {
    return await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}