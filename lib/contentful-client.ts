import { createClient } from "contentful"

// Cache for Contentful client instance
let contentfulClientInstance: ReturnType<typeof createClient> | null = null
let mockClientInstance: any = null
let lastInitAttempt = 0
const INIT_COOLDOWN = 5000 // 5 seconds between initialization attempts

// Create a function to get the Contentful client
export function getContentfulClient() {
  // Check if we already have an instance and it's not time to retry yet
  if (contentfulClientInstance && Date.now() - lastInitAttempt < INIT_COOLDOWN) {
    return contentfulClientInstance
  }

  // Update the last initialization attempt time
  lastInitAttempt = Date.now()

  // Access environment variables directly each time to ensure we get the latest values
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  // Log environment variable status (without exposing values)
  console.log("Contentful client initialization attempt:", {
    spaceIdDefined: Boolean(spaceId),
    accessTokenDefined: Boolean(accessToken),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || "unknown",
    timestamp: new Date().toISOString(),
  })

  // If environment variables are missing, return a mock client
  if (!spaceId || !accessToken) {
    console.warn("Contentful environment variables missing, using mock client")
    return getMockClient()
  }

  // Create a new client instance
  try {
    contentfulClientInstance = createClient({
      space: spaceId,
      accessToken: accessToken,
      // Add error handling for failed requests
      errorLogger: (error) => {
        console.error("Contentful Error:", error.message)
      },
    })
    return contentfulClientInstance
  } catch (error) {
    console.error("Failed to initialize Contentful client:", error)
    return getMockClient()
  }
}

// Create a mock client that returns empty data instead of throwing errors
function getMockClient() {
  // Return cached mock client if it exists
  if (mockClientInstance) {
    return mockClientInstance
  }

  console.warn("Creating Contentful mock client with fallback data")
  mockClientInstance = {
    getEntries: async () => ({ items: [], total: 0, skip: 0, limit: 0 }),
    getContentTypes: async () => ({ items: [], total: 0, skip: 0, limit: 0 }),
    getEntry: async () => null,
    getAsset: async () => null,
    getSpace: async () => ({ name: "Mock Space", locales: [] }),
    sync: async () => ({ entries: [], assets: [], deletedEntries: [], deletedAssets: [], nextSyncToken: "" }),
  } as unknown as ReturnType<typeof createClient>

  return mockClientInstance
}

// Helper function to check if Contentful client is properly configured
export const isContentfulConfigured = () => {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  return Boolean(spaceId && accessToken)
}
