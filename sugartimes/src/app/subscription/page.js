"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paymentsAPI, subscriptionsAPI } from "@/lib/api";

const plans = [
  { id: "free", name: "Free", icon: "📰", price: 0, period: "month", description: "Basic access", popular: false, cta: "Get Started", features: ["5 articles/month", "Market overview", "Newsletter"], planKey: null },
  { id: "monthly", name: "Basic", icon: "⭐", price: 299, period: "month", description: "For professionals", popular: false, cta: "Subscribe Now", features: ["Unlimited articles", "Full market data", "Policy updates", "Email alerts"], planKey: "monthly" },
  { id: "yearly", name: "Premium", icon: "🚀", price: 799, period: "month", description: "Complete intelligence", popular: true, cta: "Go Premium", features: ["Everything in Basic", "All magazines", "WhatsApp alerts", "Analytics dashboard", "Priority support", "Downloadable reports"], planKey: "yearly" },
];

function Cell({ value }) {
  if (value === true) return <Check size={16} className="text-green-500 mx-auto" />;
  if (value === false) return <X size={16} className="text-slate-300 mx-auto" />;
  return <span className="text-xs text-slate-600">{value}</span>;
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user, isSubscribed, fetchSubscription } = useAuth();
  const router = useRouter();

  const handleSubscribe = async (plan) => {
    if (!plan.planKey) { router.push("/register"); return; }
    if (!user) { router.push("/login"); return; }
    setLoading(plan.id);
    try {
      const amount = plan.price;
      const { data: payment } = await paymentsAPI.initiate({ amount });
      await paymentsAPI.verify({ paymentId: payment.paymentId });
      await subscriptionsAPI.create({ plan: plan.planKey, paymentId: payment.paymentId });
      await fetchSubscription(user.id);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">You are subscribed!</h2>
          <p className="text-slate-500 mb-6">Welcome to Sugartimes Premium. Enjoy full access.</p>
          <a href="/dashboard" className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-3">Simple, Transparent Pricing</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Choose the plan that fits your needs. Cancel anytime.</p>
        {isSubscribed && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mt-4">
            ✅ You have an active subscription
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => (
          <div key={plan.id} className={`relative rounded-2xl border-2 p-6 flex flex-col ${plan.popular ? "border-amber-500 shadow-xl shadow-amber-100" : "border-slate-200 bg-white"}`}>
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
              </div>
            )}
            <div className="text-2xl mb-3">{plan.icon}</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-3xl font-black text-slate-900">Rs {plan.price}</span>
              <span className="text-slate-500 text-sm">/{plan.period}</span>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={15} className="text-green-500 mt-0.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe(plan)} disabled={loading === plan.id}
              className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${plan.popular ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}>
              {loading === plan.id && <Loader2 size={14} className="animate-spin" />}
              {loading === plan.id ? "Processing..." : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Ready to get started?</h2>
        <p className="text-amber-100 mb-6">Join 4,800+ sugar industry professionals on Sugartimes</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/register" className="bg-white text-amber-600 font-bold px-6 py-3 rounded-xl hover:bg-amber-50 transition-colors">Create Account</a>
          <a href="/contact" className="bg-amber-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-800 transition-colors">Contact Sales</a>
        </div>
      </div>
    </div>
  );
}
