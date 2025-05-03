import { createClient } from "contentful"
import { processContentfulImageUrl } from "./image-utils"

// Cache for Contentful client instance
let contentfulClientInstance: ReturnType<typeof createClient> | null = null
let mockClientInstance: any = null
let lastInitAttempt = 0
const INIT_COOLDOWN = 5000 // 5 seconds between initialization attempts

// Process Contentful image URLs - using our new utility function
export const getImageUrl = (
  imageUrl: string | null | undefined,
  options: { width?: number; height?: number; quality?: number } = {},
) => {
  return processContentfulImageUrl(imageUrl, options)
}

// Create a function to get the Contentful client with enhanced error handling
export function getContentfulClient() {
  // Get environment variables
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  // Check if we already have a valid instance and it's not time to retry yet
  if (contentfulClientInstance && Date.now() - lastInitAttempt < INIT_COOLDOWN) {
    return contentfulClientInstance
  }

  // Update the last initialization attempt time
  lastInitAttempt = Date.now()

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
    console.warn("Missing Contentful credentials - using mock client with sample data")
    return getMockClient()
  }

  // Create a new client instance
  try {
    contentfulClientInstance = createClient({
      space: spaceId,
      accessToken: accessToken,
      // Force consistent environment between server and client
      environment: "master",
      // Add retry logic for network issues
      retryOnError: true,
    })

    // Test the client with a simple query to ensure it's working
    contentfulClientInstance
      .getContentTypes({ limit: 1 })
      .then(() => console.log("Contentful client initialized successfully"))
      .catch((err) => {
        console.error("Contentful client test query failed:", err)
        contentfulClientInstance = null // Reset the client if test fails
      })

    return contentfulClientInstance
  } catch (error) {
    console.error("Failed to initialize Contentful client:", error)
    return getMockClient()
  }
}

// Improve the mock client to better handle errors
function getMockClient() {
  // Return cached mock client if it exists
  if (mockClientInstance) {
    return mockClientInstance
  }

  console.info("Creating Contentful mock client with sample data")

  // Sample data for mock responses
  const sampleBlogPosts = [
    {
      sys: { id: "sample1" },
      fields: {
        title: "The Art of Bird Photography in Low Light",
        excerpt: "Techniques for capturing stunning avian images during dawn and dusk hours.",
        publishDate: new Date().toISOString(),
        slug: "bird-photography-low-light",
        coverPhoto: { fields: { file: { url: "/placeholder.svg?key=lhed4" } } },
        tags: ["Photography", "Birds"],
      },
    },
    {
      sys: { id: "sample2" },
      fields: {
        title: "Technology in Wildlife Conservation",
        excerpt: "How modern tech is helping us understand and protect bird populations.",
        publishDate: new Date().toISOString(),
        slug: "technology-wildlife-conservation",
        coverPhoto: { fields: { file: { url: "/placeholder.svg?key=jv7rb" } } },
        tags: ["Technology", "Conservation"],
      },
    },
  ]

  const sampleGalleryItems = [
    {
      sys: { id: "gallery1" },
      fields: {
        title: "Owl in Moonlight",
        description: "Great Horned Owl perched on a branch during a full moon night.",
        image: { fields: { file: { url: "/placeholder.svg?key=n29da" } } },
        location: "Brazos Bend State Park, TX",
      },
    },
    {
      sys: { id: "gallery2" },
      fields: {
        title: "Hummingbird at Dawn",
        description: "Ruby-throated Hummingbird feeding at first light.",
        image: { fields: { file: { url: "/placeholder.svg?key=e0hbu" } } },
        location: "Backyard Studio, Houston, TX",
      },
    },
  ]

  mockClientInstance = {
    getContentTypes: async (query: any = {}) => {
      // Return a properly structured response with mock content types
      const mockContentTypes = [
        {
          sys: { id: "homepage" },
          name: "Homepage",
          description: "Homepage content",
          displayField: "title",
        },
        {
          sys: { id: "blogPost" },
          name: "Blog Post",
          description: "Blog post content",
          displayField: "title",
        },
        {
          sys: { id: "photo" },
          name: "Photo",
          description: "Photo content",
          displayField: "title",
        },
        {
          sys: { id: "category" },
          name: "Category",
          description: "Content categories",
          displayField: "name",
        },
      ]

      // If a specific content type is requested, filter the list
      let items = mockContentTypes
      if (query["sys.id"]) {
        items = mockContentTypes.filter((type) => type.sys.id === query["sys.id"])
      }

      return {
        items,
        total: items.length,
        skip: 0,
        limit: query.limit || 10,
        includes: {},
      }
    },
    getEntries: async (query: any = {}) => {
      // Return different mock data based on content type
      if (query.content_type === "blogPost") {
        return {
          items: sampleBlogPosts,
          total: sampleBlogPosts.length,
          skip: 0,
          limit: query.limit || 10,
          includes: {},
        }
      } else if (
        query.content_type === "photo" ||
        query.content_type === "galleryItem" ||
        query.content_type === "galleryCollection"
      ) {
        return {
          items: sampleGalleryItems,
          total: sampleGalleryItems.length,
          skip: 0,
          limit: query.limit || 10,
          includes: {},
        }
      } else if (query.content_type === "category") {
        return {
          items: [
            { sys: { id: "cat1" }, fields: { name: "Birds", slug: "birds" } },
            { sys: { id: "cat2" }, fields: { name: "Technology", slug: "technology" } },
            { sys: { id: "cat3" }, fields: { name: "Conservation", slug: "conservation" } },
          ],
          total: 3,
          skip: 0,
          limit: query.limit || 10,
          includes: {},
        }
      }

      // Default empty response with proper structure
      return { items: [], total: 0, skip: 0, limit: query.limit || 10, includes: {} }
    },
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

// Helper function to get client-side environment variables
export const getClientEnvVars = () => {
  return {
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
    // Don't expose access token on client
    hasAccessToken: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
  }
}
