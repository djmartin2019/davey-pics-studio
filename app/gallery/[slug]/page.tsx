import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import PhotoGallery from "@/components/photo-gallery"
import ContentfulDebugImage from "@/components/contentful-debug-image"
import { getGalleryCollectionBySlug, getPageBanner } from "@/lib/api"
import { getContentfulField } from "@/lib/contentful-utils"
import PageHero from "@/components/page-hero"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateStaticParams() {
  try {
    // We only have one virtual collection now
    return [{ slug: "photos" }]
  } catch (error) {
    console.error("Error generating static params for gallery collections:", error)
    // Return an empty array to prevent build failures
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = await getGalleryCollectionBySlug(params.slug)

  if (!collection) {
    return {
      title: "Gallery Not Found",
      description: "The requested gallery collection could not be found.",
    }
  }

  return {
    title: `${collection.fields.title} | Wildlife Photography Gallery`,
    description: collection.fields.description || `A collection of wildlife photography by David Martin`,
  }
}

export default async function GalleryCollectionPage({ params }: { params: { slug: string } }) {
  const collection = await getGalleryCollectionBySlug(params.slug)

  // Fetch page banner for gallery detail page
  const pageBanner = await getPageBanner(`gallery-detail-${params.slug}`)

  // If no specific banner for this gallery, try to get the generic gallery-detail banner
  const genericBanner = !pageBanner ? await getPageBanner("gallery-detail") : null

  if (!collection) {
    notFound()
  }

  // Ensure photos array is always defined
  const photos = getContentfulField(collection, "fields.photos", [])

  // Get cover image URL safely
  const coverImageUrl = getContentfulField(collection, "fields.coverImage.fields.file.url", "")

  // Only show debug component in development
  const showDebugInfo = process.env.NODE_ENV === "development"

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Now using the PageHero component */}
      <PageHero
        title={collection.fields.title}
        subtitle={collection.fields.description || ""}
        imageUrl={coverImageUrl}
        imageAlt={collection.fields.title}
        pageBanner={pageBanner || genericBanner}
      />

      {/* Debug information in development */}
      {showDebugInfo && (
        <div className="container mx-auto px-4 mt-4">
          <ContentfulDebugImage imageUrl={coverImageUrl} alt={`Cover image for ${collection.fields.title}`} />
        </div>
      )}

      {/* Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6 w-fit">
            <Link href="/gallery" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Gallery
            </Link>
          </Button>

          <PhotoGallery items={photos} />
        </div>
      </section>
    </main>
  )
}
