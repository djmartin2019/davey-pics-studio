"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"
import { getAllServices } from "@/lib/api"

// Add this function to fetch services at the component level
async function getServiceOptions() {
  try {
    const services = await getAllServices()
    return services.map((service) => ({
      value: service.fields.slug,
      label: service.fields.serviceName,
    }))
  } catch (error) {
    console.error("Error fetching services for contact form:", error)
    return []
  }
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
    details?: string | null
  }>({
    type: null,
    message: null,
    details: null,
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string },
  ) => {
    const { name, value } = "target" in e ? e.target : e
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Inside your ContactForm component, add this before the return statement
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get("service")

  // Add a state for services
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(serviceParam || "")

  // Add this useEffect to fetch services
  useEffect(() => {
    async function loadServices() {
      const serviceOptions = await getServiceOptions()
      setServices(serviceOptions)

      // If there's a service in the URL params, select it
      if (serviceParam && serviceOptions.some((s) => s.value === serviceParam)) {
        setSelectedService(serviceParam)
      }
    }

    loadServices()
  }, [serviceParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: null, message: null })

    try {
      // Basic client-side validation
      if (!formData.name.trim()) {
        throw new Error("Please enter your name")
      }

      if (!formData.email.trim()) {
        throw new Error("Please enter your email address")
      }

      if (!formData.message.trim()) {
        throw new Error("Please enter a message")
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Use the appropriate endpoint based on environment
      const endpoint = process.env.NODE_ENV === "production" ? "/api/contact-prod" : "/api/contact"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, service: selectedService }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({
          type: "success",
          message: data.message || "Your message has been sent successfully!",
          details: data.messageId ? `Message ID: ${data.messageId}` : null,
        })
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
        setSelectedService("")
      } else {
        setFormStatus({
          type: "error",
          message: data.message || "Failed to send your message. Please try again later.",
          details: data.error,
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formStatus.type && (
        <Alert variant={formStatus.type === "success" ? "default" : "destructive"}>
          <AlertTitle>{formStatus.type === "success" ? "Success!" : "Error"}</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{formStatus.message}</p>
            {formStatus.details && process.env.NODE_ENV === "development" && (
              <p className="text-xs opacity-80">{formStatus.details}</p>
            )}
            {formStatus.type === "error" && (
              <p className="text-xs mt-2">
                If you're using the preview environment, email sending might not work due to network limitations. Please
                try again after deployment.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            required
            className="bg-background/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Inquiry Type</Label>
        <Select
          name="subject"
          value={formData.subject}
          onValueChange={(value) => handleChange({ name: "subject", value })}
        >
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Select inquiry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prints">Print Purchase</SelectItem>
            <SelectItem value="licensing">Photo Licensing</SelectItem>
            <SelectItem value="collaboration">Collaboration</SelectItem>
            <SelectItem value="workshop">Workshop Information</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* In your form, add a select field for services */}
      {/* Add this after the subject field */}
      <div className="space-y-2">
        <Label htmlFor="service">Interested in a specific service?</Label>
        <Select name="service" value={selectedService} onValueChange={(value) => setSelectedService(value)}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Select a service (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Select a service (optional)</SelectItem>
            {services.map((service) => (
              <SelectItem key={service.value} value={service.value}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message"
          rows={5}
          required
          className="bg-background/50"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Send Message
            <Send className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  )
}
