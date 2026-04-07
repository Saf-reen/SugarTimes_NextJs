import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { Calendar, Tag, Lock, ArrowLeft, Bookmark, Share2, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { mockArticles } from "@/lib/mockData";

// Custom Social Icons to match the project's dependency constraints
const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);

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
    const res = await fetch(`${apiUrl}/articles/${id}`);
    
    let article = null;
    if (res.ok) {
      article = await res.json();
    } else {
      // Fallback to mock data if API returns 404 or fails
      article = mockArticles.find(a => 
        (a.id && id && a.id.toString() === id.toString()) || 
        (a._id && id && a._id.toString() === id.toString())
      );
    }

    if (!article) return null;

    // Fetch recent/popular articles to show in the sidebar & related
    const allRes = await fetch(`${apiUrl}/articles?limit=10`);
    const allData = allRes.ok ? await allRes.json() : { articles: [] };
    
    const articlesList = Array.isArray(allData.articles) ? allData.articles : (Array.isArray(allData) ? allData : []);
    const sourceList = articlesList.length > 0 ? articlesList : mockArticles;
    
    const related = sourceList.filter(a => (a._id || a.id)?.toString() !== (article._id || article.id)?.toString()).slice(0, 3);
    const popular = sourceList.filter(a => (a._id || a.id)?.toString() !== (article._id || article.id)?.toString()).slice(0, 5); 

    return { article, related, popular };
  } catch (error) {
    // Robust fallback on connection error
    if (!id) return null;
    const article = mockArticles.find(a => a.id && a.id.toString() === id.toString());
    if (article) {
       return { 
         article, 
         related: mockArticles.slice(0, 3), 
         popular: mockArticles.slice(3, 8) 
       };
    }
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/articles?limit=100`);
    if (!res.ok) return mockArticles.map(a => ({ id: (a._id || a.id).toString() }));
    const data = await res.json();
    const articles = Array.isArray(data.articles) ? data.articles : (Array.isArray(data) ? data : []);
    return articles.map((article) => ({
      id: (article._id || article.id).toString(),
    }));
  } catch (error) {
    return mockArticles.map(a => ({ id: (a._id || a.id).toString() }));
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getArticleData(id);
  return { title: data?.article ? `${data.article.title} – Sugartimes` : "Article – Sugartimes" };
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const data = await getArticleData(id);
  
  if (!data || !data.article) {
    notFound();
  }

  const { article, related, popular } = data;

  const dynamicDate = new Date(article.createdAt || article.date || new Date()).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="bg-[#fbfcfa] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        
        {/* Breadcrumbs - Matching Screenshot */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/news" className="hover:text-green-600 transition-colors">All News</Link>
          <ChevronRight size={10} />
          <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{article.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Primary Content */}
          <main className="flex-1 w-full max-w-[880px]">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-[0.2em]">{article.category || "General News"}</span>
                {article.premium && (
                   <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2.5 py-1 uppercase tracking-[0.2em] flex items-center gap-1">
                     <Lock size={10} /> Premium Issue
                   </span>
                )}
              </div>

              <h1 className="text-[28px] md:text-[42px] font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-100 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">By <span className="text-slate-900">Uppal Shah</span></p>
                    <p className="text-xs font-bold text-slate-500">{dynamicDate}</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

                <div className="flex items-center gap-2 ml-auto">
                   <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#3b5998] text-white hover:scale-110 transition-all shadow-md shadow-blue-500/10"><FacebookIcon size={16} /></button>
                   <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1da1f2] text-white hover:scale-110 transition-all shadow-md shadow-sky-500/10"><TwitterIcon size={16} /></button>
                   <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 text-white hover:scale-110 transition-all shadow-md shadow-black/10"><Share2 size={16} /></button>
                </div>
              </div>
            </header>

            <figure className="mb-10 group relative">
               <div className="overflow-hidden rounded-xl bg-slate-100 shadow-2xl">
                 <img 
                   src={getImageUrl(article.image)} 
                   alt={article.title} 
                   className="w-full h-auto aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                 />
               </div>
               <figcaption className="text-[11px] text-slate-400 mt-4 italic text-right font-medium">Source: Sugar Times Global Research Team</figcaption>
            </figure>

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-medium prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline">
              {article.premium ? (
                <div className="relative">
                  <div className="opacity-40 select-none pointer-events-none" dangerouslySetInnerHTML={{ __html: (article.content || "").slice(0, 400).replace(/\n/g, '<br/>') }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center pt-20">
                    <div className="bg-white border-2 border-green-500 rounded-3xl p-8 max-w-md text-center shadow-2xl transform translate-y-10">
                       <Lock size={32} className="text-green-500 mx-auto mb-4" />
                       <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Premium Intelligence</h3>
                       <p className="text-sm text-slate-500 mb-6 leading-relaxed">This exclusive report is reserved for our premium subscribers. Gain full access to industry analysis and private market data.</p>
                       <Link href="/subscription" className="inline-block bg-green-500 hover:bg-green-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all">Go Premium</Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: (article.content || "").replace(/\n/g, '<br/>') }} />
              )}
            </div>

            {/* Newsletter Subscription Inline */}
            <div className="mt-16 bg-[#ebf5ea] rounded-3xl p-10 border border-green-100 flex flex-col md:flex-row items-center gap-8 shadow-inner">
               <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-[#031d10] mb-2 font-serif italic">Join the Sweet Revolution</h3>
                  <p className="text-[#031d10]/60 text-sm font-medium">Get the latest global sugar market updates delivered bi-weekly to your inbox.</p>
               </div>
               <div className="flex flex-1 gap-2 w-full max-w-md">
                  <input type="email" placeholder="email address" className="flex-1 px-5 py-3.5 rounded-xl border-2 border-[#031d10]/5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow-sm" />
                  <button className="bg-[#031d10] text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg">Join</button>
               </div>
            </div>
          </main>

          {/* Right Column: Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0">
             <div className="sticky top-24 space-y-10">
               
               {/* Premium Banner Sidebar Widget */}
               <Link href="/subscription" className="block relative overflow-hidden group">
                  <div className="bg-green-600 p-6 flex flex-col items-center text-center text-white relative">
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent scale-150"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Premium Intelligence</span>
                     <h4 className="text-xl font-black mb-6 leading-tight drop-shadow-md">READY TO UPGRADE YOUR INDUSTRY INSIGHTS?</h4>
                     <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300" className="w-24 h-24 object-contain mb-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                     <div className="bg-white text-green-600 text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg">Register Now</div>
                  </div>
               </Link>

               {/* Recent Posts Section - Matching Screenshot Sequence */}
               <div>
                 <div className="mb-4 inline-block">
                   <h3 className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 leading-none">Recent Posts</h3>
                 </div>
                 <div className="border-t-[3px] border-slate-900 pt-6 space-y-6">
                    {popular.map((p, i) => (
                      <Link key={p._id || p.id} href={`/article/${p._id || p.id}`} className="group flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                         <span className="text-[34px] font-black text-slate-200 leading-none group-hover:text-green-300 transition-colors">{i + 1}</span>
                         <div className="mt-1">
                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-green-600 transition-colors leading-tight line-clamp-3 mb-1">{p.title}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(p.createdAt || p.date || new Date()).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
                         </div>
                      </Link>
                    ))}
                 </div>
               </div>

               {/* Social Counter */}
               <div className="bg-white p-6 border border-slate-100 shadow-sm">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4 border-b pb-2">Connect with us</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg group hover:bg-blue-50 transition-colors">
                        <FacebookIcon size={18} />
                        <span className="text-[11px] font-black text-slate-800">12K</span>
                     </div>
                     <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg group hover:bg-sky-50 transition-colors">
                        <TwitterIcon size={18} />
                        <span className="text-[11px] font-black text-slate-800">8K</span>
                     </div>
                  </div>
               </div>

             </div>
          </aside>

        </div>

        {/* Related Bottom Grid */}
        <div className="mt-20 pt-10 border-t-4 border-slate-900">
           <div className="inline-block mb-10 -mt-[44px]">
             <h2 className="bg-slate-900 text-white text-[13px] font-black uppercase tracking-[0.2em] px-4 py-2">Related Articles</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {related.map(a => (
               <NewsCard key={a._id || a.id} article={{...a, id: a._id || a.id, date: a.createdAt || a.date}} />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
