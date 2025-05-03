// Common Contentful system fields
export interface ContentfulSys {
  id: string
  createdAt: string
  updatedAt: string
  contentType: {
    sys: {
      id: string
    }
  }
}

// Image asset type
export interface ContentfulImage {
  sys: ContentfulSys
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

// Author type
export interface ContentfulAuthor {
  sys: ContentfulSys
  fields: {
    name: string
    bio: any // Rich text
    photo: ContentfulImage
    email?: string
    location?: string
    socialMedia?: {
      instagram?: string
      twitter?: string
      youtube?: string
    }
  }
}

// Category type
export interface ContentfulCategory {
  sys: ContentfulSys
  fields: {
    name: string
    slug: string
    description?: string
  }
}

// Blog post type
export interface ContentfulBlogPost {
  sys: ContentfulSys
  fields: {
    title: string
    slug: string
    excerpt: string
    content: any // Rich text
    featuredImage: ContentfulImage
    author: ContentfulAuthor
    publishDate: string
    categories: ContentfulCategory[]
    relatedPosts?: ContentfulBlogPost[]
  }
}

// Photo gallery item type
export interface ContentfulGalleryItem {
  sys: ContentfulSys
  fields: {
    title: string
    description?: string
    image: ContentfulImage
    location?: string
    category?: ContentfulCategory
    featured?: boolean
    metadata?: {
      camera?: string
      lens?: string
      aperture?: string
      shutterSpeed?: string
      iso?: number
      takenAt?: string
    }
  }
}

// Photo gallery collection type
export interface ContentfulGalleryCollection {
  sys: ContentfulSys
  fields: {
    title: string
    slug: string
    description?: string
    coverImage: ContentfulImage
    photos: ContentfulGalleryItem[]
  }
}

// Homepage type
export interface ContentfulHomepage {
  sys: ContentfulSys
  fields: {
    heroTitle: string
    heroSubtitle: string
    heroImage: ContentfulImage
    featuredGallery: ContentfulGalleryCollection
    featuredPosts: ContentfulBlogPost[]
  }
}

// About page type
export interface ContentfulAboutPage {
  sys: ContentfulSys
  fields: {
    title: string
    subtitle: string
    heroImage: ContentfulImage
    biography: any // Rich text
    profileImage: ContentfulImage
    equipment: any // Rich text
    philosophy: any // Rich text
  }
}
