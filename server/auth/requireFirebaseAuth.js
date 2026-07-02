import { getFirebaseAdminAuth } from "./firebaseAdmin.js";

function readBearerToken(header = "") {
  const [scheme, token] = String(header).trim().split(/\s+/);
  if (scheme !== "Bearer" || !token) {
    return "";
  }
  return token;
}

export async function requireFirebaseAuth(req, res, next) {
  const token = readBearerToken(req.get("authorization"));
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  if (token.split(".").length !== 3) {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(token, true);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      emailVerified: Boolean(decodedToken.email_verified),
      claims: decodedToken,
    };
    return next();
  } catch (error) {
    if (error.status === 503) {
      return res.status(503).json({ message: "Authentication service is not configured." });
    }
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}