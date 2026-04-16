import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { Lock, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { mockArticles } from "@/lib/mockData";
import ArticleShareBar from "@/components/article/ArticleShareBar";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import ArticleInlineAd from "@/components/article/ArticleInlineAd";
import ArticleCommentForm from "@/components/article/ArticleCommentForm";

// Render each article on demand so newly-published admin content is
// immediately visible without rebuilding. No generateStaticParams is
// needed because the site is no longer using `output: "export"`.
export const dynamic = "force-dynamic";

const getImageUrl = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`;
};

async function safeFetch(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getArticleData(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  let article = await safeFetch(`${apiUrl}/articles/${id}`);
  if (!article) {
    article = mockArticles.find((a) =>
      (a.id && a.id.toString() === id.toString()) ||
      (a._id && a._id.toString() === id.toString())
    );
  }
  if (!article) return null;

  const allData = await safeFetch(`${apiUrl}/articles?limit=20`);
  const allArticles = Array.isArray(allData?.articles)
    ? allData.articles
    : Array.isArray(allData)
      ? allData
      : mockArticles;

  const currentId = (article._id || article.id)?.toString();
  const others = allArticles.filter((a) => (a._id || a.id)?.toString() !== currentId);
  const sameCategory = others.filter(
    (a) => a.category === article.category || a.subcategory === article.category
  );
  const related = (sameCategory.length >= 3 ? sameCategory : others).slice(0, 3);
  const popular = others.slice(0, 12);

  const idx = allArticles.findIndex((a) => (a._id || a.id)?.toString() === currentId);
  const prev = idx > 0 ? allArticles[idx - 1] : null;
  const next = idx >= 0 && idx < allArticles.length - 1 ? allArticles[idx + 1] : null;

  // Ads targeted at this article's category (or global)
  const categoryParam = encodeURIComponent(article.category || "");
  const adsData = await safeFetch(
    `${apiUrl}/advertisements?activeOnly=true&category=${categoryParam}`
  );
  const ads = Array.isArray(adsData) ? adsData : [];

  return { article, related, popular, prev, next, ads };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getArticleData(id);
  return { title: data?.article ? `${data.article.title} – Sugar Times` : "Article – Sugar Times" };
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const data = await getArticleData(id);
  if (!data || !data.article) notFound();

  const { article, related, popular, prev, next, ads } = data;
  const shareUrl =
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://sugartimes.co.in"}/article/${article._id || article.id}`;

  const dynamicDate = new Date(article.createdAt || article.date || new Date()).toLocaleDateString(
    "en-IN",
    { month: "long", day: "numeric", year: "numeric" }
  );

  const middleAds = ads.filter((a) => a.placement === "middle" || a.placement === "both");
  const sidebarAds = ads.filter((a) => a.placement === "sidebar" || a.placement === "both");

  return (
    <div className="bg-[#fbfcfa] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/news" className="hover:text-green-600 transition-colors">All News</Link>
          {article.category && (
            <>
              <ChevronRight size={10} />
              <Link href={`/news?category=${encodeURIComponent(article.category)}`} className="hover:text-green-600 transition-colors">
                {article.category}
              </Link>
            </>
          )}
          <ChevronRight size={10} />
          <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{article.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* Main Content */}
          <main className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[820px] order-1">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {article.category && (
                  <Link
                    href={`/news?category=${encodeURIComponent(article.category)}`}
                    className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors"
                  >
                    {article.category}
                  </Link>
                )}
                {article.subcategory && (
                  <Link
                    href={`/news?category=${encodeURIComponent(article.subcategory)}`}
                    className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 uppercase tracking-[0.2em] hover:bg-emerald-200 transition-colors"
                  >
                    {article.subcategory}
                  </Link>
                )}
                {article.premium && (
                  <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2.5 py-1 uppercase tracking-[0.2em] flex items-center gap-1">
                    <Lock size={10} /> Premium Issue
                  </span>
                )}
              </div>

              <h1 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] font-black text-slate-900 leading-[1.15] mb-6 tracking-tight break-words">
                {article.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 py-4 border-y border-slate-100 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">
                      By <span className="text-slate-900">{article.author || "Sugar Times Team"}</span>
                    </p>
                    <p className="text-xs font-bold text-slate-500">{dynamicDate}</p>
                  </div>
                </div>

                <ArticleShareBar url={shareUrl} title={article.title} />
              </div>
            </header>

            {/* Cover */}
            <figure className="mb-10 group relative">
              <div className="overflow-hidden rounded-xl bg-slate-100 shadow-2xl">
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-auto aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              <figcaption className="text-[11px] text-slate-400 mt-4 italic text-right font-medium">
                Source: Sugar Times
              </figcaption>
            </figure>

            {/* Content */}
            <div className="prose prose-slate prose-base sm:prose-lg max-w-none break-words prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-medium prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:w-full prose-img:h-auto">
              {article.premium ? (
                <div className="relative">
                  <div className="opacity-40 select-none pointer-events-none" dangerouslySetInnerHTML={{ __html: (article.content || "").slice(0, 400) }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center pt-20">
                    <div className="bg-white border-2 border-green-500 rounded-3xl p-8 max-w-md text-center shadow-2xl translate-y-10">
                      <Lock size={32} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Premium Intelligence</h3>
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed">This report is reserved for premium subscribers.</p>
                      <Link href="/subscription" className="inline-block bg-green-500 hover:bg-green-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all">Go Premium</Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
              )}
            </div>

            {/* Middle In-Article Advertisement */}
            {middleAds.length > 0 && (
              <div className="my-10">
                <ArticleInlineAd ad={middleAds[0]} />
              </div>
            )}

            {/* Bottom Share */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Share this article</span>
              <ArticleShareBar url={shareUrl} title={article.title} />
            </div>

            {/* Previous / Next */}
            {(prev || next) && (
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link href={`/article/${prev._id || prev.id}`} className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      <ChevronLeft size={12} /> Previous Article
                    </div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 line-clamp-2">{prev.title}</p>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link href={`/article/${next._id || next.id}`} className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-300 hover:shadow-lg transition-all text-right">
                    <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Next Article <ArrowRight size={12} />
                    </div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 line-clamp-2">{next.title}</p>
                  </Link>
                ) : <div />}
              </div>
            )}

            {/* Author Card */}
            <div className="mt-10 flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl shrink-0">
                {(article.author || "S")[0].toUpperCase()}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">By</div>
                <h4 className="text-lg font-black text-slate-900">{article.author || "Sugar Times Team"}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Covering India&apos;s sugar &amp; bio-energy industry — market news, policy, and farmer updates.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-12 pt-10 border-t-4 border-slate-900">
                <div className="inline-block mb-8 -mt-[44px]">
                  <h2 className="bg-slate-900 text-white text-[13px] font-black uppercase tracking-[0.2em] px-4 py-2">Related Articles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((a) => (
                    <NewsCard key={a._id || a.id} article={{ ...a, id: a._id || a.id, date: a.createdAt || a.date }} />
                  ))}
                </div>
              </div>
            )}

            {/* Leave a Reply */}
            <ArticleCommentForm articleId={article._id || article.id} />
          </main>

          {/* Sidebar — fixed rail on desktop, stacks on mobile */}
          <div className="w-full lg:w-[320px] lg:flex-shrink-0 order-2">
            <ArticleSidebar popular={popular} ads={sidebarAds} />
          </div>
        </div>
      </div>
    </div>
  );
}
