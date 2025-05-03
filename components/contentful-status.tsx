"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react"

export default function ContentfulStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      // Use the API route to check status
      const response = await fetch("/api/contentful-status")
      const data = await response.json()

      if (data.isConfigured) {
        setStatus("connected")
      } else {
        // Fallback to API check if needed
        const testResponse = await fetch("/api/contentful-test")
        const testData = await testResponse.json()

        if (testData.connection.success) {
          setStatus("connected")
        } else {
          setStatus("error")
        }
      }
    } catch (error) {
      console.error("Error checking Contentful connection:", error)
      setStatus("error")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "loading" || isChecking ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
          <span>Checking Contentful connection...</span>
        </>
      ) : status === "connected" ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Connected to Contentful</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Contentful connection error</span>
        </>
      )}

      <Button variant="ghost" size="sm" className="h-6 px-2" onClick={checkConnection} disabled={isChecking}>
        <RefreshCw className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
