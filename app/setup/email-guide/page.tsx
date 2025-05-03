import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertTriangle, CheckCircle } from "lucide-react"

export default function EmailSetupGuidePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Gmail Setup Guide for Contact Form</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Setting up Gmail for your Contact Form</CardTitle>
          <CardDescription>Follow these steps to configure Gmail to work with your contact form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Gmail requires an App Password for third-party applications, not your regular Gmail password.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 1: Enable 2-Step Verification</h2>
            <p>Before you can create an App Password, you need to enable 2-Step Verification on your Google Account:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Go to your{" "}
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Google Account Security settings
                </a>
              </li>
              <li>Select "2-Step Verification" under "Signing in to Google"</li>
              <li>Follow the steps to turn on 2-Step Verification</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 2: Create an App Password</h2>
            <p>Once 2-Step Verification is enabled:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Go to your{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  App passwords page
                </a>
              </li>
              <li>Click "Select app" and choose "Mail"</li>
              <li>Click "Select device" and choose "Other"</li>
              <li>Enter a name (e.g., "DaveyPics Website")</li>
              <li>Click "Generate"</li>
              <li>
                Google will display a 16-character password. <strong>Copy this password</strong>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 3: Update your .env.local file</h2>
            <p>Update your .env.local file with the following:</p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>
                EMAIL_USER=your-gmail-address@gmail.com{"\n"}
                EMAIL_PASSWORD=your-16-character-app-password
              </code>
            </pre>
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Never commit your .env.local file to version control. Make sure it's included in your .gitignore file.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 4: Test your configuration</h2>
            <p>After updating your environment variables:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Restart your development server</li>
              <li>
                Go to the{" "}
                <Link href="/test-email" className="text-primary underline">
                  Email Test Page
                </Link>{" "}
                to verify your setup
              </li>
            </ol>
          </div>

          <Alert variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              If you're deploying to Vercel, make sure to add these environment variables in your Vercel project
              settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link href="/setup" className="text-primary underline">
          Back to Setup
        </Link>
        <Link href="/test-email" className="text-primary underline">
          Test Email Configuration
        </Link>
      </div>
    </div>
  )
}
