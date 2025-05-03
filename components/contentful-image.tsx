import Image from "next/image"
import { getImageUrl } from "@/lib/contentful"

interface ContentfulImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  quality?: number
}

export default function ContentfulImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  quality = 80,
}: ContentfulImageProps) {
  // Handle empty src
  if (!src) {
    return null
  }

  // Process the Contentful image URL to add transformations
  const imageUrl = getImageUrl(src, {
    width: width || undefined,
    height: height || undefined,
    quality,
  })

  return (
    <Image
      src={imageUrl || "/placeholder.svg"}
      alt={alt || ""}
      width={fill ? undefined : width || 1200}
      height={fill ? undefined : height || 800}
      className={className || ""}
      priority={priority}
      fill={fill}
      sizes={fill ? "100vw" : undefined}
    />
  )
}
