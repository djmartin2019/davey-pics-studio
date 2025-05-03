import { Suspense } from "react"
import type { Metadata } from "next"
import { Mail, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ContactForm from "@/components/contact-form"
import { getPhotographerInfo } from "@/lib/api"

export const metadata: Metadata = {
  title: "Contact | Houston Wildlife Photography",
  description: "Get in touch with David Martin, wildlife photographer based in Humble, Texas.",
}

export default async function ContactPage() {
  // Fetch photographer info for contact details
  let photographer = null
  let contactEmail = "daveypicsstudio@gmail.com" // Default fallback
  let contactLocation = "Humble, Texas" // Default fallback

  try {
    photographer = await getPhotographerInfo()

    // Extract contact information if available
    if (photographer?.fields) {
      if (photographer.fields.email) {
        contactEmail = photographer.fields.email
      }

      if (photographer.fields.location) {
        if (typeof photographer.fields.location === "string") {
          contactLocation = photographer.fields.location
        } else if (typeof photographer.fields.location === "object") {
          // Handle location object
          const city = photographer.fields.location.city || "Humble"
          const state = photographer.fields.location.state || "Texas"
          contactLocation = `${city}, ${state}`
        }
      }
    }
  } catch (error) {
    console.error("Error fetching photographer info:", error)
  }

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions about my wildlife photography services, print purchases, or workshop availability? I'd love
              to hear from you. Fill out the form or use the contact information below.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="text-primary h-5 w-5" />
                <span>{contactEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-primary h-5 w-5" />
                <span>{contactLocation}</span>
              </div>
            </div>

            <div className="aspect-video relative rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110398.95796898!2d-95.33553148359373!3d29.99880000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b9c2bd6c3cf3%3A0x96186793d3c8c10f!2sHumble%2C%20TX!5e0!3m2!1sen!2sus!4v1651597022215!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Map showing Humble, Texas - base of operations for David Martin Wildlife Photography"
              ></iframe>
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="pt-6">
              {/* Wrap ContactForm in Suspense */}
              <Suspense fallback={<div className="p-4 text-center">Loading contact form...</div>}>
                <ContactForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
