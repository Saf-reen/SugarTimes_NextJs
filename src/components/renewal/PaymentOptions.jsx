"use client";

import { useState } from "react";
import { Smartphone, Building2, CreditCard, Banknote, Check, Copy, Download } from "lucide-react";

const PAYMENT_OPTIONS = [
  {
    id: "upi",
    title: "UPI / Online Payment",
    subtitle: "Fastest",
    icon: Smartphone,
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    content: {
      description: "Pay instantly using any UPI app \u2014 PhonePe, Google Pay, Paytm, BHIM, etc.",
      details: [
        { label: "UPI ID", value: "8756062435@okbizaxis", copyable: true },
      ],
      qrNote: "Scan the QR code with any UPI app to pay instantly",
      afterPayment:
        "After payment, WhatsApp your screenshot to +91 7355453462 with your Member Number.",
    },
  },
  {
    id: "neft",
    title: "Bank Transfer / NEFT / RTGS",
    subtitle: "Secure",
    icon: Building2,
    gradient: "from-sky-500 to-blue-600",
    lightBg: "bg-sky-50",
    content: {
      description: null,
      details: [
        { label: "Bank", value: "UCO Bank, Mumfordganj Branch, Prayagraj" },
        { label: "Current A/C No.", value: "16110210000861", copyable: true },
        { label: "IFSC Code", value: "UCBA0001611", copyable: true },
        { label: "Account Name", value: "Sugar Times" },
        { label: "Payable at", value: "Allahabad" },
      ],
      afterPayment:
        "After transfer, send payment confirmation to info@sugartimes.co.in or WhatsApp +91 7355453462 with your Member Number and name.",
    },
  },
  {
    id: "cheque",
    title: "Cheque / Demand Draft",
    subtitle: "By Post",
    icon: CreditCard,
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    content: {
      description: null,
      details: [
        { label: "Payable to", value: '"Sugar Times" \u2014 Payable at Allahabad' },
        {
          label: "Post / Courier to",
          value: "485, Mumfordganj (Opposite Shivaji Park), Prayagraj (Allahabad) \u2013 211002, Uttar Pradesh",
        },
      ],
      note: "Please write your Name, Mobile Number, and Member Number on the back of the cheque.",
      afterPayment: null,
    },
  },
  {
    id: "cash",
    title: "Cash Payment",
    subtitle: "In Person",
    icon: Banknote,
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    content: {
      description: "Visit our office directly:",
      details: [
        { label: "Address", value: "485, Mumfordganj (Opp. Shivaji Park), Prayagraj \u2013 211002" },
        { label: "Hours", value: "Monday to Saturday, 10:00 AM \u2013 6:00 PM" },
        { label: "Phone", value: "0532-2440267" },
        { label: "Mobile", value: "+91 7355453462" },
      ],
      afterPayment: null,
    },
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 ml-2 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function PaymentOptions({ selectedPayment, onPaymentSelect }) {
  const [activeTab, setActiveTab] = useState("upi");

  const handleSelect = (option) => {
    setActiveTab(option.id);
    onPaymentSelect(option);
  };

  const activeOption = PAYMENT_OPTIONS.find((o) => o.id === activeTab);
  const Icon = activeOption.icon;

  return (
    <div className="mb-14">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          Pay for Your Renewal
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Choose your preferred payment method
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PAYMENT_OPTIONS.map((option) => {
          const TabIcon = option.icon;
          const isActive = activeTab === option.id;
          const isSelected = selectedPayment?.id === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                isActive
                  ? `bg-gradient-to-r ${option.gradient} text-white border-transparent shadow-lg`
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{option.title.split("/")[0].trim()}</span>
              <span className="sm:hidden">{option.subtitle}</span>
              {isSelected && !isActive && (
                <Check className="w-4 h-4 text-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className={`${activeOption.lightBg} border-2 border-slate-200 rounded-2xl overflow-hidden`}>
        {/* Tab Header */}
        <div className={`bg-gradient-to-r ${activeOption.gradient} px-6 md:px-8 py-5 flex items-center gap-4`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg">{activeOption.title}</h3>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
              Option {PAYMENT_OPTIONS.findIndex((o) => o.id === activeOption.id) + 1} &mdash; {activeOption.subtitle}
            </p>
          </div>
        </div>

        {/* Tab Body */}
        <div className="px-6 md:px-8 py-6">
          {activeOption.content.description && (
            <p className="text-slate-700 mb-5">{activeOption.content.description}</p>
          )}

          {/* Details Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5">
            {activeOption.content.details.map((detail, idx) => (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-3.5 ${
                  idx !== activeOption.content.details.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wide w-36 flex-shrink-0">
                  {detail.label}
                </span>
                <span className="font-semibold text-slate-800 text-sm flex items-center">
                  {detail.value}
                  {detail.copyable && <CopyButton text={detail.value} />}
                </span>
              </div>
            ))}
          </div>

          {/* QR Code / Subscription Form Image */}
          {activeOption.id === "upi" && (
            <div className="flex flex-col items-center mb-5">
              <div className="bg-white border-2 border-slate-200 rounded-xl p-3 shadow-sm">
                <img
                  src="/ST Renwal.jpg.jpeg"
                  alt="Sugar Times UPI QR Code - Scan to pay"
                  className="w-56 h-auto rounded-lg"
                />
              </div>
              <a
                href="/ST Renwal.jpg.jpeg"
                download="SugarTimes_UPI_QR.jpg"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </a>
            </div>
          )}

          {/* Note */}
          {activeOption.content.note && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-sm text-amber-800">{activeOption.content.note}</p>
            </div>
          )}

          {/* After Payment instruction */}
          {activeOption.content.afterPayment && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800">
                <span className="font-bold">After Payment:</span> {activeOption.content.afterPayment}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pro tip */}
      <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="text-xs text-slate-500">
          <span className="font-bold text-slate-700">Pro Tip:</span> UPI payments are processed instantly.
          Bank transfers take 1-2 working days. Cheque/DD should reach us before your current subscription expires.
        </p>
      </div>
    </div>
  );
}

export { PAYMENT_OPTIONS };
