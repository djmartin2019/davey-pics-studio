import type { Metadata } from "next"
import { getAllPhotos, getPageBanner } from "@/lib/api"
import ContentfulImage from "@/components/contentful-image"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import PageHero from "@/components/page-hero"

export const revalidate = 60 // Revalidate this page every 60 seconds

export const metadata: Metadata = {
  title: "Gallery | Wildlife Photography",
  description: "Explore wildlife photography by David Martin",
}

export default async function GalleryPage() {
  // Fetch photos directly from Contentful
  const photos = await getAllPhotos()

  // Fetch page banner for gallery page
  const pageBanner = await getPageBanner("gallery")

  // Get the first photo's image for the hero section if available
  const heroImageUrl = photos.length > 0 && photos[0].fields.image ? photos[0].fields.image.fields.file.url : null

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Now using the PageHero component */}
      <PageHero
        title="Photo Gallery"
        subtitle="Explore wildlife photography from various locations and subjects"
        imageUrl={heroImageUrl}
        imageAlt="Featured gallery image"
        pageBanner={pageBanner}
      />

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
                  <div key={photo.sys.id} className="group cursor-pointer overflow-hidden rounded-lg">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform">
                        <h2 className="text-xl font-bold text-white mb-1">{photo.fields.title}</h2>
                        {photo.fields.location && <p className="text-white/80 text-sm">{photo.fields.location}</p>}
                        {photo.fields.date && (
                          <p className="text-white/60 text-xs mt-1">{formatDate(photo.fields.date)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Show message if no photos are available */}
          {photos.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                No photos available. Add some photos in Contentful to get started.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
