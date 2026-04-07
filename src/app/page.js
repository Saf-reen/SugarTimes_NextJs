import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import { mockArticles, mockMarketPrices, mockMagazines } from "@/lib/mockData";
import { ArrowRight, TrendingUp, TrendingDown, Minus, ChevronRight, BarChart2, CheckCircle2 } from "lucide-react";

async function getHomeData() {
  try {
    const fetchWithFallback = async (url) => {
      try {
        const res = await fetch(url);
        return res.ok ? await res.json() : [];
      } catch (err) {
        return [];
      }
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const [dbArticlesRaw, dbMagazinesRaw, dbMarketsRaw] = await Promise.all([
      fetchWithFallback(`${apiUrl}/articles`),
      fetchWithFallback(`${apiUrl}/magazines`),
      fetchWithFallback(`${apiUrl}/markets`)
    ]);

    const articlesArray = Array.isArray(dbArticlesRaw?.articles) ? dbArticlesRaw.articles : (Array.isArray(dbArticlesRaw) ? dbArticlesRaw : []);
    const magazinesArray = Array.isArray(dbMagazinesRaw) ? dbMagazinesRaw : (dbMagazinesRaw?.magazines || []);
    const marketsArray = Array.isArray(dbMarketsRaw) ? dbMarketsRaw : (dbMarketsRaw?.markets || []);

    const dbArticles = articlesArray.map(a => ({
      id: a._id,
      category: a.category || "News",
      title: a.title,
      date: new Date(a.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      image: a.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
      trending: a.trending || false,
    }));

    const dbMagazines = magazinesArray.map(m => ({
      id: m._id,
      title: m.title,
      cover: m.coverImage || "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?auto=format&fit=crop&q=80&w=400",
      pages: m.pages || 48,
      premium: m.accessType === "premium",
      fileUrl: m.fileUrl
    }));

    const heroArticles = dbArticles.length >= 5 ? dbArticles.slice(0, 5) : mockArticles.slice(0, 5);
    
    // Grouping by exact screenshot categories 
    const industryNews = dbArticles.filter(a => ["industry updates", "sugar industry news", "news"].includes(a.category?.toLowerCase())).slice(0, 5);
    // Newly requested categories
    const ethanolNews = dbArticles.filter(a => ["ethanol"].includes(a.category?.toLowerCase())).slice(0, 4);
    const molassesNews = dbArticles.filter(a => ["molasses"].includes(a.category?.toLowerCase())).slice(0, 4);
    const marketTrendsNews = dbArticles.filter(a => ["market trends"].includes(a.category?.toLowerCase())).slice(0, 4);
    
    const policyNews = dbArticles.filter(a => ["policy", "policy updates"].includes(a.category?.toLowerCase())).slice(0, 4);
    const agricultureNews = dbArticles.filter(a => ["agriculture"].includes(a.category?.toLowerCase())).slice(0, 4);
    
    // Highlight sub-fields
    const intlTradeNews = dbArticles.filter(a => ["international trade"].includes(a.category?.toLowerCase())).slice(0, 3);
    const interviewsNews = dbArticles.filter(a => ["interviews"].includes(a.category?.toLowerCase())).slice(0, 3);
    const envImpactNews = dbArticles.filter(a => ["environmental impact"].includes(a.category?.toLowerCase())).slice(0, 3);
    const technologyNews = dbArticles.filter(a => ["technology"].includes(a.category?.toLowerCase())).slice(0, 3);
    const sugarDietNews = dbArticles.filter(a => ["sugar diet"].includes(a.category?.toLowerCase())).slice(0, 4);
    const sugarFoodNews = dbArticles.filter(a => ["sugar food"].includes(a.category?.toLowerCase())).slice(0, 4);
    const sugarcaneDeptNews = dbArticles.filter(a => ["sugarcane department"].includes(a.category?.toLowerCase())).slice(0, 4);

    const latest = dbArticles.slice(0, 6);
    const trendingArticles = dbArticles.filter(a => a.trending).slice(0, 5);

    // Fallbacks
    if(industryNews.length === 0) industryNews.push(...mockArticles.slice(0,5));
    if(ethanolNews.length === 0) ethanolNews.push(...mockArticles.slice(0,4));
    if(molassesNews.length === 0) molassesNews.push(...mockArticles.slice(0,4));
    if(marketTrendsNews.length === 0) marketTrendsNews.push(...mockArticles.slice(0,4));
    if(policyNews.length === 0) policyNews.push(...mockArticles.slice(0,4));
    if(agricultureNews.length === 0) agricultureNews.push(...mockArticles.slice(0,4));
    
    if(intlTradeNews.length === 0) intlTradeNews.push(...mockArticles.slice(0,2));
    if(interviewsNews.length === 0) interviewsNews.push(...mockArticles.slice(0,2));
    if(envImpactNews.length === 0) envImpactNews.push(...mockArticles.slice(0,3));
    if(technologyNews.length === 0) technologyNews.push(...mockArticles.slice(0,2));

    const magazines = dbMagazines.length > 0 ? dbMagazines.slice(0, 3) : mockMagazines.slice(0, 3);

    return { 
      heroArticles: trendingArticles.length >= 3 ? [...trendingArticles, ...dbArticles].slice(0, 5) : heroArticles, 
      industryNews, ethanolNews, molassesNews, marketTrendsNews, policyNews, agricultureNews, 
      intlTradeNews, interviewsNews, envImpactNews, technologyNews,
      sugarDietNews, sugarFoodNews, sugarcaneDeptNews,
      latest, magazines, 
      markets: marketsArray.length > 0 ? marketsArray.slice(0, 5) : mockMarketPrices.slice(0, 5) 
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      heroArticles: mockArticles.slice(0, 5),
      industryNews: mockArticles.slice(0, 5),
      ethanolNews: mockArticles.slice(0, 4),
      molassesNews: mockArticles.slice(0, 4),
      marketTrendsNews: mockArticles.slice(0, 4),
      policyNews: mockArticles.slice(0, 4),
      agricultureNews: mockArticles.slice(0, 4),
      intlTradeNews: mockArticles.slice(0, 2),
      interviewsNews: mockArticles.slice(0, 2),
      envImpactNews: mockArticles.slice(0, 3),
      technologyNews: mockArticles.slice(0, 2),
      sugarDietNews: mockArticles.slice(0, 4),
      sugarFoodNews: mockArticles.slice(0, 4),
      sugarcaneDeptNews: mockArticles.slice(0, 4),
      latest: mockArticles.slice(0, 6),
      magazines: mockMagazines.slice(0, 3),
      markets: mockMarketPrices.slice(0, 5)
    };
  }
}

// Small helper for precise screenshot headers
function BannerHeader({ title, colorClass, borderClass }) {
  return (
    <div className={`mb-5 border-b-2 ${borderClass}`}>
      <h2 className={`text-white font-semibold text-[13px] uppercase tracking-wider px-3 py-1.5 inline-block -mb-0.5 ${colorClass}`}>
        {title}
      </h2>
    </div>
  );
}

// Small helper for section headers
function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center gap-4 mb-5 border-b-2 border-slate-100">
      <h2 className="bg-green-500 text-white font-black text-[13px] uppercase tracking-wider px-3 py-1.5 inline-block -mb-0.5">{title}</h2>
      <div className="flex-1"></div>
      {link && (
        <Link href={link} className="text-xs font-bold text-green-600 hover:underline uppercase tracking-wider">
          View All {">"}
        </Link>
      )}
    </div>
  );
}

const plans = [
  { name: "Free", icon: "📰", price: 0, period: "month", description: "Basic access for casual readers", popular: false, cta: "Get Started", features: ["5 articles/month", "Market overview", "Newsletter"] },
  { name: "Basic", icon: "⭐", price: 299, period: "month", description: "For industry professionals", popular: false, cta: "Subscribe Now", features: ["Unlimited articles", "Full market data", "Policy updates", "Email alerts"] },
  { name: "Premium", icon: "🚀", price: 799, period: "month", description: "Complete industry intelligence", popular: true, cta: "Go Premium", features: ["Everything in Basic", "All magazines", "WhatsApp alerts", "Analytics dashboard", "Priority support", "Downloadable reports"] },
];

function PricingCard({ plan }) {
  return (
    <div className={`relative bg-white rounded-3xl overflow-hidden ${plan.popular ? "border-2 border-green-500 shadow-xl shadow-green-500/10 scale-105" : "border border-slate-200 shadow-md"} p-8 group hover:-translate-y-2 transition-all duration-300`}>
      {plan.popular && <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-bl-xl z-20">Most Popular</div>}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{plan.icon}</div>
      <h3 className="text-2xl font-black text-slate-800 mb-2">{plan.name}</h3>
      <p className="text-sm text-slate-500 font-medium h-10">{plan.description}</p>
      <div className="my-6">
        <span className="text-4xl font-black text-slate-900">₹{plan.price}</span><span className="text-slate-500 font-medium">/{plan.period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {plan.features.map((f, i) => (
          <li key={i} className="flex gap-3 text-sm font-medium text-slate-600"><CheckCircle2 className="text-green-500 shrink-0" size={18} /><span>{f}</span></li>
        ))}
      </ul>
      <Link href="/subscribe" className={`block text-center py-4 rounded-xl font-bold transition-all ${plan.popular ? "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-green-500/30" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}>{plan.cta}</Link>
    </div>
  );
}

export default async function HomePage() {
  const { 
    heroArticles, industryNews, ethanolNews, molassesNews, marketTrendsNews, policyNews, agricultureNews, 
    intlTradeNews, interviewsNews, envImpactNews, technologyNews,
    sugarDietNews, sugarFoodNews, sugarcaneDeptNews,
    latest, magazines, markets 
  } = await getHomeData();
  
  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`;
  };

  return (
    <div className="bg-[#fbfcfa]">
      {/* Magazine-Style Hero Section (Full Width Dark Green) */}
      <section className="bg-[#031d10] pt-8 pb-14 px-4 shadow-2xl border-b border-green-950">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-auto lg:h-[550px]">
            
            {/* Left Column - 2 Stacked Cards */}
            <div className="grid grid-rows-2 gap-4 lg:col-span-1 h-[550px] lg:h-full">
              {heroArticles.slice(0, 2).map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="relative group overflow-hidden block h-full bg-[#052616] border border-white/5 rounded-lg shadow-lg">
                  <img src={getImageUrl(article.image)} alt={article.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-[17px] font-black leading-snug group-hover:text-green-400 transition-colors drop-shadow-md line-clamp-3">{article.title}</h3>
                    <div className="flex items-center gap-2.5 mt-3">
                       <span className="text-emerald-400 text-[10px] uppercase font-black tracking-widest">{article.category}</span>
                       <span className="w-1 h-1 rounded-full bg-white/30"></span>
                       <span className="text-white/60 text-[10px] font-bold">{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Center Column - 1 Large Card */}
            <div className="lg:col-span-2 h-[550px] lg:h-full">
              {heroArticles[2] && (
                <Link href={`/article/${heroArticles[2].id}`} className="relative group overflow-hidden block h-full bg-[#052616] border border-white/5 rounded-lg shadow-xl">
                  <img src={getImageUrl(heroArticles[2].image)} alt={heroArticles[2].title} className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <span className="bg-green-600 text-white text-[12px] font-black uppercase px-3.5 py-2 w-max mb-6 tracking-widest rounded-md border border-green-400/30 shadow-2xl shadow-green-950">{heroArticles[2].category}</span>
                    <h2 className="text-white text-3xl md:text-5xl font-black leading-[1.05] group-hover:text-green-400 transition-colors drop-shadow-2xl mb-5">{heroArticles[2].title}</h2>
                    <div className="flex items-center gap-5">
                       <span className="text-white font-black text-xs flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>{heroArticles[2].date}</span>
                       <span className="text-white/50 text-[11px] font-black uppercase tracking-[0.2em]">Sugar Times Global</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Right Column - 2 Stacked Cards */}
            <div className="grid grid-rows-2 gap-4 lg:col-span-1 h-[550px] lg:h-full">
              {heroArticles.slice(3, 5).map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="relative group overflow-hidden block h-full bg-[#052616] border border-white/5 rounded-lg shadow-lg">
                  <img src={getImageUrl(article.image)} alt={article.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-[17px] font-black leading-snug group-hover:text-green-400 transition-colors drop-shadow-md line-clamp-3">{article.title}</h3>
                    <div className="flex items-center gap-2.5 mt-3">
                       <span className="text-emerald-400 text-[10px] uppercase font-black tracking-widest">{article.category}</span>
                       <span className="w-1 h-1 rounded-full bg-white/30"></span>
                       <span className="text-white/60 text-[10px] font-bold">{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Left Primary Column */}
        <div className="flex-1 w-full space-y-10">
          
          {/* INDUSTRY UPDATES BLOCK */}
          <section>
            <BannerHeader title="Industry Updates" colorClass="bg-green-400 text-slate-900" borderClass="border-green-400" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Left Side */}
              {industryNews[0] && (
                <Link href={`/article/${industryNews[0].id}`} className="group block">
                  <div className="overflow-hidden mb-4 bg-slate-100 h-64 relative">
                    <img src={getImageUrl(industryNews[0].image)} alt={industryNews[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute bottom-0 left-0 bg-slate-900 text-white text-[10px] font-bold uppercase px-2 py-1">{industryNews[0].category}</span>
                  </div>
                  <h3 className="text-[22px] font-bold leading-tight text-slate-800 group-hover:text-green-500 transition-colors mb-2">{industryNews[0].title}</h3>
                  <div className="text-xs text-slate-500 mb-3 font-semibold">
                    <span className="text-slate-900 font-bold">Sugar Times Team</span> - {industryNews[0].date}
                  </div>
                  <p className="text-[15px] text-slate-500 leading-relaxed font-medium line-clamp-3">{industryNews[0]?.excerpt || "The Government of India is actively working on several requests made by stakeholders in the sugar industry. The goal is to prevent excess sugar..."}</p>
                </Link>
              )}
              {/* Right Side Vertical List */}
              <div className="space-y-5">
                {industryNews.slice(1, 5).map((article) => (
                  <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0">
                    <div className="w-[100px] h-[75px] shrink-0 bg-slate-100 overflow-hidden relative">
                      <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-green-500 transition-colors line-clamp-3">{article.title}</h4>
                      <span className="text-[11px] text-slate-500 mt-2 block font-medium">{article.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ETHANOL & DISTILLERY BLOCK */}
          <section>
            <BannerHeader title="Ethanol & Distillery" colorClass="bg-[#3e8a4a]" borderClass="border-[#3e8a4a]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ethanolNews.slice(0, 2).map((article) => (
                <div key={article.id} className="flex flex-col border-b border-slate-100 pb-6 mb-6">
                  <Link href={`/article/${article.id}`} className="group block mb-4">
                    <div className="overflow-hidden bg-slate-100 h-56 relative">
                      <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute bottom-0 left-0 bg-slate-900 text-white text-[10px] font-bold uppercase px-2 py-1">{article.category}</span>
                    </div>
                    <h3 className="text-[20px] font-bold leading-tight text-slate-800 group-hover:text-[#3e8a4a] transition-colors mt-4">{article.title}</h3>
                    <div className="text-[11px] text-slate-500 my-2 font-semibold">
                      <span className="text-slate-900 font-bold">Sugar Times Team</span> - {article.date}
                    </div>
                    <p className="text-[14px] text-slate-500 leading-relaxed font-medium line-clamp-3">
                       {article.excerpt || "Ethanol production is seeing a significant boost with new government incentives and technology adoption in major sugar mills..."}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* MARKET TRENDS PRIMARY BLOCK */}
          <section className="mt-8">
            <SectionHeader title="Market Trends" link="/news?category=Market+Trends" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {marketTrendsNews.map((article) => (
                 <Link key={article.id} href={`/article/${article.id}`} className="group relative overflow-hidden bg-white p-4 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-4 items-center">
                       <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                         <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                       </div>
                       <div>
                         <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h4>
                         <p className="text-[11px] text-slate-500 mt-1 font-medium">{article.date}</p>
                       </div>
                    </div>
                 </Link>
              ))}
            </div>
            {/* Embedded Market List */}
            <div className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Live State Rates</h4>
                  <Link href="/markets" className="text-[10px] font-bold text-green-600 uppercase hover:underline">View Global Index {">"}</Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {markets.slice(0, 3).map((m, i) => (
                     <div key={i} className="bg-white p-3 rounded-lg border border-slate-200/50 flex justify-between items-center">
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase">{m.state}</p><p className="text-sm font-black text-slate-800">₹{m.price}</p></div>
                        <span className={`text-[10px] font-black ${m.change > 0 ? "text-green-500" : "text-red-400"}`}>{m.change > 0 ? "+" : ""}{m.change}</span>
                     </div>
                  ))}
               </div>
            </div>
          </section>

          {/* POLICY UPDATES BLOCK */}
          <section className="mt-12">
            <SectionHeader title="Policy Updates" link="/news?category=Policy" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
              {policyNews.map((article) => (
                 <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-3 items-center border-b border-slate-100 pb-4">
                   <div className="w-20 h-16 shrink-0 bg-slate-100 overflow-hidden rounded-sm">
                     <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                   </div>
                   <div>
                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h4>
                     <span className="text-[10px] text-slate-500 mt-1 block">{article.date}</span>
                   </div>
                 </Link>
              ))}
            </div>
          </section>

          {/* AGRICULTURE / MOLASSES 2-Col Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
             <section>
               <SectionHeader title="Molasses" link="/news?category=Molasses" />
               <div className="space-y-4">
                 {molassesNews.map((article) => (
                   <Link key={article.id} href={`/article/${article.id}`} className="group flex flex-col">
                     <div className="overflow-hidden mb-2 bg-slate-100 h-36">
                       <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                     </div>
                     <h4 className="text-[13px] font-bold leading-snug text-slate-800 group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h4>
                     <span className="text-[10px] text-slate-500 mt-1 block">{article.date}</span>
                   </Link>
                 ))}
               </div>
             </section>

             <section>
               <SectionHeader title="Agriculture" link="/agriculture" />
               <div className="space-y-4">
                 {agricultureNews.map((article) => (
                   <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-3 items-center border-b border-slate-100 pb-3">
                     <div className="w-16 h-16 shrink-0 bg-slate-100 overflow-hidden rounded-full border border-slate-200">
                       <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                     </div>
                     <div>
                       <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h4>
                       <span className="text-[10px] text-slate-500 mt-1 block">{article.date}</span>
                     </div>
                   </Link>
                 ))}
               </div>
             </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
             <section>
               <SectionHeader title="Sugar Diet" link="/news?category=Sugar+Diet" />
               <div className="grid grid-cols-2 gap-4">
                 {sugarDietNews.map((article) => (
                   <Link key={article.id} href={`/article/${article.id}`} className="group flex flex-col">
                     <div className="overflow-hidden mb-2 bg-slate-100 h-24 rounded-lg">
                       <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                     </div>
                     <h4 className="text-[12px] font-bold leading-tight text-slate-800 group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h4>
                   </Link>
                 ))}
               </div>
             </section>

             <section>
               <SectionHeader title="Sugar Food" link="/news?category=Sugar+Food" />
               <div className="grid grid-cols-2 gap-4">
                 {sugarFoodNews.map((article) => (
                   <Link key={article.id} href={`/article/${article.id}`} className="group flex flex-col">
                     <div className="overflow-hidden mb-2 bg-slate-100 h-24 rounded-lg">
                       <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                     </div>
                     <h4 className="text-[12px] font-bold leading-tight text-slate-800 group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h4>
                   </Link>
                 ))}
               </div>
             </section>
          </div>

          <section className="mt-8">
             <SectionHeader title="Sugarcane Department" link="/news?category=Sugarcane+Department" />
             <div className="bg-green-50 p-6 rounded-2xl border border-green-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sugarcaneDeptNews.slice(0, 2).map(a => (
                   <Link key={a.id} href={`/article/${a.id}`} className="flex gap-4 items-center group">
                      <div className="w-20 h-20 shrink-0 bg-white rounded-xl overflow-hidden border border-green-100 shadow-sm">
                         <img src={getImageUrl(a.image)} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-green-600 transition-colors">{a.title}</h4>
                   </Link>
                ))}
             </div>
          </section>

          {/* HIGHLIGHTS HUB - SUB FIELDS */}
          <section className="mt-12">
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <h2 className="text-white text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                  Highlights
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Intl Trade */}
                  <div className="space-y-4">
                     <Link href="/news?category=International+Trade" className="text-green-400 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">International Trade <ArrowRight size={12} /></Link>
                     {intlTradeNews.slice(0, 2).map(a => (
                        <Link key={a.id} href={`/article/${a.id}`} className="group block">
                           <h4 className="text-white text-sm font-bold group-hover:text-green-400 transition-colors line-clamp-2">{a.title}</h4>
                           <p className="text-white/40 text-[10px] mt-1">{a.date}</p>
                        </Link>
                     ))}
                  </div>
                  {/* Technology */}
                  <div className="space-y-4">
                     <Link href="/news?category=Technology" className="text-green-400 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">Technology <ArrowRight size={12} /></Link>
                     {technologyNews.slice(0, 2).map(a => (
                        <Link key={a.id} href={`/article/${a.id}`} className="group block">
                           <h4 className="text-white text-sm font-bold group-hover:text-green-400 transition-colors line-clamp-2">{a.title}</h4>
                           <p className="text-white/40 text-[10px] mt-1">{a.date}</p>
                        </Link>
                     ))}
                  </div>
                  {/* Interviews */}
                  <div className="space-y-4">
                     <Link href="/news?category=Interviews" className="text-green-400 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">Interviews <ArrowRight size={12} /></Link>
                     {interviewsNews.slice(0, 2).map(a => (
                        <Link key={a.id} href={`/article/${a.id}`} className="group block">
                           <h4 className="text-white text-sm font-bold group-hover:text-green-400 transition-colors line-clamp-2">{a.title}</h4>
                           <p className="text-white/40 text-[10px] mt-1">{a.date}</p>
                        </Link>
                     ))}
                  </div>
                  {/* Environmental */}
                  <div className="space-y-4">
                     <Link href="/news?category=Environmental+Impact" className="text-green-400 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">Environmental Impact <ArrowRight size={12} /></Link>
                     {envImpactNews.slice(0, 2).map(a => (
                        <Link key={a.id} href={`/article/${a.id}`} className="group block">
                           <h4 className="text-white text-sm font-bold group-hover:text-green-400 transition-colors line-clamp-2">{a.title}</h4>
                           <p className="text-white/40 text-[10px] mt-1">{a.date}</p>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar Column */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
          
          <div className="flex justify-end hidden lg:flex">
             <Link href="/login" className="flex items-center gap-2 text-sm text-slate-600 font-semibold hover:text-green-500 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
               My account
             </Link>
          </div>

          {/* Magazine Cover Block */}
          {magazines[0] && (
            <div className="bg-[#b5cc95] p-5 flex flex-col items-center text-center shadow-inner relative overflow-hidden group">
              <div className="absolute top-2 left-2 text-[#4d6a26] font-black text-2xl uppercase opacity-20 transform -rotate-12 pointer-events-none">Sugar<br/>Times</div>
              <Link href="/magazines" className="block relative z-10 w-full flex justify-center py-6">
                <div className="relative w-48 -rotate-[8deg] group-hover:-rotate-[5deg] transition-transform duration-500 shadow-2xl z-20">
                  <img src={getImageUrl(magazines[0].cover)} alt="Magazine Cover" className="w-full border-4 border-white" />
                </div>
                <div className="absolute w-44 rotate-[5deg] right-2 top-10 opacity-60 z-10 hidden sm:block">
                   <img src={getImageUrl(magazines[0].cover)} alt="Magazine Shadow" className="w-full border-4 border-white" />
                </div>
              </Link>
              <h3 className="font-medium text-slate-800 text-xl tracking-wide z-20 mt-2 mb-2">Latest Issue</h3>
            </div>
          )}

          {/* STAY CONNECTED Widget */}
          <div className="bg-white">
            <BannerHeader title="Stay Connected" colorClass="bg-slate-900 text-white" borderClass="border-slate-900" />
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#3b5998] text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></div>
                  <span className="text-[13px] font-bold text-slate-800">16,985</span> <span className="text-xs text-slate-500">Fans</span>
                </div>
                <span className="text-[10px] font-bold text-slate-800">LIKE</span>
              </a>
              <a href="#" className="flex items-center justify-between border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1DA1F2] text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></div>
                  <span className="text-[13px] font-bold text-slate-800">2,458</span> <span className="text-xs text-slate-500">Followers</span>
                </div>
                <span className="text-[10px] font-bold text-slate-800">FOLLOW</span>
              </a>
              <a href="#" className="flex items-center justify-between border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#CD201F] text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></div>
                  <span className="text-[13px] font-bold text-slate-800">61,453</span> <span className="text-xs text-slate-500">Subscribers</span>
                </div>
                <span className="text-[10px] font-bold text-slate-800">SUBSCRIBE</span>
              </a>
            </div>
          </div>

          {/* MARKET TRENDS Widget */}
          <div className="bg-white">
            <BannerHeader title="Market Trends" colorClass="bg-slate-900 text-white" borderClass="border-slate-900" />
            <div className="grid grid-cols-2 gap-4">
              {marketTrendsNews.slice(0, 4).map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="group block">
                  <div className="relative overflow-hidden bg-slate-100 h-28 mb-3">
                    <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute bottom-1 left-1 bg-slate-900 text-white text-[9px] font-bold uppercase px-1.5 py-0.5">{article.category}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-green-500 transition-colors line-clamp-3">{article.title}</h4>
                </Link>
              ))}
            </div>
          </div>

          {/* LATEST ARTICLES Widget */}
          <div className="bg-white p-5 border border-slate-200 shadow-sm">
            <h3 className="bg-slate-900 text-white font-black text-[12px] uppercase tracking-wider px-3 py-2 inline-block mb-4">Latest Articles</h3>
            <div className="space-y-4">
              {latest.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="w-16 h-12 shrink-0 bg-slate-100 overflow-hidden">
                    <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-slate-800 leading-tight group-hover:text-green-600 transition-colors line-clamp-3">{article.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Advertisement Block */}
          <div className="bg-slate-100 border border-slate-200 h-[250px] flex items-center justify-center relative group overflow-hidden">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest absolute top-2 right-2 border border-slate-200 bg-white px-2 py-0.5 rounded-sm">Advertisement</span>
            <div className="text-slate-400 text-center">
              <span className="block text-3xl mb-1 font-black shadow-sm">300x250</span>
              <span className="block text-xs uppercase tracking-widest font-bold">Ad Space</span>
            </div>
          </div>

          {/* News Archive */}
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
               <h3 className="font-black text-slate-800 text-[14px] uppercase tracking-wider">News Archive</h3>
            </div>
            <div className="p-5">
              <ul className="space-y-2">
                {[
                  { month: "March 2026", count: 42 }, 
                  { month: "February 2026", count: 38 }, 
                  { month: "January 2026", count: 51 }, 
                  { month: "December 2025", count: 29 }, 
                  { month: "November 2025", count: 35 }
                ].map(item => (
                   <li key={item.month}>
                     <Link href="#" className="flex items-center justify-between text-sm text-slate-600 hover:text-green-600 py-1.5 border-b border-slate-50 last:border-0 hover:pl-2 transition-all font-medium">
                       <span>{item.month}</span>
                       <span className="bg-slate-100 text-slate-500 text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold group-hover:bg-green-100 group-hover:text-green-700">{item.count}</span>
                     </Link>
                   </li>
                ))}
              </ul>
            </div>
          </div>

        </aside>

      </div>
      
      {/* Restore Full-Width Data Sections */}
      <div className="max-w-[1440px] mx-auto px-4 mt-20">
        
        {/* Market Insights */}
        <section className="py-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-black text-slate-900">Market Insights</h2><p className="text-slate-500 text-sm mt-1">Live sugarcane prices across states</p></div>
            <Link href="/markets" className="flex items-center gap-1 text-green-600 font-semibold text-sm">Full Markets <ChevronRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100"><tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">State</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Variety</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Price</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Change</th>
                  </tr></thead>
                  <tbody>
                    {markets.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-green-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">{row.state}</td>
                        <td className="px-4 py-3 text-slate-500">{row.variety}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">Rs {row.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`flex items-center justify-end gap-1 font-semibold ${row.change > 0 ? "text-green-600" : row.change < 0 ? "text-red-500" : "text-slate-400"}`}>
                            {row.change > 0 ? <TrendingUp size={13} /> : row.change < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                            {row.change > 0 ? "+" : ""}{row.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-green-500" /> Price Trend</h3>
              <div className="space-y-3">
                {[["Oct 25", 3200, 60], ["Nov 25", 3280, 65], ["Dec 25", 3350, 70], ["Jan 26", 3400, 75], ["Feb 26", 3380, 72], ["Mar 26", 3450, 80]].map(([m, p, w]) => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-14">{m}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${w}%` }} /></div>
                    <span className="text-xs font-semibold text-slate-700 w-14 text-right">Rs {p}</span>
                  </div>
                ))}
              </div>
              <Link href="/markets" className="mt-5 block text-center text-sm text-green-600 font-semibold hover:underline">View Full Charts</Link>
            </div>
          </div>
        </section>

        {/* Magazines Grid */}
        <section className="py-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-black text-slate-900">Magazines</h2><p className="text-slate-500 text-sm mt-1">Monthly editions packed with industry analysis</p></div>
            <Link href="/magazines" className="flex items-center gap-1 text-green-600 font-semibold text-sm">All Issues <ChevronRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {magazines.map((mag) => (
              <Link key={mag.id} href="/magazines" className="group bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img src={getImageUrl(mag.cover)} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {mag.premium && <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Premium</div>}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-slate-800 text-[15px] line-clamp-2 group-hover:text-green-600 transition-colors">{mag.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mag.pages} pages</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pricing Subscriptions */}
        <section className="py-12 border-t border-slate-200">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Choose Your Plan</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Get full access to sugar industry intelligence. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (<PricingCard key={plan.name} plan={plan} />))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-12 border-t border-slate-200">
          <div className="text-center mb-10"><h2 className="text-3xl font-black text-slate-900 mb-3">Why Sugartimes?</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "📰", title: "Industry News", desc: "Daily updates from mills, markets, and government" },
              { icon: "📊", title: "Market Data", desc: "Real-time sugarcane prices across all major states" },
              { icon: "📋", title: "Policy Tracker", desc: "FRP, SAP, export policy all in one place" },
              { icon: "📚", title: "Digital Magazines", desc: "Monthly editions with deep industry analysis" },
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center hover:shadow-md transition-all group">
                <div className="text-3xl mb-3 group-hover:-translate-y-1 transition-transform">{b.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{b.title}</h3>
                <p className="text-[13px] text-slate-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
