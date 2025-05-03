"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { processContentfulImageUrl } from "@/lib/image-utils"

interface ContentfulImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  quality?: number
  fallbackSrc?: string
  debug?: boolean
}

export default function ContentfulImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  quality = 80,
  fallbackSrc = "/placeholder.svg",
  debug = false,
}: ContentfulImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Process the URL on both server and client consistently
  const processedSrc = processContentfulImageUrl(src, {
    width,
    height,
    quality,
    fallback: fallbackSrc,
  })

  // Use useEffect to mark when component is mounted on client
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Render the same skeleton on both server and client initially
  if (!isLoaded) {
    return (
      <Skeleton
        className={`${className} ${fill ? "absolute inset-0" : ""}`}
        style={!fill && width && height ? { width, height } : undefined}
      />
    )
  }

  // Only render the actual image on the client after hydration
  return (
    <Image
      src={processedSrc || "/placeholder.svg"}
      alt={alt || ""}
      width={fill ? undefined : width || 1200}
      height={fill ? undefined : height || 800}
      className={`${className} ${error ? "opacity-70" : ""}`}
      priority={priority}
      fill={fill}
      sizes={fill ? "100vw" : undefined}
      onError={() => {
        if (processedSrc !== fallbackSrc) {
          console.warn("Image failed to load:", processedSrc)
          setError(true)
        }
      }}
    />
  )
}
