import type React from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface ContentfulFallbackProps {
  message?: string
  children?: React.ReactNode
}

export default function ContentfulFallback({
  message = "Content could not be loaded",
  children,
}: ContentfulFallbackProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTitle>Content Error</AlertTitle>
      <AlertDescription>
        {message}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 text-sm">
            <p>Make sure your Contentful environment variables are set correctly:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>NEXT_PUBLIC_CONTENTFUL_SPACE_ID</li>
              <li>CONTENTFUL_ACCESS_TOKEN</li>
            </ul>
            <p className="mt-2">
              Create a <code>.env.local</code> file in your project root with these variables.
            </p>
          </div>
        )}
      </AlertDescription>
      {children}
    </Alert>
  )
}
