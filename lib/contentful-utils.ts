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
        return defaultValue
      }
      result = result[key]
    }

    return result === undefined || result === null ? defaultValue : (result as T)
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

  const image = item.fields.image
  return Boolean(image && image.fields && image.fields.file && typeof image.fields.file.url === "string")
}
