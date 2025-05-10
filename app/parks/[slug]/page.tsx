import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import ContentfulImage from "@/components/contentful-image"
import RichTextRenderer from "@/components/rich-text-renderer"
import { getParkBySlug, getPageBanner } from "@/lib/api"
import { JsonLd } from "@/components/json-ld"
import PageHero from "@/components/page-hero"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const park = await getParkBySlug(params.slug)

  if (!park) {
    return {
      title: "Park Not Found",
      description: "The requested park could not be found.",
    }
  }

  return {
    title: `${park.fields.parkName} - Wildlife Photography Location | David Martin Photography`,
    description:
      park.fields.shortDescription || `Explore ${park.fields.parkName}, a wildlife photography location in Texas.`,
    openGraph: {
      title: `${park.fields.parkName} - Wildlife Photography Location | David Martin Photography`,
      description:
        park.fields.shortDescription || `Explore ${park.fields.parkName}, a wildlife photography location in Texas.`,
      images: [
        {
          url: park.fields.heroImage?.fields?.file?.url || "",
          width: 1200,
          height: 630,
          alt: park.fields.parkName,
        },
      ],
    },
  }
}

export default async function ParkPage({ params }: { params: { slug: string } }) {
  const park = await getParkBySlug(params.slug)

  // Fetch page banner for park detail page
  const pageBanner = await getPageBanner(`parks-detail-${params.slug}`)

  // If no specific banner for this park, try to get the generic parks-detail banner
  const genericBanner = !pageBanner ? await getPageBanner("parks-detail") : null

  if (!park) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Park Not Found</h1>
        <p className="mb-6">The requested park could not be found.</p>
        <Button asChild>
          <Link href="/parks">Back to Parks</Link>
        </Button>
      </div>
    )
  }

  // Get the hero image URL
  const heroImageUrl = park.fields.heroImage?.fields?.file?.url || "/placeholder.svg?key=park-hero"

  // Format address for display
  const address = park.fields.address || "Address not available"

  // Check if wildlifeSpecies is an array before using map
  const hasWildlifeSpecies = Array.isArray(park.fields.wildlifeSpecies) && park.fields.wildlifeSpecies.length > 0

  // Check if amenities is an array before using map
  const hasAmenities = Array.isArray(park.fields.amenities) && park.fields.amenities.length > 0

  // Check if photographySpots is an array before using map
  const hasPhotographySpots = Array.isArray(park.fields.photographySpots) && park.fields.photographySpots.length > 0

  return (
    <main className="min-h-screen">
      {/* Hero Section - Now using the PageHero component */}
      <PageHero
        title={park.fields.parkName}
        subtitle={park.fields.shortDescription}
        imageUrl={heroImageUrl}
        imageAlt={`${park.fields.parkName} - Wildlife Photography Location`}
        pageBanner={pageBanner || genericBanner}
      />

      {/* Park Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About {park.fields.parkName}</h2>
                {park.fields.description && <RichTextRenderer content={park.fields.description} />}
              </div>

              {/* Photography Tips */}
              {park.fields.photographyTips && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Photography Tips</h2>
                  <RichTextRenderer content={park.fields.photographyTips} />
                </div>
              )}

              {/* Photography Spots */}
              {hasPhotographySpots && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Best Photography Spots</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {park.fields.photographySpots.map((spot, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        {spot.image && (
                          <div className="relative h-48">
                            <ContentfulImage
                              src={spot.image.fields.file.url}
                              alt={spot.spotName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{spot.spotName}</h3>
                          <p className="text-muted-foreground">{spot.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {park.fields.galleryImages && park.fields.galleryImages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {park.fields.galleryImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <ContentfulImage
                          src={image.fields.file.url}
                          alt={image.fields.title || `${park.fields.parkName} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hours */}
              {park.fields.hours && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Hours</h2>
                  <RichTextRenderer content={park.fields.hours} />
                </div>
              )}

              {/* Entrance Fees */}
              {park.fields.entranceFees && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Entrance Fees</h2>
                  <RichTextRenderer content={park.fields.entranceFees} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-80 space-y-6">
              <div className="bg-accent/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{park.fields.parkName}</p>
                    <p className="text-muted-foreground whitespace-pre-line">{address}</p>
                  </div>
                </div>
                {park.fields.website && (
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <a href={park.fields.website} target="_blank" rel="noopener noreferrer">
                        Visit Official Website
                      </a>
                    </Button>
                  </div>
                )}

                {/* Map */}
                {park.fields.location && park.fields.location.lat && park.fields.location.lon && (
                  <div className="mt-4 aspect-video relative rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${park.fields.location.lat},${park.fields.location.lon}&zoom=12`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                      title={`Map showing location of ${park.fields.parkName}`}
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Park Info */}
              <div className="bg-accent/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Park Information</h3>

                {/* Best Times */}
                {park.fields.bestTimes && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <p className="font-medium">Best Season</p>
                    </div>
                    <p className="text-muted-foreground ml-8 mb-2">{park.fields.bestTimes.season || "Year-round"}</p>

                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <p className="font-medium">Best Time of Day</p>
                    </div>
                    <p className="text-muted-foreground ml-8 mb-2">{park.fields.bestTimes.timeOfDay || "Any time"}</p>

                    {park.fields.bestTimes.notes && (
                      <p className="text-muted-foreground ml-8">{park.fields.bestTimes.notes}</p>
                    )}
                  </div>
                )}

                {/* Difficulty */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    <p className="font-medium">Difficulty Level</p>
                  </div>
                  <p className="text-muted-foreground ml-8">{park.fields.difficultyLevel || "Beginner"}</p>
                </div>

                {/* Wildlife Species */}
                {hasWildlifeSpecies && (
                  <div>
                    <h4 className="font-medium mb-2">Notable Wildlife Species</h4>
                    <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                      {park.fields.wildlifeSpecies.map((species, index) => (
                        <li key={index}>{species}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Amenities */}
                {hasAmenities && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                      {park.fields.amenities.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Button asChild variant="outline">
              <Link href="/parks" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to All Parks
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Add structured data for the park */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          "@id": `https://daveypicsstudio.com/parks/${park.fields.slug}`,
          name: park.fields.parkName,
          description: park.fields.shortDescription,
          url: `https://daveypicsstudio.com/parks/${park.fields.slug}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: park.fields.address || "",
          },
          geo: park.fields.location
            ? {
                "@type": "GeoCoordinates",
                latitude: park.fields.location.lat,
                longitude: park.fields.location.lon,
              }
            : undefined,
          image: park.fields.heroImage?.fields?.file?.url || "",
        }}
      />
    </main>
  )
}
