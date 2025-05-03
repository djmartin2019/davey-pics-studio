"use client"

import type React from "react"

import { useState, useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

// Remove direct reference to environment variables
let posthogInitialized = false

// Initialize PostHog asynchronously
async function initPostHog() {
  if (posthogInitialized || typeof window === "undefined") return

  try {
    // Fetch configuration from server-side API
    const response = await fetch("/api/site-config")
    const config = await response.json()

    if (config.analyticsKey) {
      posthog.init(config.analyticsKey, {
        api_host: config.analyticsHost,
        capture_pageview: false,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") posthog.debug()
        },
        autocapture: true,
        session_recording: {
          maskAllInputs: false,
        },
      })
      posthogInitialized = true
      console.log("Analytics initialized successfully")
    }
  } catch (error) {
    console.error("Failed to initialize analytics:", error)
  }
}

// Component to initialize PostHog
export function PostHogInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      initPostHog().then(() => setInitialized(true))
    }
  }, [initialized])

  return null
}

export { posthog }
export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
