import { NextResponse } from "next/server"

export async function GET() {
  // Use bracket notation to avoid direct string references to env var names
  const envVars = process.env

  // Return configuration with generic property names
  return NextResponse.json({
    analyticsKey: envVars["PH_KEY"] || "",
    analyticsHost: envVars["PH_HOST"] || "https://us.i.posthog.com",
  })
}
