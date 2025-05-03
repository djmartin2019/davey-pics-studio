import { NextResponse } from "next/server"
import { getContentfulClient } from "@/lib/contentful"

export const maxDuration = 10 // Set maximum execution time to 10 seconds

export async function GET() {
  // Get environment variables status
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  // Check if environment variables are set
  const envVars = {
    spaceIdSet: Boolean(spaceId),
    accessTokenSet: Boolean(accessToken),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || "unknown",
  }

  // If environment variables are missing, return early
  if (!spaceId || !accessToken) {
    return NextResponse.json({
      envVars,
      connection: {
        success: false,
        error: "Missing environment variables",
      },
    })
  }

  // Test the connection with a timeout
  try {
    // Get the client
    const client = getContentfulClient()

    // Create a promise that rejects after a timeout
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Connection timed out")), 5000)
    })

    // Race the connection test against the timeout
    const response = (await Promise.race([client.getContentTypes({ limit: 1 }), timeout])) as any

    return NextResponse.json({
      envVars,
      connection: {
        success: true,
        contentTypesCount: response.total || 0,
      },
    })
  } catch (error) {
    console.error("Contentful connection test failed:", error)

    return NextResponse.json({
      envVars,
      connection: {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error connecting to Contentful",
      },
    })
  }
}
