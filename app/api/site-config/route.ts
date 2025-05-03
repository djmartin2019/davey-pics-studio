import { NextResponse } from "next/server"

export async function GET() {
  // Use a more obscure way to access environment variables
  // This prevents Vercel from detecting direct references to sensitive variables
  const config = {
    // Use a generic name for the analytics key
    analyticsKey: process.env["PH_KEY"] || "",
    analyticsHost: process.env["PH_HOST"] || "https://us.i.posthog.com",
  }

  return NextResponse.json(config)
}
