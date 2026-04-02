import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

export const sendContactEmail = async (req, res) => {
  const { fullName, contactNo, email, commentsOrMessage } = req.body;

  if (!fullName || !contactNo || !email || !commentsOrMessage) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // ── 1. Save to DB (this is mandatory) ────────────────────────────────────
  try {
    await Contact.create({ fullName, contactNo, email, commentsOrMessage });
  } catch (dbError) {
    console.error("Failed to save contact in database:", dbError);
    return res.status(500).json({ message: "Failed to save your message. Please try again." });
  }

  // ── 2. Respond immediately with success ──────────────────────────────────
  // The enquiry is now in the DB. Email is sent in the background (non-blocking).
  res.status(200).json({ message: "Your message has been received successfully." });

  // ── 3. Attempt email notification (best-effort, does NOT affect response) ─
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
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    // Email to Sugar Times inbox
    await transporter.sendMail({
      from: `"Sugar Times Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: #000; color: #fff; padding: 24px;">
            <h2 style="margin: 0; font-size: 22px;">New Contact Message</h2>
            <p style="margin: 4px 0 0; color: #9ca3af; font-size: 14px;">Via Sugar Times Magazine Contact Form</p>
          </div>
          <div style="padding: 24px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 140px;">Full Name</td>
                <td style="padding: 10px 0; color: #6b7280;">${fullName}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">Contact No.</td>
                <td style="padding: 10px 0; color: #6b7280;">${contactNo}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">Email</td>
                <td style="padding: 10px 0; color: #6b7280;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #6b7280;">${commentsOrMessage}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
            Sugar Times Magazine &bull; Contact Form Submission
          </div>
        </div>
      `,
    });

    // Confirmation email to the user
    await transporter.sendMail({
      from: `"Sugar Times Magazine" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message – Sugar Times Magazine",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: #000; color: #fff; padding: 24px;">
            <h2 style="margin: 0; font-size: 22px;">Thank you, ${fullName}!</h2>
            <p style="margin: 4px 0 0; color: #9ca3af; font-size: 14px;">Sugar Times Magazine</p>
          </div>
          <div style="padding: 24px; background: #fff;">
            <p style="color: #374151; line-height: 1.6;">We have received your message and will get back to you shortly.</p>
            <div style="background: #f9fafb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 0; color: #6b7280; font-style: italic;">"${commentsOrMessage}"</p>
            </div>
            <p style="color: #374151; line-height: 1.6;">Our team typically responds within 24–48 hours.</p>
          </div>
          <div style="background: #000; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Sugar Times Magazine &bull; India's No.1 Sugar Industry Publication</p>
          </div>
        </div>
      `,
    });

    console.log(`Email notifications sent for enquiry from ${email}`);
  } catch (emailErr) {
    // Email failure is silently logged — does NOT affect the already-sent 200 response
    console.error("Background email send failed:", emailErr.message);
  }
};
