import { createClient } from "contentful"

// Cache for Contentful client instance
const contentfulClientInstance: ReturnType<typeof createClient> | null = null
let mockClientInstance: any = null
const lastInitAttempt = 0
const INIT_COOLDOWN = 5000 // 5 seconds between initialization attempts

// Create a function to get the Contentful client
export function getContentfulClient() {
  // Get environment variables
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  // Check if environment variables are defined
  if (!spaceId || !accessToken) {
    console.error("Missing Contentful credentials:", {
      hasSpaceId: Boolean(spaceId),
      hasAccessToken: Boolean(accessToken),
    })
    throw new Error("Missing Contentful credentials")
  }

  // Create and return the client
  return createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: "master", // or your custom environment
  })
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
