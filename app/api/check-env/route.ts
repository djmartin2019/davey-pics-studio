import { NextResponse } from "next/server"

export async function GET() {
  // Only expose whether variables are set, not their values
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  return NextResponse.json({
    spaceIdSet: Boolean(spaceId),
    accessTokenSet: Boolean(accessToken),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || "unknown",
    },
  })
}
