"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { articlesAPI } from "@/lib/api";
import { mockArticles } from "@/lib/mockData";
import { Plus, Edit, Trash2, Eye, Search, Loader2, X, Save, TrendingUp } from "lucide-react";

function ArticlesContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlTrending = searchParams.get("trending") === "true";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    category: "Sugar Industry News", 
    excerpt: "", 
    content: "", 
    image: "", 
    premium: false,
    trending: false 
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (urlCategory) {
      setForm(prev => ({ ...prev, category: urlCategory }));
    }
  }, [urlCategory]);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await articlesAPI.getAll({ limit: 100 });
      setArticles(data.articles || []);
    } catch {
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await articlesAPI.create(form);
      setShowForm(false);
      setForm({ title: "", category: "Sugar Industry News", excerpt: "", content: "", image: "", premium: false, trending: false });
      fetchArticles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this article?")) return;
    try {
      await articlesAPI.delete(id);
      setArticles((prev) => prev.filter((a) => (a._id || a.id) !== id));
    } catch {
      alert("Failed to delete article");
    }
  };

  // Filter based on search bar AND URL params (category/trending)
  const filtered = articles.filter((a) => {
    const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = urlCategory ? a.category === urlCategory : true;
    const matchesTrending = urlTrending ? a.trending === true : true;
    return matchesSearch && matchesCategory && matchesTrending;
  });

  const categories = [
    "Sugar Industry News", "Ethanol", "Molasses", "Market Trends", 
    "Agriculture", "International Trade", "Interviews", "Environmental Impact", 
    "Technology", "Sugarcane Department", "Sugar Diet", "Sugar Food", "Policy Updates", "Distillery Updates", "News Archive"
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            {urlTrending && <TrendingUp className="text-green-500" />}
            {urlTrending ? "Trending News" : (urlCategory || "All Articles")}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} items found</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> New Article
        </button>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">New Article</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-center gap-2 pt-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.checked })} className="rounded" />
                    Premium
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-green-600 cursor-pointer">
                    <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} className="rounded accent-green-500" />
                    Mark as Trending
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Content</label>
                <textarea rows={5} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? "Saving..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-green-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id || a.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={a.image || a.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100"}
                          alt={a.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                        <p className="font-semibold text-slate-800 line-clamp-1 max-w-xs">{a.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{a.category}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-max ${a.premium ? "bg-slate-900 text-green-400" : "bg-green-100 text-green-700"}`}>
                          {a.premium ? "Premium" : "Free"}
                        </span>
                        {a.trending && <span className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1"><TrendingUp size={10} /> Trending</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"><Eye size={14} /></button>
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(a._id || a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminArticles() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ArticlesContent />
      </Suspense>
    </AdminLayout>
  );
}
