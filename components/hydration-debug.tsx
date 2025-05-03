"use client"

import { useState, useEffect } from "react"

interface HydrationDebugProps {
  componentName: string
  data?: any
}

export default function HydrationDebug({ componentName, data }: HydrationDebugProps) {
  const [isClient, setIsClient] = useState(false)
  const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
    setRenderCount((prev) => prev + 1)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="my-2 p-2 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-xs">
      <h4 className="font-medium">Hydration Debug: {componentName}</h4>
      <div className="mt-1">
        <p>Rendering on: {isClient ? "Client" : "Server"}</p>
        <p>Client render count: {isClient ? renderCount : "N/A"}</p>
        {data && (
          <details>
            <summary className="cursor-pointer">Component Data</summary>
            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto max-h-40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
