/**
 * Helper function to track events with PostHog
 * This is a server-side file that provides a global function for use in scripts
 */
export function trackEventScript(eventName: string, properties = {}) {
  return `
    if (typeof window !== 'undefined' && window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture('${eventName}', ${JSON.stringify(properties)});
    }
  `
}
