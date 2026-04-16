"use client";

import { Check } from "lucide-react";

const RENEWAL_PLANS = [
  {
    key: "1year",
    label: "One Year",
    print: 2000,
    digital: 1000,
    savings: null,
    badge: null,
  },
  {
    key: "2year",
    label: "Two Years",
    print: 3600,
    digital: 1600,
    savings: 400,
    badge: "Save \u20b9400",
  },
  {
    key: "3year",
    label: "Three Years",
    print: 5000,
    digital: 2000,
    savings: 1000,
    badge: "Save \u20b91,000",
  },
  {
    key: "life",
    label: "Life Membership",
    print: 15000,
    digital: 8000,
    savings: null,
    badge: "Forever",
    isLife: true,
  },
];

export default function RenewalPlanCard({ plan, subscription, selected, onSelect }) {
  const isSelected = selected?.key === plan.key;
  const isPrint = subscription?.subscriptionType === "print";

  return (
    <div
      onClick={() => onSelect(plan)}
      className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 shadow-xl ring-2 ring-emerald-300 ring-offset-2"
          : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg"
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap bg-emerald-600 text-white">
          {plan.badge}
        </div>
      )}

      {/* Plan Title */}
      <h3 className={`font-black text-lg mb-4 mt-1 ${isSelected ? "text-emerald-700" : "text-slate-900"}`}>
        {plan.label}
      </h3>

      {/* Pricing */}
      <div className="space-y-3 mb-5">
        <div className={`flex items-center justify-between p-2.5 rounded-lg ${isPrint ? "bg-emerald-100/60 border border-emerald-200" : "bg-slate-50"}`}>
          <span className="text-xs font-bold text-slate-500 uppercase">Print</span>
          <span className={`font-black ${isPrint ? "text-emerald-700 text-lg" : "text-slate-400"}`}>
            {"\u20b9"}{plan.print.toLocaleString("en-IN")}/-
          </span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-lg ${!isPrint ? "bg-emerald-100/60 border border-emerald-200" : "bg-slate-50"}`}>
          <span className="text-xs font-bold text-slate-500 uppercase">Digital</span>
          <span className={`font-black ${!isPrint ? "text-emerald-700 text-lg" : "text-slate-400"}`}>
            {"\u20b9"}{plan.digital.toLocaleString("en-IN")}/-
          </span>
        </div>
      </div>

      {/* Savings / Description */}
      <div className="border-t border-slate-200 pt-3">
        {plan.savings ? (
          <p className="text-sm font-bold text-emerald-600 text-center">
            You Save {"\u20b9"}{plan.savings.toLocaleString("en-IN")}/-
          </p>
        ) : plan.isLife ? (
          <p className="text-sm font-bold text-emerald-600 text-center">
            Renew once, forever
          </p>
        ) : (
          <p className="text-sm text-slate-400 text-center">&mdash;</p>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-4 h-4 text-white stroke-[3]" />
        </div>
      )}
    </div>
  );
}

export { RENEWAL_PLANS };
