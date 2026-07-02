import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function parseServiceAccount() {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (encoded) {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    return JSON.parse(json);
  }

  return null;
}

function getFirebaseAdminOptions() {
  const serviceAccount = parseServiceAccount();
  if (serviceAccount) {
    return { credential: cert(serviceAccount) };
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_CONFIG) {
    return { credential: applicationDefault() };
  }

  return null;
}

export function getFirebaseAdminAuth() {
  if (!getApps().length) {
    const options = getFirebaseAdminOptions();
    if (!options) {
      const error = new Error("Firebase Admin credentials are not configured.");
      error.status = 503;
      throw error;
    }
    initializeApp(options);
  }

  return getAuth();
}