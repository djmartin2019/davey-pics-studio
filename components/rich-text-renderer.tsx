"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types"
import Link from "next/link"
import ContentfulImage from "./contentful-image"
import { Skeleton } from "@/components/ui/skeleton"

interface RichTextRendererProps {
  content: any
  className?: string
}

export default function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!content) {
    return null
  }

  // If we're server-side or during hydration, render a skeleton
  if (!isClient) {
    return (
      <div className={`prose prose-invert max-w-none ${className}`}>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <Skeleton className="h-6 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-6" />
      </div>
    )
  }

  // Define how to render each node type
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => <code className="bg-muted px-1 py-0.5 rounded text-sm">{text}</code>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => <p className="mb-4">{children}</p>,
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className="text-2xl font-semibold mt-6 mb-3">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className="text-xl font-semibold mt-6 mb-3">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
        <h5 className="text-lg font-semibold mt-4 mb-2">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
        <h6 className="text-base font-semibold mt-4 mb-2">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="list-decimal pl-6 mb-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => <li className="mb-2">{children}</li>,
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-primary/30 pl-4 italic my-6">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-8 border-border" />,
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { title, description, file } = node.data.target.fields
        const { url } = file

        if (file.contentType.includes("image")) {
          return (
            <figure className="my-8">
              <ContentfulImage
                src={url}
                alt={description || title || ""}
                width={800}
                height={600}
                className="rounded-lg"
              />
              {description && (
                <figcaption className="text-center text-sm text-muted-foreground mt-2">{description}</figcaption>
              )}
            </figure>
          )
        }

        return null
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
        const { uri } = node.data
        const isInternal = uri.startsWith("/")

        if (isInternal) {
          return (
            <Link href={uri} className="text-primary hover:underline">
              {children}
            </Link>
          )
        }

        return (
          <a href={uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {children}
          </a>
        )
      },
    },
  }

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>{documentToReactComponents(content, options)}</div>
  )
}
