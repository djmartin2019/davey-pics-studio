"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { posthog } from "@/lib/posthog"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      // Only capture pageview if PostHog is available
      if (posthog && typeof posthog.capture === "function") {
        posthog.capture("$pageview", {
          $current_url: url,
        })
      }
    }
  }, [pathname, searchParams])

  return null
}
