/**
 * Safely processes a Contentful image URL
 * @param url The original URL from Contentful
 * @param options Options for image processing
 * @returns Processed URL or fallback
 */
export function processContentfulImageUrl(
  url: string | null | undefined,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: "webp" | "jpg" | "png"
    fallback?: string
  } = {},
): string {
  const fallback = options.fallback || "/placeholder.svg"

  if (!url) return fallback

  // Only process Contentful URLs
  if (!url.includes("ctfassets.net")) return url

  try {
    // Ensure URL has proper protocol
    const urlStr = url.startsWith("//") ? `https:${url}` : url
    const urlObj = new URL(urlStr)

    // Add image optimization parameters
    if (options.width) urlObj.searchParams.set("w", options.width.toString())
    if (options.height) urlObj.searchParams.set("h", options.height.toString())
    if (options.quality) urlObj.searchParams.set("q", options.quality.toString())
    urlObj.searchParams.set("fm", options.format || "webp")

    return urlObj.toString()
  } catch (err) {
    console.error("Error processing Contentful image URL:", err)
    return url
  }
}

/**
 * Checks if a URL is a valid Contentful image URL
 */
export function isContentfulImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.includes("ctfassets.net") || url.includes("images.ctfassets.net")
}

/**
 * Extracts image dimensions from Contentful image metadata
 */
export function getContentfulImageDimensions(image: any): { width: number; height: number } | null {
  try {
    if (image?.fields?.file?.details?.image?.width && image?.fields?.file?.details?.image?.height) {
      return {
        width: image.fields.file.details.image.width,
        height: image.fields.file.details.image.height,
      }
    }
    return null
  } catch (err) {
    console.error("Error extracting Contentful image dimensions:", err)
    return null
  }
}
