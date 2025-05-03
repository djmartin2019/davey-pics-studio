import { NextResponse } from "next/server"
import { isContentfulConfigured } from "@/lib/contentful"

export async function GET() {
  return NextResponse.json({
    spaceIdSet: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID),
    accessTokenSet: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
    isConfigured: isContentfulConfigured(),
  })
}
