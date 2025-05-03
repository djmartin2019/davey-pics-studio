"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, RefreshCw, AlertTriangle } from "lucide-react"

export default function ContentfulConnectionStatus() {
  const [status, setStatus] = useState<{
    isChecking: boolean
    isConnected: boolean
    error: string | null
    envVars: {
      spaceIdSet: boolean
      accessTokenSet: boolean
    }
  }>({
    isChecking: true,
    isConnected: false,
    error: null,
    envVars: {
      spaceIdSet: false,
      accessTokenSet: false,
    },
  })

  const checkConnection = async () => {
    setStatus((prev) => ({ ...prev, isChecking: true, error: null }))

    try {
      const response = await fetch("/api/contentful-status", {
        cache: "no-store", // Prevent caching
      })

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      setStatus({
        isChecking: false,
        isConnected: data.connection.success,
        error: data.connection.error || null,
        envVars: {
          spaceIdSet: data.envVars.spaceIdSet,
          accessTokenSet: data.envVars.accessTokenSet,
        },
      })
    } catch (error) {
      console.error("Error checking Contentful connection:", error)
      setStatus((prev) => ({
        ...prev,
        isChecking: false,
        isConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Alert
      className={
        status.isConnected
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
      }
    >
      <AlertTitle className="flex items-center gap-2">
        {status.isChecking ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
            Checking Contentful Connection...
          </>
        ) : status.isConnected ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Contentful Connected
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Contentful Connection Issue
          </>
        )}
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>NEXT_PUBLIC_CONTENTFUL_SPACE_ID:</span>
            {status.envVars.spaceIdSet ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Set
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <XCircle className="h-3 w-3 mr-1" /> Missing
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>CONTENTFUL_ACCESS_TOKEN:</span>
            {status.envVars.accessTokenSet ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Set
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <XCircle className="h-3 w-3 mr-1" /> Missing
              </span>
            )}
          </div>
          {status.error && <p className="text-sm text-red-600 mt-2">Error: {status.error}</p>}
          <div className="mt-4">
            <Button size="sm" onClick={checkConnection} disabled={status.isChecking}>
              {status.isChecking ? (
                <>
                  <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                  Checking...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
