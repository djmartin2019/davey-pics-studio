import type { Metadata } from "next"
import Link from "next/link"
import { Camera, Cpu, Leaf, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAboutPageData } from "@/lib/api"
import ContentfulImage from "@/components/contentful-image"
import RichTextRenderer from "@/components/rich-text-renderer"
import { JsonLd } from "@/components/json-ld"

export const revalidate = 60 // Revalidate this page every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPageData()

  return {
    title: "About David Martin | Houston Wildlife Photographer from Humble, TX",
    description:
      "Meet David Martin, a professional wildlife photographer based in Humble, Texas specializing in Houston area bird and wildlife photography. Learn about my journey, equipment, and photography philosophy.",
    openGraph: {
      title: "About David Martin | Houston Wildlife Photographer from Humble, TX",
      description:
        "Meet David Martin, a professional wildlife photographer based in Humble, Texas specializing in Houston area bird and wildlife photography. Learn about my journey, equipment, and photography philosophy.",
    },
  }
}

export default async function AboutPage() {
  const aboutPage = await getAboutPageData()

  // Extract fields with fallbacks for each
  const title = aboutPage?.fields?.title || "About David Martin - Houston Wildlife Photographer"
  const subtitle =
    aboutPage?.fields?.subtitle || "Wildlife photographer based in Humble, Texas specializing in birds and nature"
  const heroImage = aboutPage?.fields?.heroImage?.fields?.file?.url || "/placeholder.svg?key=dmqtt"
  const profileImage = aboutPage?.fields?.profileImage?.fields?.file?.url || "/placeholder.svg?key=cr4q0"
  const biography = aboutPage?.fields?.biography || null

  // Fallback biography paragraphs if no Contentful data is available
  const fallbackBiographyText = [
    "As a wildlife photographer based in Humble, Texas, I've always been fascinated by the natural world, especially the diverse bird species found throughout the Houston area. Their freedom, diversity, and behaviors captivate me in ways that few other subjects can.",
    "My journey into Houston wildlife photography began when I combined this passion with my love for technology and visual storytelling. I spend countless hours in local parks and nature preserves, from Brazos Bend State Park to the coastal wetlands of Galveston, documenting the incredible biodiversity of Southeast Texas.",
    "With a background in technology, I bring a unique perspective to wildlife photography. I'm constantly exploring the intersection between cutting-edge camera technology and the timeless beauty of nature. This blend of interests allows me to capture moments that might otherwise go unnoticed in the rich ecosystems around Houston.",
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ContentfulImage
            src={heroImage}
            alt="David Martin - Houston wildlife photographer based in Humble, Texas"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{subtitle}</p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <ContentfulImage
                src={profileImage}
                alt="David Martin - Houston wildlife photographer from Humble, Texas"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <MapPin size={18} />
                <span className="font-medium">Based in Humble, Texas (Greater Houston Area)</span>
              </div>
              <h2 className="text-3xl font-bold">My Story</h2>
              {biography ? (
                // Use RichTextRenderer to display the Contentful rich text content
                <RichTextRenderer content={biography} className="text-lg text-muted-foreground" />
              ) : (
                // Fallback text if no Contentful data
                <div className="space-y-4">
                  {fallbackBiographyText.map((paragraph, index) => (
                    <p key={index} className="text-lg text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              <div className="pt-4">
                <Button asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Houston Photography Experience - NEW */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Houston Wildlife Photography Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Local Expertise</h3>
              <p className="text-muted-foreground mb-4">
              With over five years of wildlife photography experience in the Houston area, I’ve developed a deep appreciation for the ecosystems and wildlife that make southeast Texas unique.
              </p>
              <p className="text-muted-foreground">
                Whether capturing songbirds in the forests of Jesse H. Jones Park or exploring the wetlands along Galveston Bay, I strive to document the diversity of local habitats while respecting the animals that call them home.
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Houston Area Specialties</h3>
              <p className="text-muted-foreground mb-4">
                The Greater Houston area offers incredible biodiversity, from coastal wading birds to woodland species.
                I specialize in photographing:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Wading birds (Great Blue Herons, Egrets, Spoonbills)</li>
                <li>Raptors (Red-tailed Hawks, Osprey, Crested Caracaras)</li>
                <li>Songbirds (Cardinals, Painted Buntings, Warblers)</li>
                <li>Coastal species (Pelicans, Terns, Skimmers)</li>
                <li>Wetland wildlife (Alligators, Turtles, Otters)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">My Photography Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10">
              <Camera className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Patience & Precision</h3>
              <p className="text-muted-foreground">
                Wildlife photography requires patience, respect for nature, and technical precision. I wait for the
                perfect moment rather than disturbing natural behaviors in Houston's delicate ecosystems.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10">
              <Cpu className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Technology as a Tool</h3>
              <p className="text-muted-foreground">
                I embrace technology to enhance my photography, from advanced camera systems to image processing
                techniques that reveal details the human eye might miss in the diverse wildlife of Southeast Texas.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10">
              <Leaf className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Conservation Through Art</h3>
              <p className="text-muted-foreground">
                My ultimate goal is to inspire conservation through my art. By showcasing the beauty of Houston's
                wildlife, I hope to motivate others to protect these precious species and their habitats throughout
                Texas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">My Equipment</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            The tools I use to capture wildlife in their natural habitats around Houston, balancing technical
            capabilities with minimal environmental impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Camera Bodies</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Canon 90D</span>
                    <span className="text-muted-foreground">Primary</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Canon Rebel T3i</span>
                    <span className="text-muted-foreground">Secondary</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Lenses</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Sigma 150-600mm 5-6.3 Contemporary DG OS HSM Lens</span>
                    <span className="text-muted-foreground">Primary Telephoto</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Canon EF-S 18-135mm f/3.5-5.6 IS Lens</span>
                    <span className="text-muted-foreground">Standard Zoom</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Canon EF 50mm f/1.8 STM Lens</span>
                    <span className="text-muted-foreground">Landscape</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Publications and Prints */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Publications & Prints</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            My wildlife photography has been featured in various publications, and I offer fine art prints by request.
            While my official print store is coming soon, I'm happy to discuss custom print options.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/services">View Publications & Prints</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Request a Print</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Add structured data for person */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://daveypicsstudio.com/#person",
          name: "David Martin",
          jobTitle: "Wildlife Photographer",
          description:
            "Professional wildlife photographer based in Humble, Texas, specializing in bird and nature photography throughout the Houston area.",
          image: "https://daveypicsstudio.com/images/david-martin.jpg",
          url: "https://daveypicsstudio.com",
          sameAs: ["https://www.instagram.com/davey.pics/", "https://www.facebook.com/daveypicsstudio"],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Humble",
            addressRegion: "TX",
            addressCountry: "US",
          },
          worksFor: {
            "@type": "Organization",
            name: "David Martin Photography",
            url: "https://daveypicsstudio.com",
          },
        }}
      />
    </main>
  )
}
