import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { PHProvider } from "@/lib/posthog"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Houston Wildlife Photography | David Martin Photography",
    template: "%s | David Martin Photography - Houston Wildlife Photographer",
  },
  description:
    "Award-winning Houston wildlife photography by David Martin, specializing in Texas birds and wildlife. Based in Humble, Texas.",
  keywords: [
    "Houston wildlife photography",
    "Humble Texas wildlife photographer",
    "Texas bird photography",
    "wildlife photographer Houston",
    "nature photography Texas",
  ],
  creator: "David Martin",
  publisher: "David Martin Photography",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daveypicsstudio.com",
    siteName: "David Martin Photography",
    title: "Houston Wildlife Photography | David Martin Photography",
    description:
      "Award-winning Houston wildlife photography by David Martin, specializing in Texas birds and wildlife. Based in Humble, Texas.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "David Martin Photography - Houston Wildlife Photographer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Wildlife Photography | David Martin Photography",
    description:
      "Award-winning Houston wildlife photography by David Martin, specializing in Texas birds and wildlife. Based in Humble, Texas.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://daveypicsstudio.com" />
      </head>
      <body className={inter.className}>
        <PHProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                name: "David Martin Photography",
                description:
                  "Houston wildlife photography by David Martin, specializing in Texas birds and wildlife photography.",
                url: "https://daveypicsstudio.com",
                telephone: "+12815551234",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "123 Wildlife Way",
                  addressLocality: "Humble",
                  addressRegion: "TX",
                  postalCode: "77338",
                  addressCountry: "US",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 29.9988,
                  longitude: -95.2622,
                },
                priceRange: "$$",
                openingHoursSpecification: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "17:00",
                },
                sameAs: ["https://www.instagram.com/davey.pics/", "https://www.facebook.com/daveypicsstudio"],
              }}
            />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <Suspense>
                <div className="pt-16">{children}</div>
              </Suspense>
              <Footer />
            </div>
            <Analytics />
          </ThemeProvider>
        </PHProvider>
      </body>
    </html>
  )
}
