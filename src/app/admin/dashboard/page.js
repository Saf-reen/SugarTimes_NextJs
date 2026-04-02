"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { adminAPI, articlesAPI } from "@/lib/api";
import { mockAdminStats, mockArticles } from "@/lib/mockData";
import { Users, CreditCard, FileText, BookOpen, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";

const revenueData = [
  { month: "Oct", revenue: 420000 },
  { month: "Nov", revenue: 510000 },
  { month: "Dec", revenue: 480000 },
  { month: "Jan", revenue: 620000 },
  { month: "Feb", revenue: 590000 },
  { month: "Mar", revenue: 710000 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
      return;
    }
    if (isAdmin) fetchData();
  }, [user, isAdmin, authLoading]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, articlesRes] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.getUsers({ limit: 5 }),
        articlesAPI.getAll({ limit: 5 }),
      ]);
      setStats(statsRes.status === "fulfilled" ? statsRes.value.data : mockAdminStats);
      setUsers(usersRes.status === "fulfilled" ? usersRes.value.data : []);
      setArticles(articlesRes.status === "fulfilled" ? articlesRes.value.data.articles || [] : mockArticles.slice(0, 5));
    } catch {
      setStats(mockAdminStats);
      setArticles(mockArticles.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-green-500" /></div>
      </AdminLayout>
    );
  }

  const s = stats || mockAdminStats;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of Sugartimes platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Users", value: s.totalUsers?.toLocaleString() || "0", icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Active Subs", value: s.activeSubscriptions?.toLocaleString() || "0", icon: CreditCard, color: "text-green-600 bg-green-50" },
          { label: "Revenue", value: `Rs ${((s.totalRevenue || s.revenue || 0) / 100000).toFixed(1)}L`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
          { label: "Articles", value: s.totalArticles || s.articlesPublished || "0", icon: FileText, color: "text-purple-600 bg-purple-50" },
          { label: "Magazines", value: s.totalMagazines || s.magazinesUploaded || "0", icon: BookOpen, color: "text-pink-600 bg-pink-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={18} /></div>
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-5">Monthly Revenue (Rs)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `Rs ${v / 1000}K`} />
              <Tooltip formatter={(v) => [`Rs ${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px" }} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent users */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Recent Users</h2>
            <a href="/admin/users" className="text-xs text-green-600 font-semibold hover:underline">View All</a>
          </div>
          {users.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No users yet</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700 shrink-0">
                    {u.name?.[0] || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent articles */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">Recent Articles</h2>
          <a href="/admin/articles" className="text-xs text-green-600 font-semibold hover:underline">Manage</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Access</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a._id || a.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3"><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{a.category}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.premium || a.accessType === "premium" ? "bg-slate-900 text-green-400" : "bg-green-100 text-green-700"}`}>{a.premium || a.accessType === "premium" ? "Premium" : "Free"}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
