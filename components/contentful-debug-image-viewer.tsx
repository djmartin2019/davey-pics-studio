"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { processContentfulImageUrl, isContentfulImageUrl } from "@/lib/image-utils"
import { getContentfulField, getContentfulImageDimensions } from "@/lib/contentful-utils"

interface ContentfulDebugImageViewerProps {
  imageData: any // Contentful image object
  title?: string
}

export default function ContentfulDebugImageViewer({
  imageData,
  title = "Image Debugger",
}: ContentfulDebugImageViewerProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [imageError, setImageError] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  // Extract image URL and metadata
  const imageUrl = getContentfulField(imageData, "fields.file.url", null)
  const imageTitle = getContentfulField(imageData, "fields.title", "Untitled Image")
  const imageDescription = getContentfulField(imageData, "fields.description", "")
  const dimensions = getContentfulImageDimensions(imageData)
  const contentType = getContentfulField(imageData, "fields.file.contentType", "")
  const fileName = getContentfulField(imageData, "fields.file.fileName", "")

  // Process image URL for different sizes
  const smallImageUrl = processContentfulImageUrl(imageUrl, { width: 300, quality: 80 })
  const mediumImageUrl = processContentfulImageUrl(imageUrl, { width: 600, quality: 80 })
  const largeImageUrl = processContentfulImageUrl(imageUrl, { width: 1200, quality: 80 })

  // Check if this is a valid Contentful image
  const isValidContentfulImage = isContentfulImageUrl(imageUrl)

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className={isValidContentfulImage ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
            {isValidContentfulImage ? "Valid Contentful Image" : "Invalid or Missing Image"}
          </span>
        </CardTitle>
        <CardDescription>
          {imageTitle} {dimensions ? `(${dimensions.width}×${dimensions.height})` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="urls">URLs</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            {imageUrl ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Small (300px)</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <img
                      src={smallImageUrl || "/placeholder.svg"}
                      alt={imageTitle}
                      className={`max-w-full h-auto ${imageError ? "border border-red-500" : ""}`}
                      onError={() => setImageError(true)}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Medium (600px)</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <img src={mediumImageUrl || "/placeholder.svg"} alt={imageTitle} className="max-w-full h-auto" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="urls">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Original URL:</p>
                <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs">
                  {imageUrl || "null or undefined"}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Small (300px):</p>
                <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs">
                  {smallImageUrl || "null or undefined"}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Medium (600px):</p>
                <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs">
                  {mediumImageUrl || "null or undefined"}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Large (1200px):</p>
                <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs">
                  {largeImageUrl || "null or undefined"}
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Title:</p>
                <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{imageTitle}</p>
              </div>

              {imageDescription && (
                <div>
                  <p className="text-sm font-medium mb-1">Description:</p>
                  <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{imageDescription}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1">Dimensions:</p>
                <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  {dimensions ? `${dimensions.width}×${dimensions.height}` : "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Content Type:</p>
                <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{contentType || "Unknown"}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">File Name:</p>
                <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{fileName || "Unknown"}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Raw Data:</p>
                <pre className="p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs max-h-40">
                  {JSON.stringify(imageData, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => window.open(imageUrl, "_blank")}>
          Open Original
        </Button>
        <Button variant="outline" size="sm" onClick={() => setActiveTab(activeTab === "preview" ? "urls" : "preview")}>
          {activeTab === "preview" ? "Show URLs" : "Show Preview"}
        </Button>
      </CardFooter>
    </Card>
  )
}
