"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { articlesAPI, magazinesAPI } from "@/lib/api";
import { mockArticles, mockMagazines } from "@/lib/mockData";
import { Download, Bookmark, Bell, User, LogOut, Star, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, subscription, loading: authLoading, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [artRes, magRes] = await Promise.allSettled([
        articlesAPI.getAll({ limit: 4 }),
        magazinesAPI.getAll(),
      ]);
      setArticles(artRes.status === "fulfilled" ? artRes.value.data.articles || [] : mockArticles.slice(0, 4));
      setMagazines(magRes.status === "fulfilled" ? magRes.value.data.slice(0, 3) : mockMagazines.slice(0, 3));
    } catch {
      setArticles(mockArticles.slice(0, 4));
      setMagazines(mockMagazines.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-green-500" /></div>;
  }

  const planName = subscription?.plan || "Free";
  const endDate = subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile + Subscription */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <User size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{user?.name}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
                {user?.role === "admin" && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Admin</span>}
              </div>
            </div>
            <div className={`rounded-xl p-4 ${subscription ? "bg-green-50 border border-green-100" : "bg-slate-50 border border-slate-100"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className={subscription ? "text-green-500" : "text-slate-400"} />
                <span className="font-bold text-slate-900 capitalize">{planName} Plan</span>
              </div>
              {subscription && (
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <Calendar size={12} /> Expires: {endDate}
                </div>
              )}
              <Link href="/subscription" className="block text-center text-xs font-semibold bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                {subscription ? "Manage Plan" : "Upgrade to Premium"}
              </Link>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell size={16} className="text-green-500" /> Alert Settings</h3>
            <div className="space-y-3">
              {[["Email Digest", true], ["WhatsApp Alerts", !!subscription], ["Price Alerts", true]].map(([label, enabled]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enabled ? "bg-green-500" : "bg-slate-200"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? "left-5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Articles */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bookmark size={16} className="text-green-500" /> Recent Articles</h3>
              <Link href="/news" className="text-xs text-green-600 font-semibold hover:underline">Browse More</Link>
            </div>
            <div className="space-y-3">
              {articles.map((article) => (
                <Link key={article._id || article.id} href={`/article/${article._id || article.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <img src={article.image || article.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200"}
                    alt={article.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-green-600 transition-colors">{article.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{article.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Magazines */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Download size={16} className="text-green-500" /> Magazines</h3>
              <Link href="/magazines" className="text-xs text-green-600 font-semibold hover:underline">All Issues</Link>
            </div>
            <div className="space-y-3">
              {magazines.map((mag) => (
                <div key={mag._id || mag.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <img src={mag.cover || mag.coverImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200"}
                    alt={mag.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{mag.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{mag.pages || mag.pageCount || 48} pages</p>
                  </div>
                  {(mag.accessType !== "premium" || subscription) && mag.fileUrl ? (
                    <a href={mag.fileUrl} target="_blank" rel="noreferrer"
                      className="shrink-0 p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                      <Download size={14} />
                    </a>
                  ) : (
                    <Link href="/subscription" className="shrink-0 p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors">
                      <Download size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
