import * as Sentry from "@sentry/react";

const FRONTEND_DSN = String(import.meta.env.VITE_SENTRY_DSN || "").trim();
const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const APP_RELEASE = String(
  import.meta.env.VITE_COMMIT_SHA ||
    import.meta.env.VITE_APP_VERSION ||
    "local",
).trim();
const APP_ENVIRONMENT = String(import.meta.env.MODE || "development").trim();
const TRACE_RATE = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.15);

let hasInitialized = false;

function getTraceTargets() {
  const targets = [/^\/api\//];

  if (typeof window !== "undefined" && window.location?.origin) {
    targets.push(window.location.origin);
  }

  if (API_BASE) {
    targets.push(API_BASE);
  }

  return targets;
}

function shouldEnableMonitoring() {
  return Boolean(FRONTEND_DSN);
}

function getCurrentExceptionScopeConfig(context = {}) {
  return {
    level: context.level,
    tags: context.tags || {},
    extra: context.extra || {},
    user: context.user || null,
  };
}

export function initMonitoring() {
  console.log(import.meta.env.VITE_SENTRY_DSN ? "DSN_PRESENT" : "DSN_MISSING");
  console.log("Sentry initialized", Boolean(FRONTEND_DSN));

  if (!shouldEnableMonitoring() || hasInitialized || Sentry.isInitialized()) {
    return false;
  }

  try {
    Sentry.init({
      dsn: FRONTEND_DSN,
      enabled: true,
      release: APP_RELEASE,
      environment: APP_ENVIRONMENT,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: Number.isFinite(TRACE_RATE) ? TRACE_RATE : 0.15,
      tracePropagationTargets: getTraceTargets(),
      sendDefaultPii: false,
      normalizeDepth: 6,
      ignoreErrors: [
        "ResizeObserver loop limit exceeded",
        "Non-Error promise rejection captured",
        "Network request failed",
      ],
      beforeSend(event, hint) {
        const originalError = hint?.originalException;
        if (
          originalError &&
          typeof originalError === "object" &&
          /ChunkLoadError|Lazy import timed out/i.test(originalError?.message || "")
        ) {
          event.level = "warning";
        }

        return event;
      },
    });
  } catch {
    console.log("Sentry initialization failed");
    return false;
  }

  hasInitialized = true;
  console.log("Sentry initialized", true);
  return true;
}

export function isMonitoringEnabled() {
  return shouldEnableMonitoring() && (hasInitialized || Sentry.isInitialized());
}

export function captureException(error, context = {}) {
  if (!isMonitoringEnabled() || !error) {
    return;
  }

  const scopeConfig = getCurrentExceptionScopeConfig(context);
  Sentry.withScope((scope) => {
    Object.entries(scopeConfig.tags).forEach(([key, value]) => scope.setTag(key, String(value)));
    Object.entries(scopeConfig.extra).forEach(([key, value]) => scope.setExtra(key, value));
    if (scopeConfig.user) {
      scope.setUser(scopeConfig.user);
    }
    if (scopeConfig.level) {
      scope.setLevel(scopeConfig.level);
    }
    Sentry.captureException(error);
  });
}

export function captureMessage(message, context = {}) {
  if (!isMonitoringEnabled() || !message) {
    return;
  }

  const scopeConfig = getCurrentExceptionScopeConfig(context);
  Sentry.withScope((scope) => {
    Object.entries(scopeConfig.tags).forEach(([key, value]) => scope.setTag(key, String(value)));
    Object.entries(scopeConfig.extra).forEach(([key, value]) => scope.setExtra(key, value));
    if (scopeConfig.user) {
      scope.setUser(scopeConfig.user);
    }
    if (scopeConfig.level) {
      scope.setLevel(scopeConfig.level);
    }
    Sentry.captureMessage(String(message));
  });
}

export function setMonitoringUser(user) {
  if (!isMonitoringEnabled()) {
    return;
  }

  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.uid || user.id || null,
    email: user.email || null,
  });
}

export function setMonitoringContext(key, value) {
  if (!isMonitoringEnabled() || !key || value == null) {
    return;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    Sentry.setContext(String(key), value);
    return;
  }

  Sentry.setContext(String(key), { value });
}

export function withMonitoringRouting(routesComponent) {
  return routesComponent;
}
