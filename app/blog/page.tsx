import type { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BlogPostCard from "@/components/blog-post-card"
import { getAllBlogPosts, getAllCategories } from "@/lib/api"

export const revalidate = 60 // Revalidate this page every 60 seconds

export const metadata: Metadata = {
  title: "Blog | Wildlife Photography",
  description: "Insights, stories, and techniques from the field of wildlife photography",
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  const categories = await getAllCategories()

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?key=xshrj"
            alt="Blog concept"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">The Blog</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">Insights, stories, and techniques from the field</p>
        </div>
      </section>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
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

          {posts.length > 9 && (
            <div className="flex justify-center mt-12">
              <Button variant="outline">Load More Articles</Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
