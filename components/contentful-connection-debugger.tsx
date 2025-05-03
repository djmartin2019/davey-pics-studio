"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContentfulConnectionDebugger() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    setIsChecking(true)
    setError(null)

    try {
      // Test the Contentful connection
      const response = await fetch("/api/contentful-test?detailed=true")
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Contentful Connection Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button onClick={checkConnection} disabled={isChecking}>
              {isChecking ? "Checking..." : "Check Contentful Connection"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Tests connection to Contentful and displays detailed information
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-4">
              <Alert variant={results.success ? "default" : "destructive"}>
                <AlertTitle>{results.success ? "Connection Successful" : "Connection Failed"}</AlertTitle>
                <AlertDescription>{results.message}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Environment Variables:</h3>
                <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
                  {JSON.stringify(
                    {
                      NEXT_PUBLIC_CONTENTFUL_SPACE_ID: results.env?.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
                        ? "✓ Set"
                        : "✗ Missing",
                      CONTENTFUL_ACCESS_TOKEN: results.env?.CONTENTFUL_ACCESS_TOKEN ? "✓ Set" : "✗ Missing",
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>

              {results.contentTypes && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Available Content Types:</h3>
                  <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(results.contentTypes, null, 2)}
                  </pre>
                </div>
              )}

              {results.homepageFields && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Homepage Fields:</h3>
                  <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(results.homepageFields, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
