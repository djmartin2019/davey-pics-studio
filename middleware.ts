import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Only in development, set flags to indicate if env vars are set
  // This is safe because we're not exposing the actual values
  if (process.env.NODE_ENV === "development") {
    response.headers.set("x-contentful-space-id-set", process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ? "true" : "false")
    response.headers.set("x-contentful-access-token-set", process.env.CONTENTFUL_ACCESS_TOKEN ? "true" : "false")
  }

  return response
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
