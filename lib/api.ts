import { getContentfulClient } from "./contentful"
import type {
  ContentfulBlogPost,
  ContentfulGalleryItem,
  ContentfulGalleryCollection,
  ContentfulHomepage,
  ContentfulCategory,
  ContentfulAuthor,
} from "../types/contentful"
import { getCachedData } from "./contentful-cache"

// Update the getHomepage function to add more robust error handling
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
            console.warn("Invalid response when checking for homepage content type. Using sample data.")
            return getSampleHomepage()
          }

          // If the content type doesn't exist, return sample data
          if (contentTypesResponse.items.length === 0) {
            console.warn("Content type 'homepage' not found in Contentful space. Using sample data.")
            return getSampleHomepage()
          }

          const response = await client.getEntries({
            content_type: "homepage",
            include: 3, // Include 3 levels of nested references
            limit: 1,
          })

          if (response.items && response.items.length > 0) {
            const homepage = response.items[0] as unknown as ContentfulHomepage

            // Debug logging to help troubleshoot hero images
            console.log("Contentful homepage response:", {
              hasHeroImages: Boolean(homepage.fields?.heroImages),
              heroImagesCount: homepage.fields?.heroImages?.length || 0,
              hasHeroImage: Boolean(homepage.fields?.heroImage),
            })

            // Process hero images to ensure URLs have proper protocol
            if (homepage.fields?.heroImages && Array.isArray(homepage.fields.heroImages)) {
              homepage.fields.heroImages = homepage.fields.heroImages.map((image) => {
                if (image?.fields?.file?.url) {
                  const url = image.fields.file.url
                  image.fields.file.url = url.startsWith("//") ? `https:${url}` : url
                }
                return image
              })
            }

            // Also process the single heroImage if it exists
            if (homepage.fields?.heroImage?.fields?.file?.url) {
              const url = homepage.fields.heroImage.fields.file.url
              homepage.fields.heroImage.fields.file.url = url.startsWith("//") ? `https:${url}` : url
            }

            return homepage
          }
          return getSampleHomepage()
        } catch (contentTypeError) {
          console.error("Error checking for homepage content type:", contentTypeError)
          return getSampleHomepage()
        }
      },
      5 * 60 * 1000, // 5 minutes cache
    )
  } catch (error) {
    console.error("Error fetching homepage:", error)
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
        console.warn("Invalid response when checking for blogPost content type.")
        return []
      }

      // If the content type doesn't exist, return empty array
      if (contentTypesResponse.items.length === 0) {
        console.warn("Content type 'blogPost' not found in Contentful space.")
        return []
      }

      const response = await client.getEntries({
        content_type: "blogPost",
        order: "-sys.createdAt", // Sort by creation date in descending order
        include: 2,
      })

      // Add robust check for response.items
      if (!response || !response.items) {
        console.warn("Invalid response when fetching blog posts.")
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
      console.error("Error checking for blogPost content type:", contentTypeError)
      return []
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
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
        console.warn("Content type 'blogPost' not found in Contentful space.")
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
      console.error("Error checking for blogPost content type:", contentTypeError)
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
        console.warn("Invalid response when checking for photo content type.")
        return []
      }

      // If the content type doesn't exist, return empty array
      if (contentTypesResponse.items.length === 0) {
        console.warn("Content type 'photo' not found in Contentful space.")
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
        console.warn("Invalid response when fetching photos.")
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
      console.error("Error checking for photo content type:", contentTypeError)
      return []
    }
  } catch (error) {
    console.error("Error fetching photos:", error)
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
    console.error("Error creating virtual gallery collection:", error)
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
    console.error(`Error fetching gallery collection with slug ${slug}:`, error)
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
        console.warn("Invalid response when checking for photo content type. Using sample data.")
        return getSampleGalleryItems().slice(0, limit)
      }

      // If the content type doesn't exist, return sample data
      if (contentTypesResponse.items.length === 0) {
        console.warn("Content type 'photo' not found in Contentful space. Using sample data.")
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
          console.warn("Invalid response when fetching photos. Using sample data.")
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
        console.error("Error fetching photos:", error)
        return getSampleGalleryItems().slice(0, limit)
      }
    } catch (contentTypeError) {
      console.error("Error checking for photo content type:", contentTypeError)
      return getSampleGalleryItems().slice(0, limit)
    }
  } catch (error) {
    console.error("Error fetching featured gallery items:", error)
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
            console.warn("Content type 'category' not found in Contentful space. Using sample data.")
            return getSampleCategories()
          }

          const response = await client.getEntries({
            content_type: "category",
          })

          return response.items as unknown as ContentfulCategory[]
        } catch (contentTypeError) {
          console.error("Error checking for category content type:", contentTypeError)
          return getSampleCategories()
        }
      },
      30 * 60 * 1000, // 30 minutes cache
    )
  } catch (error) {
    console.error("Error fetching categories:", error)
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
        console.warn("Invalid response when checking for author content type.")
        return null
      }

      // If the content type doesn't exist, return null
      if (contentTypesResponse.items.length === 0) {
        console.warn("Content type 'author' not found in Contentful space.")
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
      console.error("Error checking for author content type:", contentTypeError)
      return null
    }
  } catch (error) {
    console.error("Error fetching photographer info:", error)
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

// Add this helper function at the end of the file
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
      // Add sample heroImages array
      heroImages: [
        {
          fields: {
            file: {
              url: "/placeholder.svg?key=hero-sample-1",
            },
            title: "Hero Image 1",
          },
        },
        {
          fields: {
            file: {
              url: "/placeholder.svg?key=hero-sample-2",
            },
            title: "Hero Image 2",
          },
        },
      ],
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
