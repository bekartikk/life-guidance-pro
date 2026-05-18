const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || "";
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

let clientPromise = null;
let initialized = false;

async function loadPostHogClient() {
  if (!POSTHOG_KEY) return null;

  if (!clientPromise) {
    clientPromise = import("posthog-js")
      .then(({ default: posthog }) => {
        if (!initialized) {
          posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            person_profiles: "identified_only",
            capture_pageview: false,
            capture_pageleave: true,
            autocapture: true,
            disable_session_recording: false,
            session_recording: {
              maskAllInputs: false,
              recordCrossOriginIframes: false,
            },
            persistence: "localStorage+cookie",
            loaded(client) {
              if (import.meta.env.DEV) {
                client.debug(false);
              }
            },
          });

          initialized = true;
        }

        return posthog;
      })
      .catch(() => null);
  }

  return clientPromise;
}

export function initPostHog() {
  void loadPostHogClient();
}

export function withPostHog(callback) {
  if (!POSTHOG_KEY) return;

  void loadPostHogClient().then((client) => {
    if (!client) return;
    callback(client);
  });
}

export function hasPostHogKey() {
  return Boolean(POSTHOG_KEY);
}
