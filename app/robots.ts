import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/setup/", "/debug/", "/api/", "/test-email/"],
    },
    sitemap: "https://daveypicsstudio.com/sitemap.xml",
  }
}
