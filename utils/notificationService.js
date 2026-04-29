import nodemailer from "nodemailer";

/**
 * Sends credentials to the user via Email and (optional) WhatsApp.
 * @param {Object} params
 * @param {string} params.name - User's full name
 * @param {string} params.email - User's email address
 * @param {string} params.mobile - User's mobile number
 * @param {string} params.password - Generated password
 * @param {string} params.type - "digital" or "print" subscription
 */
export const sendWelcomeCredentials = async ({ name, email, mobile, password, type }) => {
  console.log(`Sending credentials to ${email} and ${mobile}...`);

  // 1. Email Notification
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

    await transporter.sendMail({
      from: `"Sugar Times Magazine" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Sugar Times – Your Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
          <div style="background: #1b5e20; color: #fff; padding: 24px 28px;">
            <h2 style="margin: 0; font-size: 20px;">Welcome to Sugar Times, ${name}!</h2>
            <p style="margin: 4px 0 0; color: #a5d6a7; font-size: 13px;">Your Subscription is Active</p>
          </div>
          <div style="padding: 28px; background: #fff;">
            <p style="color: #374151; line-height: 1.7; margin-top: 0;">Thank you for subscribing to the <strong>${type.toUpperCase()}</strong> edition of Sugar Times Magazine.</p>
            
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 12px; margin: 24px 0;">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; color: #1b5e20; text-transform: uppercase; letter-spacing: 1px;">Your Account Info</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Password</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold; font-family: monospace;">${password}</td>
                </tr>
              </table>
            </div>

            <p style="color: #374151; line-height: 1.7;">You can now log in to our website to access the e-magazine and manage your subscription.</p>
            
            <a href="https://sugartimes.co.in/login" style="display: inline-block; background: #1b5e20; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;">Login to Dashboard</a>
          </div>
          <div style="background: #f9fafb; padding: 14px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            Sugar Times Magazine &bull; India's No.1 Sugar Industry Publication
          </div>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
  }

  // 2. WhatsApp Notification
  // Note: Placeholder for the WhatsApp API mentioned by the user.
  // Currently, we'll log it. If a specific API was uploaded, it should hook here.
  try {
    const waMessage = `Welcome to Sugar Times, ${name}! Your ${type} subscription is now active.
Login: https://sugartimes.co.in/login
User: ${email}
Pass: ${password}
Enjoy reading!`;

    console.log(`[WhatsApp Simulation] To: ${mobile} | Msg: ${waMessage}`);
    
    // TODO: Integrate with the WhatsApp API provided by the user.
    // Example: await axios.post(WHATSAPP_API_URL, { phone: mobile, message: waMessage });
    
  } catch (err) {
    console.error("Failed to send WhatsApp notification:", err.message);
  }
};

/**
 * Sends a 6-digit OTP to the user's email for login verification.
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP string
 */
export const sendOtpEmail = async (email, otp) => {
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

    await transporter.sendMail({
      from: `"Sugar Times Magazine" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Login Verification Code – Sugar Times",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
          <div style="background: #10b981; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">Verification Code</h2>
          </div>
          <div style="padding: 30px; background: #fff; text-align: center;">
            <p style="color: #374151; font-size: 15px; margin-top: 0;">Use the following 6-digit code to securely log in to your account.</p>
            
            <div style="background: #f9fafb; border: 1px dashed #10b981; padding: 20px; border-radius: 12px; margin: 24px 0;">
              <h1 style="margin: 0; font-size: 32px; color: #10b981; letter-spacing: 5px;">${otp}</h1>
            </div>

            <p style="color: #6b7280; font-size: 13px;">This code is valid for 5 minutes. If you did not request this code, you can safely ignore this email.</p>
          </div>
          <div style="background: #f9fafb; padding: 14px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            Sugar Times Magazine &bull; India's No.1 Sugar Industry Publication
          </div>
        </div>
      `,
    });
    console.log(`[Email OTP] Sent successfully to ${email}`);
    return { success: true };
  } catch (err) {
    console.error("[Email OTP] Failed to send email:", err.message);
    return { success: false, error: err.message };
  }
};
