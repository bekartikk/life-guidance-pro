import { auth } from "../firebase";

export async function getFirebaseIdToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Please sign in again before continuing.");
  }

  return currentUser.getIdToken();
}

export async function fetchWithFirebaseAuth(url, options = {}) {
  const token = await getFirebaseIdToken();
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
  });
}