import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

    // Check if email credentials are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Email service is not configured. Please try again later." },
        { status: 500 },
      )
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

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

      // Return success response
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully! We'll get back to you soon.",
      })
    } catch (emailError) {
      console.error("Error sending email:", emailError)

      return NextResponse.json(
        { success: false, message: "Failed to send email. Please try again later." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { success: false, message: "Failed to process your request. Please try again later." },
      { status: 500 },
    )
  }
}
