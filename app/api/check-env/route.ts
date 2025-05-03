import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check for required environment variables
    const variables = {
      NEXT_PUBLIC_CONTENTFUL_SPACE_ID: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID),
      CONTENTFUL_ACCESS_TOKEN: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
      EMAIL_USER: Boolean(process.env.EMAIL_USER),
      EMAIL_PASSWORD: Boolean(process.env.EMAIL_PASSWORD),
    }

    return NextResponse.json({
      success: true,
      variables,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
