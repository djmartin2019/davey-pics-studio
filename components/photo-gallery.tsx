"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ContentfulImage from "./contentful-image"
import { getContentfulField } from "@/lib/contentful-utils"
import type { ContentfulGalleryItem } from "@/types/contentful"

interface PhotoGalleryProps {
  items: ContentfulGalleryItem[]
}

export default function PhotoGallery({ items }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [renderedItems, setRenderedItems] = useState<ContentfulGalleryItem[]>([])

  // Use useEffect to ensure we're only rendering on the client
  // This prevents hydration mismatches
  useEffect(() => {
    setIsClient(true)
    // Process the items to ensure each has valid data
    const processedItems = (items || []).map((item) => ({
      ...item,
      fields: {
        ...item.fields,
        // Ensure image URL is properly structured
        image: item.fields.image
          ? {
              ...item.fields.image,
              fields: {
                ...item.fields.image.fields,
                file: item.fields.image.fields.file
                  ? {
                      ...item.fields.image.fields.file,
                      // Ensure URL uses https protocol
                      url: item.fields.image.fields.file.url
                        ? item.fields.image.fields.file.url.replace(/^\/\//, "https://")
                        : null,
                    }
                  : null,
              },
            }
          : null,
      },
    }))
    setRenderedItems(processedItems)
  }, [items])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null || renderedItems.length === 0) return

    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? renderedItems.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === renderedItems.length - 1 ? 0 : selectedImage + 1)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") navigateImage("prev")
    if (e.key === "ArrowRight") navigateImage("next")
  }

  // On server or during hydration, render a placeholder grid
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderedItems.map((item, index) => {
          const imageUrl = getContentfulField(item, "fields.image.fields.file.url", null)
          const title = getContentfulField(item, "fields.title", "Untitled")
          const location = getContentfulField(item, "fields.location", "")

          return (
            <div
              key={`${item.sys?.id || index}`}
              className="group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <ContentfulImage
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  fallbackSrc="/nature-photography-collection.png"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <h3 className="text-white font-medium">{title}</h3>
                    {location && <p className="text-white/80 text-sm">{location}</p>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage("prev")
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-10"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage("next")
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="max-w-5xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/9] md:aspect-[3/2] w-full">
              {renderedItems[selectedImage] && (
                <ContentfulImage
                  src={getContentfulField(renderedItems[selectedImage], "fields.image.fields.file.url", null)}
                  alt={getContentfulField(renderedItems[selectedImage], "fields.title", "Gallery image")}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-4 absolute bottom-0 left-0 right-0">
              <h3 className="font-medium text-lg">
                {getContentfulField(renderedItems[selectedImage], "fields.title", "")}
              </h3>
              <p className="text-muted-foreground">
                {getContentfulField(renderedItems[selectedImage], "fields.description", "")}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-primary">
                  {getContentfulField(renderedItems[selectedImage], "fields.category.fields.name", "")}
                </span>
                <span className="text-muted-foreground">
                  {getContentfulField(renderedItems[selectedImage], "fields.location", "")}
                </span>
              </div>
              {renderedItems[selectedImage]?.fields?.metadata && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {renderedItems[selectedImage].fields.metadata.camera && (
                    <span className="mr-3">{renderedItems[selectedImage].fields.metadata.camera}</span>
                  )}
                  {renderedItems[selectedImage].fields.metadata.lens && (
                    <span className="mr-3">{renderedItems[selectedImage].fields.metadata.lens}</span>
                  )}
                  {renderedItems[selectedImage].fields.metadata.aperture && (
                    <span className="mr-3">f/{renderedItems[selectedImage].fields.metadata.aperture}</span>
                  )}
                  {renderedItems[selectedImage].fields.metadata.shutterSpeed && (
                    <span className="mr-3">{renderedItems[selectedImage].fields.metadata.shutterSpeed}s</span>
                  )}
                  {renderedItems[selectedImage].fields.metadata.iso && (
                    <span>ISO {renderedItems[selectedImage].fields.metadata.iso}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
