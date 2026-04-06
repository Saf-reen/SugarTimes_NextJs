"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { articlesAPI } from "@/lib/api";
import { mockArticles } from "@/lib/mockData";
import { Plus, Edit, Trash2, Eye, Search, Loader2, X, Save, TrendingUp, FileText } from "lucide-react";

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
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            {urlTrending ? <TrendingUp className="text-green-500" /> : <FileText className="text-green-500" />}
            {urlTrending ? "Trending Highlights" : (urlCategory || "Central Article Desk")}
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">
            Managing {urlCategory ? `the "${urlCategory}" segment` : "all editorial content"} • {filtered.length} entries
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-3 bg-[#1b5e20] hover:bg-black text-white font-black px-6 py-3.5 rounded-xl text-[11px] uppercase tracking-widest transition-all shadow-lg hover:shadow-green-900/20 active:scale-95 group">
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
          {urlCategory ? `Add ${urlCategory} Article` : "Draft New Article"}
        </button>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
              <div>
                <h2 className="font-black text-slate-900 text-2xl tracking-tight uppercase italic">{urlCategory ? `Publish to ${urlCategory}` : "New Editorial Draft"}</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Fill in the details to go live on the user panel</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Article Headline</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Maharashtra sugar mills see record production..."
                    className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-400/10 focus:border-green-500 bg-slate-50/50 transition-all" />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Publishing Desk (Category)</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    disabled={!!urlCategory}
                    className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-400/10 focus:border-green-500 bg-white shadow-sm disabled:bg-slate-50 disabled:text-slate-400 transition-all appearance-none cursor-pointer">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {urlCategory && <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-2 ml-1 italic">Locked to this section</p>}
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${form.premium ? "bg-slate-900" : "bg-slate-200"}`}>
                       <input type="checkbox" className="hidden" checked={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.checked })} />
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${form.premium ? "left-5" : "left-1"}`}></div>
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-900">Premium Content</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${form.trending ? "bg-green-500" : "bg-slate-200"}`}>
                       <input type="checkbox" className="hidden" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} />
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${form.trending ? "left-5" : "left-1"}`}></div>
                    </div>
                    <span className="text-xs font-black text-green-600 uppercase tracking-widest group-hover:text-green-700">Trending Now</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Cover Media (Image URL)</label>
                <div className="flex gap-4">
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-5 py-4 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-400/10 focus:border-green-500 bg-slate-50/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Short Summary (Excerpt)</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="A one or two line hook for the listing card..."
                  className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-400/10 focus:border-green-500 bg-slate-50/50 transition-all resize-none" />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Extended Content</label>
                <textarea rows={6} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Paste your full article text here. Use shifts for new lines..."
                  className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-400/10 focus:border-green-500 bg-slate-50/50 transition-all resize-none" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border-2 border-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">Discard</button>
                <button type="submit" disabled={saving}
                  className="flex-[2] py-4 bg-[#1b5e20] hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-all disabled:opacity-40 active:scale-95">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Processing..." : (urlCategory ? `Publish to ${urlCategory}` : "Publish Globally")}
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
