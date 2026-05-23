import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";
import { captureException } from "../monitoring/sentry";

const TITLE_MAP = {
  "/": "Life Guidance Pro | Adaptive AI Life Operating System",
  "/login": "Log In | Life Guidance Pro",
  "/dashboard": "Dashboard | Life Guidance Pro",
};

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const title = TITLE_MAP[location.pathname] || "Life Guidance Pro";
    document.title = title;
    try {
      trackPageView(location.pathname, title);
    } catch (error) {
      captureException(error, {
        tags: { boundary: "page-tracking" },
        extra: { pathname: location.pathname, title },
      });
    }
  }, [location.pathname]);
}
