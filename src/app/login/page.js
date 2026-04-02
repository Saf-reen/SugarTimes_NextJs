"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form.email, form.password);
      router.push(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black text-slate-900">Sugar<span className="text-green-500">times</span></span>
          </Link>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="#" className="text-green-600 hover:underline font-medium">Forgot password?</a>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/login" className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center text-sm">
                Admin Login
              </Link>
              <button type="submit" disabled={loading}
                className="flex-[2] bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            No account?{" "}
            <Link href="/register" className="text-green-600 font-semibold hover:underline">Register</Link>
            {" "}or{" "}
            <Link href="/subscription" className="text-green-600 font-semibold hover:underline">Subscribe</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
