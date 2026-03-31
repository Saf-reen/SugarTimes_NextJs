"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Contact Us</h1>
        <p className="text-slate-500">Get in touch with the Sugartimes team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info */}
        <div className="space-y-5">
          {[
            { icon: <MapPin size={20} className="text-amber-500" />, title: "Address", lines: ["123 Sugar House, Connaught Place", "New Delhi – 110001, India"] },
            { icon: <Phone size={20} className="text-amber-500" />, title: "Phone", lines: ["+91 98765 43210", "+91 11 2345 6789"] },
            { icon: <Mail size={20} className="text-amber-500" />, title: "Email", lines: ["info@sugartimes.com", "subscriptions@sugartimes.com"] },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
              <div>
                <p className="font-bold text-slate-800 mb-1">{item.title}</p>
                {item.lines.map((l) => <p key={l} className="text-sm text-slate-500">{l}</p>)}
              </div>
            </div>
          ))}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <p className="font-bold text-slate-800 mb-1">Office Hours</p>
            <p className="text-sm text-slate-500">Mon–Fri: 9:00 AM – 6:00 PM</p>
            <p className="text-sm text-slate-500">Sat: 10:00 AM – 2:00 PM</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-500 mb-6">We&apos;ll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-600 transition-colors">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                  <option value="">Select a subject</option>
                  <option>Subscription Inquiry</option>
                  <option>Advertising</option>
                  <option>Editorial</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your message..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
