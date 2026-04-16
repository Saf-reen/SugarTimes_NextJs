"use client";

import { useState, useRef } from "react";
import { Mail, Phone, Clock, Smartphone, ChevronDown, Globe, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SubscriptionSearch from "@/components/renewal/SubscriptionSearch";
import SubscriptionDetailsCard from "@/components/renewal/SubscriptionDetailsCard";
import BenefitCard from "@/components/renewal/BenefitCard";
import RenewalPlanCard, { RENEWAL_PLANS } from "@/components/renewal/RenewalPlanCard";
import RenewalConfirmationForm from "@/components/renewal/RenewalConfirmationForm";
import FAQAccordion from "@/components/renewal/FAQAccordion";

const RENEWAL_BENEFITS = [
  {
    emoji: "\ud83d\udcf0",
    title: "Monthly Magazine",
    description: "Never miss a single monthly issue \u2014 print delivered to your door",
  },
  {
    emoji: "\ud83d\udd14",
    title: "Stay Updated",
    description: "Stay updated with India\u2019s sugar, ethanol & molasses sector every month",
  },
  {
    emoji: "\ud83d\udcbc",
    title: "Exclusive Access",
    description: "Exclusive access to industry data, policy updates & market news",
  },
  {
    emoji: "\ud83c\udf81",
    title: "Loyalty Benefits",
    description: "Loyalty benefits for multi-year renewals \u2014 save more, worry less",
  },
];

export default function RenewalPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpdateDetails, setShowUpdateDetails] = useState(false);
  const [success, setSuccess] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({
    name: "",
    designation: "",
    organisation: "",
    address: "",
    pincode: "",
    mobile: "",
    whatsapp: "",
    email: "",
  });

  const detailsRef = useRef(null);
  const formRef = useRef(null);

  const handleSubscriptionFound = (sub) => {
    setSubscription(sub);
    setSuccess(false);

    // Auto-select the user's existing plan
    const existingPlan = RENEWAL_PLANS.find((p) => p.key === sub.plan);
    setSelectedPlan(existingPlan || null);

    setShowUpdateDetails(false);
    setUpdatedDetails({
      name: sub.name || "",
      designation: sub.designation || "",
      organisation: sub.organisation || "",
      address: sub.deliveryAddress || "",
      pincode: sub.pincode || "",
      mobile: sub.registeredMobile || "",
      whatsapp: sub.whatsapp || "",
      email: sub.registeredEmail || "",
    });
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleRenewalSuccess = () => {
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDetailChange = (field, value) => {
    if (field === "mobile" || field === "whatsapp") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length > 10) return;
      setUpdatedDetails((prev) => ({ ...prev, [field]: digitsOnly }));
      return;
    }
    setUpdatedDetails((prev) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Renewal Successful!</h2>
          <p className="text-slate-500 mb-2">Your Sugar Times subscription has been renewed.</p>
          <p className="text-sm text-slate-400 mb-8">
            Your new validity has been updated. Check your email for confirmation details.
          </p>
          <button
            onClick={() => { setSuccess(false); setSubscription(null); setSelectedPlan(null); }}
            className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-center"
          >
            Back to Renewal Page
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1c13] via-emerald-900 to-teal-900 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center text-white">
          <div className="inline-block px-5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Subscription Renewal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight tracking-tight">
            Renew Your Sugar Times<br className="hidden sm:block" /> Subscription
          </h1>
          <p className="text-lg md:text-xl text-emerald-200/90 mb-3 font-medium">
            {"\u0905\u092a\u0928\u0940 \u0936\u0941\u0917\u0930 \u091f\u093e\u0907\u092e\u094d\u0938 \u0938\u0926\u0938\u094d\u092f\u0924\u093e \u0928\u0935\u0940\u0928\u0940\u0915\u0930\u0923 \u0915\u0930\u0947\u0902"}
          </p>
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Your subscription keeps you connected to India&apos;s sugar industry &mdash; don&apos;t let it lapse.
            Renewing is quick and easy. Choose your preferred plan below and pay securely via Razorpay.
          </p>
          <div className="flex justify-center mt-10">
            <a
              href="/ST Renwal.jpg.jpeg"
              download="SugarTimes_Renewal_Form.jpg"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-emerald-300/30 text-emerald-50 text-sm font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-xl"
            >
              <Download className="w-5 h-5 text-emerald-300" />
              Prefer offline? Download Renewal Form
            </a>
          </div>
        </div>
      </section>

      {/* BENEFITS STRIP */}
      <section className="relative -mt-8 z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {RENEWAL_BENEFITS.map((benefit, idx) => (
            <BenefitCard key={idx} emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
          ))}
        </div>
        <div className="text-center mt-8">
          <h2 className="text-xl md:text-2xl font-black text-slate-800">
            Already a Subscriber? Here&apos;s Why You Should Renew
          </h2>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-12">

        <SubscriptionSearch onSubscriptionFound={handleSubscriptionFound} />

        {subscription && (
          <div ref={detailsRef}>

            <SubscriptionDetailsCard subscription={subscription} />

            {/* CHOOSE RENEWAL PLAN */}
            <div className="mb-14">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Choose Your Renewal Plan</h2>
                <p className="text-slate-500 text-sm md:text-base">
                  Select your plan &mdash; exclusive multi-year savings available
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {RENEWAL_PLANS.map((plan) => (
                  <RenewalPlanCard
                    key={plan.key}
                    plan={plan}
                    subscription={subscription}
                    selected={selectedPlan}
                    onSelect={handlePlanSelect}
                  />
                ))}
              </div>
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center">
                <p className="text-sm text-emerald-800">
                  <span className="font-bold">Tip:</span> Renewing for 2 or 3 years means no follow-up, no lapse risk, and better savings.
                  Most of our loyal readers choose the <span className="font-bold">3-year plan</span>.
                </p>
              </div>
            </div>

            {/* UPDATE DELIVERY DETAILS (Collapsible) */}
            {selectedPlan && (
              <div className="mb-14">
                <button
                  onClick={() => setShowUpdateDetails(!showUpdateDetails)}
                  className="w-full flex items-center justify-between p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-300 transition-all group"
                >
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Update Your Delivery Details
                      <span className="text-sm font-normal text-slate-500 ml-2">(Optional)</span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      If your address, mobile, or email has changed since your last subscription, update it here
                    </p>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${showUpdateDetails ? "rotate-180" : ""}`} />
                </button>
                {showUpdateDetails && (
                  <div className="mt-3 bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-5">
                      {[
                        { key: "name", label: "Full Name", type: "text", placeholder: "As registered" },
                        { key: "designation", label: "Designation", type: "text", placeholder: "e.g., Chief Engineer" },
                        { key: "organisation", label: "Organisation / Mill Name", type: "text", placeholder: "e.g., Bajaj Hindusthan Sugar Ltd." },
                        { key: "pincode", label: "Pin Code", type: "text", placeholder: "e.g., 211002" },
                        { key: "mobile", label: "Mobile Number", type: "tel", placeholder: "e.g., 9876543210", maxLength: 10, inputMode: "numeric" },
                        { key: "whatsapp", label: "WhatsApp Number", type: "tel", placeholder: "If different from mobile", maxLength: 10, inputMode: "numeric" },
                        { key: "email", label: "Email Address", type: "email", placeholder: "e.g., subscriber@example.com" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs uppercase font-bold text-slate-500 mb-2 tracking-wide">{field.label}</label>
                          <input
                            type={field.type}
                            value={updatedDetails[field.key]}
                            onChange={(e) => handleDetailChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            {...(field.maxLength && { maxLength: field.maxLength })}
                            {...(field.inputMode && { inputMode: field.inputMode })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-800 placeholder-slate-400 transition-all"
                          />
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-2 tracking-wide">Complete Delivery Address</label>
                        <textarea
                          value={updatedDetails.address}
                          onChange={(e) => handleDetailChange("address", e.target.value)}
                          placeholder="Full postal address for magazine delivery"
                          rows="3"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-800 placeholder-slate-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RENEWAL FORM WITH RAZORPAY */}
            {selectedPlan && (
              <div ref={formRef}>
                <RenewalConfirmationForm
                  subscription={subscription}
                  selectedPlan={selectedPlan}
                  updatedDetails={showUpdateDetails ? updatedDetails : null}
                  onSuccess={handleRenewalSuccess}
                />
              </div>
            )}

          </div>
        )}

        {/* RENEWAL REMINDERS */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8 mb-12">
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4">Renewal Reminders</h3>
          <p className="text-slate-600 mb-5 text-sm">We send renewal reminders via:</p>
          <div className="space-y-3">
            {[
              { icon: Smartphone, text: "WhatsApp message", detail: "30 days before expiry" },
              { icon: Mail, text: "Email", detail: "30 days and 7 days before expiry" },
              { icon: Clock, text: "Renewal slip in magazine", detail: "2 months before expiry" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-slate-700 text-sm"><span className="font-bold">{item.text}</span> &mdash; {item.detail}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-5 pt-4 border-t border-blue-200">
            Not receiving reminders? Contact{" "}
            <a href="mailto:info@sugartimes.co.in" className="font-bold text-blue-600 hover:underline">info@sugartimes.co.in</a>{" "}or{" "}
            <a href="tel:+917355453462" className="font-bold text-blue-600 hover:underline">+91 7355453462</a>.
          </p>
        </div>

        {/* NEED HELP */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Need Help With Your Renewal?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Smartphone, title: "WhatsApp / Call", links: [{ text: "+91 7355453462", href: "tel:+917355453462" }, { text: "+91 9415305911", href: "tel:+919415305911" }] },
              { icon: Phone, title: "Office", links: [{ text: "0532-2440267", href: "tel:05322440267" }] },
              { icon: Mail, title: "Email", links: [{ text: "info@sugartimes.co.in", href: "mailto:info@sugartimes.co.in" }] },
              { icon: Globe, title: "Website", links: [{ text: "sugartimes.co.in", href: "https://sugartimes.co.in/subscribe" }] },
            ].map((item) => (
              <div key={item.title} className="text-center p-5 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">{item.title}</h3>
                {item.links.map((link) => (
                  <a key={link.text} href={link.href} className="text-emerald-600 hover:underline font-bold text-sm block mt-1">{link.text}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
            <span className="font-bold text-slate-700">Office Hours:</span> Monday &ndash; Saturday, 10:00 AM &ndash; 6:00 PM
          </div>
        </div>

        <FAQAccordion />
      </section>

      {/* FOOTER */}
      <section className="bg-[#0b1c13] text-white py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-black text-lg mb-2">Sugar Times Magazine</p>
          <p className="text-emerald-300/80 text-sm mb-4">{"\u091a\u0940\u0928\u0940 \u0909\u0926\u094d\u092f\u094b\u0917 \u090f\u0935\u0902 \u0917\u0928\u094d\u0928\u093e \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u092a\u0930 \u090f\u0915\u092e\u093e\u0924\u094d\u0930 \u0939\u093f\u0928\u094d\u0926\u0940 \u092e\u093e\u0938\u093f\u0915 \u092a\u0924\u094d\u0930\u093f\u0915\u093e"}</p>
          <p className="text-slate-400 text-xs">
            485, Mumfordganj, Prayagraj &ndash; 211002 &nbsp;|&nbsp; info@sugartimes.co.in &nbsp;|&nbsp;{" "}
            <a href="https://sugartimes.co.in" className="text-emerald-400 hover:underline">sugartimes.co.in</a>
          </p>
        </div>
      </section>
    </main>
  );
}
