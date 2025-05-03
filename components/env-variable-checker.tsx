"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function EnvVariableChecker() {
  const [envStatus, setEnvStatus] = useState<{
    spaceId: { defined: boolean; name: string }
    accessToken: { defined: boolean; name: string }
    environment: { nodeEnv: string; vercelEnv: string }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEnvVariables = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/env-check")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setEnvStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkEnvVariables()
  }, [])

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="my-4">
      <Alert className={error ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}>
        <AlertTitle className="flex items-center gap-2">
          Environment Variables Status
          <Button
            variant="outline"
            size="sm"
            onClick={checkEnvVariables}
            disabled={isLoading}
            className="h-6 px-2 text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Refresh"}
          </Button>
        </AlertTitle>
        <AlertDescription>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : !envStatus ? (
            <p>Loading environment status...</p>
          ) : (
            <div className="text-sm mt-2">
              <p>
                {envStatus.spaceId.name}:{" "}
                {envStatus.spaceId.defined ? (
                  <span className="text-green-600 font-medium">✅ Set</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Not set</span>
                )}
              </p>
              <p>
                {envStatus.accessToken.name}:{" "}
                {envStatus.accessToken.defined ? (
                  <span className="text-green-600 font-medium">✅ Set</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Not set</span>
                )}
              </p>
              <p className="mt-2 text-gray-600">
                Node Environment: <span className="font-medium">{envStatus.environment.nodeEnv}</span>
              </p>
              <p className="text-gray-600">
                Vercel Environment: <span className="font-medium">{envStatus.environment.vercelEnv}</span>
              </p>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
