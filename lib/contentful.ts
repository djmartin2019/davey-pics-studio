import { createClient } from "contentful"

// Check if required environment variables are defined
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

if (!spaceId || !accessToken) {
  console.error(
    "Warning: Missing required Contentful environment variables. Please make sure NEXT_PUBLIC_CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN are set.",
  )
}

// Create a Contentful client for fetching data
export const contentfulClient = createClient({
  space: spaceId || "",
  accessToken: accessToken || "",
  // Add error handling for failed requests
  errorLogger: (error) => {
    console.error("Contentful Error:", error.message)
    console.error("Error details:", {
      status: error.status,
      statusText: error.statusText,
      details: error.details,
      request: {
        url: error.request?.url,
        method: error.request?.method,
      },
    })
  },
})

// Helper function to check if Contentful client is properly configured
export const isContentfulConfigured = () => {
  return Boolean(spaceId && accessToken)
}

// Helper function to parse Contentful rich text
export const parseContentfulRichText = (richText: any) => {
  if (!richText) return ""

  // This is a simplified version - for production, you'd want to use
  // the @contentful/rich-text-react-renderer package for proper rendering
  try {
    return richText.content
      .map((item: any) => {
        if (item.nodeType === "paragraph") {
          return item.content.map((content: any) => content.value || "").join("")
        }
        return ""
      })
      .join("\n\n")
  } catch (error) {
    console.error("Error parsing rich text:", error)
    return ""
  }
}

// Helper function to get a URL for a Contentful image with transformations
export const getImageUrl = (imageUrl: string, options: { width?: number; height?: number; quality?: number } = {}) => {
  if (!imageUrl) return ""

  // If the URL is already using the Contentful Images API
  if (imageUrl.includes("images.ctfassets.net")) {
    const url = new URL(imageUrl)

    // Add width if specified
    if (options.width) {
      url.searchParams.set("w", options.width.toString())
    }

    // Add height if specified
    if (options.height) {
      url.searchParams.set("h", options.height.toString())
    }

    // Add quality if specified (1-100)
    if (options.quality) {
      url.searchParams.set("q", options.quality.toString())
    }

    // Set the fit to fill by default
    url.searchParams.set("fit", "fill")

    return url.toString()
  }

  return imageUrl
}
