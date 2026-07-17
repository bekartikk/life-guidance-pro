import { randomUUID } from "node:crypto";

export function requestIdMiddleware(req, res, next) {
  const incomingRequestId = String(req.get("x-request-id") || "").trim();
  req.requestId = incomingRequestId || randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}

export function logBackendException(error, context = {}) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "error",
    requestId: context.requestId || "unknown",
    route: context.route || "unknown",
    provider: context.provider || error?.provider || "unknown",
    userId: context.userId || "unauthenticated",
    message: error?.message || "Unknown backend exception",
    stack: error?.stack || null,
    ...context.details,
  }));
}

export function logBackendWarning(message, context = {}) {
  console.warn(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "warn",
    requestId: context.requestId || "unknown",
    route: context.route || "unknown",
    provider: context.provider || "unknown",
    userId: context.userId || "unauthenticated",
    message,
    ...context.details,
  }));
}

export function errorResponse(res, status, message, requestId) {
  return res.status(status).json({ message, requestId });
}
