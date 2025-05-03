import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { getAllGalleryCollections } from "@/lib/api"
import ContentfulImage from "@/components/contentful-image"

export const revalidate = 60 // Revalidate this page every 60 seconds

export const metadata: Metadata = {
  title: "Gallery | Wildlife Photography",
  description: "Explore wildlife photography collections by David Martin",
}

export default async function GalleryPage() {
  const collections = await getAllGalleryCollections()

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
            Explore collections of wildlife photography from various locations and subjects
          </p>
        </div>
      </section>

      {/* Gallery Collections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.sys.id}
                href={`/gallery/${collection.fields.slug}`}
                className="group block overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {collection.fields.coverImage ? (
                    <ContentfulImage
                      src={collection.fields.coverImage.fields.file.url}
                      alt={collection.fields.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                      <span className="text-muted-foreground">No cover image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{collection.fields.title}</h2>
                    <p className="text-white/80 line-clamp-2">
                      {collection.fields.description ||
                        `A collection of ${collection.fields.photos?.length || 0} photos`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
