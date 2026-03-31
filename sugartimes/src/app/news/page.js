"use client";
import { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import { articlesAPI } from "@/lib/api";
import { Search, Loader2 } from "lucide-react";
import { mockArticles } from "@/lib/mockData";

const categories = ["All", "News", "Markets", "Policy", "Agriculture"];

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, [category, page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (category !== "All") params.category = category;
      if (search) params.search = search;
      const { data } = await articlesAPI.getAll(params);
      setArticles(data.articles || []);
      setTotal(data.total || 0);
    } catch {
      // Fallback to mock data if backend is unavailable
      setArticles(mockArticles);
      setTotal(mockArticles.length);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Sugar Industry News</h1>
        <p className="text-slate-500">Latest updates from mills, markets, government, and the field</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
          </div>
          <button type="submit" className="bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
            Search
          </button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat ? "bg-amber-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-amber-500" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No articles found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {articles.slice(0, 2).map((a) => <NewsCard key={a._id || a.id} article={a} />)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.slice(2).map((a) => <NewsCard key={a._id || a.id} article={a} compact />)}
              </div>
              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-amber-400 transition-colors">
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-500">Page {page} of {Math.ceil(total / 12)}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 12)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-amber-400 transition-colors">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Trending Topics</h3>
            <ul className="space-y-2">
              {["Ethanol Blending", "FRP 2026-27", "Sugar Export", "Maharashtra Mills", "Cane Prices", "ISMA Report"].map((t) => (
                <li key={t} onClick={() => { setSearch(t); setPage(1); fetchArticles(); }}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-2">Newsletter</h3>
            <p className="text-sm text-slate-500 mb-3">Daily sugar industry digest</p>
            <input type="email" placeholder="Your email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <button className="w-full bg-amber-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors">Subscribe</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.filter(c => c !== "All").map((cat) => (
                <li key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                  className="flex items-center justify-between text-sm cursor-pointer">
                  <span className="text-slate-600 hover:text-amber-600 transition-colors">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
