import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

export const sendContactEmail = async (req, res) => {
  const { fullName, designation, email, contactNo, subject, commentsOrMessage } = req.body;

  if (!fullName || !email || !commentsOrMessage) {
    return res.status(400).json({ message: "Name, Email, and Message are required." });
  }

  // ── 1. Save to DB ────────────────────────────────────────────────────────
  try {
    await Contact.create({ fullName, designation, email, contactNo, subject, commentsOrMessage });
  } catch (dbError) {
    console.error("Failed to save contact in database:", dbError);
    return res.status(500).json({ message: "Failed to save your message. Please try again." });
  }

  // ── 2. Respond immediately ────────────────────────────────────────────────
  res.status(200).json({ message: "Your message has been received successfully." });

  // ── 3. Email notification (best-effort, non-blocking) ─────────────────────
  const emailConfigured =
    process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== "your_gmail@gmail.com" &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== "your_gmail_app_password";

  if (!emailConfigured) {
    console.log("Email not configured – enquiry saved to DB only.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    });

    const subjectLabel = subject || "General Enquiry";
    const designationLabel = designation ? `${designation}` : "—";

    // Email to Sugar Times inbox (info@sugartimes.co.in)
    await transporter.sendMail({
      from: `"Sugar Times Contact Form" <${process.env.EMAIL_USER}>`,
      to: "sandalanithinkumar123@gmail.com",
      replyTo: email,
      subject: `[${subjectLabel}] New message from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
          <div style="background: #1b5e20; color: #fff; padding: 24px 28px;">
            <h2 style="margin: 0; font-size: 20px;">New Contact Form Submission</h2>
            <p style="margin: 4px 0 0; color: #a5d6a7; font-size: 13px;">Sugar Times Magazine — Contact Form</p>
          </div>
          <div style="padding: 28px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 160px; border-bottom: 1px solid #f3f4f6;">Full Name</td>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; border-bottom: 1px solid #f3f4f6;">Designation / Org</td>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">${designationLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; border-bottom: 1px solid #f3f4f6;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email}" style="color: #1b5e20;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; border-bottom: 1px solid #f3f4f6;">Phone / WhatsApp</td>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">${contactNo || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; border-bottom: 1px solid #f3f4f6;">Subject</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <span style="background: #e8f5e9; color: #1b5e20; padding: 3px 10px; border-radius: 20px; font-weight: bold; font-size: 12px;">${subjectLabel}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #6b7280; white-space: pre-wrap;">${commentsOrMessage}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f9fafb; padding: 14px; text-align: center; font-size: 12px; color: #9ca3af;">
            Sugar Times Magazine &bull; Contact Form Submission &bull; info@sugartimes.co.in
          </div>
        </div>
      `,
    });

    // Auto-reply to the sender
    await transporter.sendMail({
      from: `"Sugar Times Magazine" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message – Sugar Times Magazine",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
          <div style="background: #1b5e20; color: #fff; padding: 24px 28px;">
            <h2 style="margin: 0; font-size: 20px;">Thank you, ${fullName}!</h2>
            <p style="margin: 4px 0 0; color: #a5d6a7; font-size: 13px;">Sugar Times Magazine</p>
          </div>
          <div style="padding: 28px; background: #fff;">
            <p style="color: #374151; line-height: 1.7; margin-top: 0;">We have received your message regarding <strong>${subjectLabel}</strong> and will get back to you shortly.</p>
            <div style="background: #f9fafb; border-left: 4px solid #1b5e20; padding: 16px; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 0; color: #6b7280; font-style: italic; white-space: pre-wrap;">"${commentsOrMessage}"</p>
            </div>
            <p style="color: #374151; line-height: 1.7;">Our team typically responds within <strong>24–48 hours</strong> during working days.</p>
            <p style="color: #6b7280; font-size: 13px;">For urgent matters, reach us on WhatsApp: <strong>+91 73554 53462</strong></p>
          </div>
          <div style="background: #1b5e20; padding: 14px; text-align: center;">
            <p style="margin: 0; color: #a5d6a7; font-size: 12px;">Sugar Times Magazine &bull; India's No.1 Sugar Industry Publication</p>
          </div>
        </div>
      `,
    });

    console.log(`Email notifications sent for enquiry from ${email}`);
  } catch (emailErr) {
    console.error("Background email send failed:", emailErr.message);
  }
};
