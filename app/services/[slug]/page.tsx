import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, DollarSign, MapPin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import ContentfulImage from "@/components/contentful-image"
import RichTextRenderer from "@/components/rich-text-renderer"
import { getServiceBySlug, getAllServices } from "@/lib/api"
import { JsonLd } from "@/components/json-ld"

export const revalidate = 60 // Revalidate this page every 60 seconds

// Generate static params for all services
export async function generateStaticParams() {
  const services = await getAllServices()
  return services.map((service) => ({
    slug: service.fields.slug,
  }))
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    }
  }

  return {
    title: `${service.fields.serviceName} | Wildlife Photography`,
    description: service.fields.shortDescription,
    openGraph: {
      title: `${service.fields.serviceName} | Wildlife Photography`,
      description: service.fields.shortDescription,
      images: [
        {
          url: service.fields.featuredImage?.fields?.file?.url || "",
          width: 1200,
          height: 630,
          alt: service.fields.serviceName,
        },
      ],
    },
  }
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  const {
    serviceName,
    shortDescription,
    detailedDescription,
    featuredImage,
    galleryImages,
    serviceCategory,
    duration,
    price,
    locationType,
    whatsIncluded,
    requirements,
    availability,
    bookingInformation,
    testimonials,
  } = service.fields

  const isPrintService = serviceCategory === "Print Sales"

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {featuredImage?.fields?.file?.url ? (
            <ContentfulImage
              src={featuredImage.fields.file.url}
              alt={serviceName}
              fill
              priority
              className="object-cover brightness-[0.7]"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Button variant="outline" size="sm" asChild className="w-fit mb-6">
            <Link href="/services" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Publications & Prints
            </Link>
          </Button>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">{serviceName}</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{shortDescription}</p>
        </div>
      </section>

      {/* Print Availability Notice - Only show for print services */}
      {isPrintService && (
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <Alert className="bg-primary/10 border-primary/20">
              <InfoIcon className="h-5 w-5 text-primary" />
              <AlertTitle>Print Availability</AlertTitle>
              <AlertDescription>
                Official print offerings are not yet available for online purchase. If you're interested in purchasing
                this print, please use the contact form to inquire about availability and pricing.
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Service Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">About {isPrintService ? "This Print" : "This Publication"}</h2>

              {detailedDescription && (
                <div className="prose max-w-none mb-12">
                  <RichTextRenderer content={detailedDescription} />
                </div>
              )}

              {/* Gallery Images */}
              {galleryImages && galleryImages.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <ContentfulImage
                          src={image.fields.file.url}
                          alt={`${serviceName} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included - Only show for relevant services */}
              {whatsIncluded && !isPrintService && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">What's Included</h3>
                  <div className="prose max-w-none">
                    <RichTextRenderer content={whatsIncluded} />
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {testimonials && testimonials.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Testimonials</h3>
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-accent/5 p-6 rounded-lg">
                        <p className="italic mb-4">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-3">
                          {testimonial.image && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <ContentfulImage
                                src={testimonial.image.fields.file.url}
                                alt={testimonial.author}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{testimonial.author}</p>
                            {testimonial.location && (
                              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-6 rounded-lg sticky top-24">
                <h3 className="text-xl font-bold mb-6">Details</h3>
                <div className="space-y-4">
                  {/* Service Category */}
                  <div className="flex items-start gap-3">
                    <Tag className="text-primary h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">{isPrintService ? "Fine Art Print" : "Publication"}</p>
                    </div>
                  </div>

                  {/* Duration - Only for non-print services */}
                  {duration && !isPrintService && (
                    <div className="flex items-start gap-3">
                      <Clock className="text-primary h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-muted-foreground">{duration}</p>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  {price && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="text-primary h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Price</p>
                        <p className="text-muted-foreground">
                          {isPrintService
                            ? "Contact for pricing"
                            : `${price.amount} ${price.currency}${price.unit ? ` / ${price.unit}` : ""}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Location Type */}
                  {locationType && !isPrintService && (
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{locationType}</p>
                      </div>
                    </div>
                  )}

                  {/* Requirements - Only for non-print services */}
                  {requirements && !isPrintService && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="prose prose-sm max-w-none">
                        <RichTextRenderer content={requirements} />
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {availability && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Availability</h4>
                      <div className="prose prose-sm max-w-none">
                        <RichTextRenderer content={availability} />
                      </div>
                    </div>
                  )}

                  {/* Booking Information */}
                  {bookingInformation && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Booking Information</h4>
                      <div className="prose prose-sm max-w-none">
                        <RichTextRenderer content={bookingInformation} />
                      </div>
                    </div>
                  )}

                  {/* Contact Button */}
                  <div className="mt-8">
                    <Button asChild className="w-full">
                      <Link href="/contact">
                        {isPrintService ? "Inquire About This Print" : "Contact About This Publication"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add structured data */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": isPrintService ? "Product" : "CreativeWork",
          name: serviceName,
          description: shortDescription,
          image: featuredImage?.fields?.file?.url || "",
          ...(isPrintService
            ? {
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  price: price?.amount || "0",
                  priceCurrency: price?.currency || "USD",
                },
              }
            : {
                author: {
                  "@type": "Person",
                  name: "David Martin",
                },
                publisher: {
                  "@type": "Organization",
                  name: "David Martin Wildlife Photography",
                },
              }),
        }}
      />
    </main>
  )
}
