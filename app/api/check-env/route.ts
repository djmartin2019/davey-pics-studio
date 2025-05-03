import { NextResponse } from "next/server"

export async function GET() {
  // Only expose whether variables are set, not their values
  return NextResponse.json({
    spaceIdSet: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID),
    accessTokenSet: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
  })
}
