import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ContentfulError() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Contentful Connection Error</AlertTitle>
        <AlertDescription>
          <p>Unable to connect to Contentful. This could be due to missing or incorrect environment variables.</p>
        </AlertDescription>
      </Alert>

      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>

        <ol className="list-decimal pl-5 space-y-3">
          <li>
            Check that you've added the <code>CONTENTFUL_ACCESS_TOKEN</code> environment variable to your Vercel project
          </li>
          <li>Verify that the token value is correct and has not expired</li>
          <li>
            Make sure the Space ID is correct in <code>NEXT_PUBLIC_CONTENTFUL_SPACE_ID</code>
          </li>
          <li>Redeploy your application after making any changes to environment variables</li>
        </ol>

        <div className="mt-6 flex gap-4">
          <Button asChild>
            <Link href="/setup">View Setup Guide</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/api/contentful-test">Test Contentful Connection</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
