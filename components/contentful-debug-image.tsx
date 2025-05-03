interface ContentfulDebugImageProps {
  imageUrl: string | null | undefined
  alt: string
}

export default function ContentfulDebugImage({ imageUrl, alt }: ContentfulDebugImageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
      <h3 className="font-medium mb-2">Contentful Image Debug</h3>
      <p className="text-sm">
        <strong>Image URL:</strong> {imageUrl || "No image URL provided"}
      </p>
      <p className="text-sm">
        <strong>Alt Text:</strong> {alt}
      </p>
      <p className="text-xs mt-2">
        This component is only visible in development mode to help debug Contentful image URLs.
      </p>
    </div>
  )
}
