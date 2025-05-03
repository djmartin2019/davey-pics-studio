"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

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
}: ContentfulImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to ensure client-side only execution
  // This prevents hydration mismatches by ensuring consistent rendering
  useEffect(() => {
    setIsClient(true)

    if (!src) {
      setImageSrc(fallbackSrc)
      setIsLoading(false)
      return
    }

    // Process the URL on the client side
    try {
      // Check if this is a Contentful URL (contains ctfassets.net)
      // Only process Contentful URLs, leave relative URLs as they are
      if (src.includes("ctfassets.net")) {
        // Ensure URL has proper protocol
        const urlStr = src.startsWith("//") ? `https:${src}` : src
        const url = new URL(urlStr)

        // Add image optimization parameters
        if (width) url.searchParams.set("w", width.toString())
        if (height) url.searchParams.set("h", height.toString())
        if (quality) url.searchParams.set("q", quality.toString())
        url.searchParams.set("fm", "webp") // Use WebP format for better performance

        setImageSrc(url.toString())
      } else {
        // For relative URLs or other non-Contentful URLs, use as is
        setImageSrc(src)
      }
    } catch (err) {
      console.error("Error processing image URL:", src, err)
      setImageSrc(fallbackSrc)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [src, width, height, quality, fallbackSrc])

  // Server-side and initial client render - show skeleton
  if (!isClient || isLoading) {
    return (
      <Skeleton
        className={`${className} ${fill ? "absolute inset-0" : ""}`}
        style={!fill ? { width: width || 300, height: height || 200 } : undefined}
      />
    )
  }

  // Return the image once we have the URL on the client
  return (
    <Image
      src={imageSrc || "/placeholder.svg"}
      alt={alt || ""}
      width={fill ? undefined : width || 1200}
      height={fill ? undefined : height || 800}
      className={`${className} ${error ? "opacity-70" : ""}`}
      priority={priority}
      fill={fill}
      sizes={fill ? "100vw" : undefined}
      onError={() => {
        if (imageSrc !== fallbackSrc) {
          console.warn("Image failed to load:", imageSrc)
          setError(true)
          setImageSrc(fallbackSrc)
        }
      }}
    />
  )
}
