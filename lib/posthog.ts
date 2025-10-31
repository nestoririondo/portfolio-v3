import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      
      // Core tracking
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      
      // Heatmaps (required for toolbar)
      enable_heatmaps: true,
      
      // Session recording
      disable_session_recording: false,
      session_recording: {
        recordCrossOriginIframes: true,
      },
      
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          posthog.debug();
        }
      },
    });
  }
};

export { posthog };
