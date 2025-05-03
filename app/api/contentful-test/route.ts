import { NextResponse } from "next/server"
import { getContentfulClient } from "@/lib/contentful"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const detailed = url.searchParams.get("detailed") === "true"

  try {
    // Check environment variables
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

    if (!spaceId || !accessToken) {
      return NextResponse.json({
        success: false,
        message: "Missing Contentful credentials",
        env: {
          NEXT_PUBLIC_CONTENTFUL_SPACE_ID: Boolean(spaceId),
          CONTENTFUL_ACCESS_TOKEN: Boolean(accessToken),
        },
      })
    }

    // Get Contentful client
    const client = getContentfulClient()

    // Test connection with a simple query
    const contentTypesResponse = await client.getContentTypes({ limit: 10 })

    // If detailed mode, get more information
    let homepageFields = null
    let contentTypes = null

    if (detailed) {
      // Get content types
      contentTypes = contentTypesResponse.items.map((type) => ({
        id: type.sys.id,
        name: type.name,
        displayField: type.displayField,
      }))

      // Try to get homepage content
      try {
        const homepageResponse = await client.getEntries({
          content_type: "homepage",
          include: 2,
          limit: 1,
        })

        if (homepageResponse.items && homepageResponse.items.length > 0) {
          const homepage = homepageResponse.items[0]
          homepageFields = {
            availableFields: Object.keys(homepage.fields || {}),
            hasProcessImage: Boolean(homepage.fields?.processImage),
            processImageDetails: homepage.fields?.processImage
              ? {
                  hasFields: Boolean(homepage.fields.processImage.fields),
                  hasFile: Boolean(homepage.fields.processImage.fields?.file),
                  fileUrl: homepage.fields.processImage.fields?.file?.url || null,
                }
              : null,
          }
        } else {
          homepageFields = { error: "No homepage entries found" }
        }
      } catch (error) {
        homepageFields = { error: error instanceof Error ? error.message : "Unknown error" }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Contentful",
      env: {
        NEXT_PUBLIC_CONTENTFUL_SPACE_ID: Boolean(spaceId),
        CONTENTFUL_ACCESS_TOKEN: Boolean(accessToken),
      },
      contentTypes: contentTypes,
      homepageFields: homepageFields,
    })
  } catch (error) {
    console.error("Contentful test error:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      env: {
        NEXT_PUBLIC_CONTENTFUL_SPACE_ID: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID),
        CONTENTFUL_ACCESS_TOKEN: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
      },
    })
  }
}
