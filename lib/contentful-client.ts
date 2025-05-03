import { createClient } from "contentful"

// Create a function to get the Contentful client
export function getContentfulClient() {
  // Get environment variables
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  // Check if environment variables are defined
  if (!spaceId || !accessToken) {
    throw new Error("Missing Contentful credentials")
  }

  // Create and return the client
  return createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: "master", // or your custom environment
  })
}

// Helper function to check if Contentful client is properly configured
export const isContentfulConfigured = () => {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  return Boolean(spaceId && accessToken)
}
