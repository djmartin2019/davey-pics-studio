import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Terms of Service | David Martin Photography",
  description: "Terms of service for David Martin Photography website",
}

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col py-20 bg-background">
      <div className="container mx-auto px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <h2>Introduction</h2>
            <p>
              Welcome to David Martin Photography. These Terms of Service ("Terms") govern your use of our website (the
              "Website") and the content, features, and services we offer. By accessing or using our Website, you agree
              to be bound by these Terms.
            </p>

            <h2>Intellectual Property Rights</h2>
            <p>
              All content on this Website, including but not limited to photographs, images, text, graphics, logos, and
              design elements, is the property of David Martin Photography and is protected by copyright, trademark, and
              other intellectual property laws.
            </p>
            <p>
              You may view and browse the Website for your personal, non-commercial use. You may not reproduce,
              distribute, modify, create derivative works from, publicly display, publicly perform, republish, download,
              store, or transmit any of the material on our Website without our express written consent.
            </p>

            <h2>Use of the Website</h2>
            <p>
              You agree to use the Website only for lawful purposes and in a way that does not infringe upon the rights
              of others or restrict their use of the Website. Prohibited uses include:
            </p>
            <ul>
              <li>Using the Website in any way that violates applicable laws or regulations</li>
              <li>Attempting to gain unauthorized access to any part of the Website</li>
              <li>Using the Website to transmit or upload viruses or malicious code</li>
              <li>Engaging in any activity that could damage, disable, or impair the Website's functionality</li>
              <li>Collecting or harvesting any information from the Website without authorization</li>
            </ul>

            <h2>User Submissions</h2>
            <p>
              If you submit any information or material to us through the Website (such as through contact forms), you
              grant us a non-exclusive, royalty-free, perpetual, irrevocable right to use, reproduce, modify, adapt,
              publish, translate, and distribute such material.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              The Website and its content are provided on an "as is" and "as available" basis without any warranties of
              any kind, either express or implied. We do not warrant that the Website will be uninterrupted or
              error-free, that defects will be corrected, or that the Website is free of viruses or other harmful
              components.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, David Martin Photography shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of or relating to your use of the
              Website.
            </p>

            <h2>Links to Third-Party Websites</h2>
            <p>
              Our Website may contain links to third-party websites. These links are provided solely for your
              convenience. We have no control over the content of these websites and accept no responsibility for them
              or for any loss or damage that may arise from your use of them.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may revise these Terms at any time by updating this page. By continuing to use the Website after such
              changes, you agree to be bound by the revised Terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without
              regard to its conflict of law provisions.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:daveypicsstudio@gmail.com" className="text-primary hover:underline">
                daveypicsstudio@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
