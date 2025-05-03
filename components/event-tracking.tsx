"use client"

import { posthog } from "@/lib/posthog"

type EventOptions = {
  name: string
  properties?: Record<string, any>
}

export function trackEvent({ name, properties = {} }: EventOptions) {
  // Only track if PostHog is available and initialized
  if (posthog && typeof posthog.capture === "function") {
    posthog.capture(name, properties)
  } else {
    console.warn(`Event "${name}" not tracked: PostHog not initialized`)
  }
}
