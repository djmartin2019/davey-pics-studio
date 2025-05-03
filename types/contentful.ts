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
    heroImage?: ContentfulImage // Keep for backward compatibility
    heroImages?: ContentfulImage[] // New field for multiple images
    featuredGallery?: ContentfulGalleryCollection
    featuredPosts?: ContentfulBlogPost[]
  }
}

// About page type
export interface ContentfulAboutPage {
  sys: ContentfulSys
  fields: {
    title: string
    subtitle: string
    heroImage: ContentfulImage
    profileImage: ContentfulImage
    biography?: any // Rich text field
    equipment?: any // Rich text field
    philosophy?: any // Rich text field
  }
}

// Contact Page type
export interface ContentfulContactPage {
  sys: ContentfulSys
  fields: {
    title: string
    subtitle: string
    heroImage: ContentfulImage
    contactEmail?: string
    contactInstagram?: string
    contactLocation?: string
    faqItems?: Array<{
      question: string
      answer: string
    }>
  }
}
