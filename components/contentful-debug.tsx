"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ContentfulDebug() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runTest = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/contentful-test")
      const data = await response.json()
      setTestResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="my-8 p-4 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
      <h2 className="text-lg font-semibold mb-4">Contentful Connection Debugger</h2>

      <Button onClick={runTest} disabled={isLoading} variant="outline" className="mb-4">
        {isLoading ? "Testing Connection..." : "Test Contentful Connection"}
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {testResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
              <p className="font-medium">Environment Variables:</p>
              <p>SPACE_ID: {testResults.envVars.spaceId ? "✅ Set" : "❌ Missing"}</p>
              <p>ACCESS_TOKEN: {testResults.envVars.accessToken ? "✅ Set" : "❌ Missing"}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
              <p className="font-medium">Connection Status:</p>
              <p>Connected: {testResults.connection.success ? "✅ Yes" : "❌ No"}</p>
              {!testResults.connection.success && <p className="text-red-600">{testResults.connection.error}</p>}
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="content-types">
              <AccordionTrigger>Content Types</AccordionTrigger>
              <AccordionContent>
                {testResults.contentTypes.success ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {testResults.contentTypes.types.map((type: any) => (
                      <li key={type.sys.id}>
                        {type.name} ({type.sys.id})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-600">{testResults.contentTypes.error}</p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="entries">
              <AccordionTrigger>Sample Entries</AccordionTrigger>
              <AccordionContent>
                {testResults.entries.success ? (
                  <div>
                    <p>Found {testResults.entries.count} entries</p>
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-60 text-xs">
                      {JSON.stringify(testResults.entries.sample, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-red-600">{testResults.entries.error}</p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="raw-response">
              <AccordionTrigger>Raw API Response</AccordionTrigger>
              <AccordionContent>
                <pre className="p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(testResults.rawResponse, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  )
}
