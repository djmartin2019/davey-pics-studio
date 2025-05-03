"use client"

import { useState, useEffect } from "react"
import { getContentfulField } from "@/lib/contentful-utils"
import ContentfulImage from "./contentful-image"
import { Skeleton } from "@/components/ui/skeleton"
import type { ContentfulGalleryItem } from "@/types/contentful"

interface HomePageGalleryProps {
  items: ContentfulGalleryItem[]
}

export default function HomePageGallery({ items }: HomePageGalleryProps) {
  const [isClient, setIsClient] = useState(false)
  const [renderedItems, setRenderedItems] = useState<ContentfulGalleryItem[]>([])

  // Use useEffect to ensure we're only rendering on the client
  useEffect(() => {
    setIsClient(true)
    // Process the items to ensure each has valid data
    const processedItems = (items || []).filter((item) => item && item.fields)
    setRenderedItems(processedItems)
  }, [items])

  // Render a consistent placeholder grid on server and during hydration
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(items.length || 3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="aspect-[4/3] relative">
              <Skeleton className="absolute inset-0 w-full h-full" />
            </div>
          ))}
      </div>
    )
  }

  // If no items are available after client-side processing
  if (renderedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No gallery items available.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderedItems.map((item, index) => {
        const imageUrl = getContentfulField(item, "fields.image.fields.file.url", null)
        const title = getContentfulField(item, "fields.title", "Untitled")
        const location = getContentfulField(item, "fields.location", "")

        return (
          <div key={`${item.sys?.id || index}`} className="group overflow-hidden rounded-lg">
            <div className="aspect-[4/3] relative overflow-hidden">
              <ContentfulImage
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
                fallbackSrc="/nature-photography-collection.png"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-medium">{title}</h3>
                  {location && <p className="text-white/80 text-sm">{location}</p>}
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 transition-all duration-300 rounded-lg"></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
