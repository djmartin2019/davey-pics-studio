import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DebugPage() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Debug</h1>

      <Alert className={spaceId && accessToken ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"}>
        <AlertTitle>Environment Variables Status</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-2">
            <li>
              NEXT_PUBLIC_CONTENTFUL_SPACE_ID:{" "}
              {spaceId ? (
                <span className="text-green-600 font-medium">✅ Set</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Not set</span>
              )}
            </li>
            <li>
              CONTENTFUL_ACCESS_TOKEN:{" "}
              {accessToken ? (
                <span className="text-green-600 font-medium">✅ Set</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Not set</span>
              )}
            </li>
          </ul>

          {!spaceId || !accessToken ? (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-medium text-yellow-800">How to fix:</h3>
              <ol className="list-decimal ml-5 mt-2 text-yellow-800">
                <li>
                  Create a <code>.env.local</code> file in your project root directory
                </li>
                <li>
                  Add the following lines to the file:
                  <pre className="mt-2 p-2 bg-gray-800 text-gray-200 rounded overflow-x-auto">
                    {`NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here`}
                  </pre>
                </li>
                <li>Replace the placeholder values with your actual Contentful credentials</li>
                <li>Restart your development server</li>
              </ol>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-medium text-green-800">All environment variables are properly configured! 🎉</h3>
            </div>
          )}
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <Button asChild>
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  )
}
