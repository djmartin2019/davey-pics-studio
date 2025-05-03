import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Mail, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PhotoGallery from "@/components/photo-gallery"
import BlogPostCard from "@/components/blog-post-card"
import ContactForm from "@/components/contact-form"
import ContentfulImage from "@/components/contentful-image"
import ContentfulFallback from "@/components/contentful-fallback"
import ContentfulDebug from "@/components/contentful-debug"
import { getHomepage, getAllBlogPosts, getFeaturedGalleryItems, getPhotographerInfo } from "@/lib/api"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()

  return {
    title: homepage?.fields.heroTitle || "Wildlife Photography",
    description: homepage?.fields.heroSubtitle || "Wildlife photography by David Martin",
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
  // Wrap Contentful data fetching in try/catch blocks
  let homepage = null
  let featuredPosts = []
  let featuredPhotos = []
  let photographer = null
  let contentfulError = null

  try {
    homepage = await getHomepage()
  } catch (error) {
    console.error("Error fetching homepage:", error)
    contentfulError = error instanceof Error ? error.message : "Error fetching homepage data"
  }

  try {
    // Get the 3 most recent blog posts from Contentful
    const allPosts = await getAllBlogPosts()
    featuredPosts = allPosts.slice(0, 3) // Get the 3 most recent posts

    if (featuredPosts.length === 0) {
      featuredPosts = sampleBlogPosts
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    featuredPosts = sampleBlogPosts
  }

  try {
    featuredPhotos = await getFeaturedGalleryItems(6)
    if (featuredPhotos.length === 0) {
      featuredPhotos = sampleGalleryItems
    }
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    featuredPhotos = sampleGalleryItems
  }

  try {
    photographer = await getPhotographerInfo()
  } catch (error) {
    console.error("Error fetching photographer info:", error)
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
      {contentfulError && (
        <div className="container mx-auto px-4 mt-8">
          <ContentfulFallback message={`Unable to load content from Contentful: ${contentfulError}`}>
            <p className="mt-4">Using sample data as fallback.</p>
          </ContentfulFallback>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {homepage?.fields.heroImage ? (
            <ContentfulImage
              src={homepage.fields.heroImage.fields.file.url}
              alt={homepage.fields.heroImage.fields.title}
              fill
              priority
              className="object-cover brightness-[0.6]"
            />
          ) : (
            <Image
              src="/placeholder.svg?key=5q8jl"
              alt="Nighttime forest with birds"
              fill
              priority
              className="object-cover brightness-[0.6]"
            />
          )}
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              {homepage?.fields.heroTitle || "Capturing Nature Through a Tech Lens"}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              {homepage?.fields.heroSubtitle ||
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

          <PhotoGallery items={featuredPhotos} />
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
                excerpt={post.fields.excerpt}
                date={new Date(post.fields.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                slug={post.fields.slug}
                imageSrc={post.fields.featuredImage?.fields.file.url || ""}
                tags={post.fields.categories?.map((category) => category.fields.name) || []}
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
                  <span>{photographer?.fields.email || "david@daveypics.studio"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <span>{photographer?.fields.location || "Houston, Texas"}</span>
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
