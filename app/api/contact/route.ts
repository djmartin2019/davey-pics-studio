import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Configure email transporter with environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Disable connection verification since DNS lookup isn't available in preview
  secure: true,
  tls: {
    // Ignore server certificate verification
    rejectUnauthorized: false,
  },
})

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required fields" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address" }, { status: 400 })
    }

    // Log environment variables status (without exposing actual values)
    console.log("Email environment variables status:", {
      EMAIL_USER_set: Boolean(process.env.EMAIL_USER),
      EMAIL_PASSWORD_set: Boolean(process.env.EMAIL_PASSWORD),
    })

    // Check if email credentials are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured. Please try again later or contact us directly.",
          debug: process.env.NODE_ENV === "development" ? "Missing email credentials" : undefined,
        },
        { status: 500 },
      )
    }

    // Prepare email content
    const mailOptions = {
      from: `"DaveyPics Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Contact Form: ${subject || "New message from your website"}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${subject ? `<p><strong>Inquiry Type:</strong> ${subject}</p>` : ""}
          <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p style="margin-top: 0;"><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            This email was sent from the contact form on your DaveyPics website.
          </p>
        </div>
      `,
    }

    try {
      // Send the email
      const info = await transporter.sendMail(mailOptions)

      console.log("Email sent successfully:", {
        messageId: info.messageId,
        response: info.response,
      })

      // Return success response
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully! We'll get back to you soon.",
        messageId: info.messageId,
      })
    } catch (emailError) {
      console.error("Error sending email:", emailError)

      // Check if it's a Gmail authentication error
      const isAuthError =
        emailError.code === "EAUTH" && String(emailError).includes("Username and Password not accepted")

      const errorMessage = isAuthError
        ? "Email authentication failed. Please ensure you're using an App Password for Gmail, not your regular password. See https://support.google.com/accounts/answer/185833 for instructions on creating an App Password."
        : "Failed to send email. Please try again later or contact us directly."

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          error: process.env.NODE_ENV === "development" ? String(emailError) : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing request:", error)

    // Return error response with more details in development
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to process your request. Please try again later or contact us directly at daveypicsstudio@gmail.com.",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    )
  }
}
