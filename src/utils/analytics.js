import { hasPostHogKey, withPostHog } from "../analytics/posthog";

function detectViewportGroup() {
  if (typeof window === "undefined") return "server";
  if (window.innerWidth <= 640) return "mobile";
  if (window.innerWidth <= 1024) return "tablet";
  return "desktop";
}

function getBaseProperties() {
  return {
    viewport_group: detectViewportGroup(),
    path: typeof window !== "undefined" ? window.location.pathname : "",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
}

export function trackEvent(name, properties = {}) {
  const eventName = String(name || "").trim();
  if (!eventName) return;

  const payload = {
    ...getBaseProperties(),
    ...properties,
  };

  try {
    if (hasPostHogKey()) {
      withPostHog((client) => client.capture(eventName, payload));
    }
  } catch {
    return;
  }
}

export function trackPageView(pathname, title, extra = {}) {
  const payload = {
    pathname,
    title,
    ...getBaseProperties(),
    ...extra,
  };

  if (hasPostHogKey()) {
    withPostHog((client) => client.capture("$pageview", payload));
  }
}

export function identifyUser(user) {
  if (!user || !hasPostHogKey()) return;
  withPostHog((client) =>
    client.identify(user.uid, {
      email: user.email || "",
    }),
  );
}

export function resetAnalytics() {
  if (!hasPostHogKey()) return;
  withPostHog((client) => client.reset());
}
