import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Share2 } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import ContentfulImage from "@/components/contentful-image"
import RichTextRenderer from "@/components/rich-text-renderer"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/api"
import { formatDate } from "@/lib/utils"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts()

    return posts.map((post) => ({
      slug: post.fields.slug,
    }))
  } catch (error) {
    console.error("Error generating static params for blog posts:", error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.fields.title} | Wildlife Photography Blog`,
    description: post.fields.body ? extractExcerpt(post.fields.body) : "",
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const publishDate = post.fields.date ? formatDate(post.fields.date) : ""

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {post.fields.coverPhoto ? (
            <ContentfulImage
              src={post.fields.coverPhoto.fields.file.url}
              alt={post.fields.coverPhoto.fields.title || post.fields.title}
              fill
              priority
              className="object-cover brightness-[0.7]"
            />
          ) : (
            <div className="w-full h-full bg-accent/20" />
          )}
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Button variant="ghost" asChild className="text-white mb-6 w-fit">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </Button>
          {post.fields.tags && post.fields.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.fields.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary/20 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">{post.fields.title}</h1>
          {publishDate && (
            <div className="flex items-center gap-4 text-gray-200">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{publishDate}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <article className="prose prose-invert max-w-none">
                <RichTextRenderer content={post.fields.body} />
              </article>

              <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share this article:</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 size={16} />
                  </Button>
                </div>
                {post.fields.tags && post.fields.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.fields.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-accent/50 hover:bg-accent/70 text-xs px-2 py-1 rounded-full transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Recent Articles</h3>
                <div className="space-y-6">
                  {/* This would be populated with recent posts in a future update */}
                  <p className="text-muted-foreground text-sm">
                    Check back soon for more articles about wildlife photography.
                  </p>
                </div>

                {post.fields.tags && post.fields.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="text-xl font-semibold mb-6">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.fields.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-accent/50 hover:bg-accent/70 px-3 py-1 rounded-full transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
