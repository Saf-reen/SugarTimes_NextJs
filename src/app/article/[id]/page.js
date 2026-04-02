import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { Calendar, Tag, Lock, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

// Utility to get fully qualified image/file URL
const getImageUrl = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`;
};

async function getArticleData(id) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // Fetch the main article
    const res = await fetch(`${apiUrl}/articles/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const article = await res.json();
    
    // Fetch recent/popular articles to show in the sidebar & related
    // Using getAll logic briefly
    const allRes = await fetch(`${apiUrl}/articles?limit=8`, { cache: "no-store" });
    const allData = allRes.ok ? await allRes.json() : { articles: [] };
    
    // Fallbacks if shape is slightly different
    const articlesList = Array.isArray(allData.articles) ? allData.articles : (Array.isArray(allData) ? allData : []);
    
    const related = articlesList.filter(a => a._id !== article._id).slice(0, 3);
    const popular = articlesList.filter(a => a._id !== article._id).slice(3, 8); // Just grabbing some for sidebar

    return { article, related, popular };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const data = await getArticleData(params.id);
  return { title: data?.article ? `${data.article.title} – Sugartimes` : "Article – Sugartimes" };
}

export default async function ArticlePage({ params }) {
  const data = await getArticleData(params.id);
  
  if (!data || !data.article) {
    notFound();
  }

  const { article, related, popular } = data;

  const dynamicDate = new Date(article.createdAt || new Date()).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb style back link */}
      <Link href="/news" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-600 transition-colors mb-4 uppercase font-semibold tracking-wider">
        <ArrowLeft size={13} /> Home / News / {article.category || "Uncategorized"} / {article.title?.slice(0, 20)}...
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Article Content */}
        <article className="flex-1 w-full max-w-[800px]">
          {/* Top badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">{article.category || "News"}</span>
            {article.premium && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                <Lock size={10} /> Premium
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 leading-[1.15] mb-6">{article.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">By <span className="font-bold text-slate-800">Sugar Times Team</span></span>
              </div>
            </div>
            <span className="text-xs text-slate-400 border-l border-slate-200 pl-4">{dynamicDate}</span>
            <div className="ml-auto flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors"><Share2 size={14} /></button>
            </div>
          </div>

          <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-auto aspect-video object-cover mb-8 shadow-sm" />

          {article.excerpt && (
            <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed mb-8">{article.excerpt}</p>
          )}

          {/* Article Body */}
          {article.premium ? (
            <div>
              <div className="prose prose-slate prose-lg max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: article.content.slice(0, 300) + '...' }} />
              </div>
              <div className="bg-gradient-to-b from-transparent to-white relative -mt-12 pt-12">
                <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center shadow-sm">
                  <Lock size={28} className="text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Content</h3>
                  <p className="text-slate-600 text-sm mb-5">Subscribe to read the full article and access all premium market reports.</p>
                  <Link href="/subscription" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-md transition-colors shadow-md">View Plans</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate prose-lg max-w-none text-slate-800 leading-relaxed">
               <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
            </div>
          )}

          {/* Share footer */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-slate-800">Share This Article</span>
               <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-colors"><Share2 size={16} /></button>
             </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 pt-2 lg:pt-0">
          <div className="sticky top-24">
            
            {/* Most Popular Block styling to match standard news layout */}
            <div className="mb-8">
              <div className="bg-slate-900 text-white text-xs font-bold uppercase tracking-widest py-2 px-3 inline-block mb-4">Most Popular</div>
              <div className="border-t-[3px] border-slate-900 pt-5 space-y-5">
                {popular.map((pArt, index) => (
                  <Link key={pArt._id} href={`/article/${pArt._id}`} className="group flex gap-4 items-start">
                     {/* Using index + 1 as rank number */}
                     <span className="text-4xl font-black text-slate-200 mt-1">{index + 1}</span>
                     <div>
                       <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-green-600 transition-colors leading-snug line-clamp-3">{pArt.title}</h4>
                       <span className="text-xs text-slate-400 mt-1 block">{new Date(pArt.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                     </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Block */}
            <div className="bg-slate-50 border border-slate-100 p-6 text-center">
              <h3 className="font-black text-xl text-slate-900 mb-2">Get Updates</h3>
              <p className="text-sm text-slate-500 mb-4">The latest news directly to your inbox</p>
              <input type="email" placeholder="Email Address" className="w-full px-4 py-2.5 border border-slate-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
              <button className="w-full bg-green-500 text-white text-sm font-bold uppercase tracking-wider py-2.5 hover:bg-green-600 transition-colors">Subscribe</button>
            </div>

          </div>
        </aside>
      </div>

      {/* Related articles bottom */}
      {related.length > 0 && (
        <div className="mt-16 pt-8 border-t-4 border-slate-900 max-w-[800px]">
          <div className="bg-slate-900 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-3 inline-block mb-6 -mt-[42px]">Related Articles</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((a) => (
              <NewsCard key={a._id} article={{...a, id: a._id, date: a.createdAt}} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
