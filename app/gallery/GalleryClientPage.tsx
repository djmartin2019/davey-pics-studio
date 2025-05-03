"use client"

import Image from "next/image"
import Link from "next/link"

import { getAllPhotos } from "@/lib/api"
import ContentfulImage from "@/components/contentful-image"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default async function GalleryClientPage() {
  const photos = await getAllPhotos()

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?key=50969"
            alt="Gallery concept"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Photo Gallery</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Explore wildlife photography from various locations and subjects
          </p>
        </div>
      </section>

      {/* Gallery Photos */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Display all photos in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.length === 0
              ? // Show skeletons if no photos are available
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="aspect-[4/3] relative overflow-hidden rounded-lg">
                      <Skeleton className="absolute inset-0 w-full h-full" />
                    </div>
                  ))
              : photos.map((photo) => (
                  <div
                    key={photo.sys.id}
                    className="group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => {}} // We'll implement a lightbox in the future
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {photo.fields.image ? (
                        <ContentfulImage
                          src={photo.fields.image.fields.file.url}
                          alt={photo.fields.title || "Wildlife photo"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-70 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform">
                        <h2 className="text-xl font-bold text-white mb-1">{photo.fields.title}</h2>
                        {photo.fields.location && <p className="text-white/80 text-sm">{photo.fields.location}</p>}
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Add a link to the full gallery view */}
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/gallery/photos">View Full Gallery</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
