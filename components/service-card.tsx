import Link from "next/link"
import { BookOpen, ImageIcon } from "lucide-react"
import ContentfulImage from "./contentful-image"
import type { ContentfulService } from "@/types/contentful"

interface ServiceCardProps {
  service: ContentfulService
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { serviceName, slug, shortDescription, featuredImage, serviceCategory } = service.fields

  // Determine icon based on service category
  const CategoryIcon = serviceCategory === "Print Sales" ? ImageIcon : BookOpen

  return (
    <Link href={`/services/${slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
        <div className="aspect-[16/9] relative overflow-hidden">
          {featuredImage?.fields?.file?.url ? (
            <ContentfulImage
              src={featuredImage.fields.file.url}
              alt={serviceName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          <div className="absolute right-3 top-3 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm flex items-center gap-1.5">
            <CategoryIcon size={12} />
            {serviceCategory === "Print Sales" ? "Print" : "Publication"}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold group-hover:text-primary">{serviceName}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{shortDescription}</p>
        </div>
      </div>
    </Link>
  )
}
