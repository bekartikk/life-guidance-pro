import { getFirebaseAdminAuth } from "./firebaseAdmin.js";
import { errorResponse, logBackendException } from "../observability.js";

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
    return errorResponse(res, 401, "Authentication required.", req.requestId);
  }

  if (token.split(".").length !== 3) {
    return errorResponse(res, 401, "Invalid or expired authentication token.", req.requestId);
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
    logBackendException(error, { requestId: req.requestId, route: req.originalUrl, provider: "firebase", userId: req.user?.uid });
    if (error.status === 503) {
      return errorResponse(res, 503, "Authentication service is unavailable.", req.requestId);
    }
    return errorResponse(res, 401, "Invalid or expired authentication token.", req.requestId);
  }
}
