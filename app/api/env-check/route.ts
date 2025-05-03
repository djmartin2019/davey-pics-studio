import { NextResponse } from "next/server"

export async function GET() {
  // Create a safe response that doesn't expose actual values
  return NextResponse.json({
    spaceId: {
      name: "NEXT_PUBLIC_CONTENTFUL_SPACE_ID",
      defined: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID),
    },
    accessToken: {
      name: "CONTENTFUL_ACCESS_TOKEN",
      defined: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || "unknown",
    },
  })
}
