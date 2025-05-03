"use client"

import { useEffect, useState } from "react"

export default function EnvStatus() {
  const [envVars, setEnvVars] = useState({
    spaceId: false,
    accessToken: false,
  })

  useEffect(() => {
    async function checkEnvVars() {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()
        setEnvVars({
          spaceId: data.spaceIdSet,
          accessToken: data.accessTokenSet,
        })
      } catch (error) {
        console.error("Failed to check environment variables:", error)
      }
    }

    checkEnvVars()
  }, [])

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50 bg-yellow-100 text-yellow-800 p-4 rounded shadow-lg">
      <h3 className="font-bold">Environment Variables Status:</h3>
      <ul className="mt-2 text-sm">
        <li>SPACE_ID: {envVars.spaceId ? "✅ Set" : "❌ Not set"}</li>
        <li>ACCESS_TOKEN: {envVars.accessToken ? "✅ Set" : "❌ Not set"}</li>
      </ul>
    </div>
  )
}
