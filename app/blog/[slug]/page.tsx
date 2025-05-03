import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Share2 } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import ContentfulImage from "@/components/contentful-image"
import RichTextRenderer from "@/components/rich-text-renderer"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/api"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()

  return posts.map((post) => ({
    slug: post.fields.slug,
  }))
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
    description: post.fields.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const publishDate = new Date(post.fields.publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {post.fields.featuredImage ? (
            <ContentfulImage
              src={post.fields.featuredImage.fields.file.url}
              alt={post.fields.featuredImage.fields.title || post.fields.title}
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
          <div className="flex flex-wrap gap-2 mb-4">
            {post.fields.categories?.map((category) => (
              <span
                key={category.sys.id}
                className="bg-primary/20 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {category.fields.name}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">{post.fields.title}</h1>
          <div className="flex items-center gap-4 text-gray-200">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{publishDate}</span>
            </div>
            {post.fields.author && <span>by {post.fields.author.fields.name}</span>}
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <article className="prose prose-invert max-w-none">
                <RichTextRenderer content={post.fields.content} />
              </article>

              <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share this article:</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.fields.categories?.map((category) => (
                    <Link
                      key={category.sys.id}
                      href={`/blog/category/${category.fields.slug}`}
                      className="bg-accent/50 hover:bg-accent/70 text-xs px-2 py-1 rounded-full transition-colors"
                    >
                      {category.fields.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
                <div className="space-y-6">
                  {post.fields.relatedPosts?.map((related) => (
                    <div key={related.sys.id} className="group">
                      <Link href={`/blog/${related.fields.slug}`} className="block">
                        <div className="aspect-video relative rounded-lg overflow-hidden mb-3">
                          {related.fields.featuredImage ? (
                            <ContentfulImage
                              src={related.fields.featuredImage.fields.file.url}
                              alt={related.fields.featuredImage.fields.title || related.fields.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-accent/20" />
                          )}
                        </div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {related.fields.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(related.fields.publishDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className="text-xl font-semibold mb-6">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.fields.categories?.map((category) => (
                      <Link
                        key={category.sys.id}
                        href={`/blog/category/${category.fields.slug}`}
                        className="bg-accent/50 hover:bg-accent/70 px-3 py-1 rounded-full transition-colors"
                      >
                        {category.fields.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
