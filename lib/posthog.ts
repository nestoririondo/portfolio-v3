import posthog from "posthog-js";

export const initPostHog = () => {
  // Don't initialize PostHog in development or if no key provided
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  // Check for manual disable flag
  if (process.env.NEXT_PUBLIC_DISABLE_POSTHOG === "true") {
    console.log("PostHog tracking manually disabled via environment variable");
    return;
  }

  // Check for environment override
  const envOverride = process.env.NEXT_PUBLIC_ENVIRONMENT_OVERRIDE;
  if (envOverride === "development") {
    console.log("PostHog tracking disabled via environment override");
    return;
  }

  // Skip tracking in development environment
  if (process.env.NODE_ENV === "development") {
    console.log("PostHog tracking disabled in development environment");
    return;
  }

  // Skip tracking for localhost and local IPs
  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || 
                     hostname === "127.0.0.1" || 
                     hostname.startsWith("192.168.") ||
                     hostname.startsWith("10.") ||
                     hostname.endsWith(".local") ||
                     hostname.includes("ngrok") ||
                     hostname.includes("vercel.app") && hostname.includes("git-");

  if (isLocalhost) {
    console.log("PostHog tracking disabled for localhost/local development");
    return;
  }

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
      // Additional safety check in case we missed something
      if (process.env.NODE_ENV === "development" || isLocalhost) {
        posthog.opt_out_capturing();
        console.log("PostHog capturing disabled for development/localhost");
      }
    },
  });
};

// Safe PostHog wrapper that checks if tracking is enabled
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.identify(userId, properties);
  }
};

export const setUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.people.set(properties);
  }
};

export { posthog };
