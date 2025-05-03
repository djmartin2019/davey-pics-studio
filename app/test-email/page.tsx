"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Info } from "lucide-react"
import Link from "next/link"

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const sendTestEmail = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          subject: "test",
          message: "This is a test message to verify email functionality.",
        }),
      })

      const data = await response.json()

      setTestResult({
        success: response.ok,
        message: data.message,
        details: data.messageId ? `Message ID: ${data.messageId}` : data.error,
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: "An error occurred while testing the email functionality",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Email Functionality Test</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Email Sending</CardTitle>
          <CardDescription>
            Send a test email to verify that your email configuration is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This test will send an email to <strong>daveypicsstudio@gmail.com</strong> using the configured
              environment variables.
            </AlertDescription>
          </Alert>

          <div className="text-sm space-y-2 mb-4">
            <p>
              <strong>Environment Variables Status:</strong>
            </p>
            <p>EMAIL_USER: {process.env.EMAIL_USER ? "✅ Set" : "❌ Not visible in client"}</p>
            <p>EMAIL_PASSWORD: {process.env.EMAIL_PASSWORD ? "✅ Set" : "❌ Not visible in client"}</p>
            <p className="text-xs text-muted-foreground">
              Note: Environment variables are not directly visible in the browser for security reasons.
            </p>
          </div>

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"} className="mb-4">
              <AlertTitle className="flex items-center gap-2">
                {testResult.success ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Success
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Error
                  </>
                )}
              </AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{testResult.message}</p>
                {testResult.details && <p className="text-xs opacity-80">{testResult.details}</p>}
                {!testResult.success && (
                  <p className="text-xs mt-2">
                    If you're testing in the preview environment, email sending might not work due to network
                    limitations. Deploy to production to test email functionality.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={sendTestEmail} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Send Test Email"
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Go to Contact Form</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
