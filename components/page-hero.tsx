import ContentfulImage from "@/components/contentful-image"
import type { ContentfulPageBanner } from "@/types/contentful"

interface PageHeroProps {
  title: string
  subtitle?: string
  imageUrl: string | null | undefined
  imageAlt: string
  pageBanner?: ContentfulPageBanner | null
}

export default function PageHero({ title, subtitle, imageUrl, imageAlt, pageBanner }: PageHeroProps) {
  // Use banner image if available, otherwise use the provided image
  const bannerImage = pageBanner?.fields?.bannerImage?.fields?.file?.url || imageUrl

  // Use banner headings if available, otherwise use the provided title/subtitle
  const headingText = pageBanner?.fields?.headingText || title
  const subheadingText = pageBanner?.fields?.subheadingText || subtitle

  return (
    <section className="relative w-full h-[40vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        {bannerImage ? (
          <ContentfulImage src={bannerImage} alt={imageAlt} fill priority className="object-cover brightness-[0.7]" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No featured image available</span>
          </div>
        )}
      </div>
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">{headingText}</h1>
        {subheadingText && <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{subheadingText}</p>}
      </div>
    </section>
  )
}
