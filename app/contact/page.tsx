import type { Metadata } from "next"
import Image from "next/image"
import { Mail, MapPin, Instagram } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ContactForm from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact | David Martin Photography",
  description: "Get in touch with David Martin for photography inquiries, collaborations, or print purchases",
}

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?key=tja72"
            alt="Contact"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Get In Touch</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            I'd love to hear from you about photography, collaborations, or print inquiries
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-muted-foreground mb-1">For inquiries and collaborations</p>
                    <a href="mailto:daveypicsstudio@gmail.com" className="text-primary hover:underline">
                      daveypicsstudio@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Instagram className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Instagram</h3>
                    <p className="text-muted-foreground mb-1">Follow my latest work</p>
                    <a
                      href="https://instagram.com/davey.pics"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @davey.pics
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Location</h3>
                    <p className="text-muted-foreground mb-1">Based in</p>
                    <p>Houston, Texas</p>
                  </div>
                </div>
              </div>

              <div className="aspect-video relative rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443088.20075264716!2d-95.73095328906248!3d29.817350000000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1651597022215!5m2!1sen!2sus"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="pt-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Do you sell prints of your photographs?</h3>
              <p className="text-muted-foreground">
                I currently do not have a process for selling prints. However, if you would like to purchase any of my work, I would love to chat with you further!
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Are you available for commissioned work?</h3>
              <p className="text-muted-foreground">
                I'm open to commissioned projects related to wildlife photography, especially birds. Let's discuss your
                vision.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Do you offer photography workshops?</h3>
              <p className="text-muted-foreground">
                I currently do not host any workshops, but if you're interested please reach out and let me know!
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Can I license your photos for commercial use?</h3>
              <p className="text-muted-foreground">
                Yes, licensing options are available for commercial and editorial use. Please contact me with details
                about your project.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
