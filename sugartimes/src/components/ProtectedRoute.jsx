"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function ProtectedRoute({ children, requireSubscription = false }) {
  const [status, setStatus] = useState("checking"); // checking | ok | no-auth | no-sub
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const plan = localStorage.getItem("plan");
    if (!token) {
      setStatus("no-auth");
    } else if (requireSubscription && plan === "free") {
      setStatus("no-sub");
    } else {
      setStatus("ok");
    }
  }, [requireSubscription]);

  if (status === "checking") {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (status === "no-auth") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-sm">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Login Required</h2>
          <p className="text-slate-500 text-sm mb-6">Please login to access this page.</p>
          <Link href="/login" className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors">Login</Link>
        </div>
      </div>
    );
  }

  if (status === "no-sub") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-sm">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Premium Content</h2>
          <p className="text-slate-500 text-sm mb-6">Subscribe to access premium articles, magazines, and market data.</p>
          <Link href="/subscription" className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors">View Plans</Link>
        </div>
      </div>
    );
  }

  return children;
}
