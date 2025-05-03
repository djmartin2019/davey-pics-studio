/**
 * Safely access nested Contentful fields with improved type safety and error handling
 * @param obj The Contentful object
 * @param path The path to the field (e.g., 'fields.image.fields.file.url')
 * @param defaultValue Default value if the field doesn't exist
 */
export function getContentfulField<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue

  try {
    const keys = path.split(".")
    let result = obj

    for (const key of keys) {
      if (result === undefined || result === null) {
        console.warn(`Contentful field path ${path} resolved to undefined at key "${key}"`)
        return defaultValue
      }
      result = result[key]
    }

    // Type checking for expected return type
    if (result === undefined || result === null) {
      return defaultValue
    }

    // For URL fields, ensure they have proper protocol
    if (typeof result === "string" && path.endsWith("url") && result.startsWith("//")) {
      return `https:${result}` as unknown as T
    }

    return result as T
  } catch (error) {
    console.error(`Error accessing Contentful field at path ${path}:`, error)
    return defaultValue
  }
}

/**
 * Check if a Contentful image exists and has a valid URL
 * @param item The Contentful item
 * @returns boolean indicating if the image is valid
 */
export function hasValidImage(item: any): boolean {
  if (!item || !item.fields) return false

  try {
    const image = item.fields.image
    return Boolean(image && image.fields && image.fields.file && typeof image.fields.file.url === "string")
  } catch (error) {
    console.error("Error checking for valid image:", error)
    return false
  }
}

/**
 * Safely get an image URL from a Contentful item
 * @param item The Contentful item
 * @param fallback Fallback URL if image is not found
 * @returns The image URL or fallback
 */
export function getContentfulImageUrl(item: any, fallback = ""): string {
  try {
    if (!hasValidImage(item)) return fallback

    let url = item.fields.image.fields.file.url

    // Ensure URL has proper protocol
    if (url.startsWith("//")) {
      url = `https:${url}`
    }

    return url
  } catch (error) {
    console.error("Error getting Contentful image URL:", error)
    return fallback
  }
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
