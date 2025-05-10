import Link from "next/link"
import { MapPin } from "lucide-react"
import ContentfulImage from "./contentful-image"
import type { ContentfulPark } from "@/types/contentful"

interface ParkCardProps {
  park: ContentfulPark
}

export default function ParkCard({ park }: ParkCardProps) {
  const { parkName, slug, shortDescription, heroImage, address, difficultyLevel } = park.fields

  // Determine difficulty badge color with updated difficulty levels
  const difficultyColor = {
    Beginner: "bg-green-500/80",
    Moderate: "bg-amber-500/80",
    Challenging: "bg-red-500/80",
  }[difficultyLevel || "Beginner"]

  return (
    <Link href={`/parks/${slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
        <div className="aspect-[16/9] relative overflow-hidden">
          {heroImage?.fields?.file?.url ? (
            <ContentfulImage
              src={heroImage.fields.file.url}
              alt={parkName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          {difficultyLevel && (
            <div
              className={`absolute right-3 top-3 rounded-full ${difficultyColor} px-3 py-1 text-xs font-medium text-white backdrop-blur-sm`}
            >
              {difficultyLevel}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold group-hover:text-primary">{parkName}</h3>
          {address && (
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{address}</span>
            </div>
          )}
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{shortDescription}</p>
        </div>
      </div>
    </Link>
  )
}
