import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail, MapPin } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import BlogPostCard from "@/components/blog-post-card"
import ContactForm from "@/components/contact-form"
import ContentfulImage from "@/components/contentful-image"
import ContentfulFallback from "@/components/contentful-fallback"
import { getHomepage, getAllBlogPosts, getPhotographerInfo, getFeaturedParks, getFeaturedServices } from "@/lib/api"
import { isContentfulConfigured } from "@/lib/contentful"
import { JsonLd } from "@/components/json-ld"
import ParkCard from "@/components/park-card"
import ServiceCard from "@/components/service-card"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()

  return {
    title: "Houston Wildlife Photography | David Martin - Humble, Texas",
    description:
      "Award-winning Houston wildlife photography by David Martin. Specializing in birds and wildlife photography throughout Texas. Based in Humble, TX.",
    openGraph: {
      title: "Houston Wildlife Photography | David Martin - Humble, Texas",
      description:
        "Award-winning Houston wildlife photography by David Martin. Specializing in birds and wildlife photography throughout Texas. Based in Humble, TX.",
    },
  }
}

// Sample data to use as fallback when Contentful data is not available
const sampleBlogPosts = [
  {
    sys: { id: "sample1" },
    fields: {
      title: "The Art of Bird Photography in Low Light",
      excerpt: "Techniques for capturing stunning avian images during dawn and dusk hours.",
      publishDate: new Date().toISOString(),
      slug: "bird-photography-low-light",
      featuredImage: { fields: { file: { url: "/placeholder.svg?key=lhed4" } } },
      categories: [{ fields: { name: "Photography" } }, { fields: { name: "Birds" } }],
    },
  },
  {
    sys: { id: "sample2" },
    fields: {
      title: "Technology in Wildlife Conservation",
      excerpt: "How modern tech is helping us understand and protect bird populations.",
      publishDate: new Date().toISOString(),
      slug: "technology-wildlife-conservation",
      featuredImage: { fields: { file: { url: "/placeholder.svg?key=jv7rb" } } },
      categories: [{ fields: { name: "Technology" } }, { fields: { name: "Conservation" } }],
    },
  },
  {
    sys: { id: "sample3" },
    fields: {
      title: "Ethical Wildlife Photography",
      excerpt: "Guidelines for responsible photography that respects animal habitats.",
      publishDate: new Date().toISOString(),
      slug: "ethical-wildlife-photography",
      featuredImage: { fields: { file: { url: "/placeholder.svg?key=8cg3i" } } },
      categories: [{ fields: { name: "Ethics" } }, { fields: { name: "Wildlife" } }],
    },
  },
]

export default async function Home() {
  // Initialize variables for content
  let homepage = null
  let featuredPosts = sampleBlogPosts
  let photographer = null
  let contentfulError = null
  const isConfigured = isContentfulConfigured()

  try {
    homepage = await getHomepage()
  } catch (error) {
    console.error("Error fetching homepage:", error)
    contentfulError = error instanceof Error ? error.message : "Error fetching homepage data"
  }

  try {
    // Get the 3 most recent blog posts from Contentful
    const allPosts = await getAllBlogPosts()
    if (allPosts && allPosts.length > 0) {
      featuredPosts = allPosts.slice(0, 3) // Get the 3 most recent posts
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
  }

  try {
    photographer = await getPhotographerInfo()
  } catch (error) {
    console.error("Error fetching photographer info:", error)
  }

  // Add this after other data fetching
  let featuredParks = []
  let featuredServices = []

  try {
    featuredParks = await getFeaturedParks(3)
  } catch (error) {
    console.error("Error fetching featured parks:", error)
  }

  try {
    featuredServices = await getFeaturedServices(3)
  } catch (error) {
    console.error("Error fetching featured services:", error)
  }

  // Default contact information if photographer data is not available
  let contactEmail = "daveypicsstudio@gmail.com"
  let contactLocation = "Houston, Texas"

  // Safely extract contact information
  if (photographer && photographer.fields) {
    if (photographer.fields.email) {
      contactEmail = photographer.fields.email
    }

    if (photographer.fields.location) {
      // Handle location whether it's a string or an object with coordinates
      if (typeof photographer.fields.location === "string") {
        contactLocation = photographer.fields.location
      } else if (typeof photographer.fields.location === "object") {
        // If it's a location object with lat/lon, use a default or extract city/state if available
        if (photographer.fields.location.lat && photographer.fields.location.lon) {
          contactLocation = "Houston, Texas" // Default if only coordinates are available
        } else if (photographer.fields.location.city || photographer.fields.location.state) {
          // Create a formatted string from the location object
          const city = photographer.fields.location.city || "Houston"
          const state = photographer.fields.location.state || "Texas"
          contactLocation = `${city}, ${state}`
        }
      }
    }
  }

  // Determine if we should show the Contentful error message
  const showContentfulError = contentfulError && process.env.NODE_ENV === "development"

  // Get the hero image URL from the single heroImage field
  let heroImageUrl = "/placeholder.svg?key=5q8jl" // Default fallback
  let heroImageTitle = "Wildlife Photography"

  // Use the single heroImage field
  if (homepage?.fields?.heroImage?.fields?.file?.url) {
    heroImageUrl = homepage.fields.heroImage.fields.file.url
    heroImageTitle = homepage.fields.heroImage.fields.title || "Hero image"
  }

  // Get the process image URL from the processImage field
  let processImageUrl = "/placeholder.svg?key=houston-wildlife" // Default fallback

  // Use the processImage field if it exists with proper null checking
  if (homepage?.fields?.processImage?.fields?.file?.url) {
    processImageUrl = homepage.fields.processImage.fields.file.url
    // Ensure the URL has the proper protocol
    if (processImageUrl.startsWith("//")) {
      processImageUrl = `https:${processImageUrl}`
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Show error message if there was a problem with Contentful */}
      {showContentfulError && (
        <div className="container mx-auto px-4 mt-8">
          <ContentfulFallback message={`Unable to load content from Contentful: ${contentfulError}`}>
            <p className="mt-4">Using sample data as fallback.</p>
          </ContentfulFallback>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ContentfulImage
            src={heroImageUrl}
            alt="Houston wildlife photography by David Martin - Humble, Texas photographer specializing in birds and nature"
            fill
            priority
            className="object-cover brightness-[0.6]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Houston Wildlife Photography</h1>
            <p className="text-lg md:text-xl text-gray-200">
              Wildlife photography by David Martin, based in Humble, Texas. Specializing in birds and wildlife
              throughout the Houston area and beyond.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/gallery">Explore Gallery</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-background/30"
              >
                <Link href="/about">About Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Houston Area Photography Section - Centered Text */}
      <section className="py-16 relative border-y border-primary/10 dark:border-primary/20">
        {/* Dynamic background that changes with theme */}
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm"></div>

        {/* Content container with subtle shadow for depth */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-background/80 dark:bg-background/40 backdrop-blur-sm rounded-lg p-8 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <h2 className="text-3xl font-bold mb-6">Houston Area Wildlife Photography</h2>
            <p className="text-lg mb-5 leading-relaxed">
              Based in Humble, Texas, I specialize in capturing the diverse bird and animal species found throughout the
              Houston area's rich and varied ecosystems. My passion lies in revealing the hidden beauty of our local
              wildlife through the lens.
            </p>
            <p className="text-lg mb-5 leading-relaxed">
              From the wetlands of Brazos Bend State Park to the coastal habitats of Galveston, my work showcases the
              incredible biodiversity of Southeast Texas. Each photograph represents hours of patience, technical
              precision, and a deep respect for nature's delicate balance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild>
                <Link href="/about">About the Photographer</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/30 hover:bg-primary/5">
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Houston Wildlife Photography Blog</h2>
              <p className="text-muted-foreground max-w-2xl">
                Insights on wildlife photography in Houston and throughout Texas, including tips, location guides, and
                conservation efforts.
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link href="/blog" className="flex items-center gap-2">
                All Articles
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogPostCard
                key={post.sys.id}
                title={post.fields.title}
                excerpt={post.fields.excerpt || post.fields.body ? extractExcerpt(post.fields.body) : ""}
                date={
                  post.fields.date || post.fields.publishDate
                    ? formatDate(post.fields.date || post.fields.publishDate)
                    : ""
                }
                slug={post.fields.slug}
                imageSrc={
                  post.fields.coverPhoto?.fields?.file?.url || post.fields.featuredImage?.fields?.file?.url || ""
                }
                tags={post.fields.tags || post.fields.categories?.map((category) => category.fields.name) || []}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parks Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Photography Locations</h2>
              <p className="text-muted-foreground max-w-2xl">
                Discover the best wildlife photography spots in and around Houston
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link href="/parks" className="flex items-center gap-2">
                View All Locations
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {featuredParks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredParks.map((park) => (
                <ParkCard key={park.sys.id} park={park} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No featured parks available yet</h3>
              <p className="text-muted-foreground mb-4">
                Add parks in Contentful to showcase your favorite photography locations.
              </p>
              <Button asChild>
                <Link href="/parks">Browse Parks</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Publications & Prints</h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore my wildlife photography publications and fine art print offerings
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link href="/services" className="flex items-center gap-2">
                View All
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <ServiceCard key={service.sys.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No featured services available yet</h3>
              <p className="text-muted-foreground mb-4">
                Add services in Contentful to showcase your publications and print offerings.
              </p>
              <Button asChild>
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Houston Wildlife Photographer</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Based in Humble, Texas, I'm available for wildlife photography commissions, print purchases, and
                photography workshops throughout the Houston area.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary h-5 w-5" />
                  <span>{contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <span>Humble, Texas (Greater Houston Area)</span>
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
                  title="Map showing Humble, Texas - base of operations for David Martin Wildlife Photography"
                ></iframe>
              </div>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardContent className="pt-6">
                {/* Wrap ContactForm in Suspense */}
                <Suspense fallback={<div className="p-4 text-center">Loading contact form...</div>}>
                  <ContactForm />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Add structured data for local business */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://daveypicsstudio.com",
          name: "David Martin Wildlife Photography",
          description:
            "Professional wildlife photography services in Houston and Humble, Texas, specializing in bird and nature photography.",
          url: "https://daveypicsstudio.com",
          telephone: "+12815551234",
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
          image: ["https://daveypicsstudio.com/images/logo.jpg", "https://daveypicsstudio.com/images/storefront.jpg"],
          priceRange: "$$",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "17:00",
            },
          ],
          sameAs: ["https://www.instagram.com/davey.pics/", "https://www.facebook.com/daveypicsstudio"],
        }}
      />
    </main>
  )
}

// Add this helper function at the bottom of the file if it doesn't exist
function extractExcerpt(richText: any, maxLength = 150): string {
  try {
    // If it's a rich text document
    if (richText?.nodeType === "document" && richText.content) {
      // Find the first paragraph
      const firstParagraph = richText.content.find((node: any) => node.nodeType === "paragraph")

      if (firstParagraph && firstParagraph.content) {
        // Extract text from the paragraph
        const text = firstParagraph.content
          .filter((node: any) => node.nodeType === "text")
          .map((node: any) => node.value)
          .join("")

        // Truncate if needed
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + "..."
        }
        return text
      }
    }
    return ""
  } catch (error) {
    console.error("Error extracting excerpt:", error)
    return ""
  }
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}
