import Link from "next/link";
import { Check, Zap } from "lucide-react";

export default function PricingCard({ plan }) {
  return (
    <div className={`relative rounded-2xl border-2 p-6 flex flex-col ${plan.popular ? "border-green-500 shadow-xl shadow-green-100" : "border-slate-200 bg-white"}`}>
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
            <Zap size={11} /> Most Popular
          </span>
        </div>
      )}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.popular ? "bg-green-500" : "bg-slate-100"}`}>
        <span className={`text-lg ${plan.popular ? "text-white" : "text-slate-600"}`}>{plan.icon}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
      <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
      <div className="mb-6">
        <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
        <span className="text-slate-500 text-sm">/{plan.period}</span>
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <Check size={15} className="text-green-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/subscription"
        className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
          plan.popular
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-800"
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}
