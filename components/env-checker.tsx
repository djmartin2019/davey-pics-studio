"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function EnvChecker() {
  const [showDetails, setShowDetails] = useState(false)
  const [envStatus, setEnvStatus] = useState({
    spaceId: false,
    accessToken: false,
  })

  useEffect(() => {
    async function checkEnvVars() {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()
        setEnvStatus({
          spaceId: data.spaceIdSet,
          accessToken: data.accessTokenSet,
        })
      } catch (error) {
        console.error("Failed to check environment variables:", error)
      }
    }

    checkEnvVars()
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="bg-background/80 backdrop-blur-sm"
      >
        {showDetails ? "Hide Env Info" : "Check Env Variables"}
      </Button>

      {showDetails && (
        <Alert className="mt-2 w-80">
          <AlertTitle>Environment Variables</AlertTitle>
          <AlertDescription>
            <div className="text-xs mt-2">
              <p>NEXT_PUBLIC_CONTENTFUL_SPACE_ID: {envStatus.spaceId ? "✅ Set" : "❌ Not set"}</p>
              <p>CONTENTFUL_ACCESS_TOKEN: {envStatus.accessToken ? "✅ Set" : "❌ Not set"}</p>
              <p className="mt-2 text-muted-foreground">
                {!envStatus.spaceId || !envStatus.accessToken ? (
                  <span className="text-red-500">
                    Please create a .env.local file with the required environment variables.
                  </span>
                ) : (
                  "Environment variables are properly configured."
                )}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
