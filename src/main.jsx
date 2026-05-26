import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { initPostHog } from "./analytics/posthog";

import "./index.css";
import "./styles/design-system.css";

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
