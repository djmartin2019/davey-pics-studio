import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import BlogPostCard from "@/components/blog-post-card"
import ContactForm from "@/components/contact-form"
import ContentfulImage from "@/components/contentful-image"
import ContentfulFallback from "@/components/contentful-fallback"
import ContentfulDebug from "@/components/contentful-debug"
import { getHomepage, getAllBlogPosts, getFeaturedGalleryItems, getPhotographerInfo } from "@/lib/api"
import { isContentfulConfigured } from "@/lib/contentful"
import HomePageGallery from "@/components/homepage-gallery"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()

  return {
    title: homepage?.fields?.heroTitle || "Wildlife Photography",
    description: homepage?.fields?.heroSubtitle || "Wildlife photography by David Martin",
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

const sampleGalleryItems = [
  {
    sys: { id: "gallery1" },
    fields: {
      title: "Owl in Moonlight",
      description: "Great Horned Owl perched on a branch during a full moon night.",
      image: { fields: { file: { url: "/placeholder.svg?key=n29da" } } },
      location: "Brazos Bend State Park, TX",
      category: { fields: { name: "Birds of Prey" } },
    },
  },
  {
    sys: { id: "gallery2" },
    fields: {
      title: "Hummingbird at Dawn",
      description: "Ruby-throated Hummingbird feeding at first light.",
      image: { fields: { file: { url: "/placeholder.svg?key=e0hbu" } } },
      location: "Backyard Studio, Houston, TX",
      category: { fields: { name: "Small Birds" } },
    },
  },
  {
    sys: { id: "gallery3" },
    fields: {
      title: "Hawk Hunting",
      description: "Red-tailed Hawk scanning for prey in a Texas field.",
      image: { fields: { file: { url: "/placeholder.svg?key=c2gpa" } } },
      location: "Katy Prairie Conservancy, TX",
      category: { fields: { name: "Birds of Prey" } },
    },
  },
]

export default async function Home() {
  // Initialize variables for content
  let homepage = null
  let featuredPosts = sampleBlogPosts
  let featuredPhotos = sampleGalleryItems
  let photographer = null
  let contentfulError = null
  const isConfigured = isContentfulConfigured()

  // Log environment status
  console.log("Home page - Contentful configuration status:", {
    isConfigured,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  })

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
    const galleryItems = await getFeaturedGalleryItems(6)
    if (galleryItems && galleryItems.length > 0) {
      featuredPhotos = galleryItems
    }
  } catch (error) {
    console.error("Error fetching gallery items:", error)
  }

  try {
    photographer = await getPhotographerInfo()
  } catch (error) {
    console.error("Error fetching photographer info:", error)
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

  // Log the homepage data to help debug
  console.log("Homepage data - hero image:", {
    hasHomepage: Boolean(homepage),
    hasHeroImage: Boolean(homepage?.fields?.heroImage),
    heroImageUrl: homepage?.fields?.heroImage?.fields?.file?.url || "not available",
  })

  // Use the single heroImage field
  if (homepage?.fields?.heroImage?.fields?.file?.url) {
    heroImageUrl = homepage.fields.heroImage.fields.file.url
    heroImageTitle = homepage.fields.heroImage.fields.title || "Hero image"
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Show debug component in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="container mx-auto px-4 mt-8">
          <ContentfulDebug />
        </div>
      )}

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
            alt={heroImageTitle}
            fill
            priority
            className="object-cover brightness-[0.6]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              {homepage?.fields?.heroTitle || "Capturing Nature Through a Tech Lens"}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              {homepage?.fields?.heroSubtitle ||
                "Wildlife photography by David Martin, specializing in avian subjects from the diverse ecosystems of Texas, powered by a passion for both nature and web technology."}
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

      {/* Featured Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Photography</h2>
              <p className="text-muted-foreground max-w-2xl">
                A selection of my favorite wildlife captures, focusing on birds in their natural habitats.
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link href="/gallery" className="flex items-center gap-2">
                View All Work
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <HomePageGallery items={featuredPhotos} />
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recent Articles</h2>
              <p className="text-muted-foreground max-w-2xl">
                Thoughts and insights on wildlife photography, technology, and conservation.
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

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Interested in prints, collaborations, or just want to chat about wildlife photography? Feel free to
                reach out.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary h-5 w-5" />
                  <span>{contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <span>
                    {typeof contactLocation === "object"
                      ? (contactLocation.city || "Houston") + ", " + (contactLocation.state || "Texas")
                      : contactLocation || "Houston, Texas"}
                  </span>
                </div>
              </div>

              <div className="aspect-video relative rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443088.20075264716!2d-95.73095328906248!3d29.817350000000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1651597022215!5m2!1sen!2sus"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
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
