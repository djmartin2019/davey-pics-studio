"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function EnvStatus() {
  const [envVars, setEnvVars] = useState({
    spaceIdSet: false,
    accessTokenSet: false,
    isLoading: true,
  })

  useEffect(() => {
    async function checkEnvVars() {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()
        setEnvVars({
          spaceIdSet: data.spaceIdSet,
          accessTokenSet: data.accessTokenSet,
          isLoading: false,
        })
      } catch (error) {
        console.error("Failed to check environment variables:", error)
        setEnvVars((prev) => ({ ...prev, isLoading: false }))
      }
    }

    checkEnvVars()
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  if (envVars.isLoading) {
    return (
      <div className="fixed top-20 right-4 z-50 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded shadow-lg">
        <h3 className="font-bold flex items-center gap-2">
          <AlertTriangle size={16} />
          Checking environment variables...
        </h3>
      </div>
    )
  }

  // If all environment variables are set, don't show the status
  if (envVars.spaceIdSet && envVars.accessTokenSet) {
    return null
  }

  return (
    <Alert
      variant="warning"
      className="fixed top-20 right-4 z-50 w-80 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700"
    >
      <AlertTitle className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Missing Environment Variables
      </AlertTitle>
      <AlertDescription>
        <ul className="mt-2 text-sm space-y-1">
          <li className="flex items-center justify-between">
            <span>NEXT_PUBLIC_CONTENTFUL_SPACE_ID:</span>
            {envVars.spaceIdSet ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <XCircle size={16} className="text-red-600" />
            )}
          </li>
          <li className="flex items-center justify-between">
            <span>CONTENTFUL_ACCESS_TOKEN:</span>
            {envVars.accessTokenSet ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <XCircle size={16} className="text-red-600" />
            )}
          </li>
        </ul>
        <p className="mt-2 text-xs">Check your .env.local file or Vercel environment variables.</p>
      </AlertDescription>
    </Alert>
  )
}
