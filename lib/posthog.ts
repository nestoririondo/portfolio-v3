import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      // Track everything
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: false,
      session_recording: {
        recordCrossOriginIframes: true,
      },
      // Enable all tracking features
      bootstrap: {
        distinctID: undefined,
      },
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
        // Enable all features
        posthog.startSessionRecording();
      },
    });
  }
};

export { posthog };
