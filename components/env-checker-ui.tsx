"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EnvCheckerUI() {
  const [envVars, setEnvVars] = useState<Record<string, boolean> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEnvVars = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/check-env")
      const data = await response.json()

      if (data.success) {
        setEnvVars(data.variables)
      } else {
        setError(data.message || "Failed to check environment variables")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Environment Variables Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={checkEnvVars} disabled={isLoading}>
            {isLoading ? "Checking..." : "Check Environment Variables"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {envVars && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Environment Variables Status:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-2 rounded-md ${value ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}
                  >
                    <span className="font-mono text-xs">{key}: </span>
                    <span className={value ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                      {value ? "✓ Set" : "✗ Missing"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
