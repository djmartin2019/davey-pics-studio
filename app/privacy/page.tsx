import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Privacy Policy | David Martin Photography",
  description: "Privacy policy for David Martin Photography website",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <h2>Introduction</h2>
            <p>
              David Martin Photography ("we," "our," or "us") respects your privacy and is committed to protecting your
              personal data. This privacy policy explains how we collect, use, and safeguard your information when you
              visit our website (the "Website") or contact us.
            </p>

            <h2>Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>
                <strong>Personal Information:</strong> When you contact us through our contact form, we collect your
                name, email address, and any other information you choose to provide.
              </li>
              <li>
                <strong>Usage Data:</strong> We automatically collect information about how you interact with our
                Website, including your IP address, browser type, pages viewed, time spent on pages, and referring
                website addresses.
              </li>
              <li>
                <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to
                track activity on our Website and hold certain information to improve your experience.
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Respond to your inquiries and provide you with information you request</li>
              <li>Improve our Website and understand how users interact with it</li>
              <li>Communicate with you about our services, events, or other information you might find interesting</li>
              <li>Protect against, identify, and prevent fraud and other illegal activity</li>
            </ul>

            <h2>Data Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties except in the
              following circumstances:
            </p>
            <ul>
              <li>With service providers who assist us in operating our Website and conducting our business</li>
              <li>When required by law or to protect our rights</li>
              <li>In the event of a business transfer, such as a merger or acquisition</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. However, no method of
              transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
              security.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access the personal information we hold about you</li>
              <li>The right to request correction of inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to restrict or object to processing of your information</li>
            </ul>

            <h2>Children's Privacy</h2>
            <p>
              Our Website is not intended for children under 16 years of age. We do not knowingly collect personal
              information from children under 16.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{" "}
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
