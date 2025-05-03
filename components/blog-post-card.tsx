import Link from "next/link"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import ContentfulImage from "./contentful-image"

interface BlogPostCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
  imageSrc: string
  tags: string[]
  className?: string
}

export default function BlogPostCard({ title, excerpt, date, slug, imageSrc, tags, className }: BlogPostCardProps) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/blog/${slug}`} className="block">
        <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
          {imageSrc ? (
            <ContentfulImage
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-accent/20 flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          {tags && tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="bg-background/80 text-foreground text-xs px-2 py-1 rounded-full">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{excerpt}</p>
          {date && date !== "Invalid Date" && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{date}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
