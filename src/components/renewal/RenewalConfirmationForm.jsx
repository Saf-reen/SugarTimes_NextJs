"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Zap, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paymentsAPI, subscriptionsAPI } from "@/lib/api";

/* ─── Load Razorpay SDK (reused from subscription page) ─── */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RenewalConfirmationForm({
  subscription,
  selectedPlan,
  updatedDetails,
  onSuccess,
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    memberNumber: subscription?.memberNumber || "",
    subscriberName: subscription?.name || "",
    mobile: subscription?.registeredMobile || "",
    email: subscription?.registeredEmail || "",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    if (field === "mobile") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length > 10) return;
      setFormData((prev) => ({ ...prev, [field]: digitsOnly }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isPrint = subscription?.subscriptionType === "print";
  const price = isPrint ? selectedPlan.print : selectedPlan.digital;

  /* ── Razorpay Checkout ─── */
  const handlePay = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.subscriberName || !formData.mobile) {
      setError("Please fill in Name and Mobile Number.");
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setProcessing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay SDK failed to load. Check your connection.");

      // 1. Create order on backend
      const { data: orderData } = await paymentsAPI.createOrder({ amount: price, currency: "INR" });

      // 2. Open Razorpay Checkout
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: "Sugar Times Magazine",
          description: `${selectedPlan.label} ${isPrint ? "Print" : "Digital"} Renewal`,
          image: "/logo.png",
          prefill: {
            name: formData.subscriberName,
            email: formData.email,
            contact: formData.mobile,
          },
          notes: {
            plan: selectedPlan.key,
            subscriptionType: subscription.subscriptionType,
            memberNumber: subscription.memberNumber,
            type: "renewal",
          },
          theme: { color: "#16a34a" },
          handler: async (response) => {
            try {
              // 3. Verify signature server-side
              await paymentsAPI.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // 4. Process renewal on backend
              await subscriptionsAPI.renew({
                memberNumber: subscription.memberNumber,
                plan: selectedPlan.key,
                subscriptionType: subscription.subscriptionType,
                paymentMode: "online",
                transactionNumber: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                dateOfPayment: new Date().toISOString().split("T")[0],
                subscriberName: formData.subscriberName,
                mobile: formData.mobile,
                email: formData.email,
                ...(updatedDetails && {
                  designation: updatedDetails.designation,
                  organisation: updatedDetails.organisation,
                  address: updatedDetails.address,
                  pincode: updatedDetails.pincode,
                }),
              });

              resolve();
              if (onSuccess) onSuccess();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled by user.")),
          },
          onerror: async (error) => {
            // Handle payment rejection/error from Razorpay
            try {
              await paymentsAPI.handleFailure({
                razorpay_order_id: error.metadata?.order_id || orderData.orderId,
                error_code: error.code || "UNKNOWN_ERROR",
                error_description: error.description || "Payment was rejected by Razorpay",
              });
            } catch (err) {
              console.error("Failed to record payment failure:", err);
            }
            reject(new Error(error.description || "Payment failed. Please try again."));
          },
        });
        rzp.open();
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden mb-14">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white px-6 md:px-8 py-5 border-b border-slate-200">
        <h2 className="text-xl md:text-2xl font-black text-slate-900">
          Confirm &amp; Pay for Renewal
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Verify your details and pay securely via Razorpay
        </p>
      </div>

      <form onSubmit={handlePay} className="px-6 md:px-8 py-6">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Plan Summary */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-emerald-600 tracking-wide">Selected Plan</p>
            <p className="font-black text-slate-900">
              {selectedPlan.label} &mdash; {isPrint ? "Print" : "Digital"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-700">{"\u20b9"}{price.toLocaleString("en-IN")}/-</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2 tracking-wide">
              Member Number
            </label>
            <input
              type="text"
              value={formData.memberNumber}
              disabled
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2 tracking-wide">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subscriberName}
              onChange={(e) => handleChange("subscriberName", e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2 tracking-wide">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              required
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="10-digit mobile number"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2 tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5"
        >
          {processing ? (
            <><Loader2 className="w-5 h-5 animate-spin" />Processing...</>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Pay {"\u20b9"}{price.toLocaleString("en-IN")} via Razorpay
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-3">
          <Shield className="w-3.5 h-3.5" />
          Secured by Razorpay &middot; 256-bit SSL encryption
          {!user && (
            <span className="text-emerald-600 font-medium ml-1">&middot; Login required to pay</span>
          )}
        </p>
      </form>
    </div>
  );
}
