"use client";
import { useState } from "react";
import { contactAPI } from "@/lib/api";


export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    contactNo: "",
    email: "",
    commentsOrMessage: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await contactAPI.send(form);
      setStatus("success");
      setForm({ fullName: "", contactNo: "", email: "", commentsOrMessage: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err.response?.data?.message || err.message || "Failed to send. Please try again."
      );
    }
  };


  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#fff" }}>

      {/* ═══════════════════ TOP: Contact Us ═══════════════════ */}
      <div style={{ padding: "40px 48px 48px", background: "#fff" }}>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#111" }}>
          Contact Us
        </h1>
        <p style={{ color: "#555", fontSize: 14, margin: "0 0 32px", lineHeight: 1.6 }}>
          We&apos;re always happy to hear from our readers, advertisers, and partners.
          If you have any questions, feedback, or suggestions, please feel free to get in touch with us.
        </p>

        {/* Map + Info Row */}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* ── Google Map ── */}
          <div style={{ flex: "0 0 auto" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6866.056408725164!2d81.852759!3d25.476161!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399aca8f1ede9ec5%3A0xe6180b8bd9e6320a!2sSugar%20Times%20Magazine!5e1!3m2!1sen!2sin!4v1774954509068!5m2!1sen!2sin"
              width="420"
              height="320"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sugar Times Magazine Location"
            />
          </div>

          {/* ── Contact Info Cards ── */}
          <div
            style={{
              flex: 1,
              minWidth: 280,
              background: "linear-gradient(135deg, #f8f8f8 0%, #eaf9fb 100%)",
              borderRadius: 8,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Address */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 6px", color: "#222" }}>Address</p>
                <p style={{ color: "#555", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                  485 Mumfordganj, Prayagraj &nbsp;211 002 (U.P.)
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: 0 }} />

            {/* Telephone */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 6px", color: "#222" }}>Telephone</p>
                <p style={{ color: "#555", fontSize: 14, margin: "0 0 2px" }}>+91-0532-2440267</p>
                <p style={{ color: "#555", fontSize: 14, margin: 0 }}>+91-73554 53462</p>
              </div>
            </div>

            {/* Divider */}
            <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: 0 }} />

            {/* Email */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 6px", color: "#222" }}>Email</p>
                <a href="mailto:info@sugartimes.co.in" style={{ color: "#00bcd4", fontSize: 14, display: "block", textDecoration: "none", marginBottom: 2 }}>
                  info@sugartimes.co.in
                </a>
                <a href="mailto:upsugartimes@gmail.com" style={{ color: "#00bcd4", fontSize: 14, display: "block", textDecoration: "none" }}>
                  upsugartimes@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ WHATSAPP BANNER ═══════════════════ */}
      <div
        style={{
          background: "#00bcd4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 48px",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="white">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.214 6.347L4.05 28l6.91-1.816A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.5a9.43 9.43 0 0 1-4.78-1.294l-.343-.203-3.56.935.952-3.479-.223-.358A9.444 9.444 0 0 1 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm5.197-7.115c-.285-.143-1.688-.833-1.95-.927-.262-.095-.453-.143-.644.143-.19.285-.738.927-.904 1.118-.167.19-.333.214-.617.071-.285-.143-1.202-.443-2.29-1.413-.846-.754-1.418-1.688-1.584-1.972-.166-.285-.018-.439.125-.581.128-.128.285-.333.428-.5.143-.166.19-.285.285-.476.095-.19.048-.357-.024-.5-.071-.143-.644-1.551-.882-2.122-.232-.553-.47-.477-.644-.486l-.548-.01c-.19 0-.5.072-.762.357-.262.285-1 .977-1 2.382s1.024 2.764 1.167 2.955c.143.19 2.016 3.078 4.885 4.316.683.295 1.215.47 1.63.602.685.218 1.308.187 1.802.113.55-.082 1.688-.69 1.927-1.356.238-.667.238-1.238.166-1.356-.071-.119-.262-.19-.548-.333z"/>
          </svg>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
            Connect with us on WhatsApp
          </span>
        </div>
        <a
          href="https://wa.me/917355453462"
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#fff",
            color: "#00bcd4",
            fontWeight: 700,
            fontSize: 13,
            padding: "8px 24px",
            borderRadius: 4,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Message Us
        </a>
      </div>

      {/* ═══════════════════ GET IN CONTACT (dark) ═══════════════════ */}
      <div style={{ background: "#000", padding: "50px 48px 64px" }}>
        <h2
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          GET IN CONTACT
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 660, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}
        >
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              required
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Contact No */}
          <div>
            <label style={labelStyle}>Contact No.</label>
            <input
              required
              name="contactNo"
              value={form.contactNo}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Comments / Message */}
          <div>
            <label style={labelStyle}>Comments or Message</label>
            <textarea
              required
              name="commentsOrMessage"
              value={form.commentsOrMessage}
              onChange={handleChange}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Status messages */}
          {status === "success" && (
            <p style={{ color: "#4ade80", fontSize: 14, textAlign: "center", margin: 0 }}>
              ✅ Your message has been sent! We&apos;ll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p style={{ color: "#f87171", fontSize: 14, textAlign: "center", margin: 0 }}>
              ❌ {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: status === "loading" ? "#333" : "#111",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: 4,
                padding: "11px 44px",
                fontSize: 14,
                fontWeight: 600,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                letterSpacing: 1,
                transition: "background 0.2s",
              }}
            >
              {status === "loading" ? "Sending…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  color: "#ccc",
  fontSize: 13,
  display: "block",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  background: "#fff",
  border: "none",
  borderRadius: 2,
  padding: "10px 14px",
  fontSize: 14,
  color: "#111",
  boxSizing: "border-box",
  outline: "none",
};
