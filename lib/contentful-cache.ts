// Simple in-memory cache for Contentful responses
type CacheEntry = {
  data: any
  timestamp: number
}

const cache: Record<string, CacheEntry> = {}
const DEFAULT_TTL = 60 * 1000 // 1 minute default TTL

/**
 * Get cached data or fetch it if not available
 * @param cacheKey Unique key for the cache entry
 * @param fetchFn Function to fetch the data if not in cache
 * @param ttl Time to live in milliseconds
 */
export async function getCachedData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
): Promise<T> {
  const now = Date.now()
  const cacheEntry = cache[cacheKey]

  // Return cached data if it exists and is not expired
  if (cacheEntry && now - cacheEntry.timestamp < ttl) {
    return cacheEntry.data as T
  }

  try {
    // Fetch fresh data
    const data = await fetchFn()

    // Update cache
    cache[cacheKey] = {
      data,
      timestamp: now,
    }

    return data
  } catch (error) {
    // If fetch fails but we have cached data (even if expired), return it as fallback
    if (cacheEntry) {
      console.warn(`Failed to fetch fresh data for ${cacheKey}, using expired cache:`, error)
      return cacheEntry.data as T
    }

    // Otherwise, rethrow the error
    throw error
  }
}

/**
 * Clear a specific cache entry or the entire cache
 * @param cacheKey Optional key to clear specific entry
 */
export function clearCache(cacheKey?: string): void {
  if (cacheKey) {
    delete cache[cacheKey]
  } else {
    Object.keys(cache).forEach((key) => delete cache[key])
  }
}
