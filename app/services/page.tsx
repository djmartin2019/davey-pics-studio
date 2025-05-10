import type { Metadata } from "next"
import { getAllServices, getPageBanner } from "@/lib/api"
import ServiceCard from "@/components/service-card"
import { Skeleton } from "@/components/ui/skeleton"
import { JsonLd } from "@/components/json-ld"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import PageHero from "@/components/page-hero"

export const revalidate = 60 // Revalidate this page every 60 seconds

export const metadata: Metadata = {
  title: "Publications & Prints | Wildlife Photography",
  description: "Explore my wildlife photography publications and print offerings",
}

export default async function ServicesPage() {
  // Fetch services from Contentful
  const allServices = await getAllServices()

  // Fetch page banner for services page
  const pageBanner = await getPageBanner("services")

  // Filter services to only include Publications and Prints
  const services = allServices.filter(
    (service) => service.fields.serviceCategory === "Print Sales" || service.fields.serviceCategory === "Publication",
  )

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Now using the PageHero component */}
      <PageHero
        title="Publications & Prints"
        subtitle="Explore my wildlife photography publications and fine art print offerings"
        imageUrl={
          services.length > 0 && services[0].fields.featuredImage
            ? services[0].fields.featuredImage.fields.file.url
            : "/placeholder.svg?key=publications-prints"
        }
        imageAlt="Wildlife photography publications and prints"
        pageBanner={pageBanner}
      />

      {/* Print Availability Notice */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Alert className="bg-primary/10 border-primary/20">
            <InfoIcon className="h-5 w-5 text-primary" />
            <AlertTitle>Print Availability</AlertTitle>
            <AlertDescription>
              Official print offerings are not yet available for online purchase. If you're interested in purchasing a
              print, please use the contact form to inquire about availability and pricing.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Services Listing */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Display publications and prints in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length === 0
              ? // Show skeletons if no services are available
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
              : services.map((service) => <ServiceCard key={service.sys.id} service={service} />)}
          </div>

          {/* Show message if no services are available */}
          {services.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                No publications or prints available yet. Please check back soon or contact me for custom inquiries.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Add structured data for the collection of services */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: service.fields.serviceName,
              description: service.fields.shortDescription,
              url: `https://daveypicsstudio.com/services/${service.fields.slug}`,
              provider: {
                "@type": "Person",
                name: "David Martin",
                url: "https://daveypicsstudio.com",
              },
              offers: service.fields.price
                ? {
                    "@type": "Offer",
                    price: service.fields.price.amount,
                    priceCurrency: service.fields.price.currency,
                  }
                : undefined,
            },
          })),
        }}
      />
    </main>
  )
}
