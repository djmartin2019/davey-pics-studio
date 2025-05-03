"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RouteErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="flex gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-left max-w-2xl overflow-auto">
            <p className="font-medium mb-2">Error details:</p>
            <pre className="text-xs whitespace-pre-wrap">{error.stack}</pre>
            {error.digest && <p className="mt-2 text-xs">Digest: {error.digest}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
