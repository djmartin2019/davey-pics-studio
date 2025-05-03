import { contentfulClient } from "./contentful"
import type {
  ContentfulBlogPost,
  ContentfulGalleryItem,
  ContentfulGalleryCollection,
  ContentfulHomepage,
  ContentfulAboutPage,
  ContentfulCategory,
  ContentfulAuthor,
} from "../types/contentful"

// Fetch homepage data
export async function getHomepage(): Promise<ContentfulHomepage | null> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return null
    }

    const response = await contentfulClient.getEntries({
      content_type: "homepage",
      include: 3, // Include 3 levels of nested references
      limit: 1,
    })

    if (response.items.length > 0) {
      return response.items[0] as unknown as ContentfulHomepage
    }
    return null
  } catch (error) {
    console.error("Error fetching homepage:", error)
    return null
  }
}

// Fetch about page data
export async function getAboutPage(): Promise<ContentfulAboutPage | null> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return null
    }
    const response = await contentfulClient.getEntries({
      content_type: "aboutPage",
      include: 2,
      limit: 1,
    })

    if (response.items.length > 0) {
      return response.items[0] as unknown as ContentfulAboutPage
    }
    return null
  } catch (error) {
    console.error("Error fetching about page:", error)
    return null
  }
}

// Fetch all blog posts
export async function getAllBlogPosts(): Promise<ContentfulBlogPost[]> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return []
    }
    const response = await contentfulClient.getEntries({
      content_type: "blogPost",
      order: "-fields.publishDate", // Sort by publish date in descending order
      include: 2,
    })

    return response.items as unknown as ContentfulBlogPost[]
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<ContentfulBlogPost | null> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return null
    }
    const response = await contentfulClient.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      include: 3, // Include related posts
    })

    if (response.items.length > 0) {
      return response.items[0] as unknown as ContentfulBlogPost
    }
    return null
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

// Fetch all gallery collections
export async function getAllGalleryCollections(): Promise<ContentfulGalleryCollection[]> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return []
    }
    const response = await contentfulClient.getEntries({
      content_type: "galleryCollection",
      include: 1,
    })

    return response.items as unknown as ContentfulGalleryCollection[]
  } catch (error) {
    console.error("Error fetching gallery collections:", error)
    return []
  }
}

// Fetch a single gallery collection by slug
export async function getGalleryCollectionBySlug(slug: string): Promise<ContentfulGalleryCollection | null> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return null
    }
    const response = await contentfulClient.getEntries({
      content_type: "galleryCollection",
      "fields.slug": slug,
      include: 2,
    })

    if (response.items.length > 0) {
      return response.items[0] as unknown as ContentfulGalleryCollection
    }
    return null
  } catch (error) {
    console.error(`Error fetching gallery collection with slug ${slug}:`, error)
    return null
  }
}

// Fetch featured gallery items
export async function getFeaturedGalleryItems(limit = 6): Promise<ContentfulGalleryItem[]> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return []
    }

    // First try to get featured items
    const featuredResponse = await contentfulClient.getEntries({
      content_type: "galleryItem",
      "fields.featured": true,
      include: 2,
      limit,
    })

    // If no featured items, get the most recent items
    if (featuredResponse.items.length === 0) {
      const response = await contentfulClient.getEntries({
        content_type: "galleryItem",
        order: "-sys.createdAt",
        include: 2,
        limit,
      })
      return response.items as unknown as ContentfulGalleryItem[]
    }

    return featuredResponse.items as unknown as ContentfulGalleryItem[]
  } catch (error) {
    console.error("Error fetching featured gallery items:", error)
    return []
  }
}

// Fetch all categories
export async function getAllCategories(): Promise<ContentfulCategory[]> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return []
    }
    const response = await contentfulClient.getEntries({
      content_type: "category",
    })

    return response.items as unknown as ContentfulCategory[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Fetch blog posts by category
export async function getBlogPostsByCategory(categorySlug: string): Promise<ContentfulBlogPost[]> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return []
    }
    // First, get the category
    const categoryResponse = await contentfulClient.getEntries({
      content_type: "category",
      "fields.slug": categorySlug,
    })

    if (categoryResponse.items.length === 0) {
      return []
    }

    const categoryId = categoryResponse.items[0].sys.id

    // Then, get posts with this category
    const response = await contentfulClient.getEntries({
      content_type: "blogPost",
      "fields.categories.sys.id": categoryId,
      order: "-fields.publishDate",
      include: 2,
    })

    return response.items as unknown as ContentfulBlogPost[]
  } catch (error) {
    console.error(`Error fetching blog posts for category ${categorySlug}:`, error)
    return []
  }
}

// Fetch the photographer's information
export async function getPhotographerInfo(): Promise<ContentfulAuthor | null> {
  try {
    // Check if client is properly configured
    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.error("Contentful environment variables are not configured properly")
      return null
    }
    const response = await contentfulClient.getEntries({
      content_type: "author",
      limit: 1,
    })

    if (response.items.length > 0) {
      return response.items[0] as unknown as ContentfulAuthor
    }
    return null
  } catch (error) {
    console.error("Error fetching photographer info:", error)
    return null
  }
}
