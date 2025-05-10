import { getContentfulClient } from "./contentful"
import type {
  ContentfulBlogPost,
  ContentfulGalleryItem,
  ContentfulGalleryCollection,
  ContentfulHomepage,
  ContentfulCategory,
  ContentfulAuthor,
  ContentfulPark,
  ContentfulService,
  ContentfulPageBanner,
} from "../types/contentful"
import { getCachedData } from "./contentful-cache"

// Update the getHomepage function to focus on the single heroImage
export async function getHomepage(): Promise<ContentfulHomepage | null> {
  try {
    return await getCachedData(
      "homepage",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "homepage",
          })

          // Add robust check for contentTypesResponse.items
          if (!contentTypesResponse || !contentTypesResponse.items) {
            return getSampleHomepage()
          }

          // If the content type doesn't exist, return sample data
          if (contentTypesResponse.items.length === 0) {
            return getSampleHomepage()
          }

          const response = await client.getEntries({
            content_type: "homepage",
            include: 3, // Include 3 levels of nested references
            limit: 1,
          })

          if (response.items && response.items.length > 0) {
            const homepage = response.items[0] as unknown as ContentfulHomepage

            // Process the single heroImage if it exists
            if (homepage.fields?.heroImage?.fields?.file?.url) {
              const url = homepage.fields.heroImage.fields.file.url
              homepage.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            // Process the processImage if it exists
            if (homepage.fields?.processImage?.fields?.file?.url) {
              const url = homepage.fields.processImage.fields.file.url
              homepage.fields.processImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            return homepage
          }
          return getSampleHomepage()
        } catch (contentTypeError) {
          return getSampleHomepage()
        }
      },
      5 * 60 * 1000, // 5 minutes cache
    )
  } catch (error) {
    return getSampleHomepage()
  }
}

// Update the getAllBlogPosts function with similar robust error handling
export async function getAllBlogPosts(): Promise<ContentfulBlogPost[]> {
  try {
    const client = getContentfulClient()

    // First check if the content type exists
    try {
      const contentTypesResponse = await client.getContentTypes({
        "sys.id": "blogPost",
      })

      // Add robust check for contentTypesResponse.items
      if (!contentTypesResponse || !contentTypesResponse.items) {
        return []
      }

      // If the content type doesn't exist, return empty array
      if (contentTypesResponse.items.length === 0) {
        return []
      }

      const response = await client.getEntries({
        content_type: "blogPost",
        order: "-sys.createdAt", // Sort by creation date in descending order
        include: 2,
      })

      // Add robust check for response.items
      if (!response || !response.items) {
        return []
      }

      // Process the response to ensure all fields have proper values
      const posts = response.items as unknown as ContentfulBlogPost[]

      // Process each post to ensure image URLs are properly formatted
      return posts.map((post) => {
        // Handle both coverPhoto and featuredImage fields
        if (post.fields?.coverPhoto?.fields?.file?.url) {
          const url = post.fields.coverPhoto.fields.file.url
          post.fields.coverPhoto.fields.file.url = url.startsWith("//") ? `https:${url}` : url
        }

        if (post.fields?.featuredImage?.fields?.file?.url) {
          const url = post.fields.featuredImage.fields.file.url
          post.fields.featuredImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
        }

        return post
      })
    } catch (contentTypeError) {
      return []
    }
  } catch (error) {
    return []
  }
}

// Update the getBlogPostBySlug function to match the new content type structure
export async function getBlogPostBySlug(slug: string): Promise<ContentfulBlogPost | null> {
  if (!slug) {
    console.error("getBlogPostBySlug called without a slug")
    return null
  }

  try {
    const client = getContentfulClient()

    // First check if the content type exists
    try {
      const contentTypesResponse = await client.getContentTypes({
        "sys.id": "blogPost",
      })

      // If the content type doesn't exist, return null
      if (contentTypesResponse.items.length === 0) {
        return null
      }

      const response = await client.getEntries({
        content_type: "blogPost",
        "fields.slug": slug,
        include: 2,
      })

      if (response.items.length > 0) {
        const post = response.items[0] as unknown as ContentfulBlogPost

        // Ensure coverPhoto URL has proper protocol
        if (post.fields?.coverPhoto?.fields?.file?.url) {
          const url = post.fields.coverPhoto.fields.file.url
          post.fields.coverPhoto.fields.file.url = url.startsWith("//") ? `https:${url}` : url
        }

        return post
      }

      return null
    } catch (contentTypeError) {
      return null
    }
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

// Update the getAllPhotos function with similar robust error handling
export async function getAllPhotos(): Promise<ContentfulGalleryItem[]> {
  try {
    const client = getContentfulClient()

    // First, check if the content type exists by getting content types
    try {
      const contentTypesResponse = await client.getContentTypes({
        "sys.id": "photo",
      })

      // Add robust check for contentTypesResponse.items
      if (!contentTypesResponse || !contentTypesResponse.items) {
        return []
      }

      // If the content type doesn't exist, return empty array
      if (contentTypesResponse.items.length === 0) {
        return []
      }

      // If content type exists, proceed with the query
      const response = await client.getEntries({
        content_type: "photo",
        include: 1,
        order: "-fields.date,sys.createdAt", // Sort by date field, then by creation date
        limit: 100, // Increase limit if you have many photos
      })

      // Add robust check for response.items
      if (!response || !response.items) {
        return []
      }

      // Process photos to ensure image URLs are properly formatted
      const photos = response.items as unknown as ContentfulGalleryItem[]

      return photos.map((photo) => {
        // Ensure image URL has proper protocol
        if (photo.fields?.image?.fields?.file?.url) {
          const url = photo.fields.image.fields.file.url
          photo.fields.image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
        }
        return photo
      })
    } catch (contentTypeError) {
      return []
    }
  } catch (error) {
    return []
  }
}

// Keep the original function for backward compatibility, but make it use getAllPhotos
export async function getAllGalleryCollections(): Promise<ContentfulGalleryCollection[]> {
  try {
    // Get all photos
    const photos = await getAllPhotos()

    // Convert photos to a "virtual" gallery collection
    const virtualCollection: ContentfulGalleryCollection = {
      sys: { id: "virtual-gallery" },
      fields: {
        title: "Photo Gallery",
        slug: "photos",
        description: "A collection of wildlife photographs",
        coverImage: photos[0]?.fields?.image || {
          fields: {
            file: {
              url: "/placeholder.svg?key=gallery-cover",
            },
            title: "Gallery Cover",
          },
        },
        photos: photos,
      },
    } as unknown as ContentfulGalleryCollection

    return [virtualCollection]
  } catch (error) {
    return getSampleGalleryCollections()
  }
}

// Update the getGalleryCollectionBySlug function to work with the new structure
export async function getGalleryCollectionBySlug(slug: string): Promise<ContentfulGalleryCollection | null> {
  if (!slug) {
    console.error("getGalleryCollectionBySlug called without a slug")
    return null
  }

  try {
    // For now, we only have one virtual collection
    if (slug === "photos") {
      const photos = await getAllPhotos()

      // Create a virtual collection with all photos
      const virtualCollection: ContentfulGalleryCollection = {
        sys: { id: "virtual-gallery" },
        fields: {
          title: "Photo Gallery",
          slug: "photos",
          description: "A collection of wildlife photographs",
          coverImage: photos[0]?.fields?.image || {
            fields: {
              file: {
                url: "/placeholder.svg?key=gallery-cover",
              },
              title: "Gallery Cover",
            },
          },
          photos: photos,
        },
      } as unknown as ContentfulGalleryCollection

      return virtualCollection
    }

    // If slug doesn't match our virtual collection, return sample data
    const sampleCollections = getSampleGalleryCollections()
    return sampleCollections.find((collection) => collection.fields.slug === slug) || null
  } catch (error) {
    return null
  }
}

// Fetch featured gallery items
export async function getFeaturedGalleryItems(limit = 6): Promise<ContentfulGalleryItem[]> {
  try {
    const client = getContentfulClient()

    // First check if the content type exists
    try {
      const contentTypesResponse = await client.getContentTypes({
        "sys.id": "photo",
      })

      // Add robust check for contentTypesResponse.items
      if (!contentTypesResponse || !contentTypesResponse.items) {
        return getSampleGalleryItems().slice(0, limit)
      }

      // If the content type doesn't exist, return sample data
      if (contentTypesResponse.items.length === 0) {
        return getSampleGalleryItems().slice(0, limit)
      }

      // Get the most recent items - don't query for 'featured' field since it doesn't exist
      try {
        const response = await client.getEntries({
          content_type: "photo",
          order: "-sys.createdAt",
          include: 2,
          limit,
        })

        // Check if response is valid
        if (!response || !response.items) {
          return getSampleGalleryItems().slice(0, limit)
        }

        const items = response.items as unknown as ContentfulGalleryItem[]

        // Process items to ensure image URLs are properly formatted
        return items.map((item) => {
          if (item.fields?.image?.fields?.file?.url) {
            const url = item.fields.image.fields.file.url
            item.fields.image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
          }
          return item
        })
      } catch (error) {
        return getSampleGalleryItems().slice(0, limit)
      }
    } catch (contentTypeError) {
      return getSampleGalleryItems().slice(0, limit)
    }
  } catch (error) {
    return getSampleGalleryItems().slice(0, limit)
  }
}

// Fetch all categories
export async function getAllCategories(): Promise<ContentfulCategory[]> {
  try {
    return await getCachedData(
      "all-categories",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "category",
          })

          // If the content type doesn't exist, return sample data
          if (contentTypesResponse.items.length === 0) {
            return getSampleCategories()
          }

          const response = await client.getEntries({
            content_type: "category",
          })

          return response.items as unknown as ContentfulCategory[]
        } catch (contentTypeError) {
          return getSampleCategories()
        }
      },
      30 * 60 * 1000, // 30 minutes cache
    )
  } catch (error) {
    return getSampleCategories()
  }
}

// Fetch the photographer's information
export async function getPhotographerInfo(): Promise<ContentfulAuthor | null> {
  try {
    const client = getContentfulClient()

    // First check if the content type exists
    try {
      const contentTypesResponse = await client.getContentTypes({
        "sys.id": "author",
      })

      // Add robust check for contentTypesResponse.items
      if (!contentTypesResponse || !contentTypesResponse.items) {
        return null
      }

      // If the content type doesn't exist, return null
      if (contentTypesResponse.items.length === 0) {
        return null
      }

      const response = await client.getEntries({
        content_type: "author",
        limit: 1,
      })

      if (response.items && response.items.length > 0) {
        return response.items[0] as unknown as ContentfulAuthor
      }
      return null
    } catch (contentTypeError) {
      return null
    }
  } catch (error) {
    return null
  }
}

// Add these functions to your existing api.ts file

// Fetch About Page data
export async function getAboutPageData(): Promise<any> {
  try {
    return await getCachedData(
      "about-page",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "aboutPage",
          })

          // If the content type doesn't exist, return null
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return null
          }

          const response = await client.getEntries({
            content_type: "aboutPage",
            include: 2,
            limit: 1,
          })

          if (response.items && response.items.length > 0) {
            const aboutPage = response.items[0]

            // Process image URLs to ensure they have https:// prefix
            if (aboutPage.fields?.heroImage?.fields?.file?.url) {
              const url = aboutPage.fields.heroImage.fields.file.url
              aboutPage.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            if (aboutPage.fields?.profileImage?.fields?.file?.url) {
              const url = aboutPage.fields.profileImage.fields.file.url
              aboutPage.fields.profileImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            return aboutPage
          }
          return null
        } catch (contentTypeError) {
          return null
        }
      },
      5 * 60 * 1000, // 5 minutes cache
    )
  } catch (error) {
    return null
  }
}

// Fetch Contact Page data
export async function getContactPageData(): Promise<any> {
  try {
    return await getCachedData(
      "contact-page",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "contactPage",
          })

          // If the content type doesn't exist, return null
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return null
          }

          const response = await client.getEntries({
            content_type: "contactPage",
            include: 2,
            limit: 1,
          })

          if (response.items && response.items.length > 0) {
            const contactPage = response.items[0]

            // Process image URL to ensure it has https:// prefix
            if (contactPage.fields?.heroImage?.fields?.file?.url) {
              const url = contactPage.fields.heroImage.fields.file.url
              contactPage.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            return contactPage
          }
          return null
        } catch (contentTypeError) {
          return null
        }
      },
      5 * 60 * 1000, // 5 minutes cache
    )
  } catch (error) {
    return null
  }
}

// NEW: Fetch Page Banner by identifier
export async function getPageBanner(pageIdentifier: string): Promise<ContentfulPageBanner | null> {
  try {
    return await getCachedData(
      `page-banner-${pageIdentifier}`,
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "pageBanner",
          })

          // If the content type doesn't exist, return null
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return null
          }

          const response = await client.getEntries({
            content_type: "pageBanner",
            "fields.pageIdentifier": pageIdentifier,
            "fields.isActive": true,
            include: 2,
            limit: 1,
          })

          if (response.items && response.items.length > 0) {
            const pageBanner = response.items[0] as unknown as ContentfulPageBanner

            // Process image URL to ensure it has https:// prefix
            if (pageBanner.fields?.bannerImage?.fields?.file?.url) {
              const url = pageBanner.fields.bannerImage.fields.file.url
              pageBanner.fields.bannerImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            return pageBanner
          }
          return null
        } catch (contentTypeError) {
          console.error("Error fetching page banner:", contentTypeError)
          return null
        }
      },
      5 * 60 * 1000, // 5 minutes cache
    )
  } catch (error) {
    console.error("Error in getPageBanner:", error)
    return null
  }
}

// Add this helper function at the end of the file
function getSampleGalleryCollections(): ContentfulGalleryCollection[] {
  return [
    {
      sys: { id: "sample-collection-1" },
      fields: {
        title: "Birds of Texas",
        slug: "birds-of-texas",
        description: "A collection of bird photographs from various locations in Texas",
        coverImage: {
          fields: {
            file: {
              url: "/placeholder.svg?key=birds-collection",
            },
            title: "Birds Collection Cover",
          },
        },
        photos: [
          {
            sys: { id: "sample-photo-1" },
            fields: {
              title: "Great Blue Heron",
              description: "Great Blue Heron wading in shallow water",
              image: {
                fields: {
                  file: {
                    url: "/placeholder.svg?key=heron",
                  },
                },
              },
              location: "Brazos Bend State Park, TX",
            },
          },
          {
            sys: { id: "sample-photo-2" },
            fields: {
              title: "Northern Cardinal",
              description: "Male Northern Cardinal perched on a branch",
              image: {
                fields: {
                  file: {
                    url: "/placeholder.svg?key=cardinal",
                  },
                },
              },
              location: "Houston Arboretum, TX",
            },
          },
        ],
      },
    },
    {
      sys: { id: "sample-collection-2" },
      fields: {
        title: "Landscapes",
        slug: "landscapes",
        description: "Scenic landscapes from around the country",
        coverImage: {
          fields: {
            file: {
              url: "/placeholder.svg?key=landscape-collection",
            },
            title: "Landscape Collection Cover",
          },
        },
        photos: [],
      },
    },
  ] as unknown as ContentfulGalleryCollection[]
}

// Add this helper function at the end of the file
function getSampleGalleryItems(): ContentfulGalleryItem[] {
  return [
    {
      sys: { id: "sample-photo-1" },
      fields: {
        title: "Great Blue Heron",
        description: "Great Blue Heron wading in shallow water",
        image: {
          fields: {
            file: {
              url: "/placeholder.svg?key=heron-sample",
            },
            title: "Great Blue Heron",
          },
        },
        location: "Brazos Bend State Park, TX",
        category: { fields: { name: "Birds" } },
      },
    },
    {
      sys: { id: "sample-photo-2" },
      fields: {
        title: "Northern Cardinal",
        description: "Male Northern Cardinal perched on a branch",
        image: {
          fields: {
            file: {
              url: "/placeholder.svg?key=cardinal-sample",
            },
            title: "Northern Cardinal",
          },
        },
        location: "Houston Arboretum, TX",
        category: { fields: { name: "Birds" } },
      },
    },
    {
      sys: { id: "sample-photo-3" },
      fields: {
        title: "Sunset Over Mountains",
        description: "Beautiful sunset over mountain range",
        image: {
          fields: {
            file: {
              url: "/placeholder.svg?key=sunset-sample",
            },
            title: "Sunset Over Mountains",
          },
        },
        location: "Big Bend National Park, TX",
        category: { fields: { name: "Landscapes" } },
      },
    },
    {
      sys: { id: "sample-photo-4" },
      fields: {
        title: "Red-tailed Hawk",
        description: "Red-tailed Hawk scanning for prey",
        image: {
          fields: {
            file: {
              url: "/placeholder.svg?key=hawk-sample",
            },
            title: "Red-tailed Hawk",
          },
        },
        location: "Katy Prairie Conservancy, TX",
        category: { fields: { name: "Birds of Prey" } },
      },
    },
    {
      sys: { id: "sample-photo-5" },
      fields: {
        title: "Ruby-throated Hummingbird",
        description: "Hummingbird feeding on nectar",
        image: {
          fields: {
            file: {
              url: "/placeholder.svg?key=hummingbird-sample",
            },
            title: "Ruby-throated Hummingbird",
          },
        },
        location: "Memorial Park, Houston, TX",
        category: { fields: { name: "Birds" } },
      },
    },
    {
      sys: { id: "sample-photo-6" },
      fields: {
        title: "Coastal Sunrise",
        description: "Sunrise over the Gulf of Mexico",
        image: {
          fields: {
            file: {
              url: "/placeholder.svg?key=sunrise-sample",
            },
            title: "Coastal Sunrise",
          },
        },
        location: "Galveston Island, TX",
        category: { fields: { name: "Landscapes" } },
      },
    },
  ] as unknown as ContentfulGalleryItem[]
}

// Update the sample homepage to focus on the single heroImage
function getSampleHomepage(): ContentfulHomepage {
  return {
    sys: { id: "sample-homepage" },
    fields: {
      heroTitle: "Capturing Nature Through a Tech Lens",
      heroSubtitle:
        "Wildlife photography by David Martin, specializing in avian subjects from the diverse ecosystems of Texas.",
      heroImage: {
        fields: {
          file: {
            url: "/placeholder.svg?key=hero-sample",
          },
          title: "Hero Image",
        },
      },
      processImage: {
        fields: {
          file: {
            url: "/placeholder.svg?key=process-image-sample",
          },
          title: "Process Image",
        },
      },
      featuredGallery: null,
      featuredPosts: [],
    },
  } as unknown as ContentfulHomepage
}

// Add this helper function at the end of the file
function getSampleBlogPosts(): ContentfulBlogPost[] {
  return [
    {
      sys: { id: "sample-post-1" },
      fields: {
        title: "The Art of Bird Photography in Low Light",
        slug: "bird-photography-low-light",
        excerpt: "Techniques for capturing stunning avian images during dawn and dusk hours.",
        content: {
          nodeType: "document",
          data: {},
          content: [
            {
              nodeType: "paragraph",
              data: {},
              content: [
                {
                  nodeType: "text",
                  value: "This is sample content for a blog post about bird photography in low light conditions.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        featuredImage: {
          fields: {
            file: {
              url: "/placeholder.svg?key=low-light-birds",
            },
            title: "Bird in Low Light",
          },
        },
        publishDate: new Date().toISOString(),
        categories: [
          { fields: { name: "Photography", slug: "photography" } },
          { fields: { name: "Birds", slug: "birds" } },
        ],
      },
    },
    {
      sys: { id: "sample-post-2" },
      fields: {
        title: "Technology in Wildlife Conservation",
        slug: "technology-wildlife-conservation",
        excerpt: "How modern tech is helping us understand and protect bird populations.",
        content: {
          nodeType: "document",
          data: {},
          content: [
            {
              nodeType: "paragraph",
              data: {},
              content: [
                {
                  nodeType: "text",
                  value: "This is sample content for a blog post about technology in wildlife conservation.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        featuredImage: {
          fields: {
            file: {
              url: "/placeholder.svg?key=tech-conservation",
            },
            title: "Wildlife Conservation Technology",
          },
        },
        publishDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        categories: [
          { fields: { name: "Technology", slug: "technology" } },
          { fields: { name: "Conservation", slug: "conservation" } },
        ],
      },
    },
  ] as unknown as ContentfulBlogPost[]
}

// Add this helper function at the end of the file
function getSampleCategories(): ContentfulCategory[] {
  return [
    { sys: { id: "sample-cat-1" }, fields: { name: "Birds", slug: "birds", description: "Bird photography" } },
    {
      sys: { id: "sample-cat-2" },
      fields: { name: "Technology", slug: "technology", description: "Technology in photography" },
    },
    {
      sys: { id: "sample-cat-3" },
      fields: { name: "Conservation", slug: "conservation", description: "Wildlife conservation" },
    },
    {
      sys: { id: "sample-cat-4" },
      fields: { name: "Landscapes", slug: "landscapes", description: "Landscape photography" },
    },
  ] as unknown as ContentfulCategory[]
}

// Add these functions at the end of your api.ts file

// Fetch all parks
export async function getAllParks(): Promise<ContentfulPark[]> {
  try {
    return await getCachedData(
      "all-parks",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "park",
          })

          // If the content type doesn't exist, return empty array
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return []
          }

          const response = await client.getEntries({
            content_type: "park",
            order: "fields.parkName",
            include: 2,
          })

          if (!response.items) {
            return []
          }

          // Process parks to ensure image URLs are properly formatted
          const parks = response.items as unknown as ContentfulPark[]
          return parks.map((park) => {
            // Process hero image URL
            if (park.fields?.heroImage?.fields?.file?.url) {
              const url = park.fields.heroImage.fields.file.url
              park.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            // Process gallery images URLs
            if (park.fields?.galleryImages?.length) {
              park.fields.galleryImages = park.fields.galleryImages.map((image) => {
                if (image.fields?.file?.url) {
                  const url = image.fields.file.url
                  image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
                }
                return image
              })
            }

            // Process photography spot images
            if (park.fields?.photographySpots?.length) {
              park.fields.photographySpots = park.fields.photographySpots.map((spot) => {
                if (spot.image?.fields?.file?.url) {
                  const url = spot.image.fields.file.url
                  spot.image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
                }
                return spot
              })
            }

            return park
          })
        } catch (contentTypeError) {
          return []
        }
      },
      10 * 60 * 1000, // 10 minutes cache
    )
  } catch (error) {
    return []
  }
}

// Fetch a single park by slug
export async function getParkBySlug(slug: string): Promise<ContentfulPark | null> {
  if (!slug) {
    console.error("getParkBySlug called without a slug")
    return null
  }

  try {
    return await getCachedData(
      `park-${slug}`,
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "park",
          })

          // If the content type doesn't exist, return null
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return null
          }

          const response = await client.getEntries({
            content_type: "park",
            "fields.slug": slug,
            include: 3, // Include 3 levels of nested references
          })

          if (response.items.length > 0) {
            const park = response.items[0] as unknown as ContentfulPark

            // Process hero image URL
            if (park.fields?.heroImage?.fields?.file?.url) {
              const url = park.fields.heroImage.fields.file.url
              park.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            // Process gallery images URLs
            if (park.fields?.galleryImages?.length) {
              park.fields.galleryImages = park.fields.galleryImages.map((image) => {
                if (image.fields?.file?.url) {
                  const url = image.fields.file.url
                  image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
                }
                return image
              })
            }

            return park
          }

          return null
        } catch (contentTypeError) {
          return null
        }
      },
      10 * 60 * 1000, // 10 minutes cache
    )
  } catch (error) {
    return null
  }
}

// Fetch featured parks
export async function getFeaturedParks(limit = 3): Promise<ContentfulPark[]> {
  try {
    return await getCachedData(
      "featured-parks",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "park",
          })

          // If the content type doesn't exist, return empty array
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return []
          }

          // First try to get parks marked as featured
          const response = await client.getEntries({
            content_type: "park",
            "fields.featured": true,
            order: "fields.parkName",
            include: 2,
            limit,
          })

          // If no featured parks found, get the most recent ones instead
          if (!response.items || response.items.length === 0) {
            const allParksResponse = await client.getEntries({
              content_type: "park",
              order: "-sys.createdAt",
              include: 2,
              limit,
            })

            if (!allParksResponse.items) {
              return []
            }

            const parks = allParksResponse.items as unknown as ContentfulPark[]
            return parks.map((park) => {
              // Process hero image URL
              if (park.fields?.heroImage?.fields?.file?.url) {
                const url = park.fields.heroImage.fields.file.url
                park.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
              }
              return park
            })
          }

          // Process parks to ensure image URLs are properly formatted
          const parks = response.items as unknown as ContentfulPark[]
          return parks.map((park) => {
            // Process hero image URL
            if (park.fields?.heroImage?.fields?.file?.url) {
              const url = park.fields.heroImage.fields.file.url
              park.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }
            return park
          })
        } catch (contentTypeError) {
          return []
        }
      },
      5 * 60 * 1000, // 5 minutes cache
    )
  } catch (error) {
    return []
  }
}

// Fetch all services
export async function getAllServices(): Promise<ContentfulService[]> {
  try {
    return await getCachedData(
      "all-services",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "service",
          })

          // If the content type doesn't exist, return empty array
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return []
          }

          const response = await client.getEntries({
            content_type: "service",
            order: "fields.serviceName",
            include: 2,
          })

          if (!response.items) {
            return []
          }

          // Process services to ensure image URLs are properly formatted
          const services = response.items as unknown as ContentfulService[]
          return services.map((service) => {
            // Process featured image URL
            if (service.fields?.featuredImage?.fields?.file?.url) {
              const url = service.fields.featuredImage.fields.file.url
              service.fields.featuredImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            // Process gallery images URLs
            if (service.fields?.galleryImages?.length) {
              service.fields.galleryImages = service.fields.galleryImages.map((image) => {
                if (image.fields?.file?.url) {
                  const url = image.fields.file.url
                  image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
                }
                return image
              })
            }

            // Process testimonial images
            if (service.fields?.testimonials?.length) {
              service.fields.testimonials = service.fields.testimonials.map((testimonial) => {
                if (testimonial.image?.fields?.file?.url) {
                  const url = testimonial.image.fields.file.url
                  testimonial.image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
                }
                return testimonial
              })
            }

            return service
          })
        } catch (contentTypeError) {
          return []
        }
      },
      10 * 60 * 1000, // 10 minutes cache
    )
  } catch (error) {
    return []
  }
}

// Fetch a single service by slug
export async function getServiceBySlug(slug: string): Promise<ContentfulService | null> {
  if (!slug) {
    console.error("getServiceBySlug called without a slug")
    return null
  }

  try {
    return await getCachedData(
      `service-${slug}`,
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "service",
          })

          // If the content type doesn't exist, return null
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return null
          }

          const response = await client.getEntries({
            content_type: "service",
            "fields.slug": slug,
            include: 3, // Include 3 levels of nested references
          })

          if (response.items.length > 0) {
            const service = response.items[0] as unknown as ContentfulService

            // Process featured image URL
            if (service.fields?.featuredImage?.fields?.file?.url) {
              const url = service.fields.featuredImage.fields.file.url
              service.fields.featuredImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            // Process gallery images URLs
            if (service.fields?.galleryImages?.length) {
              service.fields.galleryImages = service.fields.galleryImages.map((image) => {
                if (image.fields?.file?.url) {
                  const url = image.fields.file.url
                  image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
                }
                return image
              })
            }

            return service
          }

          return null
        } catch (contentTypeError) {
          return null
        }
      },
      10 * 60 * 1000, // 10 minutes cache
    )
  } catch (error) {
    return null
  }
}

// Fetch featured services
export async function getFeaturedServices(limit = 3): Promise<ContentfulService[]> {
  try {
    return await getCachedData(
      "featured-services",
      async () => {
        const client = getContentfulClient()

        // First check if the content type exists
        try {
          const contentTypesResponse = await client.getContentTypes({
            "sys.id": "service",
          })

          // If the content type doesn't exist, return empty array
          if (!contentTypesResponse.items || contentTypesResponse.items.length === 0) {
            return []
          }

          // First try to get services marked as featured
          const response = await client.getEntries({
            content_type: "service",
            "fields.featured": true,
            order: "fields.serviceName",
            include: 2,
            limit,
          })

          // If no featured services found, get the most recent ones instead
          if (!response.items || response.items.length === 0) {
            const allServicesResponse = await client.getEntries({
              content_type: "service",
              order: "-sys.createdAt",
              include: 2,
              limit,
            })

            if (!allServicesResponse.items) {
              return []
            }

            const services = allServicesResponse.items as unknown as ContentfulService[]
            return services.map((service) => {
              // Process featured image URL
              if (service.fields?.featuredImage?.fields?.file?.url) {
                const url = service.fields.featuredImage.fields.file.url
                service.fields.featuredImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
              }
              return service
            })
          }

          // Process services to ensure image URLs are properly formatted
          const services = response.items as unknown as ContentfulService[]
          return services.map((service) => {
            // Process featured image URL
            if (service.fields?.featuredImage?.fields?.file?.url) {
              const url = service.fields.featuredImage.fields.file.url
              service.fields.featuredImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }
            return service
          })
        } catch (contentTypeError) {
          return []
        }
      },
      5 * 60 * 1000, // 5 minutes cache
    )
  } catch (error) {
    return []
  }
}
