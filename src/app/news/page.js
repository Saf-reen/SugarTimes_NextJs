"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import { articlesAPI } from "@/lib/api";
import { Search, Loader2 } from "lucide-react";
import { mockArticles } from "@/lib/mockData";

const categories = [
  "All",
  "Sugar Industry News",
  "Ethanol",
  "Molasses",
  "Market Trends",
  "Agriculture",
  "International Trade",
  "Interviews",
  "Environmental Impact",
  "Technology",
  "Sugarcane Department",
  "Sugar Diet",
  "Sugar Food",
  "Policy Updates",
  "Distillery Updates",
  "News Archive"
];

const ARTICLES_PER_PAGE = 12;

function NewsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Sync state with URL params when they change
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search") || "";

    if (urlCategory) setCategory(urlCategory);
    setSearch(urlSearch);
    setPage(1);
  }, [searchParams]);

  // Scroll to top when category or page changes (gives "New Screen" feel)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, page, search]);

  useEffect(() => {
    fetchArticles();
  }, [category, page, search]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = { page, limit: ARTICLES_PER_PAGE };
      if (category !== "All") params.category = category;
      if (search) params.search = search;
      const { data } = await articlesAPI.getAll(params);

      const articlesArray = Array.isArray(data?.articles) ? data.articles : (Array.isArray(data) ? data : []);
      setArticles(articlesArray);
      setTotal(data.total || articlesArray.length);
    } catch (err) {
      console.error("Failed to fetch articles", err);
      // Fallback
      const filteredMock = category === "All"
        ? mockArticles
        : mockArticles.filter(a => a.category?.toLowerCase().includes(category.toLowerCase()));
      setArticles(filteredMock);
      setTotal(filteredMock.length);
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
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
          {search ? `Search Results: ${search}` : (category === "All" ? "Sugar Industry News" : category)}
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          {search
            ? `Showing results for "${search}" across all categories.`
            : (category === "All"
              ? "Latest updates from mills, markets, government, and the field"
              : `Exploring the latest insights and developments in ${category}`)}
        </p>
      </div>


      <div className="flex gap-8">
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-green-500" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No articles found in this category.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {articles.slice(0, 2).map((a) => <NewsCard key={a._id || a.id} article={a} />)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.slice(2).map((a) => <NewsCard key={a._id || a.id} article={a} compact />)}
              </div>
              {/* Pagination */}
              {total > ARTICLES_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-green-400 transition-colors">
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-500">Page {page} of {Math.ceil(total / ARTICLES_PER_PAGE)}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / ARTICLES_PER_PAGE)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-green-400 transition-colors">
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
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-2">Newsletter</h3>
            <p className="text-sm text-slate-500 mb-3">Daily sugar industry digest</p>
            <input type="email" placeholder="Your email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <button className="w-full bg-green-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-green-600 transition-colors">Subscribe</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 min-h-screen">
        <Loader2 size={32} className="animate-spin text-green-500" />
      </div>
    }>
      <NewsContent />
    </Suspense>
  );
}
