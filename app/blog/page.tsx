import type { Metadata } from "next"
import { getAllBlogPosts, getAllCategories, getPageBanner } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BlogPostCard from "@/components/blog-post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import PageHero from "@/components/page-hero"

export const revalidate = 60 // Revalidate this page every 60 seconds

export const metadata: Metadata = {
  title: "Blog | Wildlife Photography",
  description: "Insights, stories, and techniques from the field of wildlife photography",
}

export default async function BlogPage() {
  // Fetch blog posts directly from Contentful
  const posts = await getAllBlogPosts()
  const categories = await getAllCategories()

  // Fetch page banner for blog page
  const pageBanner = await getPageBanner("blog")

  // Get the first post's cover image for the hero section if available
  const heroImageUrl =
    posts.length > 0 && posts[0].fields.coverPhoto ? posts[0].fields.coverPhoto.fields.file.url : null

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Now using the PageHero component */}
      <PageHero
        title="The Blog"
        subtitle="Insights, stories, and techniques from the field"
        imageUrl={heroImageUrl}
        imageAlt="Blog hero"
        pageBanner={pageBanner}
      />

      {/* Blog Posts Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="w-full md:w-1/3">
              <Input type="search" placeholder="Search articles..." className="bg-background/50 border-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                All
              </Button>
              {categories.map((category) => (
                <Button key={category.sys.id} variant="outline" size="sm" className="rounded-full">
                  {category.fields.name}
                </Button>
              ))}
            </div>
          </div>

          {posts.length === 0 ? (
            // Show skeletons if no posts are available
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard
                  key={post.sys.id}
                  title={post.fields.title}
                  excerpt={post.fields.body ? extractExcerpt(post.fields.body) : ""}
                  date={post.fields.date ? formatDate(post.fields.date) : ""}
                  slug={post.fields.slug}
                  imageSrc={post.fields.coverPhoto?.fields.file.url || ""}
                  tags={post.fields.tags || []}
                />
              ))}
            </div>
          )}

          {/* Show message if no posts are available */}
          {posts.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                No blog posts available. Add some posts in Contentful to get started.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

// Helper function to extract excerpt from rich text
function extractExcerpt(richText: any, maxLength = 150): string {
  try {
    // If it's a rich text document
    if (richText.nodeType === "document" && richText.content) {
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
