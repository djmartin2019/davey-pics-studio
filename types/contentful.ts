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
    processImage?: ContentfulImage // New field for the process section image
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

// Park content type
export interface ContentfulPark {
  sys: ContentfulSys
  fields: {
    parkName: string
    slug: string
    description: any // Rich text
    shortDescription: string
    heroImage: ContentfulImage
    galleryImages?: ContentfulImage[]
    location: {
      lat: number
      lon: number
    }
    address: string
    website?: string
    hours?: any // Rich text
    entranceFees?: any // Rich text
    bestTimes?: {
      season?: string
      timeOfDay?: string
      notes?: string
    }
    wildlifeSpecies?: string[]
    photographySpots?: Array<{
      spotName: string
      description: string
      coordinates?: {
        lat: number
        lon: number
      }
      image?: ContentfulImage
    }>
    photographyTips?: any // Rich text
    amenities?: string[]
    difficultyLevel?: "Beginner" | "Moderate" | "Challenging" // Updated difficulty levels
    featured?: boolean
    relatedParks?: ContentfulPark[]
    relatedBlogPosts?: ContentfulBlogPost[]
  }
}

// Service content type
export interface ContentfulService {
  sys: ContentfulSys
  fields: {
    serviceName: string
    slug: string
    shortDescription: string
    detailedDescription: any // Rich text
    featuredImage: ContentfulImage
    galleryImages?: ContentfulImage[]
    serviceCategory: "Workshop" | "Guided Tour" | "Print Sales" | "Publication" | "Other"
    duration?: string
    price?: {
      amount: number
      currency: string
      unit: string
    }
    locationType?: "On Location" | "Studio" | "Virtual" | "Multiple Locations"
    locations?: ContentfulPark[]
    whatsIncluded?: any // Rich text
    requirements?: any // Rich text
    groupSize?: {
      minimum?: number
      maximum?: number
    }
    skillLevel?: "Beginner" | "Intermediate" | "Advanced" | "All Levels"
    equipment?: any // Rich text
    availability?: any // Rich text
    bookingInformation?: any // Rich text
    testimonials?: Array<{
      quote: string
      author: string
      location?: string
      image?: ContentfulImage
    }>
    featured?: boolean
    relatedServices?: ContentfulService[]
    relatedBlogPosts?: ContentfulBlogPost[]
  }
}

// Page Banner content type (NEW)
export interface ContentfulPageBanner {
  sys: ContentfulSys
  fields: {
    pageIdentifier: string // e.g., "parks", "services", "parks-detail", "services-detail"
    title: string // For admin purposes
    description?: string // For admin purposes
    bannerImage: ContentfulImage
    headingText?: string // Optional override for the page heading
    subheadingText?: string // Optional override for the page subheading
    isActive: boolean // Whether this banner should be used
  }
}
