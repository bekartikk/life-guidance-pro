import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.jsx";
import { initPostHog } from "./analytics/posthog";

import "./index.css";
import "./styles/design-system.css";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.2,
    environment: import.meta.env.MODE,
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("React root element '#root' was not found.");
}

if (typeof window !== "undefined") {
  const schedulePostHog =
    "requestIdleCallback" in window
      ? window.requestIdleCallback.bind(window)
      : (callback) => window.setTimeout(callback, 180);
  schedulePostHog(() => initPostHog());
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
