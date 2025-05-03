"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FooterContentful() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [isChecking, setIsChecking] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const checkConnection = async () => {
    setIsChecking(true)
    setErrorDetails(null)

    try {
      // Use the API route to check status with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch("/api/contentful-status", {
        signal: controller.signal,
        cache: "no-store", // Prevent caching
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.envVars.spaceIdSet && data.envVars.accessTokenSet) {
        if (data.connection.success) {
          setStatus("connected")
        } else {
          setStatus("error")
          setErrorDetails(data.connection.error || "Connection test failed")
        }
      } else {
        setStatus("error")
        setErrorDetails("Environment variables not properly configured")
      }
    } catch (error) {
      console.error("Error checking Contentful connection in footer:", error)
      setStatus("error")
      setErrorDetails(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsChecking(false)
    }
  }

  // Initial check with retry logic
  useEffect(() => {
    const initialCheck = async () => {
      try {
        await checkConnection()
      } catch (error) {
        // If we've retried less than 3 times, try again after a delay
        if (retryCount < 3) {
          const timer = setTimeout(() => {
            setRetryCount((prev) => prev + 1)
          }, 2000) // Retry after 2 seconds

          return () => clearTimeout(timer)
        }
      }
    }

    initialCheck()
  }, [retryCount])

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "loading" || isChecking ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
          <span className="text-yellow-500">Checking Contentful...</span>
        </>
      ) : status === "connected" ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Contentful connected</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-amber-500" />
          <span className="text-amber-500" title={errorDetails || undefined}>
            Contentful status: offline
          </span>
        </>
      )}

      <Button variant="ghost" size="sm" className="h-6 px-2" onClick={checkConnection} disabled={isChecking}>
        <RefreshCw className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
