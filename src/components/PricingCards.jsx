"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    key: "1year", label: "1 Year", tagline: "Best for newcomers",
    printPrice: 2000, digitalPrice: 1000,
    badge: null, color: "emerald",
  },
  {
    key: "2year", label: "2 Years", tagline: "Most popular choice",
    printPrice: 3600, digitalPrice: 1600,
    badge: "Popular", color: "amber",
    savings: "Save ₹400",
  },
  {
    key: "3year", label: "3 Years", tagline: "Best value per year",
    printPrice: 5000, digitalPrice: 2000,
    badge: "Best Value", color: "sky",
    savings: "Save ₹1000",
  },
  {
    key: "life", label: "Lifetime", tagline: "Never pay again",
    printPrice: 15000, digitalPrice: 8000,
    badge: "Lifetime", color: "violet",
  },
];

const COLOR = {
  emerald: {
    ring: "ring-emerald-400",
    badge: "bg-emerald-500 text-white",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    glow: "shadow-emerald-200",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-400",
  },
  amber: {
    ring: "ring-amber-400",
    badge: "bg-amber-500 text-white",
    btn: "bg-amber-500 hover:bg-amber-600",
    glow: "shadow-amber-200",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-400",
  },
  sky: {
    ring: "ring-sky-400",
    badge: "bg-sky-500 text-white",
    btn: "bg-sky-600 hover:bg-sky-700",
    glow: "shadow-sky-200",
    text: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-400",
  },
  violet: {
    ring: "ring-violet-400",
    badge: "bg-violet-600 text-white",
    btn: "bg-violet-600 hover:bg-violet-700",
    glow: "shadow-violet-200",
    text: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-400",
  },
};

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function PricingCards() {
  const router = useRouter();
  const [subType, setSubType] = useState("print");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelect = (key) => {
    const plan = PLANS.find(p => p.key === key);
    if (!plan) return;
    
    const price = subType === "print" ? plan.printPrice : plan.digitalPrice;
    setSelectedPlan(key);
    
    // Navigate to subscription page with plan details
    router.push(`/subscription?plan=${key}&type=${subType}&amount=${price}`);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16" id="plans">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Choose Your Plan</h2>
        <p className="text-slate-500 text-sm md:text-base">Save more with longer subscriptions. Two-year and three-year plans offer significant savings.</p>

        {/* Print / Digital Toggle */}
        <div className="inline-flex items-center mt-6 bg-slate-200 rounded-full p-1">
          {["print", "digital"].map((t) => (
            <button
              key={t}
              onClick={() => setSubType(t)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 capitalize ${subType === t
                  ? "bg-white shadow text-emerald-700"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {t === "print" ? "📰 Print" : "📱 Digital"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan) => {
          const c = COLOR[plan.color];
          const price = subType === "print" ? plan.printPrice : plan.digitalPrice;
          const isSelected = selectedPlan === plan.key;
          return (
            <div
              key={plan.key}
              onClick={() => handlePlanSelect(plan.key)}
              className={`relative cursor-pointer rounded-3xl border-2 bg-white p-7 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isSelected ? `${c.border} ${c.glow} shadow-2xl ring-2 ${c.ring}` : "border-slate-200 hover:border-slate-300"
                }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-full ${c.badge} shadow`}>
                  {plan.badge}
                </div>
              )}
              {plan.savings && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {plan.savings}
                </div>
              )}

              <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${c.text}`}>{plan.label}</div>
              <p className="text-xs text-slate-400 mb-4">{plan.tagline}</p>

              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">{formatINR(price)}</span>
                <span className="text-slate-400 text-xs ml-1">/{plan.label.toLowerCase()}</span>
              </div>

              {/* Pill detail */}
              <div className={`text-xs rounded-xl px-3 py-2 mb-5 ${c.bg} ${c.text} font-medium`}>
                {subType === "print"
                  ? `Delivered by Courier / Regd. Post`
                  : `Digital access on all devices`}
              </div>

              <div
                className={`mt-auto w-full py-2.5 rounded-2xl text-white text-sm font-bold text-center transition-colors ${c.btn} ${isSelected ? "ring-2 ring-offset-2 " + c.ring : ""
                  }`}
              >
                {isSelected ? "✓ Selected" : "Select Plan"}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
