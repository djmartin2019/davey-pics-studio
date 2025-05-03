import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Info } from "lucide-react"

export default function EmailSetupPage() {
  const emailUser = process.env.EMAIL_USER
  const emailPassword = process.env.EMAIL_PASSWORD

  return (
    <div className="container mx-auto py-12 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/setup" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Setup
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Email Configuration Setup</h1>

      <Alert className={emailPassword ? "bg-green-100 border-green-500" : "bg-yellow-100 border-yellow-500"}>
        <AlertTitle>
          {emailPassword ? "Email Configuration Status: Configured" : "Email Configuration Status: Not Configured"}
        </AlertTitle>
        <AlertDescription>
          <div className="mt-2">
            <p>
              EMAIL_USER:{" "}
              {emailUser ? (
                <span className="text-green-600 font-medium">✅ Set</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Not set</span>
              )}
            </p>
            <p>
              EMAIL_PASSWORD:{" "}
              {emailPassword ? (
                <span className="text-green-600 font-medium">✅ Set</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Not set</span>
              )}
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Setting Up Email for Contact Form</CardTitle>
          <CardDescription>Follow these steps to configure email sending for your contact form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">1. Create App Password for Gmail</h3>
            <p className="text-muted-foreground mb-4">
              For security reasons, Gmail requires an app-specific password for sending emails from applications.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to your Google Account settings</li>
              <li>Navigate to Security &gt; 2-Step Verification</li>
              <li>Scroll down and click on "App passwords"</li>
              <li>Select "Mail" as the app and "Other" as the device</li>
              <li>Enter a name (e.g., "DaveyPics Website")</li>
              <li>Click "Generate" and copy the 16-character password</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">2. Set Environment Variables</h3>
            <p className="text-muted-foreground mb-4">Add the following environment variables to your project:</p>

            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm">
                {`EMAIL_USER=daveypicsstudio@gmail.com
EMAIL_PASSWORD=your-app-specific-password`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">3. For Local Development</h3>
            <p className="text-muted-foreground mb-4">
              Add these variables to your <code>.env.local</code> file in the project root.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">4. For Vercel Deployment</h3>
            <p className="text-muted-foreground mb-4">Add these variables in your Vercel project settings:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to your Vercel dashboard</li>
              <li>Select your project</li>
              <li>Go to Settings &gt; Environment Variables</li>
              <li>Add both variables</li>
              <li>Redeploy your application</li>
            </ol>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Never commit your email password to your repository. Always use environment variables for sensitive
              information.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/contact">Test Contact Form</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
