import { NextResponse } from "next/server"
import { getContentfulClient, isContentfulConfigured } from "@/lib/contentful"

export async function GET() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  // Check environment variables
  const envVars = {
    spaceId: Boolean(spaceId),
    accessToken: Boolean(accessToken),
  }

  // Initialize results
  const results: any = {
    envVars,
    connection: { success: false },
    contentTypes: { success: false },
    entries: { success: false },
    rawResponse: null,
  }

  // If environment variables are missing, return early
  if (!isContentfulConfigured()) {
    return NextResponse.json({
      ...results,
      connection: {
        success: false,
        error: "Missing environment variables",
      },
    })
  }

  try {
    // Get Contentful client
    const client = getContentfulClient()

    // Test connection by getting content types
    const contentTypesResponse = await client.getContentTypes()
    results.connection.success = true
    results.rawResponse = contentTypesResponse

    // Get content types
    if (contentTypesResponse.items.length > 0) {
      results.contentTypes = {
        success: true,
        types: contentTypesResponse.items.map((type) => ({
          name: type.name,
          sys: type.sys,
        })),
      }
    } else {
      results.contentTypes = {
        success: false,
        error: "No content types found",
      }
    }

    // Try to get some entries
    try {
      const entriesResponse = await client.getEntries({
        limit: 5,
      })

      results.entries = {
        success: true,
        count: entriesResponse.total,
        sample: entriesResponse.items.map((item) => ({
          id: item.sys.id,
          contentType: item.sys.contentType?.sys.id,
          updatedAt: item.sys.updatedAt,
          fields: Object.keys(item.fields),
        })),
      }
    } catch (entriesError) {
      results.entries = {
        success: false,
        error: entriesError instanceof Error ? entriesError.message : "Unknown error fetching entries",
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({
      ...results,
      connection: {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error connecting to Contentful",
      },
    })
  }
}
