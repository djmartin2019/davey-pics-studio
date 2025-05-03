import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ArrowRight, Mail } from "lucide-react"

export default function SetupPage() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  const emailPassword = process.env.EMAIL_PASSWORD

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Setup Guide</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Alert className="bg-blue-100 border-blue-500">
          <AlertTitle>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Contentful Configuration
            </span>
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p>
                NEXT_PUBLIC_CONTENTFUL_SPACE_ID:{" "}
                {spaceId ? (
                  <span className="text-green-600 font-medium">✅ Set</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Not set</span>
                )}
              </p>
              <p>
                CONTENTFUL_ACCESS_TOKEN:{" "}
                {accessToken ? (
                  <span className="text-green-600 font-medium">✅ Set</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Not set</span>
                )}
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className={emailPassword ? "bg-green-100 border-green-500" : "bg-yellow-100 border-yellow-500"}>
          <AlertTitle>
            {emailPassword ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Email Configuration Detected
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Email Not Configured
              </span>
            )}
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p>
                EMAIL_PASSWORD:{" "}
                {emailPassword ? (
                  <span className="text-green-600 font-medium">✅ Set</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Not set</span>
                )}
              </p>
              <Button variant="outline" size="sm" asChild className="mt-2">
                <Link href="/setup/email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Setup Guide
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="local" className="mt-8">
        <TabsList>
          <TabsTrigger value="local">Local Development</TabsTrigger>
          <TabsTrigger value="vercel">Vercel Deployment</TabsTrigger>
          <TabsTrigger value="content">Content Model</TabsTrigger>
        </TabsList>
        <TabsContent value="local" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Local Environment</CardTitle>
              <CardDescription>Follow these steps to configure Contentful for local development</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in your project root
                  directory
                </li>
                <li>
                  Add the following lines to the file:
                  <pre className="mt-2 p-3 bg-muted rounded overflow-x-auto">
                    {`NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
EMAIL_USER=daveypicsstudio@gmail.com
EMAIL_PASSWORD=your_app_specific_password`}
                  </pre>
                </li>
                <li>Replace the placeholder values with your actual credentials</li>
                <li>Restart your development server</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vercel" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Vercel Environment</CardTitle>
              <CardDescription>Follow these steps to configure your Vercel deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-4">
                <li>Go to your project in the Vercel dashboard</li>
                <li>
                  Navigate to <strong>Settings</strong> &gt; <strong>Environment Variables</strong>
                </li>
                <li>
                  Add the following environment variables:
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded">NEXT_PUBLIC_CONTENTFUL_SPACE_ID</div>
                      <div className="p-2 bg-muted rounded">your_space_id_here</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded">CONTENTFUL_ACCESS_TOKEN</div>
                      <div className="p-2 bg-muted rounded">your_access_token_here</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded">EMAIL_USER</div>
                      <div className="p-2 bg-muted rounded">daveypicsstudio@gmail.com</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded">EMAIL_PASSWORD</div>
                      <div className="p-2 bg-muted rounded">your_app_specific_password</div>
                    </div>
                  </div>
                </li>
                <li>
                  Click <strong>Save</strong>
                </li>
                <li>Redeploy your application</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contentful Content Model</CardTitle>
              <CardDescription>Make sure your Contentful space has the required content models</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Your Contentful space needs the following content models for this application to work properly:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Homepage</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <code>heroTitle</code> (Short text) - Title for the hero section
                    </li>
                    <li>
                      <code>heroSubtitle</code> (Short text) - Subtitle for the hero section
                    </li>
                    <li>
                      <code>heroImage</code> (Media) - Background image for the hero section
                    </li>
                    <li>
                      <code>featuredGallery</code> (Reference, 1 item) - Link to a gallery collection to feature
                    </li>
                    <li>
                      <code>featuredPosts</code> (Reference, many items) - Links to blog posts to feature
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Blog Post</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <code>title</code> (Short text) - Post title
                    </li>
                    <li>
                      <code>slug</code> (Short text) - URL-friendly identifier
                    </li>
                    <li>
                      <code>excerpt</code> (Short text) - Brief summary
                    </li>
                    <li>
                      <code>content</code> (Rich text) - Main content
                    </li>
                    <li>
                      <code>featuredImage</code> (Media) - Featured image
                    </li>
                    <li>
                      <code>author</code> (Reference, 1 item) - Link to author
                    </li>
                    <li>
                      <code>publishDate</code> (Date & time) - Publication date
                    </li>
                    <li>
                      <code>categories</code> (Reference, many items) - Links to categories
                    </li>
                    <li>
                      <code>relatedPosts</code> (Reference, many items) - Links to related posts
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Gallery Item</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <code>title</code> (Short text) - Photo title
                    </li>
                    <li>
                      <code>description</code> (Short text) - Photo description
                    </li>
                    <li>
                      <code>image</code> (Media) - The photo
                    </li>
                    <li>
                      <code>location</code> (Short text) - Where the photo was taken
                    </li>
                    <li>
                      <code>category</code> (Reference, 1 item) - Link to category
                    </li>
                    <li>
                      <code>featured</code> (Boolean) - Whether to feature this photo
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/contentful-content-model.md" className="flex items-center gap-2">
                  View Full Content Model Guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button asChild>
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>

      <div className="mt-8 space-y-2">
        <h3 className="text-lg font-medium">Email Configuration</h3>
        <p>Set up email for the contact form:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Add EMAIL_USER and EMAIL_PASSWORD to .env.local</li>
          <li>
            For Gmail, you need to use an App Password -{" "}
            <Link href="/setup/email-guide" className="text-primary underline">
              See detailed guide
            </Link>
          </li>
          <li>
            <Link href="/test-email" className="text-primary underline">
              Test email functionality
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
