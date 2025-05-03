"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import ContentfulImage from "./contentful-image"
import type { ContentfulGalleryItem } from "@/types/contentful"

interface PhotoGalleryProps {
  items: ContentfulGalleryItem[]
}

export default function PhotoGallery({ items }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return

    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? items.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === items.length - 1 ? 0 : selectedImage + 1)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") navigateImage("prev")
    if (e.key === "ArrowRight") navigateImage("next")
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No gallery items found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={item.sys.id}
            className="group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              {item.fields.image?.fields.file.url ? (
                <ContentfulImage
                  src={item.fields.image.fields.file.url}
                  alt={item.fields.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <h3 className="text-white font-medium">{item.fields.title}</h3>
                  <p className="text-white/80 text-sm">{item.fields.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
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
              {items[selectedImage]?.fields.image?.fields.file.url ? (
                <ContentfulImage
                  src={items[selectedImage].fields.image.fields.file.url}
                  alt={items[selectedImage].fields.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <span className="text-white">Image not available</span>
                </div>
              )}
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-4 absolute bottom-0 left-0 right-0">
              <h3 className="font-medium text-lg">{items[selectedImage]?.fields.title}</h3>
              <p className="text-muted-foreground">{items[selectedImage]?.fields.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-primary">{items[selectedImage]?.fields.category?.fields.name}</span>
                <span className="text-muted-foreground">{items[selectedImage]?.fields.location}</span>
              </div>
              {items[selectedImage]?.fields.metadata && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {items[selectedImage].fields.metadata.camera && (
                    <span className="mr-3">{items[selectedImage].fields.metadata.camera}</span>
                  )}
                  {items[selectedImage].fields.metadata.lens && (
                    <span className="mr-3">{items[selectedImage].fields.metadata.lens}</span>
                  )}
                  {items[selectedImage].fields.metadata.aperture && (
                    <span className="mr-3">f/{items[selectedImage].fields.metadata.aperture}</span>
                  )}
                  {items[selectedImage].fields.metadata.shutterSpeed && (
                    <span className="mr-3">{items[selectedImage].fields.metadata.shutterSpeed}s</span>
                  )}
                  {items[selectedImage].fields.metadata.iso && (
                    <span>ISO {items[selectedImage].fields.metadata.iso}</span>
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
