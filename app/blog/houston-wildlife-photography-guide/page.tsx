import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Camera, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import ContentfulImage from "@/components/contentful-image"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Complete Guide to Houston Wildlife Photography | Best Locations & Tips",
  description:
    "Discover the best locations for wildlife photography in Houston and surrounding areas. Tips, gear recommendations, and seasonal guides from a Humble, Texas based photographer.",
  keywords: [
    "Houston wildlife photography",
    "wildlife photography Houston",
    "Humble Texas wildlife photographer",
    "bird photography Houston",
    "Texas wildlife photo locations",
  ],
  openGraph: {
    title: "Complete Guide to Houston Wildlife Photography | Best Locations & Tips",
    description:
      "Discover the best locations for wildlife photography in Houston and surrounding areas. Tips, gear recommendations, and seasonal guides from a Humble, Texas based photographer.",
    type: "article",
    publishedTime: "2023-09-15T00:00:00Z",
    authors: ["David Martin"],
    tags: ["Wildlife Photography", "Houston", "Texas", "Bird Photography", "Nature"],
  },
}

export default function HoustonWildlifeGuide() {
  const publishDate = "September 15, 2023"

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ContentfulImage
            src="/placeholder.svg?key=houston-wildlife-guide"
            alt="Great Egret photographed at Brazos Bend State Park - Houston Wildlife Photography Guide"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Button variant="ghost" asChild className="text-white mb-6 w-fit">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary/20 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              Wildlife Photography
            </span>
            <span className="bg-primary/20 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              Houston
            </span>
            <span className="bg-primary/20 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              Location Guide
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Complete Guide to Houston Wildlife Photography
          </h1>
          <div className="flex items-center gap-4 text-gray-200">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Humble, Texas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <article className="prose prose-invert max-w-none">
                <p className="lead">
                  As a wildlife photographer based in Humble, Texas, I've spent countless hours exploring the diverse
                  ecosystems around Houston. This comprehensive guide shares my favorite locations, seasonal tips, and
                  equipment recommendations for capturing stunning wildlife images in the Greater Houston area.
                </p>

                <div className="bg-accent/20 p-6 rounded-lg my-8">
                  <h2 className="flex items-center gap-2 mt-0">
                    <Info className="h-5 w-5 text-primary" />
                    About This Guide
                  </h2>
                  <p className="mb-0">
                    This guide is based on my 10+ years of experience as a Houston wildlife photographer. All locations
                    are within a 90-minute drive from downtown Houston, making them accessible for both day trips and
                    longer photography sessions.
                  </p>
                </div>

                <h2>Top Houston Wildlife Photography Locations</h2>

                <h3>1. Brazos Bend State Park</h3>
                <div className="aspect-video relative rounded-lg overflow-hidden my-6">
                  <ContentfulImage
                    src="/placeholder.svg?key=brazos-bend-detailed"
                    alt="Alligator basking in the sun at Brazos Bend State Park - Houston wildlife photography"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Located just 45 minutes southwest of Houston, Brazos Bend State Park is a wildlife photographer's
                  paradise. The park features diverse ecosystems including wetlands, lakes, and woodlands, making it
                  home to an incredible variety of wildlife.
                </p>
                <p>
                  <strong>Best for:</strong> Alligators, wading birds (herons, egrets, spoonbills), and woodland
                  species.
                </p>
                <p>
                  <strong>Photography tips:</strong> Visit early morning for the best light and most active wildlife.
                  The trails around 40-Acre Lake and Elm Lake offer excellent opportunities for photographing alligators
                  and wading birds. Bring a telephoto lens (at least 300mm) and a tripod.
                </p>
                <p>
                  <strong>Best seasons:</strong> Spring for nesting birds and baby alligators; fall and winter for
                  migratory species.
                </p>

                <h3>2. Sheldon Lake State Park</h3>
                <div className="aspect-video relative rounded-lg overflow-hidden my-6">
                  <ContentfulImage
                    src="/placeholder.svg?key=sheldon-lake-detailed"
                    alt="Great Blue Heron fishing at Sheldon Lake State Park - Houston area wildlife photography"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  This hidden gem in northeast Houston is just a short drive from Humble. The park features wetlands,
                  prairies, and a restored lake system that attracts numerous bird species and other wildlife.
                </p>
                <p>
                  <strong>Best for:</strong> Wading birds, raptors, songbirds, and reptiles.
                </p>
                <p>
                  <strong>Photography tips:</strong> The observation tower provides excellent views for landscape shots,
                  while the boardwalks offer close-up opportunities for wetland species. The Environmental Education
                  Center has bird blinds that are perfect for songbird photography.
                </p>
                <p>
                  <strong>Best seasons:</strong> Year-round, with spring and fall migration bringing additional species.
                </p>

                <h3>3. Anahuac National Wildlife Refuge</h3>
                <div className="aspect-video relative rounded-lg overflow-hidden my-6">
                  <ContentfulImage
                    src="/placeholder.svg?key=anahuac-detailed"
                    alt="Roseate Spoonbill in flight at Anahuac National Wildlife Refuge - Texas coastal wildlife photography"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Located about an hour east of Houston, Anahuac NWR consists of coastal marshes and prairies that
                  provide habitat for an incredible diversity of birds, especially during migration seasons.
                </p>
                <p>
                  <strong>Best for:</strong> Waterfowl, shorebirds, wading birds, and raptors.
                </p>
                <p>
                  <strong>Photography tips:</strong> The Shoveler Pond Auto Loop is excellent for bird photography from
                  your vehicle (which acts as a natural blind). The boardwalks and observation platforms provide
                  additional vantage points.
                </p>
                <p>
                  <strong>Best seasons:</strong> Winter for waterfowl; spring and fall for migratory species.
                </p>

                <h3>4. Jesse H. Jones Park & Nature Center (Humble)</h3>
                <div className="aspect-video relative rounded-lg overflow-hidden my-6">
                  <ContentfulImage
                    src="/placeholder.svg?key=jones-park-detailed"
                    alt="Pileated Woodpecker at Jesse H. Jones Park in Humble, Texas - Houston area bird photography"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Located right in Humble, this park features beautiful woodland trails along Spring Creek, providing
                  habitat for numerous songbirds, woodpeckers, and riparian wildlife.
                </p>
                <p>
                  <strong>Best for:</strong> Songbirds, woodpeckers, raptors, and woodland mammals.
                </p>
                <p>
                  <strong>Photography tips:</strong> The Cypress Boardwalk and trails near Spring Creek offer excellent
                  opportunities for woodland bird photography. The Nature Center has feeders that attract songbirds
                  year-round.
                </p>
                <p>
                  <strong>Best seasons:</strong> Spring for breeding birds and wildflowers; fall and winter for
                  migratory species.
                </p>

                <h2>Essential Gear for Houston Wildlife Photography</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-6 rounded-lg">
                    <h3 className="flex items-center gap-2 mt-0">
                      <Camera className="h-5 w-5 text-primary" />
                      Camera Equipment
                    </h3>
                    <ul>
                      <li>
                        <strong>Camera:</strong> DSLR or mirrorless with good autofocus capabilities
                      </li>
                      <li>
                        <strong>Lenses:</strong> Telephoto lens (300mm minimum, 400-600mm ideal)
                      </li>
                      <li>
                        <strong>Support:</strong> Sturdy tripod with gimbal head for long lenses
                      </li>
                      <li>
                        <strong>Accessories:</strong> Extra batteries, memory cards, lens rain cover
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-6 rounded-lg">
                    <h3 className="flex items-center gap-2 mt-0">
                      <Info className="h-5 w-5 text-primary" />
                      Field Essentials
                    </h3>
                    <ul>
                      <li>
                        <strong>Clothing:</strong> Neutral colors, layers for variable weather
                      </li>
                      <li>
                        <strong>Protection:</strong> Insect repellent, sunscreen, hat
                      </li>
                      <li>
                        <strong>Hydration:</strong> Water bottle or hydration pack
                      </li>
                      <li>
                        <strong>Navigation:</strong> Park maps, GPS or smartphone
                      </li>
                    </ul>
                  </div>
                </div>

                <h2>Seasonal Guide to Houston Wildlife Photography</h2>

                <h3>Spring (March-May)</h3>
                <p>
                  Spring is arguably the best season for wildlife photography in Houston. Breeding birds display vibrant
                  plumage, nesting activity is high, and baby animals emerge. Wildflowers create beautiful backgrounds
                  for your subjects.
                </p>
                <p>
                  <strong>Key species:</strong> Nesting herons and egrets, migrating warblers, alligators with
                  hatchlings
                </p>
                <p>
                  <strong>Top locations:</strong> Brazos Bend State Park, High Island sanctuaries, Sheldon Lake State
                  Park
                </p>

                <h3>Summer (June-August)</h3>
                <p>
                  Houston summers are hot and humid, but early mornings can still provide excellent photography
                  opportunities. Focus on wetland areas where birds congregate around shrinking water sources.
                </p>
                <p>
                  <strong>Key species:</strong> Wading birds, juvenile birds learning to hunt, dragonflies
                </p>
                <p>
                  <strong>Top locations:</strong> Sheldon Lake State Park (early morning), Brazos Bend (near water),
                  Jesse H. Jones Park (shaded areas)
                </p>

                <h3>Fall (September-November)</h3>
                <p>
                  Fall brings migratory birds passing through the Houston area, along with more comfortable temperatures
                  for extended photography sessions.
                </p>
                <p>
                  <strong>Key species:</strong> Migrating raptors, waterfowl, shorebirds
                </p>
                <p>
                  <strong>Top locations:</strong> Anahuac NWR, Galveston Island, Brazos Bend State Park
                </p>

                <h3>Winter (December-February)</h3>
                <p>
                  Winter brings numerous waterfowl species to Houston's wetlands and provides opportunities to
                  photograph birds against cleaner backgrounds with fallen leaves.
                </p>
                <p>
                  <strong>Key species:</strong> Ducks, geese, wintering sparrows, raptors
                </p>
                <p>
                  <strong>Top locations:</strong> Anahuac NWR, Brazos Bend State Park, Sheldon Lake State Park
                </p>

                <h2>Ethics for Houston Wildlife Photographers</h2>

                <p>
                  As wildlife photographers in the Houston area, we have a responsibility to protect the very subjects
                  we photograph:
                </p>

                <ul>
                  <li>Never disturb wildlife or their habitats for a photograph</li>
                  <li>Maintain a safe distance from all wildlife, especially alligators</li>
                  <li>Stay on designated trails to protect sensitive ecosystems</li>
                  <li>Follow all park rules and regulations</li>
                  <li>Consider joining local conservation organizations to support habitat preservation</li>
                </ul>

                <h2>Conclusion</h2>

                <p>
                  The Greater Houston area offers incredible opportunities for wildlife photography throughout the year.
                  From the wetlands of Brazos Bend to the woodlands of Humble's Jesse H. Jones Park, photographers can
                  capture a remarkable diversity of species without traveling far from the city.
                </p>

                <p>
                  As a wildlife photographer based in Humble, Texas, I continue to discover new locations and species to
                  photograph in our region. I hope this guide helps you explore the natural beauty of Houston and
                  capture your own stunning wildlife images.
                </p>

                <p>
                  If you have questions about wildlife photography in the Houston area or would like to join me for a
                  photography workshop, please{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    contact me
                  </Link>
                  .
                </p>
              </article>

              <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share this guide:</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Link
                      href="https://twitter.com/intent/tweet?url=https://daveypicsstudio.com/blog/houston-wildlife-photography-guide&text=Complete Guide to Houston Wildlife Photography"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Link
                      href="https://www.facebook.com/sharer/sharer.php?u=https://daveypicsstudio.com/blog/houston-wildlife-photography-guide"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-accent/50 hover:bg-accent/70 text-xs px-2 py-1 rounded-full transition-colors">
                    Houston
                  </span>
                  <span className="bg-accent/50 hover:bg-accent/70 text-xs px-2 py-1 rounded-full transition-colors">
                    Wildlife Photography
                  </span>
                  <span className="bg-accent/50 hover:bg-accent/70 text-xs px-2 py-1 rounded-full transition-colors">
                    Texas
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <ContentfulImage
                        src="/placeholder.svg?key=author-david"
                        alt="David Martin - Houston Wildlife Photographer"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">David Martin</h4>
                      <p className="text-sm text-muted-foreground">Wildlife Photographer</p>
                      <p className="text-sm text-muted-foreground">Humble, Texas</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    David is a wildlife photographer specializing in birds and nature photography throughout the Houston
                    area. Based in Humble, Texas, he has been documenting local wildlife for over 10 years.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/about">More About David</Link>
                  </Button>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Houston Photography Workshops</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join me for guided wildlife photography workshops at the locations mentioned in this guide. Learn
                    field techniques, camera settings, and post-processing tips.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/contact">Inquire About Workshops</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add structured data for article */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Complete Guide to Houston Wildlife Photography | Best Locations & Tips",
          description:
            "Discover the best locations for wildlife photography in Houston and surrounding areas. Tips, gear recommendations, and seasonal guides from a Humble, Texas based photographer.",
          image: "https://daveypicsstudio.com/images/houston-wildlife-guide.jpg",
          datePublished: "2023-09-15T00:00:00Z",
          dateModified: "2023-09-15T00:00:00Z",
          author: {
            "@type": "Person",
            name: "David Martin",
            url: "https://daveypicsstudio.com/about",
          },
          publisher: {
            "@type": "Organization",
            name: "David Martin Photography",
            logo: {
              "@type": "ImageObject",
              url: "https://daveypicsstudio.com/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://daveypicsstudio.com/blog/houston-wildlife-photography-guide",
          },
          keywords:
            "Houston wildlife photography, wildlife photography Houston, Humble Texas wildlife photographer, bird photography Houston, Texas wildlife photo locations",
        }}
      />
    </main>
  )
}
