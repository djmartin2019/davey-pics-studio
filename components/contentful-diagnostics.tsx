"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

export default function ContentfulDiagnostics() {
  const [isLoading, setIsLoading] = useState(false)
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // First check environment variables
      const envResponse = await fetch("/api/env-check")
      const envData = await envResponse.json()

      // Then test connection
      let connectionData = { success: false, error: "Not tested" }
      try {
        const connectionResponse = await fetch("/api/contentful-status")
        connectionData = await connectionResponse.json()
      } catch (connErr) {
        connectionData = {
          success: false,
          error: connErr instanceof Error ? connErr.message : "Connection test failed",
        }
      }

      setDiagnosticResults({
        environment: envData,
        connection: connectionData,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Contentful Connection Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          If you're experiencing issues with Contentful, run this diagnostic tool to help identify the problem.
        </p>

        <Button onClick={runDiagnostics} disabled={isLoading} className="mb-6">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diagnosticResults && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Environment Variables</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>NEXT_PUBLIC_CONTENTFUL_SPACE_ID:</span>
                    {diagnosticResults.environment.spaceId.defined ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" /> Set
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-1" /> Missing
                      </span>
                    )}
                  </li>
                  <li className="flex items-center justify-between">
                    <span>CONTENTFUL_ACCESS_TOKEN:</span>
                    {diagnosticResults.environment.accessToken.defined ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" /> Set
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <AlertCircle className="h-4 w-4 mr-1" /> Missing
                      </span>
                    )}
                  </li>
                  <li className="text-sm text-gray-500 mt-2">
                    Node Environment: {diagnosticResults.environment.environment.nodeEnv}
                  </li>
                  <li className="text-sm text-gray-500">
                    Vercel Environment: {diagnosticResults.environment.environment.vercelEnv}
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Connection Status</h3>
                {diagnosticResults.connection.connection?.success ? (
                  <div className="text-green-500 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Connected to Contentful successfully
                  </div>
                ) : (
                  <div className="text-red-500">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Connection failed
                    </div>
                    {diagnosticResults.connection.connection?.error && (
                      <p className="mt-2 text-sm">Error: {diagnosticResults.connection.connection.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Alert
              className={
                diagnosticResults.environment.spaceId.defined &&
                diagnosticResults.environment.accessToken.defined &&
                diagnosticResults.connection.connection?.success
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }
            >
              <AlertTitle>Diagnosis</AlertTitle>
              <AlertDescription>
                {!diagnosticResults.environment.spaceId.defined ||
                !diagnosticResults.environment.accessToken.defined ? (
                  <p>
                    <strong>Problem:</strong> Missing environment variables. Make sure both
                    NEXT_PUBLIC_CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN are set in your environment.
                  </p>
                ) : !diagnosticResults.connection.connection?.success ? (
                  <p>
                    <strong>Problem:</strong> Environment variables are set, but connection to Contentful failed. Check
                    that your credentials are correct and that you have proper access to the Contentful space.
                  </p>
                ) : (
                  <p>
                    <strong>All good!</strong> Your Contentful connection is working properly.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
