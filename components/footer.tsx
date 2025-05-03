import Link from "next/link"
import { Camera, Instagram } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import FooterContentful from "./footer-contentful"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">DaveyPics</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Wildlife photography with a focus on Texas birds and web technology. Capturing nature through a tech lens.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://instagram.com/davey.pics"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Add Contentful status indicator with error handling */}
            {process.env.NODE_ENV === "development" && (
              <div className="pt-2">
                <FooterContentful />
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              {process.env.NODE_ENV === "development" && (
                <Link href="/setup" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Setup Guide
                </Link>
              )}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} David Martin. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
