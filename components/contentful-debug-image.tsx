"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { processContentfulImageUrl, isContentfulImageUrl } from "@/lib/image-utils"

interface ContentfulDebugImageProps {
  imageUrl: string | null | undefined
  alt?: string
}

export default function ContentfulDebugImage({ imageUrl, alt = "Debug image" }: ContentfulDebugImageProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [testUrlResults, setTestUrlResults] = useState<{ success: boolean; message: string } | null>(null)

  // Only shown in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  // Process URL only if it's a Contentful URL
  const processedUrl = processContentfulImageUrl(imageUrl, { width: 300 })
  const isContentfulUrl = isContentfulImageUrl(imageUrl)

  const testImageUrl = () => {
    if (!imageUrl) {
      setTestUrlResults({ success: false, message: "No image URL to test" })
      return
    }

    // Test if the image can be loaded
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      setTestUrlResults({
        success: true,
        message: `Image loaded successfully (${img.naturalWidth}×${img.naturalHeight})`,
      })
    }

    img.onerror = () => {
      setTestUrlResults({
        success: false,
        message: "Failed to load image. Check the URL or CORS configuration.",
      })
    }

    img.src = processedUrl
  }

  return (
    <div className="mt-4 p-4 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
      <h3 className="font-medium mb-2">Contentful Image Debugger</h3>

      <div className="flex space-x-2 mb-2">
        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
        <Button variant="outline" size="sm" onClick={testImageUrl}>
          Test Image URL
        </Button>
      </div>

      {testUrlResults && (
        <Alert variant={testUrlResults.success ? "default" : "destructive"} className="mb-3">
          <AlertTitle>{testUrlResults.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{testUrlResults.message}</AlertDescription>
        </Alert>
      )}

      {showDetails && (
        <div className="space-y-2 text-sm">
          <div>
            <p>
              <strong>Original URL:</strong>
            </p>
            <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
              {imageUrl || "null or undefined"}
            </code>
          </div>

          <div>
            <p>
              <strong>Processed URL:</strong>
            </p>
            <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
              {processedUrl || "null or undefined"}
            </code>
          </div>

          <div>
            <p>
              <strong>URL Type:</strong> {isContentfulUrl ? "Contentful Image URL" : "Non-Contentful URL"}
            </p>
          </div>

          {imageUrl && (
            <div>
              <p>
                <strong>Image Preview:</strong>
              </p>
              <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <img
                  src={processedUrl || "/placeholder.svg"}
                  alt={alt}
                  className="max-w-full h-auto max-h-40 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    target.src = "/image-error.png"
                    target.classList.add("border", "border-red-500")
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <p>
              <strong>Troubleshooting Tips:</strong>
            </p>
            <ul className="list-disc pl-5 text-xs">
              <li>Check that the Contentful Space ID and Access Token are set correctly</li>
              <li>Verify that the image exists in your Contentful space</li>
              <li>Make sure the image field name matches your content model</li>
              <li>Check for CORS issues (Contentful should allow cross-origin requests)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
