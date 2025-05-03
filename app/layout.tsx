import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import EnvStatus from "@/components/env-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DaveyPics Studio - Wildlife Photography",
  description:
    "Wildlife photography by David Martin, specializing in avian subjects and exploring the intersection of nature and technology.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="pt-16">{children}</div>
            <Footer />
            <EnvStatus /> {/* Environment variable status indicator */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
