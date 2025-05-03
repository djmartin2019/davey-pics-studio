import type { Metadata } from "next"
import { Mail, MapPin, Instagram } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ContactForm from "@/components/contact-form"
import ContentfulImage from "@/components/contentful-image"
import { getContactPageData } from "@/lib/api"
import { JsonLd } from "@/components/json-ld"

// Import Suspense
import { Suspense } from "react"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await getContactPageData()

  return {
    title: "Contact Houston Wildlife Photographer | David Martin - Humble, TX",
    description:
      "Get in touch with David Martin, professional wildlife photographer based in Humble, Texas. Inquire about prints, workshops, or photography services in the Houston area.",
    openGraph: {
      title: "Contact Houston Wildlife Photographer | David Martin - Humble, TX",
      description:
        "Get in touch with David Martin, professional wildlife photographer based in Humble, Texas. Inquire about prints, workshops, or photography services in the Houston area.",
    },
  }
}

export default async function ContactPage() {
  const contactPage = await getContactPageData()

  // Extract fields with fallbacks
  const title = contactPage?.fields?.title || "Contact Houston Wildlife Photographer"
  const subtitle =
    contactPage?.fields?.subtitle ||
    "Get in touch about wildlife photography prints, workshops, or services in the Houston area"
  const heroImage = contactPage?.fields?.heroImage?.fields?.file?.url || "/placeholder.svg?key=tja72"

  // Contact info - could also come from Contentful
  const email = "daveypicsstudio@gmail.com"
  const instagramHandle = "davey.pics"
  const location = "Humble, Texas (Greater Houston Area)"

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ContentfulImage
            src={heroImage}
            alt="Contact Houston wildlife photographer David Martin - Based in Humble, Texas"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{subtitle}</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Houston Wildlife Photographer Contact Information</h2>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-muted-foreground mb-1">For inquiries and collaborations</p>
                    <a href={`mailto:${email}`} className="text-primary hover:underline">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Instagram className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Instagram</h3>
                    <p className="text-muted-foreground mb-1">Follow my latest work</p>
                    <a
                      href={`https://instagram.com/${instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @{instagramHandle}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Location</h3>
                    <p className="text-muted-foreground mb-1">Based in</p>
                    <p>{location}</p>
                  </div>
                </div>
              </div>

              <div className="aspect-video relative rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110398.95796898!2d-95.33553148359373!3d29.99880000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b9c2bd6c3cf3%3A0x96186793d3c8c10f!2sHumble%2C%20TX!5e0!3m2!1sen!2sus!4v1651597022215!5m2!1sen!2sus"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Map showing Humble, Texas location of wildlife photographer David Martin"
                ></iframe>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="pt-6">
                  <Suspense fallback={<div className="p-4 text-center">Loading contact form...</div>}>
                    <ContactForm />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Do you sell prints of your Houston wildlife photographs?</h3>
              <p className="text-muted-foreground">
                I currently do not have a process for selling prints. However, if you would like to purchase any of my
                work, I would love to chat with you further!
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Do you offer wildlife photography workshops in Houston?</h3>
              <p className="text-muted-foreground">
                I currently do not host any workshops, but if you're interested please reach out and let me know!
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Where are you located?</h3>
              <p className="text-muted-foreground">
                I'm based in Humble, Texas, which is part of the Greater Houston area. This central location allows me
                to easily access wildlife photography locations throughout Southeast Texas.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Can I license your photos for commercial use?</h3>
              <p className="text-muted-foreground">
                Yes, licensing options are available for commercial and editorial use of my Houston wildlife
                photography. Please contact me with details about your project for custom licensing quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Add structured data for local business */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://daveypicsstudio.com/#business",
          name: "David Martin Wildlife Photography",
          description:
            "Professional wildlife photography services in Houston and Humble, Texas, specializing in bird and nature photography.",
          url: "https://daveypicsstudio.com",
          telephone: "+12815551234",
          email: "daveypicsstudio@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "123 Wildlife Way",
            addressLocality: "Humble",
            addressRegion: "TX",
            postalCode: "77338",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 29.9988,
            longitude: -95.2622,
          },
          areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
              "@type": "GeoCoordinates",
              latitude: 29.7604,
              longitude: -95.3698,
            },
            geoRadius: "80000",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "17:00",
            },
          ],
          sameAs: ["https://www.instagram.com/davey.pics/", "https://www.facebook.com/daveypicsstudio"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Wildlife Photography Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Fine Art Prints",
                  description: "High-quality prints of Houston wildlife photography",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Photography Workshops",
                  description: "Guided wildlife photography workshops in Houston area",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Custom Photography Projects",
                  description: "Specialized wildlife photography services for publications and businesses",
                },
              },
            ],
          },
        }}
      />
    </main>
  )
}
