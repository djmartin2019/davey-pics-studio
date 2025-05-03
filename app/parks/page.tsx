import type { Metadata } from "next"
import { getAllParks } from "@/lib/api"
import ContentfulImage from "@/components/contentful-image"
import ParkCard from "@/components/park-card"
import { Skeleton } from "@/components/ui/skeleton"
import { JsonLd } from "@/components/json-ld"

export const revalidate = 60 // Revalidate this page every 60 seconds

export const metadata: Metadata = {
  title: "Photography Locations | Wildlife Photography Parks",
  description: "Explore the best wildlife photography locations in Houston and beyond",
}

export default async function ParksPage() {
  // Fetch parks from Contentful
  const parks = await getAllParks()

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {parks.length > 0 && parks[0].fields.heroImage ? (
            <ContentfulImage
              src={parks[0].fields.heroImage.fields.file.url}
              alt="Wildlife photography locations"
              fill
              priority
              className="object-cover brightness-[0.7]"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No featured image available</span>
            </div>
          )}
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Photography Locations</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Discover the best parks and wildlife areas for photography in Houston and beyond
          </p>
        </div>
      </section>

      {/* Parks Listing */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Display all parks in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parks.length === 0
              ? // Show skeletons if no parks are available
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border border-border">
                      <div className="aspect-[16/9] relative">
                        <Skeleton className="absolute inset-0 w-full h-full" />
                      </div>
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))
              : parks.map((park) => <ParkCard key={park.sys.id} park={park} />)}
          </div>

          {/* Show message if no parks are available */}
          {parks.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">No parks available. Add some parks in Contentful to get started.</p>
            </div>
          )}
        </div>
      </section>

      {/* Add structured data for the collection of parks */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: parks.map((park, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Place",
              name: park.fields.parkName,
              description: park.fields.shortDescription,
              url: `https://daveypicsstudio.com/parks/${park.fields.slug}`,
              image: park.fields.heroImage?.fields?.file?.url || "",
              address: {
                "@type": "PostalAddress",
                streetAddress: park.fields.address,
              },
            },
          })),
        }}
      />
    </main>
  )
}
